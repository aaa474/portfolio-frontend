import { Canvas, useLoader } from '@react-three/fiber';
import { Suspense } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { TextureLoader, ClampToEdgeWrapping, LinearFilter, SRGBColorSpace } from 'three';
import DuckGroupManager from './DuckGroupManager';
import { useState } from 'react';

export default function SwimmingDuckCanvas() {
  const waterTexture = useLoader(TextureLoader, '/images (2).jpg');
  const [ducksVisible, setDucksVisible] = useState(true);

  waterTexture.colorSpace = SRGBColorSpace;
  waterTexture.wrapS = ClampToEdgeWrapping;
  waterTexture.wrapT = ClampToEdgeWrapping;
  waterTexture.anisotropy = 16;
  waterTexture.minFilter = LinearFilter;
  waterTexture.magFilter = LinearFilter;

  return (
    <>
      {/* Toggle Button */}
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
          textShadow: '0 0 4px #FFFF00',
        }}
        onClick={() => setDucksVisible((v) => !v)}
      >
        {ducksVisible ? 'Hide Ducks' : 'Show Ducks'}
      </div>

      <Canvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'transparent',
          pointerEvents: 'auto',
        }}
        gl={{ alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <ambientLight intensity={2.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow={false} />

        <mesh position={[0, -2.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 10]} />
          <meshStandardMaterial
            map={waterTexture}
            transparent={true}
            opacity={0.87}
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>

        <Suspense fallback={null}>
          {<DuckGroupManager count={10} visible={ducksVisible} />}
        </Suspense>
      </Canvas>
    </>
  );
}
