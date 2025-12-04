import React, { useState } from 'react';
import { useScroll } from '../contexts/ScrollContext';
import './ProjectCard.css';

const PROJECT_TIPS = {
    1: "This was JHERVIN's first major full-stack project!",
    2: "You're looking at the AI powering this very portfolio!",
    3: "JHERVIN loves building desktop apps with JavaFX",
    4: "JHERVIN's creative side shines in game development",
    5: "A real-world HR tool JHERVIN built for performance tracking",
};

const ProjectCard = ({ project }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [showTip, setShowTip] = useState(false);
    const { setHoveredProjectId } = useScroll();

    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
    };

    const handleMouseEnter = () => {
        setHoveredProjectId(project.id);
        // Show tip after a delay
        setTimeout(() => setShowTip(true), 1500);
    };

    const handleMouseLeave = () => {
        setHoveredProjectId(null);
        setShowTip(false);
    };

    return (
        <div 
            className="project-card-scene" 
            onClick={handleCardClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* AI Tip Tooltip */}
            {showTip && !isFlipped && PROJECT_TIPS[project.id] && (
                <div className="project-tip">
                    <i className="ri-lightbulb-line tip-icon"></i>
                    <span className="tip-text">{PROJECT_TIPS[project.id]}</span>
                </div>
            )}
            
            <div className={`project-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                <div className="project-card-face card-front">
                    <div className="project-image-container">
                        <img src={project.image} alt={project.title} className="project-image" />
                        <div className="project-image-overlay"></div>
                    </div>
                    <div className="project-content">
                        <span className="project-type">{project.type}</span>
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <span className="click-hint">Click to see details</span>
                    </div>
                </div>
                <div className="project-card-face card-back">
                    <div className="card-back-content">
                        <h4>{project.title}</h4>
                        <p className="long-desc">{project.longDescription}</p>
                        <div className="tech-list">
                            {project.technologies.map(tech => (
                                <span key={tech} className="tech-tag">{tech}</span>
                            ))}
                        </div>
                        <div className="card-links">
                            <a href={project.liveDemoUrl} className="card-link">Live Demo</a>
                            <a href={project.sourceCodeUrl} className="card-link">Source Code</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;