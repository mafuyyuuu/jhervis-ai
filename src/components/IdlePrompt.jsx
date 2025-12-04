import React, { useState } from 'react';
import './IdlePrompt.css';

const CONVERSATION_STARTERS = [
    "Want to know about JHERVIN's latest projects?",
    "Ask me about JHERVIN's skills in AI and web development!",
    "Curious about JHERVIN's achievements?",
    "I can tell you about JHERVIN's favorite technologies!",
    "Want to hear about JHERVIN's creative side?",
    "Ask me anything about this portfolio!",
];

// Pick a random prompt at module level
const getRandomPrompt = () => CONVERSATION_STARTERS[Math.floor(Math.random() * CONVERSATION_STARTERS.length)];

const IdlePrompt = ({ isVisible, onDismiss, onAsk }) => {
    // Use state initialized with a random prompt - this only runs once
    const [currentPrompt] = useState(getRandomPrompt);

    if (!isVisible) return null;

    const handleAsk = () => {
        if (onAsk) {
            onAsk(currentPrompt);
        }
        onDismiss();
    };

    return (
        <div className="idle-prompt visible">
            <button className="idle-dismiss" onClick={onDismiss}>
                <i className="ri-close-line"></i>
            </button>
            <i className="ri-lightbulb-line idle-icon"></i>
            <p className="idle-text">{currentPrompt}</p>
            <div className="idle-actions">
                <button className="idle-btn primary" onClick={handleAsk}>
                    <i className="ri-robot-line"></i>
                    Ask JHERVIS
                </button>
                <button className="idle-btn secondary" onClick={onDismiss}>
                    Maybe later
                </button>
            </div>
        </div>
    );
};

export default IdlePrompt;
