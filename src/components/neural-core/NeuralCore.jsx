import React from 'react';
import { useVoiceAssistant } from "@livekit/components-react";
import { useScroll } from '../../contexts/ScrollContext';
import './NeuralCore.css';

const NeuralCore = ({ isFixed, scrollSpeed = 0 }) => {
    const { state: agentState } = useVoiceAssistant();
    const { hoveredProjectId } = useScroll();
    const isGazing = hoveredProjectId !== null;

    const isSpeaking = agentState === 'speaking';
    const isListening = agentState === 'listening';
    const isThinking = agentState === 'thinking';

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

    return (
        <div className={`neural-core-wrapper ${isFixed ? 'fixed' : ''}`}>
            <div className={`reactor-container ${isSpeaking ? 'reactor-speaking' : ''} ${isListening ? 'reactor-listening' : ''} ${isGazing ? 'is-gazing' : ''}`}>
                <div className="reactor-glow"></div>
                <div className="reactor-ring ring-1" style={{ animationDuration: `${duration1}s` }}></div>
                <div className="reactor-ring ring-2" style={{ animationDuration: `${duration2}s` }}></div>
                <div className="reactor-ring ring-3">
                    <div className="core-dot"></div>
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
