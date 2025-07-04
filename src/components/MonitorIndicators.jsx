import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const monitorLabels = ['Main Page', 'About Me', 'Experience', 'Projects', 'Contact'];
const monitorColors = ['red', 'orange', 'yellow', 'green', 'deepskyblue'];


export default function MonitorIndicators({ topDownLevel, currentIndex }) {
  const containerRef = useRef(null);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    let animationFrame;

    const updatePositions = () => {
      const camera = window.__THREE_CAMERA__;
      const baseAngle = window.__CAMERA_ANGLE || 0;

      if (!camera || topDownLevel !== 0) {
        animationFrame = requestAnimationFrame(updatePositions);
        return;
      }

      const monitorCount = 5;
      const radius = 4;
      const seatedY = 1.3;
      const monitorHeight = .4;
      const indicatorHeight = 0.1;
      const newPositions = [];

      for (let i = 0; i < monitorCount; i++) {
       
        const angle = (i / monitorCount) * Math.PI * 2;
        
        
        const monitorX = radius * Math.cos(angle);
        const monitorZ = radius * Math.sin(angle);
        const monitorY = seatedY;
        
      
        const indicatorPos = new THREE.Vector3(
          monitorX,
          monitorY + monitorHeight + indicatorHeight,
          monitorZ
        );

       
        const screenPos = indicatorPos.clone().project(camera);
        

        if (screenPos.z < 1 && screenPos.z > -1) {
          const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
          const y = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;
          
          if (x >= 0 && x <= window.innerWidth && y >= 0 && y <= window.innerHeight) {
            newPositions.push({ x, y, label: monitorLabels[i], index: i });
          }
        }
      }

      setPositions(newPositions);
      animationFrame = requestAnimationFrame(updatePositions);
    };

    animationFrame = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(animationFrame);
  }, [topDownLevel]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
        zIndex: 12,
      }}
    >
      {positions.map(({ x, y, label, index }) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            transform: 'translate(-50%, -100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {/* Label above */}
          <div
            style={{
              fontFamily: '"Space Nova", sans-serif',
              color: monitorColors[index],
              fontWeight: 'bold',
              fontSize: '2.5rem',
              textShadow: `0 0 8px ${monitorColors[index]}`,
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </div>

          {/* Downward arrow below */}
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: `14px solid ${monitorColors[index]}`,
              filter: `drop-shadow(0 0 4px ${monitorColors[index]})`,
              marginTop: '14px',
              animation: currentIndex === index ? 'floatArrowVertical 1s ease-in-out infinite' : 'none',
            }}
          />
        </div>
      ))}

      <style>
        {`@keyframes floatArrowVertical {
          0%   { transform: translateY(0); }
          50%  { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }`}
      </style>
    </div>
  );
}