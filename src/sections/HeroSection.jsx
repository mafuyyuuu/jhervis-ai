import React from 'react';
import ShinyText from '../components/shiny-text/ShinyText';
import VoiceIndicator from '../components/voice-indicator/VoiceIndicator';
import HeroAsk from '../components/HeroAsk';
import './HeroSection.css';

const HeroSection = ({ onAsk, aiStatus }) => {
    return (
        <section id="hero">
            <div className="hero-content">
                <div className="hero-text">
                    {/* Sits in normal flow, so there is no viewport-fixed orb to
                        collide with the title at unlucky screen sizes. */}
                    <VoiceIndicator size="lg" showLabel />

                    <h1 className="main-title">
                        <ShinyText text="J.H.E.R.V.I.S." />
                    </h1>
                    <p className="subtitle">JHERVIN's AI Digital Companion</p>
                    <p className="value-prop">
                        Ask about Jhervin's work and this portfolio answers you — out loud,
                        or in writing. Built for internship, junior, and freelance opportunities.
                    </p>

                    <HeroAsk onAsk={onAsk} disabled={aiStatus === 'error'} />

                    <div className="hero-signals" aria-label="Credibility highlights">
                        <span>5 showcased builds</span>
                        <span>BSIT @ PLP</span>
                        <span>President&apos;s Lister</span>
                    </div>
                    <div className="hero-cta-group">
                        <a href="#projects" className="hero-cta">View case studies</a>
                        <a
                            href="https://github.com/mafuyyuuu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hero-cta"
                        >
                            GitHub profile
                        </a>
                    </div>
                </div>
            </div>
            <div className="scroll-down-indicator" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

export default HeroSection;
