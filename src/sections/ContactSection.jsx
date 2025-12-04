import React from 'react';
import ScanEffect from '../components/ScanEffect';
import { useScroll } from '../contexts/ScrollContext';
import './ContactSection.css';

const ContactSection = () => {
    const { activeSection } = useScroll();
    return (
        <section id="contact">
            <ScanEffect active={activeSection === 'contact'} />
            <div className="contact-section-content">
                <h2 className="section-title">GET IN TOUCH</h2>
                <p>
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team. Feel free to reach out.
                </p>
                <a href="mailto:jervinjimenez@example.com" className="holo-btn">
                    SAY HELLO
                </a>
            </div>
        </section>
    );
};

export default ContactSection;