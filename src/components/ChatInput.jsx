import React, { useState, useEffect, useRef } from 'react';
import { useRoomContext } from '@livekit/components-react';
import './ChatInput.css';

const ChatInput = ({ onQuerySubmit }) => {
    const room = useRoomContext();
    const [inputValue, setInputValue] = useState('');
    const [animatedText, setAnimatedText] = useState('');
    const animationFrameRef = useRef();

    useEffect(() => {
        let currentIndex = 0;
        const animate = () => {
            if (currentIndex < inputValue.length) {
                setAnimatedText(inputValue.substring(0, currentIndex + 1));
                currentIndex++;
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        };

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [inputValue]);

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            const message = inputValue.trim();
            
            // Notify parent component of the query
            if (onQuerySubmit) {
                onQuerySubmit(message);
            }

            setInputValue('');
            setAnimatedText('');

            if (room) {
                const encoder = new TextEncoder();
                const data = encoder.encode(message);
                await room.localParticipant.publishData(data, { reliable: true });
            }
        }
    };

    return (
        <div className="chat-input-wrapper" onClick={() => document.querySelector('.hidden-input')?.focus()}>
            <div className="chat-input-display">
                <span>&gt; </span>
                <span>{animatedText}</span>
                <span className="cursor">_</span>
            </div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="hidden-input"
                autoFocus
            />
        </div>
    );
};

export default ChatInput;
