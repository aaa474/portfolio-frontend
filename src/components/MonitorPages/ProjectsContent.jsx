import { useEffect, useState, Suspense, useMemo, useRef } from 'react';
import axios from 'axios';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const navButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#00FF00',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
  textShadow: '0 0 5px #00FF00',
  transition: 'all 0.2s ease',
};

const boxStyle = {
  background: 'rgba(0, 0, 0, 0.65)',
  padding: '1.5rem',
  borderRadius: '8px',
  border: '1px solid rgba(30, 255, 0, 0.2)', 
  boxShadow: '0 0 30px rgba(102, 255, 0, 0.1)',
  };


  const textStyle = {
  color: 'green',
  fontSize: 'clamp(1rem, 2vw, 1.125rem)',
  lineHeight: '1.8',
  fontFamily: 'Space Nova, sans-serif',
  textAlign: 'left',
  margin: 0,
  };


  const subheadingStyle = {
    color: 'green',
    marginBottom: '0.75rem',
    fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
  };

  const listStyle = {
  paddingLeft: '1.25rem',
  color: 'green',
  lineHeight: '1.8',
  fontSize: 'clamp(1rem, 2vw, 1.125rem)',
  fontFamily: 'Space Nova, sans-serif',
  textAlign: 'left',
  listStyleType: 'disc',
  };

function ExplosionParticles({ position, onComplete }) {
  const ref = useRef();
  const particles = useMemo(() => {
    const count = 20;
    return Array.from({ length: count }, () => ({
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      ),
      position: position.clone(),
    }));
  }, [position]);
  const lifetime = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    lifetime.current += delta;
    ref.current.children.forEach((mesh, i) => {
      particles[i].position.addScaledVector(particles[i].velocity, delta);
      mesh.position.copy(particles[i].position);
    });
    if (lifetime.current > 1.2) onComplete?.();
  });

  return (
    <group ref={ref}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[0.1, 4, 4]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      ))}
    </group>
  );
}

