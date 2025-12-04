import React, { useState, useEffect, useRef } from 'react';
import { useVoiceAssistant } from "@livekit/components-react";
import { useScroll } from '../../contexts/ScrollContext';
import './NeuralCore.css';

const NeuralCore = ({ isFixed, scrollSpeed = 0 }) => {
    const { state: agentState } = useVoiceAssistant();
    const { hoveredProjectId, activeSection } = useScroll();
    const isGazing = hoveredProjectId !== null;
    const coreRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const isSpeaking = agentState === 'speaking';
    const isListening = agentState === 'listening';
    const isThinking = agentState === 'thinking';

    // Mood-based color mapping
    const getMoodClass = () => {
        switch(activeSection) {
            case 'about': return 'mood-professional';
            case 'projects': return 'mood-enthusiastic';
            case 'skills': return 'mood-professional';
            case 'contact': return 'mood-friendly';
            default: return 'mood-default';
        }
    };

    let statusText = "STANDBY";
    let statusClass = "";
    if (isSpeaking) { statusText = "TRANSMITTING"; statusClass = "status-speaking"; }
    if (isListening) { statusText = "LISTENING"; statusClass = "status-listening"; }
    if (isThinking) { statusText = "PROCESSING"; statusClass = "status-thinking"; }

    // Base animation durations
    const baseDuration1 = 8;
    const baseDuration2 = 5;

    // Make spinning faster based on scroll speed, but cap the effect
    const speedFactor = Math.max(0.1, 1 - Math.min(scrollSpeed / 10, 0.9));
    const duration1 = baseDuration1 * speedFactor;
    const duration2 = baseDuration2 * speedFactor;

    // Eye follow cursor effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (coreRef.current) {
                const rect = coreRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = (e.clientX - centerX) / 50;
                const deltaY = (e.clientY - centerY) / 50;
                
                // Clamp the movement
                const clampedX = Math.max(-8, Math.min(8, deltaX));
                const clampedY = Math.max(-8, Math.min(8, deltaY));
                
                setMousePos({ x: clampedX, y: clampedY });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div 
            ref={coreRef}
            className={`neural-core-wrapper ${isFixed ? 'fixed' : ''} ${getMoodClass()}`}
        >
            <div className={`reactor-container ${isSpeaking ? 'reactor-speaking' : ''} ${isListening ? 'reactor-listening' : ''} ${isGazing ? 'is-gazing' : ''}`}>
                <div className="reactor-glow"></div>
                <div className="reactor-ring ring-1" style={{ animationDuration: `${duration1}s` }}></div>
                <div className="reactor-ring ring-2" style={{ animationDuration: `${duration2}s` }}></div>
                <div className="reactor-ring ring-3">
                    <div 
                        className="core-dot"
                        style={{ 
                            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
                            transition: 'transform 0.1s ease-out'
                        }}
                    ></div>
                </div>
            </div>
            <div className={`status-indicator ${statusClass}`}>
                <span className="status-dot"></span>
                <span className="status-text">{statusText}</span>
            </div>
        </div>
    );
};

export default NeuralCore;
