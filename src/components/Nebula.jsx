import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export default function Nebula() {
  const texture = useLoader(THREE.TextureLoader, '/hubble_nebula_ngc_2818.png'); 
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.z += 0.0003;
    }
  });

  return (
    <mesh ref={ref} position={[0, 1.3, -110]}>
      <planeGeometry args={[50, 30]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.15}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
