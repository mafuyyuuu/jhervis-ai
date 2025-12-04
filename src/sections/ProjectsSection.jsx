import React from 'react';
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
        liveDemoUrl: "#",
        sourceCodeUrl: "#",
    },
    { 
        id: 2, 
        title: "J.H.E.R.V.I.S.", 
        type: "AI / Python / React", 
        description: "AI-powered digital companion with real-time voice interaction and holographic interface.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
        longDescription: "This is the very portfolio you are interacting with now. It's an exploration into creating an AI-driven user experience using real-time voice and chat, powered by Google Gemini and LiveKit's agent framework.",
        technologies: ["React", "Python", "LiveKit", "Google Gemini", "Vite"],
        role: "AI Engineer & Frontend Developer",
        liveDemoUrl: "#",
        sourceCodeUrl: "#",
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
        liveDemoUrl: "#",
        sourceCodeUrl: "#",
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
        liveDemoUrl: "#",
        sourceCodeUrl: "#",
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
        liveDemoUrl: "#",
        sourceCodeUrl: "#",
    },
];

const ProjectsSection = () => {
    const { activeSection, hoveredProjectId } = useScroll();
    return (
        <section id="projects">
            <ScanEffect active={activeSection === 'projects'} />
            <div className="projects-section-content">
                <h2 className="section-title">PROJECTS</h2>
                <div className="row g-4">
                    {MY_PROJECTS.map(project => (
                        <div 
                            className={`col-md-4 ${hoveredProjectId === project.id ? 'glow' : ''}`} 
                            key={project.id}
                        >
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectsSection;