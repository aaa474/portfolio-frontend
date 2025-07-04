import { useFrame } from '@react-three/fiber';
import SwimmingDuck from './SwimmingDuck';
import { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';

export default function DuckGroupManager({ count = 10, visible = true }) {
  const ducksRef = useRef([]);
  const duckParams = useMemo(() => (
    Array.from({ length: count }).map((_, i) => ({
      speed: 0.9 + Math.random() * 0.3,
      delay: i * 1.5,
      z: -1 - Math.random() * 4,
    }))
  ), [count]);

  useFrame(() => {
    for (let i = 0; i < ducksRef.current.length; i++) {
      const a = ducksRef.current[i];
      if (!a) continue;
      for (let j = i + 1; j < ducksRef.current.length; j++) {
        const b = ducksRef.current[j];
        if (!b) continue;

        const dx = a.position.x - b.position.x;
        const dz = a.position.z - b.position.z;
        const distSq = dx * dx + dz * dz;

        if (distSq < 1) {
          const dist = Math.sqrt(distSq);
          const overlap = 1 - dist;
          const nx = dx / dist;
          const nz = dz / dist;
          a.position.x += nx * overlap * 0.01;
          b.position.x -= nx * overlap * 0.01;
          a.position.z += nz * overlap * 0.01;
          b.position.z -= nz * overlap * 0.01;
        }
      }
    }
  });

  return (
    <>
      {duckParams.map((props, i) => (
        <SwimmingDuck
          key={i}
          speed={props.speed}
          delay={props.delay}
          zStart={props.z}
          visible={visible}
          ref={(el) => (ducksRef.current[i] = el)}
        />
      ))}
    </>
  );
}
