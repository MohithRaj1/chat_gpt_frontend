import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import '../styles/home.css';
import '../styles/chat.css';

const Home = () => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { activeId, createNewChat, addMessage, getActiveChat, setConversations } = useChat();
  const messagesEndRef = useRef(null);

  const activeChat = getActiveChat();
  const messages = activeChat ? activeChat.messages : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    let currentId = activeId;
    if (!currentId) {
      currentId = createNewChat();
    }

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    addMessage(currentId, userMessage);
    const userInput = message;
    setMessage("");

    try {
      // Call the FastAPI backend
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      
      addMessage(currentId, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("AI Response Error:", error);
      addMessage(currentId, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting to my brain right now. Please make sure the backend server is running! 🧠🔌",
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (title) => {
    setMessage(`Help me with: ${title}`);
  };

  return (
    <div className="home-container">
      <div className="background-gradient"></div>

      <div className="chat-container">
        {messages.length === 0 ? (
          <div className="home-content">
            <div className="content-wrapper">
              <div className="welcome-section">
                <div className="logo-circle">
                  <span className="logo-text">✨</span>
                </div>
                <h1 className="welcome-title">Hello there!</h1>
                <p className="welcome-subtitle">Ask me anything. I'm here to help.</p>
              </div>

              <div className="suggestions-grid">
                {[
                  { icon: "✨", title: "Create", desc: "Generate creative content" },
                  { icon: "📊", title: "Analyze", desc: "Get insights from data" },
                  { icon: "💡", title: "Brainstorm", desc: "Generate fresh ideas" },
                  { icon: "🔍", title: "Research", desc: "Deep dive into topics" }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="suggestion-card"
                    onClick={() => handleSuggestionClick(item.title)}
                  >
                    <div className="suggestion-icon">{item.icon}</div>
                    <div className="suggestion-content">
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="messages-area">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-row ${msg.role}`}>
                <div className="message-content">
                  <div className={`avatar ${msg.role}`}>
                    {msg.role === 'user' ? 'U' : 'AI'}
                  </div>
                  <div className="message-text">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="input-area">
          <div className="input-container">
            <div className={`input-wrapper ${isFocused ? 'focused' : ''}`}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Type your message here..."
                className="message-input"
                rows="1"
              />
              <button
                onClick={handleSend}
                className="send-button"
                disabled={!message.trim()}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 10l17-9L1 19l4-9-4-9z" />
                </svg>
              </button>
            </div>
            <p className="input-hint">Press Enter to send, Shift + Enter for new line</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;