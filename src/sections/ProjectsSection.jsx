import React, { useEffect, useMemo, useRef, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import ScanEffect from '../components/ScanEffect';
import { useScroll } from '../contexts/ScrollContext';
import './ProjectsSection.css';

const MY_PROJECTS = [
    { 
        id: 1, 
        title: "Payroll System", 
        type: "React / Node.js", 
        description: "A comprehensive payroll management system handling employee salaries, deductions, and tax computations.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
        longDescription: "This full-stack application was developed as a major academic project to simulate a real-world payroll system. It features role-based access control for employees and administrators, automated salary calculation, and detailed payslip generation.",
        technologies: ["React", "Node.js", "Express", "MySQL", "Bootstrap"],
        role: "Full-Stack Developer",
        outcome: "Automated core payroll calculations and organized records into one dashboard.",
        liveDemoUrl: "https://github.com/mafuyyuuu",
        sourceCodeUrl: "https://github.com/mafuyyuuu",
    },
    { 
        id: 2, 
        title: "J.H.E.R.V.I.S.", 
        type: "AI / Python / React", 
        description: "AI-powered digital companion with real-time voice interaction and holographic interface.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
        longDescription: "This is the very portfolio you are interacting with now. It's an exploration into creating an AI-driven user experience using real-time voice and chat, powered by Google Gemini and LiveKit's api framework.",
        technologies: ["React", "Python", "LiveKit", "Google Gemini", "Vite"],
        role: "AI Engineer & Frontend Developer",
        outcome: "Delivered a realtime voice + chat portfolio assistant integrated with LiveKit.",
        liveDemoUrl: "https://jhervis-ai.vercel.app",
        sourceCodeUrl: "https://github.com/mafuyyuuu/jhervis-ai",
    },
    { 
        id: 3, 
        title: "Library System", 
        type: "Java / MySQL", 
        description: "A library management system for tracking books, borrowers, and lending records with search functionality.",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
        longDescription: "A desktop application built with Java and JavaFX for managing a library's inventory. It includes features for adding, searching, borrowing, and returning books, as well as managing borrower information.",
        technologies: ["Java", "JavaFX", "MySQL", "SceneBuilder"],
        role: "Lead Developer",
        outcome: "Centralized borrowing, returns, and inventory tracking in one workflow.",
        liveDemoUrl: "https://github.com/mafuyyuuu",
        sourceCodeUrl: "https://github.com/mafuyyuuu",
    },
    { 
        id: 4, 
        title: "Stranger Game", 
        type: "Game Dev", 
        description: "An interactive game project featuring engaging gameplay mechanics and immersive storytelling.",
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=250&fit=crop",
        longDescription: "A conceptual game project focused on narrative design and player choice. The development process involved scriptwriting, character design, and prototyping core gameplay loops in a small team setting.",
        technologies: ["Unity (Conceptual)", "Narrative Design"],
        role: "Writer & Game Designer",
        outcome: "Built a narrative prototype focused on player-choice storytelling.",
        liveDemoUrl: "https://github.com/mafuyyuuu",
        sourceCodeUrl: "https://github.com/mafuyyuuu",
    },
    { 
        id: 5, 
        title: "IPCR System", 
        type: "Web App", 
        description: "Individual Performance Commitment and Review system for tracking and evaluating employee performance.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
        longDescription: "A web application designed to streamline the employee performance review process. It allows employees to set goals and managers to review and rate performance against those goals, generating a final IPCR report.",
        technologies: ["PHP", "MySQL", "Bootstrap", "jQuery"],
        role: "Full-Stack Developer",
        outcome: "Structured employee goals and review flow into a single web process.",
        liveDemoUrl: "https://github.com/mafuyyuuu",
        sourceCodeUrl: "https://github.com/mafuyyuuu",
    },
];

const ProjectsSection = () => {
    const { activeSection } = useScroll();
    const isActive = activeSection === 'projects';
    const sectionRef = useRef(null);
    const viewportRef = useRef(null);
    const trackRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [maxTranslate, setMaxTranslate] = useState(0);

    useEffect(() => {
        const updateMaxTranslate = () => {
            if (!viewportRef.current || !trackRef.current) return;
            const nextMax = Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth);
            setMaxTranslate(nextMax);
        };

        updateMaxTranslate();
        window.addEventListener("resize", updateMaxTranslate);
        return () => window.removeEventListener("resize", updateMaxTranslate);
    }, []);

    useEffect(() => {
        let rafId = null;

        const handleScroll = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                if (!sectionRef.current) return;
                const section = sectionRef.current;
                const totalScroll = section.offsetHeight - window.innerHeight;
                if (totalScroll <= 0) {
                    setProgress(0);
                    return;
                }

                const rect = section.getBoundingClientRect();
                const scrolled = Math.min(Math.max(-rect.top, 0), totalScroll);
                setProgress(scrolled / totalScroll);
            });
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const currentSlide = useMemo(
        () => Math.min(MY_PROJECTS.length - 1, Math.round(progress * (MY_PROJECTS.length - 1))),
        [progress]
    );

    const trackStyle = {
        transform: `translate3d(-${progress * maxTranslate}px, 0, 0)`,
    };

    return (
        <section
            id="projects"
            ref={sectionRef}
            className={`${isActive ? 'section-active' : ''} projects-scroll-section`}
        >
            <ScanEffect active={isActive} />
            <div className="projects-sticky-shell">
                <div className="projects-header-row">
                    <h2 className="section-title">PROJECTS</h2>
                    <span className="projects-counter">
                        {String(currentSlide + 1).padStart(2, '0')} / {String(MY_PROJECTS.length).padStart(2, '0')}
                    </span>
                </div>
                <p className="section-subtitle">Scroll to move through featured builds.</p>
                <div className="projects-progress-track">
                    <span style={{ width: `${progress * 100}%` }} />
                </div>

                <div className="projects-horizontal-viewport" ref={viewportRef}>
                    <div className="projects-track" ref={trackRef} style={trackStyle}>
                        {MY_PROJECTS.map((project, index) => (
                            <article
                                className={`projects-slide ${index === currentSlide ? 'is-current' : ''}`}
                                key={project.id}
                            >
                                <div className="slide-meta">
                                    <span className="slide-role">{project.role}</span>
                                    <h3>{project.title}</h3>
                                </div>
                            <ProjectCard project={project} />
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectsSection;
