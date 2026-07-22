import { lazy, Suspense, useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { LiveKitRoom, RoomAudioRenderer, useRoomContext, ControlBar, useVoiceAssistant, useAudioPlayback } from "@livekit/components-react";
import "@livekit/components-styles";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './components/ThemedScrollbar.css';
import './components/ParticleBackground.css';

import NeuralCore from "./components/neural-core/NeuralCore";

import { useScrollSpy } from "./hooks/useScrollSpy";

import { ScrollProvider } from './contexts/ScrollContext';

import ParticleBackground from "./components/ParticleBackground";

import InteractiveCorner from "./components/InteractiveCorner";
import ChatDisplay from "./components/ChatDisplay";
import VoiceAssistant from "./components/VoiceAssistant";
import ProgressIndicator from "./components/ProgressIndicator";
import IdlePrompt from "./components/IdlePrompt";
import QuickActions from "./components/QuickActions";
import soundEffects from "./utils/soundEffects";

const HeroSection = lazy(() => import("./sections/HeroSection"));
const AboutSection = lazy(() => import("./sections/AboutSection"));
const ProjectsSection = lazy(() => import("./sections/ProjectsSection"));
const SkillsSection = lazy(() => import("./sections/SkillsSection"));
const ContactSection = lazy(() => import("./sections/ContactSection"));

const PortfolioPage = () => {
    const room = useRoomContext();
    const { state: agentState } = useVoiceAssistant();
    const { canPlayAudio, startAudio } = useAudioPlayback(room);
    const sectionIds = useMemo(() => ["hero", "about", "projects", "skills", "contact"], []);
    const activeSection = useScrollSpy(sectionIds, { threshold: 0.5 });
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(0);
    const [showIdlePrompt, setShowIdlePrompt] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [lastUserMessage, setLastUserMessage] = useState(null);
    const [hasEnteredExperience, setHasEnteredExperience] = useState(false);
    const [welcomeRequested, setWelcomeRequested] = useState(false);
    const lastScrollY = useRef(0);
    const lastScrollTime = useRef(0);
    const lastNarratedSection = useRef(null);
    const lastAgentState = useRef(null);
    const idleTimerRef = useRef(null);
    const messageIdRef = useRef(0);
    const isRoomConnected = room?.state === 'connected';
    
    // Initialize time ref on mount
    useEffect(() => {
        lastScrollTime.current = Date.now();
    }, []);

    // Sound effects on api state change
    useEffect(() => {
        if (agentState !== lastAgentState.current) {
            if (agentState === 'speaking' && lastAgentState.current !== 'speaking') {
                soundEffects.playSpeakingStart();
            } else if (agentState === 'listening' && lastAgentState.current !== 'listening') {
                soundEffects.playListeningStart();
            } else if (lastAgentState.current === 'speaking' && agentState !== 'speaking') {
                soundEffects.playSpeakingEnd();
            }
            lastAgentState.current = agentState;
        }
    }, [agentState]);

    // Idle detection for conversation starters
    useEffect(() => {
        const resetIdleTimer = () => {
            setShowIdlePrompt(false);
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            idleTimerRef.current = setTimeout(() => {
                setShowIdlePrompt(true);
            }, 45000); // 45 seconds of idle
        };
        
        window.addEventListener('mousemove', resetIdleTimer);
        window.addEventListener('keydown', resetIdleTimer);
        window.addEventListener('scroll', resetIdleTimer);
        resetIdleTimer();
        
        return () => {
            window.removeEventListener('mousemove', resetIdleTimer);
            window.removeEventListener('keydown', resetIdleTimer);
            window.removeEventListener('scroll', resetIdleTimer);
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const currentTime = Date.now();
            
            const distance = Math.abs(currentScrollY - lastScrollY.current);
            const time = currentTime - lastScrollTime.current;

            if (time > 0) {
                setScrollSpeed(distance / time);
            }

            lastScrollY.current = currentScrollY;
            lastScrollTime.current = currentTime;

            if (currentScrollY > 100) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const publishEvent = useCallback((event) => {
        if (!isRoomConnected) return;
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(event));
        room.localParticipant.publishData(data, { reliable: true }).catch(err => {
            console.warn('Failed to publish event:', err);
        });
    }, [room, isRoomConnected]);

    // Section change with sound and narration
    useEffect(() => {
        if (
            hasEnteredExperience &&
            activeSection &&
            activeSection !== lastNarratedSection.current &&
            isRoomConnected
        ) {
            if (isScrolled) {
                soundEffects.playSectionChange();
            }
            lastNarratedSection.current = activeSection;

            publishEvent({
                type: "narration",
                section: activeSection,
            });
        }
    }, [activeSection, isScrolled, isRoomConnected, publishEvent, hasEnteredExperience]);
    
    const handleQuerySubmit = useCallback((query) => {
        soundEffects.playClick();
        // Update last user message with unique id to trigger re-render
        messageIdRef.current += 1;
        setLastUserMessage({ id: messageIdRef.current, text: query });
        
        if (!isRoomConnected) {
            console.warn('Room not connected, cannot send query');
            return;
        }
        
        publishEvent({
            type: "user_query",
            query: query,
        });
    }, [isRoomConnected, publishEvent]);

    const handleIdleAsk = useCallback((query) => {
        handleQuerySubmit(query);
        setShowIdlePrompt(false);
    }, [handleQuerySubmit]);

    const toggleSound = useCallback(() => {
        const newState = soundEffects.toggle();
        setSoundEnabled(newState);
    }, []);

    const unlockAudio = useCallback(async () => {
        try {
            await startAudio();
        } catch {
            // continue in text mode if autoplay stays blocked
        }
    }, [startAudio]);

    useEffect(() => {
        if (!hasEnteredExperience || canPlayAudio) return;

        const handleUserGesture = () => unlockAudio();
        window.addEventListener("pointerdown", handleUserGesture);
        window.addEventListener("keydown", handleUserGesture);

        return () => {
            window.removeEventListener("pointerdown", handleUserGesture);
            window.removeEventListener("keydown", handleUserGesture);
        };
    }, [canPlayAudio, unlockAudio, hasEnteredExperience]);

    const handleStartExperience = useCallback(async () => {
        setHasEnteredExperience(true);
        await unlockAudio();
    }, [unlockAudio]);

    useEffect(() => {
        if (!canPlayAudio) {
            setWelcomeRequested(false);
            return;
        }
        if (!hasEnteredExperience || welcomeRequested || !isRoomConnected) return;
        publishEvent({ type: "welcome_request" });
        setWelcomeRequested(true);
    }, [hasEnteredExperience, welcomeRequested, publishEvent, canPlayAudio, isRoomConnected]);

    const connectionText = !isRoomConnected
        ? "Connecting to voice room..."
        : !canPlayAudio
            ? "Connected • Tap to enable audio"
            : agentState === "speaking"
                ? "JHERVIS is speaking"
                : agentState === "listening"
                    ? "Listening..."
                    : "Connected • Voice ready";

    const connectionStateClass = !isRoomConnected
        ? "is-connecting"
        : !canPlayAudio
            ? "is-blocked"
            : "is-ready";

    return (
        <ScrollProvider value={{ activeSection }}>
            <NeuralCore isFixed={isScrolled} scrollSpeed={scrollSpeed} />
            <VoiceAssistant />
            <ProgressIndicator />

            <main className="container-fluid">
                <ParticleBackground />
                <div className={`connection-pill ${connectionStateClass}`} role="status" aria-live="polite">
                    {connectionText}
                </div>

                {!hasEnteredExperience && (
                    <div className="experience-gate">
                        <div className="experience-card">
                            <h2>Start Experience</h2>
                            <p>Interactive voice portfolio with chat fallback.</p>
                            <button className="experience-start-btn" onClick={handleStartExperience}>
                                Enter Portfolio
                            </button>
                        </div>
                    </div>
                )}

                {/* Idle Prompt */}
                <IdlePrompt 
                    isVisible={showIdlePrompt && isScrolled} 
                    onDismiss={() => setShowIdlePrompt(false)}
                    onAsk={handleIdleAsk}
                />

                {/* Interactive Corner - only visible when scrolled */}
                <div className={`corner-container ${!isScrolled ? 'corner-hidden' : ''}`}>
                    <InteractiveCorner onQuerySubmit={handleQuerySubmit}>
                        <ChatDisplay userMessage={lastUserMessage} />
                        <QuickActions section={activeSection} onAsk={handleQuerySubmit} />
                    </InteractiveCorner>
                    <div className="control-bar-fixed">
                        <ControlBar
                            controls={{ microphone: true, camera: false, screenShare: false, leave: false }}
                            variation="minimal"
                        />
                    </div>
                </div>

                {/* Sound Toggle Button */}
                <button 
                    className="sound-toggle"
                    onClick={toggleSound}
                    title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
                >
                    <i className={soundEnabled ? 'ri-volume-up-line' : 'ri-volume-mute-line'}></i>
                </button>

                {hasEnteredExperience && !canPlayAudio && (
                    <button className="voice-hint-pill" onClick={unlockAudio}>
                        Tap to enable voice
                    </button>
                )}

                <Suspense fallback={null}>
                    <HeroSection />
                    <AboutSection />
                    <ProjectsSection />
                    <SkillsSection />
                    <ContactSection />
                </Suspense>
            </main>
        </ScrollProvider>
    );
};

// --- MAIN APP ---
export default function App() {
    const [token, setToken] = useState("");
    const tokenEndpoint = import.meta.env.VITE_TOKEN_SERVER_URL || "http://localhost:5005/getToken";

    useEffect(() => {
        (async () => {
            try {
                const resp = await fetch(tokenEndpoint);
                const data = await resp.text();
                setToken(data);
            } catch (e) { console.error(e); }
        })();
    }, [tokenEndpoint]);

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
            <PortfolioPage />
        </LiveKitRoom>
    );
}
