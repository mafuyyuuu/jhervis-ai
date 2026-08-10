import { lazy, Suspense, useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { LiveKitRoom, RoomAudioRenderer, useRoomContext, useVoiceAssistant, useAudioPlayback, useConnectionState } from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import "@livekit/components-styles";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './components/ThemedScrollbar.css';
import './components/ParticleBackground.css';

import NeuralCore from "./components/neural-core/NeuralCore";

import { useScrollSpy } from "./hooks/useScrollSpy";
import { useLiveKitToken } from "./hooks/useLiveKitToken";

import { ScrollProvider } from './contexts/ScrollContext';

import ParticleBackground from "./components/ParticleBackground";

import InteractiveCorner from "./components/InteractiveCorner";
import ChatDisplay from "./components/ChatDisplay";
import ProgressIndicator from "./components/ProgressIndicator";
import IdlePrompt from "./components/IdlePrompt";
import QuickActions from "./components/QuickActions";
import soundEffects from "./utils/soundEffects";

const HeroSection = lazy(() => import("./sections/HeroSection"));
const AboutSection = lazy(() => import("./sections/AboutSection"));
const ProjectsSection = lazy(() => import("./sections/ProjectsSection"));
const SkillsSection = lazy(() => import("./sections/SkillsSection"));
const ContactSection = lazy(() => import("./sections/ContactSection"));

const PortfolioPage = ({ aiStatus, onRetryAi }) => {
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
    // null = gate still up. 'voice' = wants to hear JHERVIS. 'silent' = chose to
    // just read the portfolio; the agent still answers, in text only.
    const [entryMode, setEntryMode] = useState(null);
    const [welcomeRequested, setWelcomeRequested] = useState(false);
    const [showMicHint, setShowMicHint] = useState(true);
    const hasEnteredExperience = entryMode !== null;
    const aiUnavailable = aiStatus === 'error';
    const lastScrollY = useRef(0);
    const lastScrollTime = useRef(0);
    const lastNarratedSection = useRef(null);
    const lastAgentState = useRef(null);
    const idleTimerRef = useRef(null);
    const messageIdRef = useRef(0);
    // Must come from useConnectionState, not `room.state`: useRoomContext
    // hands back the Room instance without subscribing to connection events,
    // and `room.state` is a plain mutable property — reading it directly never
    // re-renders, so it can stay stuck on "connecting" long after the socket
    // is live (which also silently blocked publishEvent/narration/queries).
    const connectionState = useConnectionState(room);
    const isRoomConnected = connectionState === ConnectionState.Connected;
    
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
        if (entryMode !== 'voice' || canPlayAudio) return;

        const handleUserGesture = () => unlockAudio();
        window.addEventListener("pointerdown", handleUserGesture);
        window.addEventListener("keydown", handleUserGesture);

        return () => {
            window.removeEventListener("pointerdown", handleUserGesture);
            window.removeEventListener("keydown", handleUserGesture);
        };
    }, [canPlayAudio, unlockAudio, entryMode]);

    const handleEnter = useCallback(async (mode) => {
        setEntryMode(mode);
        if (mode === 'voice') await unlockAudio();
    }, [unlockAudio]);

    // Voice-mode visitors get the spoken greeting once audio is actually
    // unlocked. Silent-mode visitors skip it — the agent would otherwise
    // narrate into a muted tab and burn quota for nobody.
    useEffect(() => {
        if (entryMode !== 'voice') return;
        if (!canPlayAudio) {
            setWelcomeRequested(false);
            return;
        }
        if (welcomeRequested || !isRoomConnected) return;
        publishEvent({ type: "welcome_request" });
        setWelcomeRequested(true);
    }, [entryMode, welcomeRequested, publishEvent, canPlayAudio, isRoomConnected]);

    const connectionText = aiUnavailable
        ? "JHERVIS is offline — portfolio still works"
        : !isRoomConnected
            ? "Connecting to JHERVIS..."
            : entryMode === 'silent'
                ? "JHERVIS ready • Replies in text"
                : !canPlayAudio
                    ? "Connected • Tap to enable audio"
                    : agentState === "speaking"
                        ? "JHERVIS is speaking"
                        : agentState === "listening"
                            ? "Listening..."
                            : "Connected • Voice ready";

    const connectionStateClass = aiUnavailable
        ? "is-offline"
        : !isRoomConnected
            ? "is-connecting"
            : !canPlayAudio && entryMode !== 'silent'
                ? "is-blocked"
                : "is-ready";

    return (
        <ScrollProvider value={{ activeSection }}>
            <NeuralCore isFixed={isScrolled} scrollSpeed={scrollSpeed} />
            <ProgressIndicator />

            <main className="container-fluid">
                <ParticleBackground />
                <div className={`connection-pill ${connectionStateClass}`} role="status" aria-live="polite">
                    <span>{connectionText}</span>
                    {aiUnavailable && (
                        <button className="connection-retry" onClick={onRetryAi}>
                            Retry
                        </button>
                    )}
                </div>

                {/* The gate exists only to buy the user gesture that browsers
                    require before audio can autoplay. If there's no agent to
                    listen to, there's nothing to unlock — don't put a wall in
                    front of the portfolio for no reason. */}
                {!hasEnteredExperience && !aiUnavailable && (
                    <div className="experience-gate">
                        <div className="experience-card">
                            <h2>Meet JHERVIS</h2>
                            <p>
                                An AI companion that narrates this portfolio out loud and
                                answers questions about Jhervin — by voice or in writing.
                            </p>
                            <div className="experience-actions">
                                <button
                                    className="experience-start-btn"
                                    onClick={() => handleEnter('voice')}
                                >
                                    Enter with voice
                                </button>
                                <button
                                    className="experience-skip-btn"
                                    onClick={() => handleEnter('silent')}
                                >
                                    Just browse quietly
                                </button>
                            </div>
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
                        <ChatDisplay userMessage={lastUserMessage} aiStatus={aiStatus} />
                        <QuickActions section={activeSection} onAsk={handleQuerySubmit} />
                    </InteractiveCorner>
                </div>

                {/* Held back until the dock is on screen — the hint talks about
                    tapping a mic button that lives inside it. */}
                {entryMode === 'voice' && isScrolled && showMicHint && (
                    <div className="mic-privacy-hint" role="status">
                        <span>
                            <i className="ri-mic-off-line"></i> Mic is off by default — tap it to talk. Nothing is recorded or stored.
                        </span>
                        <button
                            className="mic-privacy-hint-dismiss"
                            onClick={() => setShowMicHint(false)}
                            aria-label="Dismiss"
                        >
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                )}

                {/* Sound Toggle Button */}
                <button 
                    className="sound-toggle"
                    onClick={toggleSound}
                    title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
                >
                    <i className={soundEnabled ? 'ri-volume-up-line' : 'ri-volume-mute-line'}></i>
                </button>

                {entryMode === 'voice' && !canPlayAudio && !aiUnavailable && (
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
    const tokenEndpoint = import.meta.env.VITE_TOKEN_SERVER_URL || "/api";
    const { token, status, retry } = useLiveKitToken(tokenEndpoint);

    /* The portfolio renders immediately and unconditionally — it is a document
       first and an AI demo second. LiveKitRoom creates its Room object whether
       or not a token exists yet, so every LiveKit hook below has its context
       from the first paint; useLiveKitRoom simply logs "no token yet" and
       connects on its own once the token lands (or never, if the token server
       is down, which is now a degraded corner of the page rather than a wall). */
    return (
        <LiveKitRoom
            video={false}
            audio={false}
            token={token ?? undefined}
            serverUrl={import.meta.env.VITE_LIVEKIT_URL || "wss://jhervis-iiqthr75.livekit.cloud"}
            data-lk-theme="default"
            style={{ height: '100vh' }}
        >
            <RoomAudioRenderer />
            <PortfolioPage aiStatus={status} onRetryAi={retry} />
        </LiveKitRoom>
    );
}
