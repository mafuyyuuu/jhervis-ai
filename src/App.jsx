import { useEffect, useState, useRef } from 'react';
import {
    LiveKitRoom,
    useVoiceAssistant,
    RoomAudioRenderer,
    ControlBar,
    useRoomContext
} from "@livekit/components-react";
import "@livekit/components-styles";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// --- DATA: Your Projects ---
const MY_PROJECTS = [
    { id: 1, title: "Payroll System", type: "SQL / PHP", description: "A comprehensive payroll management system handling employee salaries, deductions, and tax computations." },
    { id: 2, title: "Employee Management", type: "React / Node", description: "Full-stack employee management system with CRUD operations, attendance tracking, and reporting." },
    { id: 3, title: "J.H.E.R.V.I.S.", type: "AI / Python", description: "AI-powered digital companion built with LiveKit, Google Gemini, and React for real-time voice interaction." },
];

// --- COMPONENT: Holographic Popup Modal ---
const HoloModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    
    return (
        <div className="holo-modal-overlay" onClick={onClose}>
            <div className="holo-modal" onClick={e => e.stopPropagation()}>
                <div className="holo-modal-header">
                    <span className="holo-modal-title">{title}</span>
                    <button className="holo-close-btn" onClick={onClose}>×</button>
                </div>
                <div className="holo-modal-content">
                    {children}
                </div>
                <div className="holo-modal-scanline"></div>
            </div>
        </div>
    );
};

// --- COMPONENT: Projects Popup ---
const ProjectsPopup = ({ isOpen, onClose }) => (
    <HoloModal isOpen={isOpen} onClose={onClose} title="PROJECT ARCHIVES">
        <div className="projects-grid">
            {MY_PROJECTS.map((proj) => (
                <div key={proj.id} className="holo-project-card">
                    <div className="project-icon">
                        <span className="project-number">0{proj.id}</span>
                    </div>
                    <div className="project-info">
                        <h4>{proj.title}</h4>
                        <span className="project-type">{proj.type}</span>
                        <p>{proj.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </HoloModal>
);

// --- COMPONENT: The Neural Core ---
const NeuralCore = ({ state }) => {
    const isSpeaking = state === 'speaking';
    const isListening = state === 'listening';
    const isThinking = state === 'thinking';

    let statusText = "STANDBY";
    let statusClass = "";
    if (isSpeaking) { statusText = "TRANSMITTING"; statusClass = "status-speaking"; }
    if (isListening) { statusText = "LISTENING"; statusClass = "status-listening"; }
    if (isThinking) { statusText = "PROCESSING"; statusClass = "status-thinking"; }

    return (
        <div className="neural-core-wrapper">
            <div className={`reactor-container ${isSpeaking ? 'reactor-speaking' : ''} ${isListening ? 'reactor-listening' : ''}`}>
                <div className="reactor-glow"></div>
                <div className="reactor-ring ring-1"></div>
                <div className="reactor-ring ring-2"></div>
                <div className="reactor-ring ring-3">
                    <div className="core-dot"></div>
                </div>
                <div className="reactor-particles"></div>
            </div>
            <div className={`status-indicator ${statusClass}`}>
                <span className="status-dot"></span>
                <span className="status-text">{statusText}</span>
            </div>
        </div>
    );
};

// --- COMPONENT: Chat Message ---
const ChatMessage = ({ message, isUser }) => (
    <div className={`chat-message ${isUser ? 'user-message' : 'ai-message'}`}>
        <div className="message-bubble">
            <span className="message-label">{isUser ? 'YOU' : 'JHERVIS'}</span>
            <p>{message}</p>
        </div>
    </div>
);

// --- COMPONENT: Chat Interface ---
const ChatInterface = ({ messages }) => {
    const chatRef = useRef(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat-container" ref={chatRef}>
            {messages.length === 0 ? (
                <div className="chat-empty">
                    <p>Voice or type to interact with J.H.E.R.V.I.S.</p>
                </div>
            ) : (
                messages.map((msg, idx) => (
                    <ChatMessage key={idx} message={msg.text} isUser={msg.isUser} />
                ))
            )}
        </div>
    );
};

// --- COMPONENT: Main Interface ---
const MainInterface = () => {
    const { state } = useVoiceAssistant();
    const room = useRoomContext();
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const [showProjects, setShowProjects] = useState(false);

    const handleSend = async (e) => {
        if (e.key === 'Enter' && text.trim()) {
            const userMessage = text.trim();
            setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
            
            // Check for project-related keywords
            if (userMessage.toLowerCase().includes('project') || 
                userMessage.toLowerCase().includes('portfolio') ||
                userMessage.toLowerCase().includes('work')) {
                setShowProjects(true);
            }

            if (room) {
                const encoder = new TextEncoder();
                const data = encoder.encode(userMessage);
                await room.localParticipant.publishData(data, { reliable: true });
            }
            setText("");
        }
    };

    return (
        <>
            <div className="main-interface">
                {/* Header HUD */}
                <header className="hud-header">
                    <div className="hud-left">
                        <span className="hud-label">SYS.STATUS</span>
                        <span className="hud-value online">ONLINE</span>
                    </div>
                    <div className="hud-center">
                        <h1 className="system-title">J.H.E.R.V.I.S.</h1>
                        <span className="system-subtitle">AI Digital Companion</span>
                    </div>
                    <div className="hud-right">
                        <span className="hud-label">PROTOCOL</span>
                        <span className="hud-value">ALPHA-7</span>
                    </div>
                </header>

                {/* Core Area */}
                <main className="core-area">
                    <NeuralCore state={state} />
                </main>

                {/* Chat Area */}
                <section className="chat-area">
                    <ChatInterface messages={messages} />
                </section>

                {/* Input Area */}
                <footer className="input-area">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            className="holo-input"
                            placeholder="Enter command or speak..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleSend}
                        />
                        <div className="mic-button">
                            <ControlBar
                                controls={{ microphone: true, camera: false, screenShare: false, leave: false }}
                                variation="minimal"
                            />
                        </div>
                    </div>
                    <div className="quick-actions">
                        <button className="holo-btn" onClick={() => setShowProjects(true)}>
                            <span>VIEW PROJECTS</span>
                        </button>
                    </div>
                </footer>
            </div>

            {/* Popups */}
            <ProjectsPopup isOpen={showProjects} onClose={() => setShowProjects(false)} />
        </>
    );
};

// --- MAIN APP ---
export default function App() {
    const [token, setToken] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const resp = await fetch("http://localhost:5000/getToken");
                const data = await resp.text();
                setToken(data);
            } catch (e) { console.error(e); }
        })();
    }, []);

    if (!token) {
        return (
            <div className="loading-screen">
                <div className="loading-core"></div>
                <p>INITIALIZING NEURAL LINK...</p>
            </div>
        );
    }

    return (
        <LiveKitRoom
            video={false}
            audio={true}
            token={token}
            serverUrl={import.meta.env.VITE_LIVEKIT_URL || "wss://jhervis-iiqthr75.livekit.cloud"}
            data-lk-theme="default"
            style={{ height: '100vh' }}
        >
            <RoomAudioRenderer />
            <MainInterface />
        </LiveKitRoom>
    );
}