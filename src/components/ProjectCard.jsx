import React, { useRef, useState } from 'react';
import ProjectPreviewModal from './ProjectPreviewModal';
import './ProjectCard.css';

/* The hover tip used to live in a module-level map keyed by project id, which
   silently went wrong the moment the project list was reordered — id 3's tip
   about JavaFX desktop apps ended up on a machine learning project. It lives on
   the project record now, so a tip can't drift away from what it describes. */
const ProjectCard = ({ project }) => {
    const [showTip, setShowTip] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const tipTimerRef = useRef(null);

    const handleCardClick = () => setIsModalOpen(true);

    const handleMouseEnter = () => {
        tipTimerRef.current = setTimeout(() => setShowTip(true), 1200);
    };

    const handleMouseLeave = () => {
        // Without this the tip still popped up ~1s after the pointer had left.
        if (tipTimerRef.current) clearTimeout(tipTimerRef.current);
        setShowTip(false);
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
            {showTip && !isModalOpen && project.tip && (
                <div className="project-tip">
                    <i className="ri-lightbulb-line tip-icon"></i>
                    <span className="tip-text">{project.tip}</span>
                </div>
            )}

            <div className="project-image-container">
                {project.image ? (
                    <>
                        <img
                            src={project.image}
                            alt={`${project.title} screenshot`}
                            className="project-image"
                            loading="lazy"
                            decoding="async"
                        />
                        <div className="project-image-overlay"></div>
                    </>
                ) : (
                    /* No real screenshot yet — a numbered plate rather than a
                       stock photo standing in for one. */
                    <div className="project-cover" aria-hidden="true">
                        <span className="project-cover-index">
                            {String(project.id).padStart(2, '0')}
                        </span>
                    </div>
                )}
            </div>

            <div className="project-content">
                <span className="project-type">{project.type}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <span className="click-hint">
                    View details
                    {project.liveDemoUrl && <em className="click-hint-live">Live</em>}
                </span>
            </div>

            {isModalOpen && (
                <ProjectPreviewModal project={project} onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};

export default ProjectCard;
