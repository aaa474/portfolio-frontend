import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

export default function Orion() {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.0002;
    }
  });

  const stars = {
    Meissa:     [0, 24, 0],
    Bellatrix:  [10, 14, 0],
    Betelgeuse: [-10, 14, 0],
    Mintaka:    [8, 5, 0],
    Alnilam:    [0, 3, 0],
    Alnitak:    [-8, 5, 0],
    Rigel:      [12, -10, 0],
    Saiph:      [-12, -10, 0],
  };

  const connections = [
    ['Meissa', 'Betelgeuse'],
    ['Meissa', 'Bellatrix'],
    ['Betelgeuse', 'Alnitak'],
    ['Bellatrix', 'Mintaka'],
    ['Alnitak', 'Alnilam'],
    ['Alnilam', 'Mintaka'],
    ['Alnitak', 'Saiph'],
    ['Mintaka', 'Rigel'],
    ['Rigel', 'Saiph'],
    ['Bellatrix', 'Alnitak'],
    ['Betelgeuse', 'Mintaka']
  ];

  const starPositions = Object.values(stars);

  return (
    <group ref={groupRef} position={[200, 80, -300]}>
      {/* Stars */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(starPositions.flat())}
            count={starPositions.length}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="white"
          size={4.5}
          sizeAttenuation
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Connecting Lines */}
      {connections.map(([a, b], i) => {
        const start = new THREE.Vector3(...stars[a]);
        const end = new THREE.Vector3(...stars[b]);
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial
              color="white"
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </line>
        );
      })}

      {/* Star Labels */}
      {Object.entries(stars).map(([name, [x, y, z]]) => (
        <Text
          key={name}
          position={[x + 2.5, y + 3, z]}
          fontSize={2.2}
          color="white"
          anchorX="left"
          anchorY="middle"
          outlineColor="black"
          outlineWidth={0.35}
        >
          {name}
        </Text>
      ))}
    </group>
  );
}
