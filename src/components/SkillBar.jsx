import React, { useEffect, useState } from 'react';
import './SkillBar.css';

const SkillBar = ({ skill }) => {
    const [width, setWidth] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setWidth(skill.level);
        }, 200);
        return () => clearTimeout(timer);
    }, [skill.level]);

    return (
        <div 
            className="skill-bar-wrapper"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="skill-header">
                <span className="skill-name">
                    {skill.name}
                    {skill.note && <span className="skill-note"> ({skill.note})</span>}
                </span>
                <span className="skill-percent">{skill.level}%</span>
            </div>
            <div className="skill-bar-bg">
                <div 
                    className="skill-bar-fill" 
                    style={{ width: `${width}%` }}
                ></div>
            </div>
            {isHovered && skill.relatedProjects && skill.relatedProjects.length > 0 && (
                <div className="related-projects-tooltip">
                    <strong>Used in:</strong> {skill.relatedProjects.join(', ')}
                </div>
            )}
        </div>
    );
};

export default SkillBar;