import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import '../styles/sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { conversations, activeId, setActiveId, createNewChat, deleteChat } = useChat();

    const handleNewChat = (e) => {
        e.preventDefault();
        createNewChat();
        navigate('/');
    };

    const handleSelectChat = (id) => {
        setActiveId(id);
        navigate('/');
    };

    return (
        <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
            <button onClick={handleNewChat} className="new-chat-btn">
                <span>+</span>
                New chat
            </button>

            <div className="nav-links">
                <div style={{ padding: '12px', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    History
                </div>
                {conversations.length === 0 ? (
                    <div style={{ padding: '12px', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        No history yet
                    </div>
                ) : (
                    conversations.map(chat => (
                        <div
                            key={chat.id}
                            className={`nav-item ${activeId === chat.id ? 'active' : ''}`}
                            onClick={() => handleSelectChat(chat.id)}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                                💬 {chat.title}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteChat(chat.id);
                                }}
                                style={{ opacity: 0.6, fontSize: '12px' }}
                                title="Delete chat"
                            >
                                🗑️
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="user-menu">
                <Link to="/login" className="nav-item">
                    Login
                </Link>
                <Link to="/signup" className="nav-item">
                    Signup
                </Link>
                <div className="user-menu-divider" style={{ height: '1px', background: 'var(--border-color)', margin: '8px 0' }}></div>
                <Link to="/about" className="nav-item">
                    <span>ℹ️</span> About
                </Link>
                <Link to="/contact" className="nav-item">
                    <span>📞</span> Contact
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
