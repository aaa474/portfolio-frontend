import { useGLTF, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export default function AsteroidField({ count = 80 }) {
  const { scene } = useGLTF('/Asteroids.glb');
  const { camera } = useThree();
  const group = useRef();
  const baseRadius = 6;


  const spacingByIndex = [4, 11, 19, 26, 39, 54, 70, 88, 109]; // Mercury to Neptune
  const marsRadius = baseRadius + spacingByIndex[3];  
  const jupiterRadius = baseRadius + spacingByIndex[4]; 
  
  
  const midPoint = (marsRadius + jupiterRadius) / 2; 
  const beltWidth = 4; 
  const minBelt = midPoint - beltWidth / 2; 
  const maxBelt = midPoint + beltWidth / 2; 
  const [colorMap, bumpMap] = useTexture([
    '/360_F_50642395_EzECINojo0khiXKgl33LOnoNwNBIhSNm.jpg',
    '/360_F_50642395_EzECINojo0khiXKgl33LOnoNwNBIhSNm.jpg'
  ]);

  const asteroids = useMemo(() => {
    const meshes = [];
    scene.traverse((obj) => {
      if (obj.isMesh) {
        const cloned = obj.clone();
        cloned.material = obj.material.clone();
        cloned.material.map = colorMap;
        cloned.material.bumpMap = bumpMap;
        cloned.material.bumpScale = 0.15;
        cloned.material.color = new THREE.Color('#ffffff');
        cloned.material.roughness = 0.9;
        cloned.material.metalness = 0.05;
        cloned.material.emissive = new THREE.Color('#222222');
        cloned.material.emissiveIntensity = 0.3;
        cloned.material.needsUpdate = true;
        meshes.push(cloned);
      }
    });

    return new Array(count).fill().map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const orbitRadius = minBelt + Math.random() * (maxBelt - minBelt);
      const verticalOffset = (Math.random() - 0.5) * 1.5;

      const position = new THREE.Vector3(
        Math.cos(angle) * orbitRadius,
        verticalOffset,
        Math.sin(angle) * orbitRadius
      );

      const scale = 0.2 + Math.random() * 0.4;
      const speed = -(0.001 + Math.random() * 0.002); 
      const mesh = meshes[Math.floor(Math.random() * meshes.length)].clone();

      return {
        mesh,
        orbitRadius,
        orbitSpeed: speed,
        orbitAngle: angle,
        orbitY: verticalOffset,
        position,
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        scale
      };
    });
  }, [scene, count, colorMap, bumpMap, minBelt, maxBelt]);

  useFrame(() => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const data = asteroids[i];
      data.orbitAngle += data.orbitSpeed;
      child.position.set(
        Math.cos(data.orbitAngle) * data.orbitRadius,
        data.orbitY,
        Math.sin(data.orbitAngle) * data.orbitRadius
      );
      child.rotation.x += 0.001;
      child.rotation.y += 0.001;
    });
  });

  return (
    <group ref={group}>
      {asteroids.map((data, i) => (
        <primitive
          key={i}
          object={data.mesh}
          position={data.position}
          rotation={data.rotation}
          scale={data.scale}
        />
      ))}
    </group>
  );
}