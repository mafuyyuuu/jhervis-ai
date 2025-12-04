import { useEffect, useState, useMemo, useRef } from 'react';
import { LiveKitRoom, RoomAudioRenderer, useRoomContext } from "@livekit/components-react";
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
import { ControlBar } from "@livekit/components-react";
import ChatDisplay from "./components/ChatDisplay";
import VoiceAssistant from "./components/VoiceAssistant";

const PortfolioPage = () => {
    const room = useRoomContext();
    const sectionIds = useMemo(() => ["hero", "about", "projects", "skills", "contact"], []);
    const activeSection = useScrollSpy(sectionIds, { threshold: 0.5 });
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(0);
    const [hasWelcomed, setHasWelcomed] = useState(false);
    const lastScrollY = useRef(0);
    const lastScrollTime = useRef(Date.now());
    const lastNarratedSection = useRef(null);

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

    useEffect(() => {
        if (room && !hasWelcomed) {
            const welcomeEvent = {
                type: "welcome",
                message: "Welcome to my portfolio. I am your personal guide. Feel free to ask me anything as you explore.",
            };
            const encoder = new TextEncoder();
            const data = encoder.encode(JSON.stringify(welcomeEvent));
            room.localParticipant.publishData(data, { reliable: true });
            setHasWelcomed(true);
        }
    }, [room, hasWelcomed]);

    useEffect(() => {
        if (activeSection && activeSection !== lastNarratedSection.current && isScrolled) {
            lastNarratedSection.current = activeSection;
            const narrationEvent = {
                type: "narration",
                section: activeSection,
            };
            
            const encoder = new TextEncoder();
            const data = encoder.encode(JSON.stringify(narrationEvent));
            room.localParticipant.publishData(data, { reliable: true });
        }
    }, [activeSection, room, isScrolled]);
    
    const handleQuerySubmit = (query) => {
        const queryEvent = {
            type: "user_query",
            query: query,
        };
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(queryEvent));
        room.localParticipant.publishData(data, { topic: "user_query" });
    };

    return (
        <ScrollProvider value={{ activeSection }}>
            <NeuralCore isFixed={isScrolled} scrollSpeed={scrollSpeed} />
            <VoiceAssistant />

            <main className="container-fluid">
                <ParticleBackground />

                <div className={!isScrolled ? 'hidden' : ''}>
                    <InteractiveCorner onQuerySubmit={handleQuerySubmit}>
                        <ChatDisplay />
                        <div className="control-bar-wrapper">
                            <ControlBar
                                controls={{ microphone: true, camera: false, screenShare: false, leave: false }}
                                variation="minimal"
                            />
                        </div>
                    </InteractiveCorner>
                </div>

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