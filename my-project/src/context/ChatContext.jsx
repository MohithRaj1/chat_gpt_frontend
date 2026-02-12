import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const [conversations, setConversations] = useState(() => {
        const saved = localStorage.getItem('conversations');
        return saved ? JSON.parse(saved) : [];
    });

    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        localStorage.setItem('conversations', JSON.stringify(conversations));
    }, [conversations]);

    const createNewChat = () => {
        const newChat = {
            id: Date.now().toString(),
            title: 'New Conversation',
            messages: [],
            timestamp: new Date().toISOString()
        };
        setConversations(prev => [newChat, ...prev]);
        setActiveId(newChat.id);
        return newChat.id;
    };

    const addMessage = (chatId, message) => {
        setConversations(prev => prev.map(chat => {
            if (chat.id === chatId) {
                const updatedMessages = [...chat.messages, message];
                // Update title based on the first user message
                let newTitle = chat.title;
                if (chat.messages.length === 0 && message.role === 'user') {
                    newTitle = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
                }
                return { ...chat, messages: updatedMessages, title: newTitle };
            }
            return chat;
        }));
    };

    const deleteChat = (chatId) => {
        setConversations(prev => prev.filter(chat => chat.id !== chatId));
        if (activeId === chatId) {
            setActiveId(null);
        }
    };

    const getActiveChat = () => {
        return conversations.find(chat => chat.id === activeId);
    };

    return (
        <ChatContext.Provider value={{
            conversations,
            setConversations,
            activeId,
            setActiveId,
            createNewChat,
            addMessage,
            deleteChat,
            getActiveChat
        }}>
            {children}
        </ChatContext.Provider>
    );
};
