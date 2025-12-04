import React from 'react';
import ScanEffect from '../components/ScanEffect';
import { useScroll } from '../contexts/ScrollContext';
import './AboutSection.css';

const AboutSection = () => {
    const { activeSection } = useScroll();
    const isActive = activeSection === 'about';
    
    const achievements = [
        "President's Lister",
        "Best in Research (2021)",
        "With High Honor (2021)",
        "Directed most-awarded short film in PLP's Art Appreciation Festival"
    ];
    const softSkills = [
        "Analytical thinker",
        "Fast learner & adaptable",
        "Leadership (team captain energy)",
        "Troubleshooting & problem-solving",
        "Communication & documentation",
        "Creativity (film, design, storytelling)"
    ];

    return (
        <section id="about" className={isActive ? 'section-active' : ''}>
            <ScanEffect active={isActive} />
            <div className="about-section-content">
                <h2 className="section-title">ABOUT ME</h2>
                <div className="row justify-content-center mb-5">
                    <div className="col-md-10">
                        <div className="profile-summary">
                            <p>
                                I am Jhervin Jimenez, a 22-year-old creator and aspiring AI engineer currently studying BSIT at Pamantasan ng Lungsod ng Pasig. With a passion for technology and creativity, I thrive on building innovative solutions and learning new things. My journey is driven by a blend of academic excellence, creative pursuits, and a strong desire for self-growth.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row g-5 mt-4">
                    <div className="col-md-6">
                        <h3 className="subsection-title">Achievements</h3>
                        <ul className="details-list">
                            {achievements.map((item, index) => <li key={index} style={{ animationDelay: `${index * 0.1}s` }}>{item}</li>)}
                        </ul>
                    </div>
                    <div className="col-md-6">
                        <h3 className="subsection-title">Soft Skills</h3>
                        <ul className="details-list">
                            {softSkills.map((item, index) => <li key={index} style={{ animationDelay: `${index * 0.1}s` }}>{item}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;