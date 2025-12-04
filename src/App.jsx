import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { LiveKitRoom, RoomAudioRenderer, useRoomContext, ControlBar, useVoiceAssistant } from "@livekit/components-react";
import "@livekit/components-styles";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './components/ThemedScrollbar.css';
import './components/ParticleBackground.css';

import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
import ProjectsSection from "./sections/ProjectsSection";
import SkillsSection from "./sections/SkillsSection";
import ContactSection from "./sections/ContactSection";
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

const PortfolioPage = () => {
    const room = useRoomContext();
    const { state: agentState } = useVoiceAssistant();
    const sectionIds = useMemo(() => ["hero", "about", "projects", "skills", "contact"], []);
    const activeSection = useScrollSpy(sectionIds, { threshold: 0.5 });
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(0);
    const [hasWelcomed, setHasWelcomed] = useState(false);
    const [showIdlePrompt, setShowIdlePrompt] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [lastUserMessage, setLastUserMessage] = useState(null);
    const lastScrollY = useRef(0);
    const lastScrollTime = useRef(0);
    const lastNarratedSection = useRef(null);
    const lastAgentState = useRef(null);
    const idleTimerRef = useRef(null);
    const messageIdRef = useRef(0);
    
    // Initialize time ref on mount
    useEffect(() => {
        lastScrollTime.current = Date.now();
    }, []);

    // Sound effects on agent state change
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

    // Section change with sound and narration
    useEffect(() => {
        if (activeSection && activeSection !== lastNarratedSection.current && isScrolled && room) {
            soundEffects.playSectionChange();
            lastNarratedSection.current = activeSection;
            
            const narrationEvent = {
                type: "narration",
                section: activeSection,
            };
            const encoder = new TextEncoder();
            const data = encoder.encode(JSON.stringify(narrationEvent));
            room.localParticipant.publishData(data, { reliable: true });
        }
    }, [activeSection, isScrolled, room]);
    
    const handleQuerySubmit = useCallback((query) => {
        soundEffects.playClick();
        // Update last user message with unique id to trigger re-render
        messageIdRef.current += 1;
        setLastUserMessage({ id: messageIdRef.current, text: query });
        
        const queryEvent = {
            type: "user_query",
            query: query,
        };
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(queryEvent));
        room.localParticipant.publishData(data, { topic: "user_query" });
    }, [room]);

    const handleIdleAsk = useCallback((query) => {
        handleQuerySubmit(query);
        setShowIdlePrompt(false);
    }, [handleQuerySubmit]);

    const toggleSound = useCallback(() => {
        const newState = soundEffects.toggle();
        setSoundEnabled(newState);
    }, []);

    return (
        <ScrollProvider value={{ activeSection }}>
            <NeuralCore isFixed={isScrolled} scrollSpeed={scrollSpeed} />
            <VoiceAssistant />
            <ProgressIndicator />

            <main className="container-fluid">
                <ParticleBackground />

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

                <HeroSection />
                <AboutSection />
                <ProjectsSection />
                <SkillsSection />
                <ContactSection />
            </main>
        </ScrollProvider>
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
            <PortfolioPage />
        </LiveKitRoom>
    );
}