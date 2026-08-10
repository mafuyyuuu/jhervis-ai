import React, { createContext, useContext } from 'react';

const ScrollContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useScroll = () => {
    return useContext(ScrollContext);
};

/* `hoveredProjectId` used to live here too, but its only reader was the arc
   reactor's "gaze" effect — the orb speeding up when you hovered a project
   card. With the reactor gone it was write-only state, so it went with it. */
export const ScrollProvider = ({ children, value }) => {
    return (
        <ScrollContext.Provider value={value}>
            {children}
        </ScrollContext.Provider>
    );
};
