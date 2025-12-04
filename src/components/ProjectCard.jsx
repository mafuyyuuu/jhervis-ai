import React, { useState } from 'react';
import { useScroll } from '../contexts/ScrollContext';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const { setHoveredProjectId } = useScroll();

    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div 
            className="project-card-scene" 
            onClick={handleCardClick}
            onMouseEnter={() => setHoveredProjectId(project.id)}
            onMouseLeave={() => setHoveredProjectId(null)}
        >
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