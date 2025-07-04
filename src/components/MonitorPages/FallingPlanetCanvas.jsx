import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useMemo, useRef } from 'react';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import FallingPlanet from './FallingPlanet';

export default function FallingPlanetCanvas() {
  const [planetsVisible, setPlanetsVisible] = useState(true);
  const planetCount = 35;

  const planetData = useMemo(() => {
    return [...Array(planetCount)].map((_, i) => ({
      id: i,
      textureUrl: [
        '/8k_earth_daymap.jpg',
        '/8k_mars.jpg',
        '/8k_jupiter.jpg',
        '/8k_saturn.jpg',
        '/2k_neptune.jpg',
        '/2k_uranus.jpg',
        '/8k_mercury.jpg',
        '/8k_moon.jpg',
        '/4k_venus_atmosphere.jpg',
      ][i % 9],
      size: 0.3 + Math.random() * 0.2,
      speed: 0.6 + Math.random() * 0.6,
      positionRef: { current: { position: [
        Math.random() < 0.5 ? -15 + Math.random() * 8 : 7 + Math.random() * 8,
        10 + Math.random() * 30,
        -2 + Math.random() * 2,
      ] } }
    }));
  }, []);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: '4.5rem',
          left: '1rem',
          zIndex: 100,
          backgroundColor: '#00000099',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          cursor: 'pointer',
          color: 'white',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          textShadow: '0 0 4px #ff0000',
        }}
        onClick={() => setPlanetsVisible((v) => !v)}
      >
        {planetsVisible ? 'Hide Planets' : 'Show Planets'}
      </div>

      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={75} near={0.1} far={100} />
        <ambientLight intensity={0.4} />

        <Suspense fallback={null}>
          <Stars radius={50} depth={20} count={3000} fade />
          {planetData.map((planet) => (
            <FallingPlanet
              key={planet.id}
              textureUrl={planet.textureUrl}
              size={planet.size}
              speed={planet.speed}
              visible={planetsVisible}
              positionRef={planet.positionRef}
            />
          ))}
        </Suspense>
      </Canvas>
    </>
  );
}
