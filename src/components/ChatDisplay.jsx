import React, { useState, useEffect, useRef } from 'react';
import { useVoiceAssistant } from '@livekit/components-react';
import './ChatDisplay.css';

const ChatDisplay = ({ userMessage }) => {
    const [messages, setMessages] = useState([]);
    const chatContainerRef = useRef(null);
    const { state: agentState } = useVoiceAssistant();
    
    const isThinking = agentState === 'thinking';

    // Add user message when prop changes
    useEffect(() => {
        if (userMessage && userMessage.text) {
            setMessages(prev => [...prev, { sender: 'user', text: userMessage.text }]);
        }
    }, [userMessage?.id]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat-display-wrapper">
            <div className="chat-display" ref={chatContainerRef}>
                {messages.length === 0 ? (
                    <div className="chat-empty-state">
                        <i className="ri-chat-3-line empty-icon"></i>
                        <p>Ask JHERVIS anything about JHERVIN!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.sender}`}>
                            <span className="message-sender">{msg.sender === 'ai' ? 'JHERVIS' : 'YOU'}</span>
                            <span className="message-text">{msg.text}</span>
                        </div>
                    ))
                )}
                {isThinking && (
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatDisplay;
