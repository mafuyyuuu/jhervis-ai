import React, { useState } from 'react';
import './HeroAsk.css';

/* The first screen is where a visitor decides what this site is. Previously it
   ended on "Scroll to explore my portfolio" — the same sentence a portfolio
   with no AI in it would use — and the only place to type at JHERVIS was a dock
   that stayed hidden until you had scrolled past the hero. So the one thing
   that makes this site different was invisible at the exact moment it had to
   land. This puts the assistant in the hero: a real input, and three questions
   worth asking, answered live. */

/* Short labels so the row stays on one line, full questions on the wire — the
   agent answers better from a complete question than from a chip caption. */
const STARTERS = [
    { label: 'What he built', query: "What has Jhervin actually built?" },
    { label: 'Junior-ready?', query: "Is Jhervin ready for a junior developer role?" },
    { label: 'Learning now', query: "What is Jhervin learning right now?" },
];

const HeroAsk = ({ onAsk, disabled }) => {
    const [value, setValue] = useState('');

    const submit = (event) => {
        event.preventDefault();
        const query = value.trim();
        if (!query || disabled) return;
        onAsk(query);
        setValue('');
    };

    return (
        <div className="hero-ask">
            <form className="hero-ask-form" onSubmit={submit}>
                <label className="hero-ask-label" htmlFor="hero-ask-input">
                    Ask JHERVIS
                </label>
                <div className="hero-ask-field">
                    <input
                        id="hero-ask-input"
                        type="text"
                        className="hero-ask-input"
                        placeholder={
                            disabled
                                ? 'JHERVIS is offline — browse below'
                                : 'Ask anything about Jhervin...'
                        }
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        disabled={disabled}
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        className="hero-ask-submit"
                        disabled={disabled || !value.trim()}
                        aria-label="Send question to JHERVIS"
                    >
                        <i className="ri-arrow-right-line"></i>
                    </button>
                </div>
            </form>

            {!disabled && (
                <div className="hero-ask-starters">
                    {STARTERS.map((starter) => (
                        <button
                            key={starter.label}
                            type="button"
                            className="hero-ask-starter"
                            onClick={() => onAsk(starter.query)}
                        >
                            {starter.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeroAsk;