function ConfettiParticles({ position, onComplete }) {
  const ref = useRef();
  const colors = ['#FF3E3E', '#3EFF5E', '#3EB2FF', '#FFE53E', '#FF3EEC'];
  const particles = useMemo(() => {
    const count = 30;
    return Array.from({ length: count }, () => ({
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 1,
        -Math.random() * 3 - 2,
        (Math.random() - 0.5) * 1
      ),
      position: position.clone(),
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, [position]);
  const lifetime = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    lifetime.current += delta;
    ref.current.children.forEach((mesh, i) => {
      particles[i].position.addScaledVector(particles[i].velocity, delta);
      mesh.position.copy(particles[i].position);
    });
    if (lifetime.current > 1.8) onComplete?.();
  });

  return (
    <group ref={ref}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <planeGeometry args={[0.15, 0.15]} />
          <meshStandardMaterial color={p.color} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function Bomb({ mesh, position, onClick }) {
  const clone = useMemo(() => mesh.clone(), [mesh]);
  return (
    <primitive
      object={clone}
      position={position}
      scale={0.45}
      rotation={[0, Math.atan2(position[0], position[2]), 0]}
      onClick={onClick}
      cursor="pointer"
    />
  );
}

function BombGroup({ visible }) {
  const { scene } = useGLTF('/CartoonBombs.glb');
  const [bombs, setBombs] = useState([]);
  const [effects, setEffects] = useState([]);

  const meshes = useMemo(() => {
    return scene.children.filter(child => child.type === 'Mesh' || child.type === 'Group');
  }, [scene]);

  const positions = useMemo(() => [
    [-11, 3.5, -2], [-11, 0.2, -2], [-11, -2.5, -2],
    [11, 3.5, -2], [11, 0.2, -2], [11, -2.5, -2],
    [-4, -5.2, -2], [0, -5.2, -2], [4, -5.2, -2],
  ], []);

  const regenerateBombs = () => {
    setBombs(() => positions.map((pos) => {
      const mesh = meshes[Math.floor(Math.random() * meshes.length)];
      return { mesh, position: pos, id: crypto.randomUUID() };
    }));
  };

  useEffect(() => {
    regenerateBombs();
    const handler = () => regenerateBombs();
    window.addEventListener('respawn-bombs', handler);
    return () => window.removeEventListener('respawn-bombs', handler);
  }, [meshes]);

  const handleBombClick = (id, position) => {
    const explode = Math.random() < 0.5;
    const sound = new Audio(explode ? '/Roblox Explosion Sound Effect.mp3' : '/25 confetti Sound effect.mp3');
    sound.volume = 0.5;
    sound.play();

    const pos = new THREE.Vector3(...position);
    setEffects((prev) => [
      ...prev,
      explode
        ? { id, type: 'explosion', position: pos }
        : { id, type: 'confetti', position: pos },
    ]);

    setBombs((prev) => prev.filter((b) => b.id !== id));
  };

  if (!visible) return null;

  return (
    <>
      {bombs.map((bomb) => (
        <Bomb
          key={bomb.id}
          mesh={bomb.mesh}
          position={bomb.position}
          onClick={() => handleBombClick(bomb.id, bomb.position)}
        />
      ))}
      {effects.map((effect) =>
        effect.type === 'explosion' ? (
          <ExplosionParticles
            key={effect.id}
            position={effect.position}
            onComplete={() =>
              setEffects((prev) => prev.filter((e) => e.id !== effect.id))
            }
          />
        ) : (
          <ConfettiParticles
            key={effect.id}
            position={effect.position}
            onComplete={() =>
              setEffects((prev) => prev.filter((e) => e.id !== effect.id))
            }
          />
        )
      )}
    </>
  );
}

export default function ProjectsContent({ currentIndex }) {
  const [projects, setProjects] = useState([]);
  const [bombsVisible, setBombsVisible] = useState(true);
  const [navbarVisible, setNavbarVisible] = useState(true);

  const sectionLabels = ['Main', 'About', 'Experience', 'Projects', 'Contact'];
  const monitorIDs = ['MAINPAGEMONITOR', 'ABOUTMEMONITOR', 'EXPERIENCEMONITOR', 'PROJECTSMONITOR', 'CONTACTMONITOR'];
  const API_URL = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    axios.get(`${API_URL}/api/projects`)
      .then((res) => setProjects(res.data))
      .catch((err) => console.error('Error loading projects:', err));
  }, []);

  useEffect(() => {
    let lastScroll = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      setNavbarVisible(current <= lastScroll || current < 20);
      lastScroll = current;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        fontFamily: 'Space Nova, sans-serif',
        backgroundImage: 'url(/20314bl-orange-nj-cone-street-bridge-1916-a6d77d-1024.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'fixed', top: '4.5rem', left: '1rem', zIndex: 100 }}>
        <div
          style={{ backgroundColor: '#00000099', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', color: 'white', fontWeight: 'bold', fontFamily: 'monospace', textShadow: '0 0 4px #FF0000', marginBottom: '0.5rem' }}
          onClick={() => setBombsVisible((v) => !v)}
        >
          {bombsVisible ? 'Hide Bombs' : 'Show Bombs'}
        </div>
        <div
          style={{ backgroundColor: '#00000099', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', color: '', fontWeight: 'bold', fontFamily: 'monospace', textShadow: '0 0 4px #00FF00' }}
          onClick={() => window.dispatchEvent(new Event('respawn-bombs'))}
        >
          Respawn Bombs
        </div>
      </div>

      <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'transparent', pointerEvents: 'auto' }} gl={{ alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 12]} />
        <ambientLight intensity={2.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <BombGroup visible={bombsVisible} />
        </Suspense>
      </Canvas>

      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'min(85vw, 1000px)', height: '70vh', background: 'rgba(0, 0, 0, 0.5)', boxShadow: '0 0 30px rgba(255, 0, 0, 0.1)', borderRadius: '8px', zIndex: 1, overflow: 'hidden' }}>
        <div style={{ height: '100%', overflowY: 'auto', padding: '2rem clamp(1rem, 4vw, 2rem)', boxSizing: 'border-box', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h1
              style={{
                background: 'linear-gradient(to right, #00FF00, #66FF66)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                textAlign: 'center',
              }}
            >
              Projects
            </h1>
            {projects.map((project) => (
              <div key={project.id} style={{ background: 'rgba(0, 0, 0, 0.65)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0, 255, 21, 0.23)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h2 style={{ color: '#00ff00', margin: 0, fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', textShadow: '0 0 8px black' }}>{project.title}</h2>
                  {project.date && <p style={{ color: '#aaa', fontSize: '0.9rem', textAlign: 'center', marginTop: '0.25rem' }}>{project.date}</p>}
                </div>
                {project.tech && <p style={{ color: '#ccc', margin: '0.5rem 0 1rem', textAlign: 'center' }}>({project.tech.join(', ')})</p>}
                {project.highlights?.length > 0 && (
                  <ul style={{ paddingLeft: '1.5rem', color: '#eee', fontSize: 'clamp(0.9rem, 2vw, 1rem)', lineHeight: '1.75', textShadow: '0 0 2px black', fontFamily: 'Space Nova, sans-serif', letterSpacing: '0.25px' }}>
                    {project.highlights.map((point, i) => <li key={i}>{point}</li>)}
                  </ul>
                )}
              </div>
            ))}
            <div style={boxStyle}>
                <h2 style={subheadingStyle}> P.S, you can click on the bomb and grenades to have them either explode or shoot out confetti :)</h2>
              </div>
            <div style={{ paddingBottom: '2rem' }}></div>
          </div>
        </div>
      </div>

      <div
        id="main-navbar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.6)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          zIndex: 100,
          opacity: navbarVisible ? 1 : 0,
          pointerEvents: navbarVisible ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ color: '#00FF00', fontWeight: 'bold', fontSize: '1.25rem' }}>Aslam Azes</div>
        <div style={{ display: 'flex', gap: '1.5rem', marginRight: '4.5rem' }}>
          {monitorIDs.map((id, i) => (
            <button
              key={id}
              onClick={() => {
                if (i !== 3) { 
                  window.dispatchEvent(new CustomEvent('jumpToMonitor', { detail: id }));
                }
              }}
              disabled={i === 3}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: i === 3 ? 'not-allowed' : 'pointer',
                opacity: i === 3 ? 0.4 : 1,
                textShadow: '0 0 5px #00ff00',
                transition: 'all 0.2s ease',
              }}
            >
              {sectionLabels[i]}
            </button>
          ))}

        </div>
      </div>
    </div>
  );
}
