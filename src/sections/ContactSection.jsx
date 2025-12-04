import React from 'react';
import ScanEffect from '../components/ScanEffect';
import { useScroll } from '../contexts/ScrollContext';
import './ContactSection.css';

const ContactSection = () => {
    const { activeSection } = useScroll();
    const isActive = activeSection === 'contact';
    
    return (
        <section id="contact" className={isActive ? 'section-active' : ''}>
            <ScanEffect active={isActive} />
            <div className="contact-section-content">
                <h2 className="section-title">GET IN TOUCH</h2>
                <p>
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team. Feel free to reach out.
                </p>
                <div className="contact-buttons">
                    <a href="mailto:jhervinjimenez@example.com" className="holo-btn primary">
                        <i className="ri-mail-line btn-icon"></i>
                        SAY HELLO
                    </a>
                    <a href="https://github.com/jhervinjimenez" target="_blank" rel="noopener noreferrer" className="holo-btn secondary">
                        <i className="ri-github-fill btn-icon"></i>
                        GITHUB
                    </a>
                    <a href="https://linkedin.com/in/jhervinjimenez" target="_blank" rel="noopener noreferrer" className="holo-btn secondary">
                        <i className="ri-linkedin-box-fill btn-icon"></i>
                        LINKEDIN
                    </a>
                </div>
                <div className="contact-footer">
                    <p className="footer-text">
                        <i className="ri-heart-fill" style={{ color: 'var(--neon-cyan)' }}></i> Built by Jhervin Jimenez • Powered by J.H.E.R.V.I.S.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;