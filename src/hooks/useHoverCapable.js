import { useEffect, useState } from 'react';

// True on devices that support a real hover state (mouse/trackpad), false on
// touch-only devices. Used to pick hover-to-play vs tap-to-open-modal for
// project preview videos.
export const useHoverCapable = () => {
    const [hoverCapable, setHoverCapable] = useState(
        () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches
    );

    useEffect(() => {
        const mql = window.matchMedia('(hover: hover)');
        const handleChange = (e) => setHoverCapable(e.matches);

        mql.addEventListener('change', handleChange);
        return () => mql.removeEventListener('change', handleChange);
    }, []);

    return hoverCapable;
};
