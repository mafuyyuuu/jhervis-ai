import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './ProjectPreviewModal.css';

// Full project details, opened when a card is clicked.
const ProjectPreviewModal = ({ project, onClose }) => {
    const dialogRef = useRef(null);
    const closeRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);

        /* Lock the page behind the modal. Without this the portfolio scrolled
           under the backdrop on wheel/trackpad, which is what made the overlay
           feel detached from the page. The scrollbar is compensated so the
           layout doesn't shift sideways as it disappears. */
        const { body } = document;
        const scrollbar = window.innerWidth - document.documentElement.clientWidth;
        const prevOverflow = body.style.overflow;
        const prevPadding = body.style.paddingRight;
        body.style.overflow = 'hidden';
        if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

        // Move focus in so Escape/Tab act on the dialog, not the page behind it.
        const previouslyFocused = document.activeElement;
        closeRef.current?.focus();

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            body.style.overflow = prevOverflow;
            body.style.paddingRight = prevPadding;
            if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
        };
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
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="preview-modal-title"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Sticky bar so Close stays reachable while reading a long
                    case study. It used to be a floating circle pinned to
                    top:-14px/right:-14px — hanging off the modal's corner,
                    clipped on narrow screens, and belonging to neither the
                    modal nor the page. */}
                <header className="preview-modal-bar">
                    <span className="preview-modal-type">{project.type}</span>
                    <button
                        className="preview-modal-close"
                        onClick={onClose}
                        aria-label="Close project details"
                        ref={closeRef}
                    >
                        <i className="ri-close-line" aria-hidden="true"></i>
                    </button>
                </header>

                <div className="preview-modal-scroll">
                    {project.image ? (
                        <img
                            src={project.image}
                            alt={`${project.title} screenshot`}
                            className="preview-modal-media"
                        />
                    ) : (
                        <div className="preview-modal-cover" aria-hidden="true">
                            <span className="project-cover-index">
                                {String(project.id).padStart(2, '0')}
                            </span>
                        </div>
                    )}

                    <div className="preview-modal-body">
                        <h3 className="preview-modal-title" id="preview-modal-title">
                            {project.title}
                        </h3>
                        <p className="preview-modal-desc">{project.longDescription}</p>

                        <dl className="preview-modal-facts">
                            {project.role && (
                                <div className="preview-modal-fact">
                                    <dt>Role</dt>
                                    <dd>{project.role}</dd>
                                </div>
                            )}
                            {project.outcome && (
                                <div className="preview-modal-fact">
                                    <dt>Outcome</dt>
                                    <dd>{project.outcome}</dd>
                                </div>
                            )}
                            <div className="preview-modal-fact">
                                <dt>Built with</dt>
                                <dd>
                                    <div className="preview-modal-tags">
                                        {project.technologies.map((tech) => (
                                            <span key={tech} className="tech-tag">{tech}</span>
                                        ))}
                                    </div>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <footer className="preview-modal-links">
                    {/* The deployed site is the preview — a link a reviewer can
                        actually click and poke at, rather than a muted clip. */}
                    {project.liveDemoUrl && (
                        <a
                            href={project.liveDemoUrl}
                            className="card-link is-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="ri-external-link-line" aria-hidden="true"></i>
                            Open live demo
                        </a>
                    )}
                    <a
                        href={project.sourceCodeUrl}
                        className="card-link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i className="ri-github-fill" aria-hidden="true"></i>
                        Source code
                    </a>
                </footer>
            </div>
        </div>,
        document.body
    );
};

export default ProjectPreviewModal;
