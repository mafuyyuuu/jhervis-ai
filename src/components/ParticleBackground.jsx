import React, { useState, useEffect, useMemo } from 'react';
import { useVoiceAssistant } from '@livekit/components-react';
import './ParticleBackground.css';

const ParticleBackground = () => {
    const { audioLevel } = useVoiceAssistant();
    const particles = useMemo(() => Array.from({ length: 50 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 5 + Math.random() * 10,
        delay: Math.random() * 5,
        size: 1 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.2,
    })), []);
    
    const [particleStyles, setParticleStyles] = useState([]);

    useEffect(() => {
        const scale = 1 + audioLevel * 5;
        const duration = 5 - audioLevel * 4;

        setParticleStyles(particles.map(p => ({
            ...p,
            scale,
            duration
        })));
        
    }, [audioLevel, particles]);

    return (
        <div className="particle-background">
            {particleStyles.map((particle, index) => (
                <div
                    key={index}
                    className="particle"
                    style={{
                        '--x': `${particle.x}vw`,
                        '--y': `${particle.y}vh`,
                        '--duration': `${particle.duration}s`,
                        '--delay': `${particle.delay}s`,
                        '--size': `${particle.size}px`,
                        '--opacity': `${particle.opacity}`,
                        '--scale': particle.scale,
                    }}
                />
            ))}
        </div>
    );
};

export default ParticleBackground;
