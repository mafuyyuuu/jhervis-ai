import React from 'react';
import { useScroll } from '../contexts/ScrollContext';
import './ContactSection.css';

const ContactSection = () => {
    const { activeSection } = useScroll();
    const isActive = activeSection === 'contact';

    return (
        <section id="contact" className={isActive ? 'section-active' : ''}>
            <div className="contact-section-content">
                <h2 className="section-title">GET IN TOUCH</h2>
                <p>
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team. Feel free to reach out.
                </p>
                <div className="credibility-signals" aria-label="Professional links">
                    <a href="https://github.com/mafuyyuuu/jhervis-ai" target="_blank" rel="noopener noreferrer">Portfolio Source</a>
                    <a href="https://github.com/mafuyyuuu" target="_blank" rel="noopener noreferrer">All Repositories</a>
                    <a href="/Resume.pdf" download="Jhervin-Jimenez-Resume.pdf">Download Resume</a>
                </div>
                <div className="contact-buttons">
                    <a href="mailto:jhervinjimenez03@gmail.com" className="holo-btn primary">
                        <i className="ri-mail-line btn-icon"></i>
                        SAY HELLO
                    </a>
                    <a href="https://github.com/mafuyyuuu" target="_blank" rel="noopener noreferrer" className="holo-btn secondary">
                        <i className="ri-github-fill btn-icon"></i>
                        GITHUB
                    </a>
                    <a href="https://www.linkedin.com/in/jhervin-jimenez-374730169/" target="_blank" rel="noopener noreferrer" className="holo-btn secondary">
                        <i className="ri-linkedin-box-fill btn-icon"></i>
                        LINKEDIN
                    </a>
                </div>
                <div className="contact-footer">
                    <p className="footer-text">
                        <i className="ri-heart-fill" style={{ color: 'var(--accent)' }}></i> Built by Jhervin Jimenez • Powered by J.H.E.R.V.I.S.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
