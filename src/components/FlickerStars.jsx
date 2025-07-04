import { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export default function FlickerStars({ count = 250, radius = 100 }) {
  const texture = useLoader(THREE.TextureLoader, '/pngimg.com - star_PNG41515.png');

  const { pos, baseColors } = useMemo(() => {
    const pos = [];
    const baseColors = [];

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = 12 + (radius - 12) * Math.random();

      pos.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );

      const type = Math.random();
      let h = 0, s = 1, l = 0.8;

      if (type < 0.25) h = 0.6 + Math.random() * 0.1;
      else if (type < 0.5) h = 0.5 + Math.random() * 0.1;
      else if (type < 0.75) h = 0.12 + Math.random() * 0.05;
      else h = 0.02 + Math.random() * 0.03;

      const color = new THREE.Color();
      color.setHSL(h, s, l);
      baseColors.push(color.r, color.g, color.b);
    }

    return {
      pos: new Float32Array(pos),
      baseColors: new Float32Array(baseColors)
    };
  }, [count, radius]);

  const ref = useRef();
  const starVelocities = useRef(Array(count).fill(null).map(() => new THREE.Vector3()));

  const dynamicColors = useRef(new Float32Array(baseColors));

  useFrame(() => {
    if (ref.current) {
      const time = Date.now() * 0.002;
      const positions = ref.current.geometry.attributes.position.array;
      const colorsArray = dynamicColors.current;

      for (let i = 0; i < count; i++) {
        const flicker = 0.3 + 0.4 * Math.abs(Math.sin(time + i));
        const ci = i * 3;

        colorsArray[ci] = baseColors[ci] * flicker;
        colorsArray[ci + 1] = baseColors[ci + 1] * flicker;
        colorsArray[ci + 2] = baseColors[ci + 2] * flicker;

        if (Math.random() < 0.0005) {
          const vx = (Math.random() - 0.5) * 0.2;
          const vy = (Math.random() - 0.5) * 0.2;
          const vz = (Math.random() - 0.5) * 0.2;
          starVelocities.current[i].set(vx, vy, vz);
        }

        const baseIndex = i * 3;
        positions[baseIndex] += starVelocities.current[i].x;
        positions[baseIndex + 1] += starVelocities.current[i].y;
        positions[baseIndex + 2] += starVelocities.current[i].z;

        starVelocities.current[i].multiplyScalar(0.95);
      }

      ref.current.geometry.attributes.position.needsUpdate = true;
      ref.current.geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(dynamicColors.current, 3)
      );
      ref.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={pos}
          count={pos.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={dynamicColors.current}
          count={dynamicColors.current.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={0.35}
        sizeAttenuation
        transparent
        vertexColors
        alphaTest={0.3}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
