import { useEffect, useState, useRef, useCallback } from 'react';
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
import ShinyText from './components/ShinyText';

// --- DATA ---
const MY_PROJECTS = [
    { 
        id: 1, 
        title: "Payroll System", 
        type: "React / Node.js", 
        description: "A comprehensive payroll management system handling employee salaries, deductions, and tax computations.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop"
    },
    { 
        id: 2, 
        title: "J.H.E.R.V.I.S.", 
        type: "AI / Python / React", 
        description: "AI-powered digital companion with real-time voice interaction and holographic interface.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop"
    },
    { 
        id: 3, 
        title: "Library System", 
        type: "Java / MySQL", 
        description: "A library management system for tracking books, borrowers, and lending records with search functionality.",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop"
    },
    { 
        id: 4, 
        title: "Stranger Game", 
        type: "Game Dev", 
        description: "An interactive game project featuring engaging gameplay mechanics and immersive storytelling.",
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=250&fit=crop"
    },
    { 
        id: 5, 
        title: "IPCR System", 
        type: "Web App", 
        description: "Individual Performance Commitment and Review system for tracking and evaluating employee performance.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"
    },
];

const MY_HOBBIES = [
    { id: 1, icon: "🎵", title: "Music", detail: "Taylor Swift Fan" },
    { id: 2, icon: "🎬", title: "Filmmaking", detail: "Director & Writer" },
    { id: 3, icon: "💪", title: "Fitness", detail: "25kg Dumbbells" },
    { id: 4, icon: "🌙", title: "Night Coding", detail: "Best Focus Time" },
];

const MY_SKILLS = [
    { id: 1, name: "React", level: 85 },
    { id: 2, name: "Python", level: 80 },
    { id: 3, name: "Java", level: 75 },
    { id: 4, name: "Node.js", level: 70 },
];

// --- COMPONENT: Floating Project Card ---
const FloatingProjectCard = ({ project, index, onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => onComplete(project.id), 10000);
        return () => clearTimeout(timer);
    }, [project.id, onComplete]);

    return (
        <div className="floating-project-card" 
             style={{ animationDelay: `${index * 0.15}s` }}>
            <div className="project-image-container">
                <img src={project.image} alt={project.title} className="project-image" />
                <div className="project-image-overlay"></div>
            </div>
            <div className="floating-project-content">
                <div className="floating-project-number">0{project.id}</div>
                <h4>{project.title}</h4>
                <span className="floating-project-type">{project.type}</span>
                <p>{project.description}</p>
            </div>
        </div>
    );
};

// --- COMPONENT: Floating Hobby Card ---
// --- COMPONENT: Floating Hobby Card ---
const FloatingHobbyCard = ({ hobby, index, onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => onComplete(hobby.id), 8000);
        return () => clearTimeout(timer);
    }, [hobby.id, onComplete]);

    return (
        <div className="floating-hobby-card"
             style={{ animationDelay: `${index * 0.2}s` }}>
            <span className="hobby-icon">{hobby.icon}</span>
            <div className="hobby-info">
                <h5>{hobby.title}</h5>
                <span>{hobby.detail}</span>
            </div>
        </div>
    );
};

// --- COMPONENT: Floating Skill Bar ---
const FloatingSkillCard = ({ skill, index, onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => onComplete(skill.id), 8000);
        return () => clearTimeout(timer);
    }, [skill.id, onComplete]);

    return (
        <div className="floating-skill-card"
             style={{ animationDelay: `${index * 0.2}s` }}>
            <div className="skill-header">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-percent">{skill.level}%</span>
            </div>
            <div className="skill-bar-bg">
                <div className="skill-bar-fill" style={{ width: `${skill.level}%` }}></div>
            </div>
        </div>
    );
};

// --- COMPONENT: Floating Message ---
const FloatingMessage = ({ text, onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => onComplete(), 4000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="floating-message">
            <span className="floating-text">{text}</span>
        </div>
    );
};

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
            </div>
            <div className={`status-indicator ${statusClass}`}>
                <span className="status-dot"></span>
                <span className="status-text">{statusText}</span>
            </div>
        </div>
    );
};

