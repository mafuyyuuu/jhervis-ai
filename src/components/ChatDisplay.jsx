import React, { useState, useEffect, useRef } from 'react';
import { useDataChannel } from '@livekit/components-react';
import './ChatDisplay.css';

const ChatDisplay = () => {
    const [messages, setMessages] = useState([]);
    const chatContainerRef = useRef(null);

    const onMessage = (msg) => {
        const decoder = new TextDecoder();
        const message = decoder.decode(msg.payload);
        const parsedMessage = JSON.parse(message);
        setMessages(prev => [...prev, { sender: 'ai', text: parsedMessage.message }]);
    };
    
    const onUserQuery = (msg) => {
        const decoder = new TextDecoder();
        const message = decoder.decode(msg.payload);
        const parsedMessage = JSON.parse(message);
        setMessages(prev => [...prev, { sender: 'user', text: parsedMessage.query }]);
    }
    
    useDataChannel("chat", onMessage);
    useDataChannel("user_query", onUserQuery);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat-display-wrapper">
            <div className="chat-display" ref={chatContainerRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender}`}>
                        <span className="message-sender">{msg.sender === 'ai' ? 'Jervis' : 'You'}</span>
                        <span className="message-text">{msg.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatDisplay;
