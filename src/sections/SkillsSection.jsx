import React from 'react';
import SkillBar from '../components/SkillBar';
import ScanEffect from '../components/ScanEffect';
import { useScroll } from '../contexts/ScrollContext';
import './SkillsSection.css';

const SKILLS_DATA = {
    "Programming Languages": [
        { id: 1, name: "Java", level: 75, relatedProjects: ["Library System"] },
        { id: 2, name: "Python", level: 80, relatedProjects: ["J.H.E.R.V.I.S.", "Face Recognition"] },
        { id: 3, name: "JavaScript", level: 90, relatedProjects: ["Payroll System", "J.H.E.R.V.I.S."] },
        { id: 4, name: "C++", level: 60, relatedProjects: [] },
    ],
    "Web Development": [
        { id: 5, name: "React", level: 85, relatedProjects: ["Payroll System", "J.H.E.R.V.I.S."] },
        { id: 6, name: "Node.js", level: 70, relatedProjects: ["Payroll System"] },
        { id: 7, name: "FastAPI", level: 50, note: "Beginner", relatedProjects: ["Face Recognition"] },
    ],
    "Tools & Tech": [
        { id: 8, name: "MySQL", level: 70, relatedProjects: ["Library System"] },
        { id: 9, name: "Git & GitHub", level: 65, note: "Learning", relatedProjects: ["All Projects"] },
        { id: 10, name: "JavaFX", level: 75, relatedProjects: ["Desktop Applications"] },
    ]
};


const SkillsSection = () => {
    const { activeSection } = useScroll();
    return (
        <section id="skills">
            <ScanEffect active={activeSection === 'skills'} />
            <div className="skills-section-content">
                <h2 className="section-title">SKILLS</h2>
                {Object.entries(SKILLS_DATA).map(([category, skills]) => (
                    <div key={category} className="skill-category">
                        <h3 className="subsection-title">{category}</h3>
                        <div className="row">
                            {skills.map(skill => (
                                <div className="col-md-6" key={skill.id}>
                                    <SkillBar skill={skill} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SkillsSection;