import React from 'react';
import ProjectCard from '../components/ProjectCard';
import { useScroll } from '../contexts/ScrollContext';
import './ProjectsSection.css';

/* Sourced from the real github.com/mafuyyuuu repositories.

   `image` is a real screenshot or it is null — no stock photography. A generic
   Unsplash photo of "some code on a laptop" tells a recruiter nothing and
   quietly signals there was nothing real to show; ProjectCard renders a
   numbered typographic cover for null instead. Drop files in public/projects/
   and point `image` at them as screenshots become available.

   There is no separate preview-video field: `liveDemoUrl` is the preview. A
   deployed link a reviewer can click beats a muted hover clip, and it can't go
   stale against the real thing. */
const MY_PROJECTS = [
    {
        id: 1,
        title: "J.H.E.R.V.I.S.",
        tip: "You're using this one right now.",
        type: "AI / Python / React",
        description: "AI companion that narrates this portfolio and answers questions about Jhervin — live voice plus an on-screen transcript.",
        image: "/projects/jhervis.png",
        longDescription: "The portfolio you are using right now. A React front end and a Python LiveKit agent worker exchange events over a room data channel, with Google Gemini's realtime model supplying the voice. The agent's speech is streamed back as text so every answer is readable, not just audible.",
        technologies: ["React", "Python", "LiveKit", "Google Gemini", "Vite"],
        role: "AI Engineer & Frontend Developer",
        outcome: "Shipped a realtime voice + text portfolio assistant that degrades to a readable transcript when audio is unavailable.",
        liveDemoUrl: "https://jhervis-ai.vercel.app",
        sourceCodeUrl: "https://github.com/mafuyyuuu/jhervis-ai",
    },
    {
        id: 2,
        title: "Project TRACE",
        tip: "Built for a real registrar's office, not a course brief.",
        type: "Full-Stack / JavaScript",
        description: "Document tracking, auto-routing, and analytics engine built for the PLP Registrar's office.",
        image: null,
        longDescription: "Tracking, Routing, and Analytics Computing Engine — an end-to-end system for following documents through the registrar's workflow, routing them to the right desk automatically, and reporting on where things stall. Mostly JavaScript with a Python service alongside it, and self-hosted n8n driving the automation between the two.",
        technologies: ["JavaScript", "Python", "n8n", "HTML", "CSS"],
        role: "Developer",
        outcome: "Replaced manual document hand-offs with tracked, auto-routed flows and analytics on bottlenecks.",
        liveDemoUrl: null,
        sourceCodeUrl: "https://github.com/mafuyyuuu/Project-TRACE",
    },
    {
        id: 3,
        title: "Alumni Employability Tracer",
        tip: "Where Jhervin's machine learning work lives.",
        type: "Machine Learning / Full-Stack",
        description: "Full-stack alumni tracking system with machine learning predictions on graduate employability.",
        image: null,
        longDescription: "Tracks alumni outcomes after graduation and models employability from that history. Roughly an even split of JavaScript for the application and Python for the modelling side.",
        technologies: ["Python", "JavaScript", "Machine Learning"],
        role: "Full-Stack & ML Developer",
        outcome: "Turned scattered alumni records into a queryable dataset with employability predictions on top.",
        liveDemoUrl: null,
        sourceCodeUrl: "https://github.com/mafuyyuuu/alumni-employability-tracer",
    },
    {
        id: 4,
        title: "SafePasig.AI",
        tip: "Runs its detection on-device, with no signal needed.",
        type: "Android / Kotlin",
        description: "Offline personal-safety app that listens for falls, struggles, and shouts for help — no signal required.",
        image: null,
        longDescription: "An Android app in Kotlin that runs its detection on-device so it keeps working with no connectivity. It watches for falls and distress signals, including shouts of \"Tulong!\", and escalates for help when the user cannot. Built to be battery-efficient enough to leave running, on top of a Firebase and Cloud Firestore data layer. Started life as PasigConnect before being reworked into SafePasig.AI.",
        technologies: ["Kotlin", "Android", "On-device ML", "Firebase", "Cloud Firestore"],
        role: "Android Developer",
        outcome: "Detection runs fully offline, so the app still works in exactly the dead-signal situations it exists for.",
        liveDemoUrl: null,
        sourceCodeUrl: "https://github.com/mafuyyuuu/SafePasigAI",
    },
    {
        id: 5,
        title: "Payroll & IPCR Module",
        tip: "Built with a team of five.",
        type: "ERP / React / Node.js",
        description: "Payroll management plus performance review (IPCR) modules for a group-built ERP system.",
        image: null,
        longDescription: "Built with a team of five at Pamantasan ng Lungsod ng Pasig. Covers salary, deduction and tax computation with role-based access for staff and administrators, alongside the IPCR module that structures employee goal-setting and manager review into one flow.",
        technologies: ["React", "Node.js", "Express", "MySQL", "Bootstrap"],
        role: "Full-Stack Developer",
        outcome: "Automated payroll computation and consolidated review workflows into a single dashboard.",
        liveDemoUrl: null,
        sourceCodeUrl: "https://github.com/mafuyyuuu/PayrollModule-ERPSystem",
    },
    {
        id: 6,
        title: "Library System",
        tip: "His first ever Java application.",
        type: "Java / MySQL",
        description: "Desktop library management for inventory, borrowers, and lending records — his first Java application.",
        image: null,
        longDescription: "A JavaFX desktop application for managing a library's inventory: adding and searching titles, handling borrowing and returns, and tracking borrower information. Written in freshman year as a Java course case study.",
        technologies: ["Java", "JavaFX", "MySQL", "SceneBuilder"],
        role: "Lead Developer",
        outcome: "Centralized borrowing, returns, and inventory tracking into one workflow.",
        liveDemoUrl: null,
        sourceCodeUrl: "https://github.com/mafuyyuuu/LibrarySystem-CaseStudy-",
    },
    {
        id: 7,
        title: "Data Analysis Case Study",
        tip: "Raw data through to a fitted model.",
        type: "Python / Data",
        description: "End-to-end data work: manipulation, exploration, analysis, visualisation, and modelling.",
        image: null,
        longDescription: "A Python case study walking a dataset through the full pipeline — cleaning and manipulation, exploratory analysis, visualisation, and finally modelling.",
        technologies: ["Python", "Data Analysis", "Data Visualisation"],
        role: "Analyst & Developer",
        outcome: "Produced a complete analysis pipeline from raw data through to a fitted model.",
        liveDemoUrl: null,
        sourceCodeUrl: "https://github.com/mafuyyuuu/CaseStudy",
    },
    {
        id: 8,
        title: "Stranger",
        tip: "Jhervin's creative side — writing as much as code.",
        type: "Game / Java",
        description: "A Stranger Things-inspired game application, built as a sophomore-year final project.",
        image: null,
        longDescription: "A small Java game inspired by Stranger Things, produced as the final project for a sophomore course. The work leaned on narrative design and scripting as much as on the code.",
        technologies: ["Java", "Narrative Design"],
        role: "Writer & Developer",
        outcome: "Delivered a playable narrative game as a course final.",
        liveDemoUrl: null,
        sourceCodeUrl: "https://github.com/mafuyyuuu/Stranger",
    },
];

const ProjectsSection = () => {
    const { activeSection } = useScroll();
    const isActive = activeSection === 'projects';

    return (
        <section id="projects" className={isActive ? 'section-active' : ''}>
            <div className="projects-section-content">
                <div className="projects-header-row">
                    <h2 className="section-title">PROJECTS</h2>
                    <span className="projects-counter">{String(MY_PROJECTS.length).padStart(2, '0')} BUILDS</span>
                </div>
                <p className="section-subtitle">Selected work — click any card for the full case study.</p>

                <div className="projects-grid">
                    {MY_PROJECTS.map((project) => (
                        <ProjectCard project={project} key={project.id} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectsSection;
