import { useGLTF, useTexture } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CircularMonitors({ onMonitorClick, topDownLevel = 0, isNavigationLocked = false }) {
  const gltf = useGLTF('/PortfolioModels3.glb');
  const groupRef = useRef();
  const { gl, camera, scene } = useThree();
  
  const glowScene = useRef(new THREE.Scene());
  const glowRenderer = useRef();
  const glowComposer = useRef();

  useEffect(() => {
  const radius = 4;
  const monitorNames = [
    'MAINPAGEMONITOR',
    'ABOUTMEMONITOR',
    'EXPERIENCEMONITOR',
    'PROJECTSMONITOR',
    'CONTACTMONITOR',
  ];

  const glowingScreens = [
    'Cube038_1',
    'Cube042_1',
    'Cube040_1',
    'Cube036_1',
    'Cube044_1'
  ];

  const screenTexture = new THREE.CanvasTexture(createScreenPattern());
  screenTexture.wrapS = THREE.RepeatWrapping;
  screenTexture.wrapT = THREE.RepeatWrapping;
  screenTexture.repeat.set(2, 2);

  monitorNames.forEach((name, i) => {
    const angle = (i / monitorNames.length) * Math.PI * 2;
    const monitor = gltf.scene.getObjectByName(name);

    if (monitor) {
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      monitor.position.set(x, 0, z);
      monitor.rotation.set(0, 0, 0);
      monitor.lookAt(0, 0, 0);
      monitor.rotateY(Math.PI);
      monitor.rotateX(Math.PI);
      monitor.userData = { id: name, index: i };

      monitor.traverse((child) => {
        if (child.isMesh && glowingScreens.includes(child.name)) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0.95, 0.95, 1.0),
            emissive: new THREE.Color(0.4, 0.5, 0.9),
            emissiveIntensity: 3,
            metalness: 0.1,
            roughness: 0.2,
            transparent: true,
            opacity: 0.98,
            map: screenTexture,
            emissiveMap: screenTexture
          });

          child.geometry.computeBoundingBox();
          const bbox = child.geometry.boundingBox;
          const width = bbox ? (bbox.max.x - bbox.min.x) : 1.5;
          const height = bbox ? (bbox.max.y - bbox.min.y) : 1;

          const glowGeometry = new THREE.PlaneGeometry(width * 1.8, height * 1.8);
          const glowMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0.3, 0.5, 1.0),
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
          });
          
          const glowPlane = new THREE.Mesh(glowGeometry, glowMaterial);
          glowPlane.position.copy(child.getWorldPosition(new THREE.Vector3()));
          glowPlane.quaternion.copy(child.getWorldQuaternion(new THREE.Quaternion()));
          glowPlane.position.z -= 0.1;
          scene.add(glowPlane);

      
          const edgeGlowGeometry = new THREE.EdgesGeometry(child.geometry);
          const edgeGlowMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(0.5, 0.7, 1.0),
            linewidth: 2,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
          });
          const edgeGlow = new THREE.LineSegments(edgeGlowGeometry, edgeGlowMaterial);
          edgeGlow.position.copy(child.position);
          edgeGlow.rotation.copy(child.rotation);
          edgeGlow.scale.copy(child.scale);
          child.add(edgeGlow);

          child.userData.glowPlane = glowPlane;
          child.userData.edgeGlow = edgeGlow;
        }
      });
    }
  });
}, [gltf]);

function createScreenPattern() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 256, 256);
  gradient.addColorStop(0, 'rgba(200, 220, 255, 0.8)');
  gradient.addColorStop(1, 'rgba(180, 200, 240, 0.6)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  
  for (let y = 20; y < 256; y += 30) {
    ctx.beginPath();
    ctx.moveTo(10, y);
    ctx.lineTo(246, y);
    ctx.stroke();
  }
  

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillRect(30, 40, 80, 60);
  ctx.fillRect(150, 80, 70, 100);
  
  return canvas;
}

useFrame((state) => {
  const time = state.clock.getElapsedTime();
  
  gltf.scene.traverse((child) => {
    if (child.isMesh && child.userData.glowPlane) {
   
      const pulseIntensity = Math.sin(time * 1.5) * 0.1 + 0.7;
      
      child.userData.glowPlane.material.opacity = pulseIntensity * 0.6;
      child.userData.glowPlane.material.color.setHSL(
        0.6 + Math.sin(time * 0.3) * 0.05, 
        0.8, 
        0.6
      );
      
      if (child.userData.edgeGlow) {
        child.userData.edgeGlow.material.opacity = pulseIntensity * 0.7;
      }
      
      child.material.emissiveIntensity = pulseIntensity * 3.5;
      child.material.map.offset.x = time * 0.01;
      child.material.map.offset.y = time * 0.005;
    }
  });
});

  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event) => {
      if (topDownLevel !== 0 || isNavigationLocked) return;

      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      const clicked = intersects.find((i) => {
        let obj = i.object;
        while (obj && !obj.userData.id && obj.parent) {
          obj = obj.parent;
        }
        return obj.userData.id;
      });

      if (clicked && onMonitorClick) {
        let obj = clicked.object;
        while (!obj.userData.id && obj.parent) {
          obj = obj.parent;
        }
        console.log('Monitor clicked:', obj.userData.id, 'at index:', obj.userData.index);
        onMonitorClick(obj.userData.id);
      }
    };

    gl.domElement.addEventListener('click', onClick);
    return () => gl.domElement.removeEventListener('click', onClick);
  }, [camera, gl, scene, onMonitorClick, topDownLevel, isNavigationLocked]);

  return <primitive object={gltf.scene} ref={groupRef} />;
}