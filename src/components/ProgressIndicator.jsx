import React, { useState, useMemo } from 'react';
import { useScroll } from '../contexts/ScrollContext';
import './ProgressIndicator.css';

const SECTIONS = [
    { id: 'hero', label: 'Welcome' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
];

const ProgressIndicator = () => {
    const { activeSection } = useScroll();
    const [hoveredSection, setHoveredSection] = useState(null);
    
    // Track visited sections using a derived approach
    const visitedSections = useMemo(() => {
        const sections = ['hero'];
        const sectionOrder = ['hero', 'about', 'projects', 'skills', 'contact'];
        const currentIndex = sectionOrder.indexOf(activeSection);
        for (let i = 0; i <= currentIndex; i++) {
            if (!sections.includes(sectionOrder[i])) {
                sections.push(sectionOrder[i]);
            }
        }
        return new Set(sections);
    }, [activeSection]);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="progress-indicator">
            {SECTIONS.map((section, index) => (
                <div 
                    key={section.id}
                    className="progress-item"
                    onMouseEnter={() => setHoveredSection(section.id)}
                    onMouseLeave={() => setHoveredSection(null)}
                >
                    <div 
                        className={`progress-dot ${
                            activeSection === section.id ? 'active' : ''
                        } ${
                            visitedSections.has(section.id) && activeSection !== section.id ? 'visited' : ''
                        }`}
                        onClick={() => scrollToSection(section.id)}
                        title={section.label}
                    />
                    {hoveredSection === section.id && (
                        <span className="progress-label">{section.label}</span>
                    )}
                    {index < SECTIONS.length - 1 && (
                        <div className={`progress-line ${visitedSections.has(SECTIONS[index + 1].id) ? 'visited' : ''}`} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProgressIndicator;
