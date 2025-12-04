import React from 'react';
import './QuickActions.css';

const QuickActions = ({ section, onAsk }) => {
    const getActionsForSection = () => {
        switch(section) {
            case 'about':
                return [
                    { label: "Tell me more", query: "Tell me more about JHERVIN's background and journey" },
                    { label: "Achievements", query: "What are JHERVIN's achievements?" },
                ];
            case 'projects':
                return [
                    { label: "Favorite project", query: "What is JHERVIN's favorite project and why?" },
                    { label: "Tech stack", query: "What technologies does JHERVIN use most?" },
                ];
            case 'skills':
                return [
                    { label: "Strongest skill", query: "What is JHERVIN's strongest skill?" },
                    { label: "Currently learning", query: "What is JHERVIN currently learning?" },
                ];
            case 'contact':
                return [
                    { label: "Work together", query: "How can I work with JHERVIN?" },
                    { label: "Availability", query: "Is JHERVIN available for freelance work?" },
                ];
            default:
                return [];
        }
    };

    const actions = getActionsForSection();
    
    if (actions.length === 0) return null;

    return (
        <div className="quick-actions">
            <span className="quick-actions-label">Quick questions:</span>
            <div className="quick-actions-buttons">
                {actions.map((action, index) => (
                    <button 
                        key={index}
                        className="quick-action-btn"
                        onClick={() => onAsk(action.query)}
                    >
                        {action.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
