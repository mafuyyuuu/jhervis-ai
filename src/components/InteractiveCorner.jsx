import React from 'react';
import './InteractiveCorner.css';
import ChatInput from "./ChatInput";
import UserQueryDisplay from "./UserQueryDisplay";

const InteractiveCorner = ({ onQuerySubmit, children }) => {
    const [lastUserQuery, setLastUserQuery] = React.useState(null);
    
    const handleQuerySubmit = (query) => {
        setLastUserQuery(query);
        if (onQuerySubmit) {
            onQuerySubmit(query);
        }
        setTimeout(() => {
            setLastUserQuery(null);
        }, 4000);
    }
    
    return (
        <div className="interactive-corner">
            <UserQueryDisplay query={lastUserQuery} />
            <ChatInput onQuerySubmit={handleQuerySubmit} />
            {children}
        </div>
    );
};

export default InteractiveCorner;
