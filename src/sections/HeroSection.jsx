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
                    <p className="value-prop">AI-powered interactive portfolio for internship, junior, and freelance opportunities.</p>
                    <div className="hero-signals" aria-label="Credibility highlights">
                        <span>5 showcased builds</span>
                        <span>BSIT @ PLP</span>
                        <span>President&apos;s Lister</span>
                    </div>
                    <div className="hero-cta-group">
                        <a href="#projects" className="hero-cta primary">View Case Studies</a>
                        <a href="https://github.com/mafuyyuuu" target="_blank" rel="noopener noreferrer" className="hero-cta secondary">GitHub Profile</a>
                    </div>
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
