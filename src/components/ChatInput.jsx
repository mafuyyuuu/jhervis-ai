import React, { useState, useRef } from 'react';
import './ChatInput.css';

const ChatInput = ({ onQuerySubmit }) => {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            const message = inputValue.trim();
            
            if (onQuerySubmit) {
                onQuerySubmit(message);
            }

            setInputValue('');
        }
    };

    const focusInput = () => {
        inputRef.current?.focus();
    };

    return (
        <div className="chat-input-wrapper" onClick={focusInput}>
            <div className="chat-input-display">
                <span className="prompt-symbol">›</span>
                {inputValue ? (
                    <span>{inputValue}</span>
                ) : (
                    <span className="input-placeholder">Type a message...</span>
                )}
                <span className="cursor">|</span>
            </div>
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="hidden-input"
            />
        </div>
    );
};

export default ChatInput;
