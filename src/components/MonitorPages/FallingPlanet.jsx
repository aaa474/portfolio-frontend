import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

export default function FallingPlanet({
  textureUrl,
  size = 1,
  speed = 0.5,
  visible = true,
  positionRef
}) {
  const ref = useRef();
  const texture = useLoader(TextureLoader, textureUrl);
  const velocity = useRef(-speed);
  const dragRotation = useRef({ x: 0, y: 0 });
  const spinVelocity = useRef({ x: 0, y: 0 });
  const spawnSide = useRef(Math.random() < 0.5 ? 'left' : 'right');
  const respawnTimer = useRef(Math.random() * 10);

  useFrame((_, delta) => {
    if (!ref.current) return;

    ref.current.position.y += velocity.current * delta;
    respawnTimer.current += delta;

    const shouldRespawn = ref.current.position.y < -12;
    if (shouldRespawn) {
      ref.current.position.y = 10 + Math.random() * 3;

      if (spawnSide.current === 'left') {
        ref.current.position.x = -15 + Math.random() * 8;
      } else {
        ref.current.position.x = 7 + Math.random() * 8;
      }

      if (Math.random() < 0.3) {
        spawnSide.current = spawnSide.current === 'left' ? 'right' : 'left';
      }

      ref.current.rotation.set(0, 0, 0);
      respawnTimer.current = 0;
    }

    if (visible) {
      ref.current.rotation.x += dragRotation.current.x;
      ref.current.rotation.y += dragRotation.current.y;
      dragRotation.current.x *= 0.9;
      dragRotation.current.y *= 0.9;

      ref.current.rotation.x += spinVelocity.current.x;
      ref.current.rotation.y += spinVelocity.current.y;
      spinVelocity.current.x *= 0.95;
      spinVelocity.current.y *= 0.95;
    }

    if (positionRef) {
      positionRef.current = ref.current;
    }
  });

  const handlePointerDown = (e) => {
    if (!visible) return;
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

  const handlePointerMove = (e) => {
    if (!visible || !ref.current) return;
    spinVelocity.current.x += 0.02;
    spinVelocity.current.y += 0.04;
  };

  return (
    <group visible={visible}>
      <mesh
        ref={ref}
        position={positionRef?.current?.position || undefined}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          emissive={'white'}
          emissiveIntensity={0.005}
          toneMapped={false}
        />
        <ambientLight intensity={0.1} />
      </mesh>
    </group>
  );
}
