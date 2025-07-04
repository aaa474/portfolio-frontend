import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useRef, useEffect } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import PoolBalls, { clearAllBalls } from './PoolBalls';
import * as THREE from 'three';

export default function PoolBallsCanvas() {
  const [ballsVisible, setBallsVisible] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  const BALL_SIZE = 0.3;
  const BALL_SPACING = BALL_SIZE * 2 + 0.1;
  const cueBallProps = { size: BALL_SIZE, cueBall: true, position: [0, -3.5, 0] };

  const trianglePositions = [];
  const rows = 5;
  const startY = 0.5;
  let ballIndex = 0;

  for (let row = 0; row < rows; row++) {
    const count = row + 1;
    const startX = -0.5 * BALL_SPACING * row;
    for (let col = 0; col < count; col++) {
      trianglePositions.push([
        startX + col * BALL_SPACING,
        startY + row * BALL_SPACING,
        0,
      ]);
      ballIndex++;
      if (ballIndex >= 15) break;
    }
    if (ballIndex >= 15) break;
  }

  const handleReset = () => {
    setResetKey(prev => prev + 1);
  };

  useEffect(() => {
    clearAllBalls();
  }, [resetKey]);

  return (
    <>
      <div style={{
        position: 'fixed',
        top: '4.5rem',
        left: '1rem',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        pointerEvents: 'auto',
      }}>
        <button onClick={() => setBallsVisible(v => !v)} style={buttonStyle}>
          {ballsVisible ? 'Hide Balls' : 'Show Balls'}
        </button>
        <button onClick={handleReset} style={buttonStyle}>
          Reset Balls
        </button>
      </div>

      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 20, 5]} intensity={2} castShadow />

        <Suspense fallback={null}>
          <PoolBalls key={`cue-${resetKey}`} {...cueBallProps} fixed={false} visible={ballsVisible} />
          {trianglePositions.map((pos, i) => (
            <PoolBalls
              key={`ball-${resetKey}-${i}`}
              size={BALL_SIZE}
              position={pos}
              index={i}
              fixed={false}
              visible={ballsVisible}
            />
          ))}
        </Suspense>

        {[
          [0, -4.7, 0, [15, 0.1, 0.1]],   // bottom
          [0, 4.5, 0, [15, 0.1, 0.1]],    // top 
          [-7.3, -0.1, 0, [0.1, 9.2, 0.1]],  // left
          [7.3, -0.1, 0, [0.1, 9.2, 0.1]],   // right
        ].map(([x, y, z, args], i) => (
          <mesh position={[x, y, z]} key={i} receiveShadow>
            <boxGeometry args={args} />
            <meshStandardMaterial color="#888" opacity={1} transparent />
          </mesh>
        ))}
      </Canvas>
    </>
  );
}

const buttonStyle = {
  backgroundColor: '#00000099',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  cursor: 'pointer',
  color: 'white',
  fontWeight: 'bold',
  fontFamily: 'monospace',
  textShadow: '0 0 4px #FFA500',
  border: 'none'
};
