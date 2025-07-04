import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

export default function Planet({
  name,
  textureUrl,
  ringUrl = null,
  radius = 5,
  size = 1,
  speed = 0.01,
  tilt = 0.4,
  spinDir = 1,
  index = 0,
}) {
  const mesh = useRef();
  const orbitRef = useRef();
  const moonOrbitRef = useRef();
  const moonMeshRef = useRef();

  const texture = useLoader(TextureLoader, textureUrl);
  const ringTexture = ringUrl ? useLoader(TextureLoader, ringUrl) : null;
  const moonTexture = name === 'Earth' ? useLoader(TextureLoader, '/8k_moon.jpg') : null;

  const spacingByIndex = [7, 11, 19, 26, 39, 48, 56, 64, 72];
  const adjustedRadius = radius + spacingByIndex[index];
  const rotationMultiplier = 5;

  const moonDistance = 2;
  const moonSize = 0.27;
  const moonSpeed = 0.03;

  useFrame(() => {
    if (orbitRef.current) orbitRef.current.rotation.y += speed;
    if (mesh.current) mesh.current.rotation.y += 0.002 * spinDir * rotationMultiplier;

   
    if (moonOrbitRef.current) moonOrbitRef.current.rotation.y += speed;
  
    if (moonMeshRef.current && moonOrbitRef.current) {
      moonMeshRef.current.lookAt(moonOrbitRef.current.parent.position);
    }
  });

  return (
    <group ref={orbitRef}>
      {/* Orbital Path Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[adjustedRadius - 0.02, adjustedRadius + 0.02, 64]} />
        <meshBasicMaterial color="gray" side={THREE.DoubleSide} transparent opacity={0.3} />
      </mesh>

      {/* Planet */}
      <mesh ref={mesh} position={[adjustedRadius, 0, 0]} rotation={[tilt, 0, 0]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Planet Ring (e.g. Saturn) */}
      {ringTexture && name === 'Saturn' && (
        <mesh
          position={[adjustedRadius, 0, 0]}
          rotation={[2, 0, 0]} 
        >
          <ringGeometry args={[size * 1.2, size * 2.5, 128]} />
          <meshBasicMaterial
            map={ringTexture}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
            depthWrite={false}
          />
        </mesh>
      )}


      {/* Moon for Earth */}
      {name === 'Earth' && moonTexture && (
        <group ref={moonOrbitRef} position={[adjustedRadius, 0, 0]}>
          {/* Moon orbital ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[moonDistance - 0.05, moonDistance + 0.05, 64]} />
            <meshBasicMaterial color="gray" transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>
          <mesh
            ref={moonMeshRef}
            position={[moonDistance, 0, 0]}
            castShadow
            receiveShadow
          >
            <sphereGeometry args={[moonSize, 32, 32]} />
            <meshStandardMaterial map={moonTexture} />
          </mesh>
        </group>
      )}
    </group>
  );
}