// --- COMPONENT: Main Interface ---
const MainInterface = () => {
    const { state: agentState, agentTranscriptions } = useVoiceAssistant();
    const room = useRoomContext();
    const [text, setText] = useState("");
    const [floatingMessages, setFloatingMessages] = useState([]);
    const [showingProjects, setShowingProjects] = useState(false);
    const [showingHobbies, setShowingHobbies] = useState(false);
    const [showingSkills, setShowingSkills] = useState(false);
    const [visibleProjects, setVisibleProjects] = useState([]);
    const [visibleHobbies, setVisibleHobbies] = useState([]);
    const [visibleSkills, setVisibleSkills] = useState([]);
    const [cardsLockedWhileSpeaking, setCardsLockedWhileSpeaking] = useState(false);
    const messageIdRef = useRef(0);
    const lastTranscriptRef = useRef("");
    const projectsTriggeredRef = useRef(false);
    const hobbiesTriggeredRef = useRef(false);
    const skillsTriggeredRef = useRef(false);

    const removeMessage = useCallback((id) => {
        setFloatingMessages(prev => prev.filter(msg => msg.id !== id));
    }, []);

    const removeProject = useCallback((id) => {
        if (cardsLockedWhileSpeaking) return;
        setVisibleProjects(prev => {
            const newProjects = prev.filter(p => p.id !== id);
            if (newProjects.length === 0) setShowingProjects(false);
            return newProjects;
        });
    }, [cardsLockedWhileSpeaking]);

    const removeHobby = useCallback((id) => {
        if (cardsLockedWhileSpeaking) return;
        setVisibleHobbies(prev => {
            const newHobbies = prev.filter(h => h.id !== id);
            if (newHobbies.length === 0) setShowingHobbies(false);
            return newHobbies;
        });
    }, [cardsLockedWhileSpeaking]);

    const removeSkill = useCallback((id) => {
        if (cardsLockedWhileSpeaking) return;
        setVisibleSkills(prev => {
            const newSkills = prev.filter(s => s.id !== id);
            if (newSkills.length === 0) setShowingSkills(false);
            return newSkills;
        });
    }, [cardsLockedWhileSpeaking]);

    const closeAllCards = useCallback(() => {
        setShowingProjects(false);
        setShowingHobbies(false);
        setShowingSkills(false);
        setVisibleProjects([]);
        setVisibleHobbies([]);
        setVisibleSkills([]);
    }, []);

    const triggerProjectsDisplay = useCallback(() => {
        closeAllCards();
        setTimeout(() => {
            setShowingProjects(true);
            setVisibleProjects([...MY_PROJECTS]);
        }, 50);
    }, [closeAllCards]);

    const triggerHobbiesDisplay = useCallback(() => {
        closeAllCards();
        setTimeout(() => {
            setShowingHobbies(true);
            setVisibleHobbies([...MY_HOBBIES]);
        }, 50);
    }, [closeAllCards]);

    const triggerSkillsDisplay = useCallback(() => {
        closeAllCards();
        setTimeout(() => {
            setShowingSkills(true);
            setVisibleSkills([...MY_SKILLS]);
        }, 50);
    }, [closeAllCards]);

    // Detect keywords in AI transcriptions to trigger cards
    useEffect(() => {
        if (!agentTranscriptions || agentTranscriptions.length === 0) return;
        
        const latestTranscript = agentTranscriptions[agentTranscriptions.length - 1];
        if (!latestTranscript || !latestTranscript.text) return;
        
        const transcriptText = latestTranscript.text.toLowerCase();
        
        // Check if we already processed this
        if (transcriptText === lastTranscriptRef.current) return;
        lastTranscriptRef.current = transcriptText;
        
        // Trigger projects when AI mentions them
        const projectKeywords = ['project', 'portfolio', 'payroll', 'library system', 'ipcr', 'stranger game'];
        const hobbiesKeywords = ['hobby', 'hobbies', 'interest', 'taylor swift', 'swiftie', 'fitness', 'workout'];
        const skillsKeywords = ['skill', 'skills', 'programming language', 'technical skill'];
        
        if (!projectsTriggeredRef.current && projectKeywords.some(kw => transcriptText.includes(kw))) {
            projectsTriggeredRef.current = true;
            triggerProjectsDisplay();
        }
        
        if (!hobbiesTriggeredRef.current && hobbiesKeywords.some(kw => transcriptText.includes(kw))) {
            hobbiesTriggeredRef.current = true;
            triggerHobbiesDisplay();
        }
        
        if (!skillsTriggeredRef.current && skillsKeywords.some(kw => transcriptText.includes(kw))) {
            skillsTriggeredRef.current = true;
            triggerSkillsDisplay();
        }
    }, [agentTranscriptions, triggerProjectsDisplay, triggerHobbiesDisplay, triggerSkillsDisplay]);

    // Reset triggers when AI stops speaking
    useEffect(() => {
        if (agentState === 'speaking') {
            setCardsLockedWhileSpeaking(true);
        } else if (cardsLockedWhileSpeaking && agentState !== 'speaking') {
            // AI stopped speaking, reset triggers and start fade out timer
            const timer = setTimeout(() => {
                setCardsLockedWhileSpeaking(false);
                projectsTriggeredRef.current = false;
                hobbiesTriggeredRef.current = false;
                skillsTriggeredRef.current = false;
            }, 5000); // Keep cards 5 more seconds after speaking ends
            return () => clearTimeout(timer);
        }
    }, [agentState, cardsLockedWhileSpeaking]);

    const handleSend = async (e) => {
        if (e.key === 'Enter' && text.trim()) {
            e.preventDefault();
            const userMessage = text.trim();
            setText(""); // Clear immediately
            
            const newId = messageIdRef.current++;
            setFloatingMessages(prev => [...prev, { id: newId, text: userMessage }]);

            if (room) {
                try {
                    const encoder = new TextEncoder();
                    const data = encoder.encode(userMessage);
                    await room.localParticipant.publishData(data, { reliable: true });
                    console.log("Sent message:", userMessage);
                } catch (err) {
                    console.error("Failed to send message:", err);
                }
            }
        }
    };

    return (
        <>
            {/* Floating text messages */}
            <div className="floating-messages-container">
                {floatingMessages.map((msg) => (
                    <FloatingMessage key={msg.id} text={msg.text} onComplete={() => removeMessage(msg.id)} />
                ))}
            </div>

            {/* Floating project cards on the sides */}
            {showingProjects && (
                <div className="floating-projects-container">
                    {visibleProjects.map((proj, index) => (
                        <FloatingProjectCard key={proj.id} project={proj} index={index} onComplete={removeProject} />
                    ))}
                </div>
            )}

            {/* Floating hobby cards */}
            {showingHobbies && (
                <div className="floating-hobbies-container">
                    {visibleHobbies.map((hobby, index) => (
                        <FloatingHobbyCard key={hobby.id} hobby={hobby} index={index} onComplete={removeHobby} />
                    ))}
                </div>
            )}

            {/* Floating skill cards */}
            {showingSkills && (
                <div className="floating-skills-container">
                    {visibleSkills.map((skill, index) => (
                        <FloatingSkillCard key={skill.id} skill={skill} index={index} onComplete={removeSkill} />
                    ))}
                </div>
            )}

            <div className="main-interface">
                <header className="hud-header">
                    <div className="hud-left">
                        <span className="hud-label">SYS.STATUS</span>
                        <span className="hud-value online">ONLINE</span>
                    </div>
                    <div className="hud-center">
                        <ShinyText text="J.H.E.R.V.I.S." speed={3} className="system-title" />
                        <span className="system-subtitle">AI Digital Companion</span>
                    </div>
                    <div className="hud-right">
                        <span className="hud-label">PROTOCOL</span>
                        <span className="hud-value">ALPHA-7</span>
                    </div>
                </header>

                <main className="core-area">
                    <NeuralCore state={agentState} />
                </main>

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
                        <button className="holo-btn" onClick={triggerProjectsDisplay}>
                            <span>PROJECTS</span>
                        </button>
                        <button className="holo-btn" onClick={triggerSkillsDisplay}>
                            <span>SKILLS</span>
                        </button>
                        <button className="holo-btn" onClick={triggerHobbiesDisplay}>
                            <span>HOBBIES</span>
                        </button>
                    </div>
                </footer>
            </div>
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
