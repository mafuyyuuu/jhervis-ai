import React from 'react';
import SkillBar from '../components/SkillBar';
import { useScroll } from '../contexts/ScrollContext';
import './SkillsSection.css';

/* Evidence, not self-assigned percentages. `usedIn` should name projects that
   appear in the Projects section above, so a reader can click through and check
   the claim — that is the whole point of listing it this way. */
const SKILLS_DATA = {
    "Programming Languages": [
        { id: 1, name: "JavaScript", usedIn: ["Project TRACE", "Alumni Employability Tracer", "J.H.E.R.V.I.S."] },
        { id: 2, name: "Python", usedIn: ["J.H.E.R.V.I.S.", "Alumni Employability Tracer", "Project TRACE", "Data Analysis Case Study"] },
        { id: 3, name: "Java", usedIn: ["Library System", "Stranger"] },
        { id: 4, name: "Kotlin", usedIn: ["SafePasig.AI"] },
        { id: 5, name: "C++", usedIn: [] },
    ],
    "Web Development": [
        { id: 6, name: "React", usedIn: ["Payroll & IPCR Module", "J.H.E.R.V.I.S."] },
        { id: 7, name: "Node.js", usedIn: ["Payroll & IPCR Module"] },
        { id: 8, name: "FastAPI", note: "Learning", usedIn: [] },
    ],
    "Tools & Tech": [
        { id: 9, name: "n8n", usedIn: ["Project TRACE"] },
        { id: 10, name: "LiveKit & Google Gemini", usedIn: ["J.H.E.R.V.I.S."] },
        { id: 11, name: "Firebase & Cloud Firestore", usedIn: ["SafePasig.AI"] },
        { id: 12, name: "MySQL", usedIn: ["Library System", "Payroll & IPCR Module"] },
        { id: 13, name: "JavaFX", usedIn: ["Library System"] },
        { id: 14, name: "Git & GitHub", note: "Learning", usedIn: ["Every project here"] },
    ]
};


const SkillsSection = () => {
    const { activeSection } = useScroll();
    const isActive = activeSection === 'skills';
    
    return (
        <section id="skills" className={isActive ? 'section-active' : ''}>
            <div className="skills-section-content">
                <h2 className="section-title">SKILLS</h2>
                {Object.entries(SKILLS_DATA).map(([category, skills], catIndex) => (
                    <div key={category} className="skill-category" style={{ animationDelay: `${catIndex * 0.2}s` }}>
                        <h3 className="subsection-title">{category}</h3>
                        <div className="row">
                            {skills.map((skill, skillIndex) => (
                                <div className="col-md-6" key={skill.id} style={{ animationDelay: `${(catIndex * 0.2) + (skillIndex * 0.1)}s` }}>
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