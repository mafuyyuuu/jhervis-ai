import React, { useState, useEffect, useRef } from 'react';
import './InteractiveCorner.css';
import ChatInput from "./ChatInput";
import MicButton from "./MicButton";
import VoiceIndicator from "./voice-indicator/VoiceIndicator";

const InteractiveCorner = ({ onQuerySubmit, children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const micRef = useRef(null);

    const handleQuerySubmit = (query) => {
        if (onQuerySubmit) {
            onQuerySubmit(query);
        }
    };

    // Keyboard shortcut for voice (Space when not typing).
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code !== 'Space') return;
            if (e.repeat) return; // holding Space shouldn't retrigger the toggle
            const tag = document.activeElement?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            e.preventDefault();
            micRef.current?.click();
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
                        <VoiceIndicator size="sm" />
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
                        <div className="mic-button-slot">
                            <MicButton ref={micRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InteractiveCorner;
