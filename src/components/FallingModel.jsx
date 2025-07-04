import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function FallingModel({ model, position, speed }) {
  const ref = useRef();
  const velocity = useRef(new THREE.Vector3(0, -speed, 0));
  const dragRotation = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.y += velocity.current.y * delta;

   
      if (ref.current.position.y < -10) {
        ref.current.position.y = 10 + Math.random() * 5;
        ref.current.position.x = (Math.random() - 0.5) * 4;
        ref.current.rotation.set(0, 0, 0);
      }

   
      ref.current.rotation.x += dragRotation.current.x;
      ref.current.rotation.y += dragRotation.current.y;
      dragRotation.current.x *= 0.9;
      dragRotation.current.y *= 0.9;
    }
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    const last = { x: e.clientX, y: e.clientY };
    const move = (moveEvt) => {
      dragRotation.current.y = (moveEvt.clientX - last.x) * 0.005;
      dragRotation.current.x = (moveEvt.clientY - last.y) * 0.005;
      last.x = moveEvt.clientX;
      last.y = moveEvt.clientY;
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <mesh ref={ref} position={position} onPointerDown={handlePointerDown}>
      <primitive object={model.clone()} />
    </mesh>
  );
}
