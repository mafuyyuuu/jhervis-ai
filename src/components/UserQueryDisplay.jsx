import React, { useState, useEffect } from 'react';
import './UserQueryDisplay.css';

const UserQueryDisplay = ({ query }) => {
    const [animatedQuery, setAnimatedQuery] = useState('');

    useEffect(() => {
        let currentIndex = 0;
        setAnimatedQuery(''); // Reset on new query

        if (query) {
            const interval = setInterval(() => {
                if (currentIndex < query.length) {
                    setAnimatedQuery(prev => prev + query[currentIndex]);
                    currentIndex++;
                } else {
                    clearInterval(interval);
                }
            }, 50); // Adjust typing speed here

            return () => clearInterval(interval);
        }
    }, [query]);

    if (!query) return null;

    return (
        <div className="user-query-display">
            <span className="query-label">USER QUERY:</span>
            <span className="query-text">{animatedQuery}</span>
        </div>
    );
};

export default UserQueryDisplay;
