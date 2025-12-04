import { useState, useEffect, useRef } from 'react';

export const useScrollSpy = (sectionIds, options) => {
    const [activeSection, setActiveSection] = useState(null);
    const observer = useRef(null);

    useEffect(() => {
        if (observer.current) {
            observer.current.disconnect();
        }

        observer.current = new IntersectionObserver((entries) => {
            let maxRatio = 0;
            let intersectingSection = null;

            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                    maxRatio = entry.intersectionRatio;
                    intersectingSection = entry.target;
                }
            });

            if (intersectingSection) {
                setActiveSection(intersectingSection.id);
            }
        }, options);

        const elements = sectionIds.map(id => document.getElementById(id));
        elements.forEach(element => {
            if (element) {
                observer.current.observe(element);
            }
        });

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [sectionIds, options]);

    return activeSection;
};