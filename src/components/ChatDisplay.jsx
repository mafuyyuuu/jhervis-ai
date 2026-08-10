import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useVoiceAssistant } from '@livekit/components-react';
import { useTranscript } from '../hooks/useTranscript';
import './ChatDisplay.css';

const NEAR_BOTTOM_PX = 48;

const ChatDisplay = ({ userMessage, aiStatus }) => {
    /* Everything JHERVIS says, plus anything the visitor says out loud, comes
       from the room's transcript stream. Typed questions are the one thing that
       doesn't: `generate_reply(user_input=...)` adds them straight to the
       agent's chat context without going through transcription, so they're
       tracked separately here and echoed optimistically — which also means they
       show up instantly instead of after a round trip. */
    const transcript = useTranscript();
    const [typedMessages, setTypedMessages] = useState([]);
    const scrollRef = useRef(null);
    const pinnedToBottomRef = useRef(true);
    const { state: agentState } = useVoiceAssistant();

    useEffect(() => {
        if (!userMessage?.text) return;
        setTypedMessages((prev) => [
            ...prev,
            {
                id: `typed-${userMessage.id}`,
                role: 'user',
                text: userMessage.text,
                final: true,
                at: Date.now(),
            },
        ]);
    }, [userMessage]);

    const messages = useMemo(
        () => [...typedMessages, ...transcript].sort((a, b) => a.at - b.at),
        [typedMessages, transcript],
    );

    /* Dots mean "working, nothing to show yet". Keyed off whether the agent has
       started its reply — not off whether a reply is still streaming — because
       agentState stays "speaking" until the audio finishes, which is well after
       the last word of text lands. Testing for unfinalized text would flick the
       dots back on underneath an already-complete message. */
    const lastMessage = messages[messages.length - 1];
    const isPending =
        (agentState === 'thinking' || agentState === 'speaking') &&
        (!lastMessage || lastMessage.role !== 'assistant');

    /* Only follow the tail if the reader is already there. Assistant text
       arrives a few words at a time, so unconditional autoscroll would yank the
       view out from under anyone who scrolled up to re-read something. */
    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        pinnedToBottomRef.current = distanceFromBottom <= NEAR_BOTTOM_PX;
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el && pinnedToBottomRef.current) {
            el.scrollTop = el.scrollHeight;
        }
    }, [messages, isPending]);

    const emptyStateText =
        aiStatus === 'error'
            ? 'JHERVIS is offline right now — the portfolio below still works.'
            : aiStatus === 'loading'
                ? 'Waking JHERVIS up...'
                : 'Ask JHERVIS anything about JHERVIN!';

    return (
        <div className="chat-display-wrapper">
            <div
                className="chat-display"
                ref={scrollRef}
                onScroll={handleScroll}
                role="log"
                aria-live="polite"
                aria-label="Conversation with JHERVIS"
            >
                {messages.length === 0 ? (
                    <div className="chat-empty-state">
                        <i className="ri-chat-3-line empty-icon"></i>
                        <p>{emptyStateText}</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`chat-message ${message.role} ${message.final ? '' : 'is-streaming'}`}
                        >
                            <span className="message-sender">
                                {message.role === 'assistant' ? 'JHERVIS' : 'YOU'}
                            </span>
                            <span className="message-text">{message.text}</span>
                        </div>
                    ))
                )}

                {isPending && (
                    <div className="typing-indicator" aria-label="JHERVIS is responding">
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
