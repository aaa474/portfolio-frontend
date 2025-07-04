import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CameraController({ index = 0, expanded = false, isZooming = false, onZoomComplete, topDownLevel = 0, onCameraStateChange, shouldZoomOut = false, onZoomOutComplete}) {
  const { camera } = useThree();
  const currentAngleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const seatedY = 1.3;
  const center = new THREE.Vector3(0, seatedY, 0);
  const monitorRadius = 4;
  const animationStateRef = useRef('normal');
  const prevStateRef = useRef(animationStateRef.current);
  const zoomStartTimeRef = useRef(0);
  const zoomDuration = 800;
  const zoomedCameraPosRef = useRef(null);
  const lastZoomIndexRef = useRef(index);
  const topDownStartRef = useRef(null);
  const topDownFromRef = useRef(null);
  const topDownToRef = useRef(null);
  const isInitializedRef = useRef(false);
  const prevTopDownLevelRef = useRef(topDownLevel);
  const rotationSpeedRef = useRef(0.08);

  const topDownConfig = [
    null,
    { distance: 45, height: 15 },
    { distance: 95, height: 35 },
  ];

  if (!isInitializedRef.current && camera) {
    const initialAngle = (index / 5) * Math.PI * 2;
    camera.position.copy(center);
    const initialMonitorPos = new THREE.Vector3(
      monitorRadius * Math.cos(initialAngle),
      seatedY,
      monitorRadius * Math.sin(initialAngle)
    );
    camera.lookAt(initialMonitorPos);

    currentAngleRef.current = initialAngle;
    targetAngleRef.current = initialAngle;
    isInitializedRef.current = true;
    prevTopDownLevelRef.current = topDownLevel;
  }

  useEffect(() => {
    if (shouldZoomOut && animationStateRef.current === 'zoomed' && topDownLevel === 0) {
      console.log('Explicit zoom-out requested');
      animationStateRef.current = 'zoomingOut';
      zoomStartTimeRef.current = Date.now();
    }
  }, [shouldZoomOut, topDownLevel]);

  useEffect(() => {
    const newTargetAngle = (index / 5) * Math.PI * 2;
    const currentAngle = currentAngleRef.current;
    let diff = newTargetAngle - currentAngle;
    
   
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    
    targetAngleRef.current = currentAngle + diff;

   
    const angleDiff = Math.abs(diff);
    if (angleDiff > Math.PI / 2) {
      rotationSpeedRef.current = 0.12;
    } else if (angleDiff > Math.PI / 4) {
      rotationSpeedRef.current = 0.10; 
    } else {
      rotationSpeedRef.current = 0.08; 
    }

    if (animationStateRef.current === 'normal' && zoomedCameraPosRef.current) {
      zoomedCameraPosRef.current = null;
    }
  }, [index]);

  useEffect(() => {
    if (topDownLevel > 0) return;

    if (isZooming && animationStateRef.current === 'normal') {
      animationStateRef.current = 'zoomingIn';
      zoomStartTimeRef.current = Date.now();
    } else if (!isZooming && expanded === false && animationStateRef.current === 'zoomed' && !shouldZoomOut) {
      animationStateRef.current = 'zoomingOut';
      zoomStartTimeRef.current = Date.now();
    }
  }, [isZooming, expanded, topDownLevel, shouldZoomOut]);

  useEffect(() => {
    if (!isInitializedRef.current) return;
    const now = Date.now();
    if (prevTopDownLevelRef.current === topDownLevel) return;
    if (!camera || camera.position.length() === 0) {
      prevTopDownLevelRef.current = topDownLevel;
      return;
    }

    topDownStartRef.current = Date.now();
    topDownFromRef.current = camera.position.clone();

    if (topDownLevel > 0) {
      const { distance, height } = topDownConfig[topDownLevel];
      const angle = (index / 5) * Math.PI * 2 + Math.PI;
      const x = distance * Math.cos(angle);
      const z = distance * Math.sin(angle);
      const y = height;
      topDownToRef.current = new THREE.Vector3(x, y, z);
    } else {
      topDownToRef.current = center.clone();
    }

    prevTopDownLevelRef.current = topDownLevel;
  }, [topDownLevel, expanded, index]);

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  useFrame(() => {
    if (!isInitializedRef.current) return;

    const now = Date.now();

    if (topDownLevel > 0) {
      animationStateRef.current = 'normal';
      zoomedCameraPosRef.current = null;
    }

    if (topDownStartRef.current) {
      const elapsed = now - topDownStartRef.current;
      const duration = 1000;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(t);
      const from = topDownFromRef.current;
      const to = topDownToRef.current;

      const midpoint = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
      midpoint.y += 10;

      const a = new THREE.Vector3().lerpVectors(from, midpoint, eased);
      const b = new THREE.Vector3().lerpVectors(midpoint, to, eased);
      const current = new THREE.Vector3().lerpVectors(a, b, eased);

      camera.position.copy(current);
      camera.lookAt(0, seatedY, 0);

      if (t >= 1) {
        topDownStartRef.current = null;
        camera.position.copy(to);
      }
      return;
    }

    if (topDownLevel > 0 && !topDownStartRef.current) {
      const { distance, height } = topDownConfig[topDownLevel];

      currentAngleRef.current = THREE.MathUtils.lerp(
        currentAngleRef.current,
        targetAngleRef.current,
        0.08
      );

      const angle = currentAngleRef.current + Math.PI;
      const x = distance * Math.cos(angle);
      const z = distance * Math.sin(angle);
      const y = height;

      camera.position.lerp(new THREE.Vector3(x, y, z), 0.08);
      camera.lookAt(0, seatedY, 0);
      return;
    }

   
    if (animationStateRef.current !== 'zoomingIn' && animationStateRef.current !== 'zoomingOut') {
      const angleDiff = Math.abs(targetAngleRef.current - currentAngleRef.current);
      
      let currentSpeed = rotationSpeedRef.current;
      if (angleDiff < 0.1) {
        currentSpeed = Math.max(0.02, currentSpeed * (angleDiff / 0.1));
      }
      
      currentAngleRef.current = THREE.MathUtils.lerp(
        currentAngleRef.current,
        targetAngleRef.current,
        currentSpeed
      );
    }

  
    window.__CAMERA_ANGLE = currentAngleRef.current;

    const angle = currentAngleRef.current;
    const targetMonitorPos = new THREE.Vector3(
      monitorRadius * Math.cos(angle),
      seatedY,
      monitorRadius * Math.sin(angle)
    );

    let finalCameraPos = center.clone();
    let lookAtTarget = targetMonitorPos.clone();

    if (topDownLevel === 0 && animationStateRef.current === 'zoomingIn') {
      const elapsed = now - zoomStartTimeRef.current;
      const progress = Math.min(elapsed / zoomDuration, 1);
      const eased = easeInOutCubic(progress);

      const direction = new THREE.Vector3().subVectors(targetMonitorPos, center).normalize();
      const zoomDistance = 2.5;
      const zoomedPos = center.clone().add(direction.multiplyScalar(zoomDistance));

      finalCameraPos.lerpVectors(center, zoomedPos, eased);
      lookAtTarget = targetMonitorPos;

      if (progress >= 1) {
        animationStateRef.current = 'zoomed';
        zoomedCameraPosRef.current = zoomedPos.clone();
        lastZoomIndexRef.current = index;
        if (onZoomComplete) onZoomComplete();
      }

      camera.position.copy(finalCameraPos);
      camera.lookAt(lookAtTarget);
      return;
    }

    if (topDownLevel === 0 && animationStateRef.current === 'zoomingOut') {
      const elapsed = now - zoomStartTimeRef.current;
      const progress = Math.min(elapsed / zoomDuration, 1);
      const eased = easeInOutCubic(progress);

      const fromPos = zoomedCameraPosRef.current || camera.position.clone();
      const targetPos = center.clone();
      
      camera.position.lerpVectors(fromPos, targetPos, eased);
      

      const angle = currentAngleRef.current;
      const lookAtTarget = new THREE.Vector3(
        monitorRadius * Math.cos(angle),
        seatedY,
        monitorRadius * Math.sin(angle)
      );
      camera.lookAt(lookAtTarget);

      if (progress >= 1) {
        console.log('Zoom-out animation complete');
        animationStateRef.current = 'normal';
        zoomedCameraPosRef.current = null;
        

        if (onZoomOutComplete) {
          onZoomOutComplete();
        }
      }
      return;
    }

    if (topDownLevel === 0 && animationStateRef.current === 'zoomed') {
      if (zoomedCameraPosRef.current) {
        camera.position.copy(zoomedCameraPosRef.current);
        camera.lookAt(targetMonitorPos);
      } else {
        const direction = new THREE.Vector3().subVectors(targetMonitorPos, center).normalize();
        const fallbackZoomDistance = 2.5;
        const fallbackPos = center.clone().add(direction.multiplyScalar(fallbackZoomDistance));
        camera.position.copy(fallbackPos);
        camera.lookAt(targetMonitorPos);
        zoomedCameraPosRef.current = fallbackPos.clone();
      }
      return;
    }

    camera.position.lerp(finalCameraPos, 0.1);
    camera.lookAt(lookAtTarget);

    // Always emit animation state if it changes
    if (animationStateRef.current !== prevStateRef.current) {
      if (typeof onCameraStateChange === 'function') {
        onCameraStateChange(animationStateRef.current);
      }
      prevStateRef.current = animationStateRef.current;
    }
  });

  return null;
}