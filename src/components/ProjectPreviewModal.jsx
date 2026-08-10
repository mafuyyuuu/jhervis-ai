import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ProjectPreviewModal.css';

// Full project details, opened when a card is clicked (any device — there's
// no more flip-to-reveal-back-face; this modal is where the details live).
const ProjectPreviewModal = ({ project, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!project) return null;

    // Rendered through a portal to document.body on purpose: this modal is a
    // DOM child of .project-card, which has `transform` on hover and
    // `overflow: hidden`. A transformed ancestor becomes the containing block
    // for position:fixed descendants, so without the portal the backdrop
    // anchors/clips to the card and visibly jumps around as you hover it.
    return createPortal(
        <div
            className="preview-modal-backdrop"
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
        >
            <div
                className="preview-modal-content"
                role="dialog"
                aria-modal="true"
                aria-label={`${project.title} details`}
                onClick={(e) => e.stopPropagation()}
            >
                <button className="preview-modal-close" onClick={onClose} aria-label="Close">
                    <i className="ri-close-line"></i>
                </button>

                {project.previewVideo ? (
                    <video
                        src={project.previewVideo}
                        className="preview-modal-media"
                        controls
                        autoPlay
                        playsInline
                    />
                ) : (
                    <img src={project.image} alt={project.title} className="preview-modal-media" />
                )}

                <div className="preview-modal-body">
                    <span className="preview-modal-type">{project.type}</span>
                    <h3 className="preview-modal-title">{project.title}</h3>
                    <p className="preview-modal-desc">{project.longDescription}</p>
                    {project.outcome && (
                        <p className="preview-modal-outcome"><strong>Outcome:</strong> {project.outcome}</p>
                    )}

                    <div className="preview-modal-tags">
                        {project.technologies.map((tech) => (
                            <span key={tech} className="tech-tag">{tech}</span>
                        ))}
                    </div>

                    <div className="preview-modal-links">
                        {project.liveDemoUrl && (
                            <a href={project.liveDemoUrl} className="card-link" target="_blank" rel="noopener noreferrer">Live Demo</a>
                        )}
                        <a href={project.sourceCodeUrl} className="card-link" target="_blank" rel="noopener noreferrer">Source Code</a>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ProjectPreviewModal;
