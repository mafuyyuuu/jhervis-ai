import { useEffect, useState, useRef } from 'react';
import { useDataChannel } from '@livekit/components-react';

const VoiceAssistant = () => {
    const [messageQueue, setMessageQueue] = useState([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const utteranceRef = useRef(null);

    const onMessage = (msg) => {
        const decoder = new TextDecoder();
        const message = decoder.decode(msg.payload);
        const parsedMessage = JSON.parse(message);
        setMessageQueue(prev => [...prev, parsedMessage.message]);
    };
    
    useDataChannel("welcome", onMessage);
    useDataChannel("narration", onMessage);

    useEffect(() => {
        const speak = (text) => {
            if ('speechSynthesis' in window) {
                setIsSpeaking(true);
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.onend = () => {
                    setIsSpeaking(false);
                    setMessageQueue(prev => prev.slice(1));
                };
                utterance.onerror = () => {
                    setIsSpeaking(false);
                    setMessageQueue(prev => prev.slice(1));
                };
                utteranceRef.current = utterance;
                window.speechSynthesis.speak(utterance);
            }
        };

        if (!isSpeaking && messageQueue.length > 0) {
            speak(messageQueue[0]);
        }

        return () => {
            if (utteranceRef.current) {
                window.speechSynthesis.cancel();
            }
        };
    }, [messageQueue, isSpeaking]);

    return null; // This is a non-visual component
};

export default VoiceAssistant;
