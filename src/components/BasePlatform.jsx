import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

export default function BasePlatform() {
  const pulseRef = useRef();
  const ringRef = useRef();

  const sunTexture = useLoader(TextureLoader, '/8k_sun.jpg');

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pulseRef.current) {
      pulseRef.current.material.emissiveIntensity = 0.3 + 0.2 * Math.sin(t * 2);
    }
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.2;
    }
  });

  return (
    <>
      {/* Main glowing base with sun texture */}
      <mesh position={[0, -2, 0]} receiveShadow>
        <cylinderGeometry args={[6.5, 6.5, 0.1, 64]} />
        <meshStandardMaterial
          map={sunTexture}
          emissive="#ffaa33"
          emissiveIntensity={0.4}
          transparent
          opacity={0.35}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* Central glowing pulsing core */}
      <mesh ref={pulseRef} position={[0, -1.95, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          emissive="#ffaa33"
          emissiveIntensity={0.3}
          color="#000"
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Rotating outer glow ring */}
      <mesh ref={ringRef} position={[0, -1.94, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.2, 6.4, 64]} />
        <meshBasicMaterial color="#ffaa33" transparent opacity={0.2} side={2} />
      </mesh>

      {/* Primary bright light source - positioned higher for better coverage */}
      <pointLight
        position={[0, 2, 0]}
        intensity={4}
        distance={150}
        decay={1.5}
        color="#ffaa33"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Additional ambient lighting for overall scene brightness */}
      <ambientLight intensity={0.3} color="#ffffff" />

      {/* Hemisphere light for natural-looking ambient lighting */}
      <hemisphereLight
        skyColor="#ffffff"
        groundColor="#ffaa33"
        intensity={0.5}
      />

      {/* Secondary fill lights positioned around the platform */}
      <pointLight
        position={[8, 1, 8]}
        intensity={1.5}
        distance={50}
        decay={2}
        color="#ffcc66"
      />
      <pointLight
        position={[-8, 1, 8]}
        intensity={1.5}
        distance={50}
        decay={2}
        color="#ffcc66"
      />
      <pointLight
        position={[8, 1, -8]}
        intensity={1.5}
        distance={50}
        decay={2}
        color="#ffcc66"
      />
      <pointLight
        position={[-8, 1, -8]}
        intensity={1.5}
        distance={50}
        decay={2}
        color="#ffcc66"
      />

      {/* Directional light for consistent illumination */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
    </>
  );
}