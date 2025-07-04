import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export default function GalaxyArm() {
  const texture = useLoader(THREE.TextureLoader, '/Andromeda_Galaxy_(transparent_background).png');
  const ref = useRef();

  return (
    <mesh ref={ref} position={[0, 10, 300]} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[100, 60]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.25}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
