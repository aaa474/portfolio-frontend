import { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';
import * as THREE from 'three';

const allBalls = [];

export const clearAllBalls = () => {
  allBalls.length = 0;
};

export default function FallingPoolBalls({
  size = 1,
  cueBall = false,
  index = 0,
  position = null,
  fixed = false,
  visible = true
}) {
  const wrapperRef = useRef();
  const gltf = useLoader(GLTFLoader, '/PoolBalls2.glb');
  const [currentBall, setCurrentBall] = useState(null);
  const velocity = useRef(new THREE.Vector3());
  const angularVelocity = useRef(new THREE.Vector3(0, 0, 2));
  const { camera } = useThree();

  const finalPosition = position || (cueBall ? [0, -3, 0] : [0, -5, 0]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    allBalls.push(wrapperRef.current);
    return () => {
      const idx = allBalls.indexOf(wrapperRef.current);
      if (idx > -1) allBalls.splice(idx, 1);
    };
  }, []);

  useEffect(() => {
    velocity.current.set(0, 0, 0);
  }, []);

  useEffect(() => {
    if (!gltf?.scene || !wrapperRef.current || currentBall) return;

    const name = cueBall ? 'CueBall' : `Ball${(index % 15) + 1}`;
    const target = gltf.scene.getObjectByName(name);

    let mesh;
    if (!target) {
      mesh = new THREE.Mesh(
        new THREE.SphereGeometry(size, 32, 32),
        new THREE.MeshStandardMaterial({ color: cueBall ? 'white' : 'red' })
      );
    } else {
      mesh = clone(target);
      mesh.scale.set(size, size, size);
      mesh.position.set(0, 0, 0);
    }

    while (wrapperRef.current.children.length) {
      wrapperRef.current.remove(wrapperRef.current.children[0]);
    }
    wrapperRef.current.add(mesh);
    setCurrentBall(mesh);

    if (cueBall) {
      const glow = new THREE.PointLight('white', 2, 2.5);
      glow.position.set(0, 0, 0);
      wrapperRef.current.add(glow);
    }

    wrapperRef.current.position.set(...finalPosition);
    wrapperRef.current.userData.velocity = velocity.current;
    wrapperRef.current.userData.isFixed = fixed;
  }, [gltf, cueBall, index, size, fixed, finalPosition, currentBall]);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.traverse(obj => {
        if (obj instanceof THREE.Object3D) {
          obj.visible = visible;
        }
      });
    }
  }, [visible]);

  const handlePointerDown = () => {
    if (!cueBall || !wrapperRef.current) return;

    const cuePos = wrapperRef.current.position.clone();
    let nearestBall = null;
    let minDist = Infinity;

    for (const ball of allBalls) {
      if (ball === wrapperRef.current || !ball.visible) continue;
      const dist = cuePos.distanceTo(ball.position);
      if (dist < minDist) {
        minDist = dist;
        nearestBall = ball;
      }
    }

    if (nearestBall) {
      const direction = new THREE.Vector3().subVectors(nearestBall.position, cuePos).normalize();
      velocity.current.copy(direction.multiplyScalar(20));
      angularVelocity.current.set(0, 0, 10);

      if (cueBall && currentBall?.material) {
        currentBall.material.emissive = new THREE.Color('yellow');
        setTimeout(() => {
          currentBall.material.emissive = new THREE.Color('black');
        }, 200);
      }
    }
  };

  useFrame((_, delta) => {
    const obj = wrapperRef.current;
    if (!obj || obj.userData.isFixed) return;

    obj.position.addScaledVector(velocity.current, delta);
    velocity.current.multiplyScalar(0.995);
    velocity.current.clampLength(0, 30);
    if (velocity.current.length() < 0.01) {
      velocity.current.set(0, 0, 0);
    }

    if (currentBall && velocity.current.length() > 0.01) {
      const spinAxis = new THREE.Vector3().crossVectors(velocity.current, new THREE.Vector3(0, 0, 1)).normalize();
      const spinAmount = velocity.current.length() * delta * 2;
      currentBall.rotateOnAxis(spinAxis, spinAmount);
    }

    const halfSize = size / 2;
    const bounceFactor = -0.8;

    if (obj.position.x + halfSize > 7.3 || obj.position.x - halfSize < -7.3) {
      velocity.current.x *= bounceFactor;
      obj.position.x = THREE.MathUtils.clamp(obj.position.x, -7.3 + halfSize, 7.3 - halfSize);
    }
    if (obj.position.y + halfSize > 4.5 || obj.position.y - halfSize < -4.7) {
      velocity.current.y *= bounceFactor;
      obj.position.y = THREE.MathUtils.clamp(obj.position.y, -4.7 + halfSize, 4.5 - halfSize);
    }

    const collisionBoost = 1.2;

    allBalls.forEach(otherBall => {
      if (otherBall === obj || !otherBall.visible) return;

      const distance = obj.position.distanceTo(otherBall.position);
      const effectiveMinDistance =
        (!obj.userData.isFixed && !otherBall.userData.isFixed)
          ? size * collisionBoost
          : size;

      if (distance < effectiveMinDistance) {
        const normal = new THREE.Vector3().subVectors(obj.position, otherBall.position).normalize();
        const overlap = effectiveMinDistance - distance;
        obj.position.addScaledVector(normal, overlap / 2);
        otherBall.position.addScaledVector(normal, -overlap / 2);

        const relativeVelocity = new THREE.Vector3().subVectors(velocity.current, otherBall.userData.velocity);
        const dotProduct = relativeVelocity.dot(normal);

        if (dotProduct < 0) {
          const v1 = velocity.current.clone();
          const v2 = otherBall.userData.velocity.clone();

          const tangent = new THREE.Vector3(-normal.y, normal.x, 0);

          const v1n = normal.clone().multiplyScalar(v1.dot(normal));
          const v1t = tangent.clone().multiplyScalar(v1.dot(tangent));
          const v2n = normal.clone().multiplyScalar(v2.dot(normal));
          const v2t = tangent.clone().multiplyScalar(v2.dot(tangent));

          const newV1 = v2n.add(v1t);
          const newV2 = v1n.add(v2t);

          velocity.current.copy(newV1);
          otherBall.userData.velocity.copy(newV2);
          otherBall.userData.isFixed = false;
        }
      }
    });
  });

  return (
    <group
      ref={wrapperRef}
      onPointerDown={handlePointerDown}
      castShadow
      receiveShadow
    />
  );
}
