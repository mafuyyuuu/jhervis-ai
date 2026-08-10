import React, { useRef, useState } from 'react';
import { useScroll } from '../contexts/ScrollContext';
import { useHoverCapable } from '../hooks/useHoverCapable';
import ProjectPreviewModal from './ProjectPreviewModal';
import './ProjectCard.css';

const PROJECT_TIPS = {
    1: "This was JHERVIN's first major full-stack project!",
    2: "You're looking at the AI powering this very portfolio!",
    3: "JHERVIN loves building desktop apps with JavaFX",
    4: "JHERVIN's creative side shines in game development",
    5: "A real-world HR tool JHERVIN built for performance tracking",
};

const ProjectCard = ({ project }) => {
    const [showTip, setShowTip] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { setHoveredProjectId } = useScroll();
    const hoverCapable = useHoverCapable();
    const videoRef = useRef(null);
    const hasPreviewVideo = Boolean(project.previewVideo);

    const handleCardClick = () => setIsModalOpen(true);

    const handleMouseEnter = () => {
        setHoveredProjectId(project.id);
        // Show tip after a delay
        setTimeout(() => setShowTip(true), 1500);

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (hoverCapable && hasPreviewVideo && !prefersReducedMotion) {
            videoRef.current?.play().catch(() => {
                // Autoplay can be blocked before any user gesture on the page; the
                // static image stays visible underneath so this is a silent no-op.
            });
        }
    };

    const handleMouseLeave = () => {
        setHoveredProjectId(null);
        setShowTip(false);

        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
        }
    };

    return (
        <div
            className={`project-card ${isModalOpen ? 'is-modal-open' : ''}`}
            onClick={handleCardClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-label={`${project.title} — view details`}
        >
            {showTip && !isModalOpen && PROJECT_TIPS[project.id] && (
                <div className="project-tip">
                    <i className="ri-lightbulb-line tip-icon"></i>
                    <span className="tip-text">{PROJECT_TIPS[project.id]}</span>
                </div>
            )}

            <div className="project-image-container">
                <img src={project.image} alt={project.title} className="project-image" loading="lazy" decoding="async" />
                {hasPreviewVideo && hoverCapable && (
                    <video
                        ref={videoRef}
                        src={project.previewVideo}
                        className="project-preview-video"
                        muted
                        loop
                        playsInline
                    />
                )}
                <div className="project-image-overlay"></div>
            </div>

            <div className="project-content">
                <span className="project-type">{project.type}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <span className="click-hint">View details →</span>
            </div>

            {isModalOpen && (
                <ProjectPreviewModal project={project} onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};

export default ProjectCard;
