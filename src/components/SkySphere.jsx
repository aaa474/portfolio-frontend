import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export default function SkySphere() {
  const texture = useLoader(THREE.TextureLoader, '/8k_stars_milky_way.jpg');

  return (
    <mesh>
      <sphereGeometry args={[300, 64, 64]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
      />
    </mesh>
  );
}
