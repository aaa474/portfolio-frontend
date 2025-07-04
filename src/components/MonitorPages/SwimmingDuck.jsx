import { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useSound } from 'use-sound';

const SwimmingDuck = forwardRef(function SwimmingDuck({ speed = 0.5, delay = 0, zStart = -3, visible = true }, ref) {
  const localRef = useRef();
  const startTime = useRef(null);
  const gltf = useLoader(GLTFLoader, '/Ducks.glb');

  const duck = useMemo(() => {
    const clone = gltf.scene.clone(true);
    const children = clone.children.filter(c => c.type === 'Mesh' || c.type === 'Group');
    const index = Math.floor(Math.random() * children.length);
    const chosen = children[index].clone();
    chosen.rotation.set(0, Math.PI / 2, 0);

    if (chosen.material) {
      chosen.material.needsUpdate = true;
      chosen.material.toneMapped = true;
      chosen.material.roughness = 0.3;
      chosen.material.metalness = 0.2;
    }

    return chosen;
  }, [gltf]);

  const [playQuack] = useSound('/Duck Quack - Sound Effect (HD).mp3', { volume: 0.4 });
  const velocity = useRef(speed * 1.5);

  const initialPosition = useMemo(() => {
    const x = -15 - Math.random() * 5;
    const z = zStart;
    const y = -2.3 + Math.sin(z * 2) * 0.05;
    return [x, y, z];
  }, [zStart]);

  const scale = useMemo(() => {
    const z = initialPosition[2];
    return Math.max(0.2, 0.6 - Math.abs(z) * 0.08);
  }, [initialPosition]);

  useImperativeHandle(ref, () => localRef.current);

  useFrame(() => {
    if (!localRef.current) return;
    const now = performance.now() / 1000;

    if (startTime.current === null) {
      startTime.current = now;
    }
    if (now - startTime.current < delay) return;

    const pos = localRef.current.position;
    pos.x += velocity.current * 1 / 60;
    pos.y = -2.2 + Math.sin(pos.x + now * 1.5 + pos.z) * 0.05;

    if (pos.x > 15) {
      const newZ = -1 - Math.random() * 4;
      const newX = -15 - Math.random() * 5;
      const newY = -2.2 + Math.sin(newZ * 2) * 0.05;
      localRef.current.position.set(newX, newY, newZ);
      startTime.current = now;
    }
  });

  return (
    <group visible={visible}>
      <primitive
        ref={localRef}
        object={duck}
        scale={scale}
        position={initialPosition}
        cursor="pointer"
        onClick={(e) => {
          e.stopPropagation();
          playQuack();
        }}
      />
    </group>
  );
});

export default SwimmingDuck;
