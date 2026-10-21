import React from 'react';
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
            <div className="about-section-content">
                <h2 className="section-title">ABOUT JHERVIN</h2>
                <div className="row justify-content-center mb-5">
                    <div className="col-md-10">
                        <div className="profile-summary">
                            <p>
                                Jhervin Jimenez is a full-stack developer based in the Philippines and a BSIT student at Pamantasan ng Lungsod ng Pasig. He brings a year of professional remote development experience with React, Node.js, and Firebase. As the lead developer of Project TRACE, he works across frontend interfaces, backend services, workflow automation, and deployment. He enjoys turning everyday problems into practical tools and improving his work through testing, feedback, and collaboration.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row g-5 mt-4">
                    <div className="col-md-6">
                        <h3 className="subsection-title">Achievements</h3>
                        <ul className="details-list">
                            {achievements.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                    </div>
                    <div className="col-md-6">
                        <h3 className="subsection-title">Soft Skills</h3>
                        <ul className="details-list">
                            {softSkills.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;