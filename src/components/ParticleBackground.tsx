'use client';

import React, { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';

interface ParticleBackgroundProps {
  intensity?: 'light' | 'medium' | 'heavy';
  color?: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ 
  intensity = 'light', 
  color = '#42a5f5' 
}) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const getParticleCount = () => {
    switch (intensity) {
      case 'heavy': return 120;
      case 'medium': return 80;
      case 'light': 
      default: return 50;
    }
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fpsLimit: 120,
        particles: {
          color: {
            value: color,
          },
          links: {
            color: color,
            distance: 150,
            enable: true,
            opacity: 0.15,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1,
          },
          number: {
            value: getParticleCount(),
          },
          opacity: {
            value: 0.3,
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      }}
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '-1',
        pointerEvents: 'none',
      }}
    />
  );
};
export default ParticleBackground;