import React from 'react';
import './SkillBar.css';

/* Was a percentage bar ("JavaScript 90%"). A self-assigned number is the most
   recognisable student-portfolio pattern there is: nobody can verify it, the
   scale means nothing across skills, and claiming 90% invites a reader to test
   it. This states where the skill was actually used instead — the same
   information a reviewer was trying to infer from the number, only checkable.
   The component keeps its name so nothing else has to move. */
const SkillBar = ({ skill }) => {
    const hasEvidence = skill.usedIn && skill.usedIn.length > 0;

    return (
        <div className="skill-entry">
            <div className="skill-header">
                <span className="skill-name">{skill.name}</span>
                {skill.note && <span className="skill-note">{skill.note}</span>}
            </div>
            {hasEvidence ? (
                <p className="skill-evidence">
                    <span className="skill-evidence-label">Used in</span>
                    {skill.usedIn.join(' · ')}
                </p>
            ) : (
                <p className="skill-evidence skill-evidence-empty">
                    <span className="skill-evidence-label">Coursework</span>
                    no shipped project yet
                </p>
            )}
        </div>
    );
};

export default SkillBar;
