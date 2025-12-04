import React, { useState, useEffect } from 'react';
import { useVoiceAssistant } from '@livekit/components-react';
import './InteractiveCorner.css';
import ChatInput from "./ChatInput";

const InteractiveCorner = ({ onQuerySubmit, children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { state: agentState } = useVoiceAssistant();
    
    const isListening = agentState === 'listening';
    
    const handleQuerySubmit = (query) => {
        if (onQuerySubmit) {
            onQuerySubmit(query);
        }
    };

    // Keyboard shortcut for voice (Space when not focused on input)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
                e.preventDefault();
                // Trigger mic toggle - find and click the mic button
                const micBtn = document.querySelector('.lk-button[data-lk-source="microphone"]');
                if (micBtn) micBtn.click();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    
    return (
        <div className="interactive-corner">
            {/* Main Chat Panel */}
            <div className={`chat-panel ${isCollapsed ? 'collapsed' : ''}`}>
                {/* Header */}
                <div className="chat-header">
                    <div className="chat-header-title">
                        <span className="status-dot"></span>
                        <i className="ri-robot-line"></i>
                        JHERVIS ASSISTANT
                    </div>
                    <button 
                        className="chat-toggle-btn"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        title={isCollapsed ? 'Expand' : 'Collapse'}
                    >
                        <i className={isCollapsed ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}></i>
                    </button>
                </div>
                
                {/* Body */}
                <div className="chat-body">
                    {/* Chat messages */}
                    {children}
                    
                    {/* Input Controls */}
                    <div className="input-controls-row">
                        <ChatInput onQuerySubmit={handleQuerySubmit} />
                        <div className="control-bar-wrapper" style={{ position: 'relative' }}>
                            {isListening && <div className="voice-active-indicator" />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InteractiveCorner;
