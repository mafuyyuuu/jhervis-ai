import React from 'react';
import ShinyText from '../components/shiny-text/ShinyText';
import ScanEffect from '../components/ScanEffect';
import { useScroll } from '../contexts/ScrollContext';
import './HeroSection.css';

const HeroSection = () => {
    const { activeSection } = useScroll();
    return (
        <section id="hero">
            <ScanEffect active={activeSection === 'hero'} />
            <div className="hero-content">
                <div className="neural-core-placeholder" />
                <div className="hero-text">
                    <h1 className="main-title">
                        <ShinyText text="J.H.E.R.V.I.S." />
                    </h1>
                    <p className="subtitle">JHERVIN's AI Digital Companion</p>
                    <p className="invitation">Scroll to explore my portfolio</p>
                </div>
            </div>
            <div className="scroll-down-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

export default HeroSection;