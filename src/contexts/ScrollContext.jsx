import React, { createContext, useContext, useState } from 'react';

const ScrollContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useScroll = () => {
    return useContext(ScrollContext);
};

export const ScrollProvider = ({ children, value }) => {
    const [hoveredProjectId, setHoveredProjectId] = useState(null);
    
    const providerValue = {
        ...value,
        hoveredProjectId,
        setHoveredProjectId,
    };

    return (
        <ScrollContext.Provider value={providerValue}>
            {children}
        </ScrollContext.Provider>
    );
};
