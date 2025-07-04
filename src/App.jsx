import ProjectsContent from './components/MonitorPages/ProjectsContent';
import './App.css';
import ContactContent from './components/MonitorPages/ContactContent';
import PageSlider from './components/PageSlider';
import MainPageContent from './components/MonitorPages/MainPageContent';
import AboutMeContent from './components/MonitorPages/AboutMeContent';
import ExperienceContent from './components/MonitorPages/ExperienceContent';
import CircularMonitors from './components/CircularMonitors';
import CameraController from './components/CameraController';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import FlickerStars from './components/FlickerStars';
import Nebula from './components/Nebula';
import AsteroidField from './components/AsteroidField';
import Planet from './components/Planet';
import BasePlatform from './components/BasePlatform';
import GalaxyArm from './components/GalaxyArm';
import MonitorIndicators from './components/MonitorIndicators';
import { OrbitControls } from '@react-three/drei';


function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [topDownLevel, setTopDownLevel] = useState(0);
  const [pendingZoomIndex, setPendingZoomIndex] = useState(null);
  const [isNavigationLocked, setIsNavigationLocked] = useState(false);
  const [showPlanets, setShowPlanets] = useState(true);
  const [showAsteroids, setShowAsteroids] = useState(true);
  const zoomCheckFrame = useRef();
  const lastUserActionRef = useRef(Date.now());
  const [cameraZoomState, setCameraZoomState] = useState('normal');
  const [isTransitioningFromTopDown, setIsTransitioningFromTopDown] = useState(false);
  const prevTopDownLevelRef = useRef(topDownLevel);
  const themes = ['#0d0f1a', '#1a1f2b', '#1b2a36', '#142d42', '#331f1f'];
  const themeColor = themes[currentIndex];
  const [forcedJump, setForcedJump] = useState(false);
  const [shouldZoomOut, setShouldZoomOut] = useState(false);
  const [isPreZooming, setIsPreZooming] = useState(false);
  const [pendingZoomTrigger, setPendingZoomTrigger] = useState(false);

  const setCurrentIndexDebounced = useCallback((newIndex) => {
    if (isNavigationLocked) return;
    
    lastUserActionRef.current = Date.now();
    setCurrentIndex(newIndex);
    
    if (isExpanded || isZooming) {
      setIsExpanded(false);
      setIsZooming(false);
      setPendingZoomIndex(null);
    }
  }, [isNavigationLocked, isExpanded, isZooming]);

  const handleMonitorClick = useCallback((id) => {
  if (isNavigationLocked || isZooming || isExpanded) return;

  const indexMap = {
    MAINPAGEMONITOR: 0,
    ABOUTMEMONITOR: 1,
    EXPERIENCEMONITOR: 2,
    PROJECTSMONITOR: 3,
    CONTACTMONITOR: 4,
  };

  const newIndex = indexMap[id] ?? 0;

  setIsNavigationLocked(true);
  setCurrentIndex(newIndex);
  setPendingZoomIndex(newIndex); 
  setIsPreZooming(true);

  const anglePerIndex = (2 * Math.PI) / 5;
  const expectedAngle = anglePerIndex * newIndex;
  const currentAngle = window.__CAMERA_ANGLE || 0;

  const normalizedExpected = ((expectedAngle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
  const normalizedCurrent = ((currentAngle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);

  let diff = Math.abs(normalizedExpected - normalizedCurrent);
  if (diff > Math.PI) diff = 2 * Math.PI - diff;

  if (diff < 0.08) {
    setTimeout(() => {
      setIsPreZooming(false);
      setIsZooming(true);
      setPendingZoomIndex(null); 
    }, 400);
  }
}, [isNavigationLocked, isZooming, isExpanded]);

  useEffect(() => {
    cancelAnimationFrame(zoomCheckFrame.current);
    if (pendingZoomIndex === null || topDownLevel > 0) return;

    const maxWait = 3000;
    const startTime = Date.now();
    const checkInterval = 16; 
    let lastCheckTime = 0;

    const check = (currentTime) => {
      if (currentTime - lastCheckTime < checkInterval) {
        zoomCheckFrame.current = requestAnimationFrame(check);
        return;
      }
      lastCheckTime = currentTime;

      const anglePerIndex = (2 * Math.PI) / 5;
      const targetAngle = anglePerIndex * pendingZoomIndex;
      const currentAngle = window.__CAMERA_ANGLE || 0;
      
      const normalizedTarget = ((targetAngle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
      const normalizedCurrent = ((currentAngle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
      
      let angleDiff = Math.abs(normalizedTarget - normalizedCurrent);
      if (angleDiff > Math.PI) {
        angleDiff = 2 * Math.PI - angleDiff;
      }

      if (angleDiff < 0.01) {
        setTimeout(() => {
          setIsZooming(true);
          setPendingZoomIndex(null);
        }, 250);
        return;
      }
      
      if (currentTime - startTime > maxWait) {
        console.warn('Zoom timeout - resetting state');
        resetZoomState();
        return;
      }

      zoomCheckFrame.current = requestAnimationFrame(check);
    };

    zoomCheckFrame.current = requestAnimationFrame(check);
    return () => cancelAnimationFrame(zoomCheckFrame.current);
  }, [pendingZoomIndex, topDownLevel]);

  useEffect(() => {
  
    if (
      topDownLevel === 0 &&
      !isZooming &&
      !isExpanded &&
      pendingZoomIndex === null &&
      isCenteredView() &&
      cameraZoomState !== 'zoomed'
    ) {
      setCameraZoomState('zoomed');
    }
  }, [topDownLevel, isZooming, isExpanded, pendingZoomIndex, currentIndex, cameraZoomState]);
  
  useEffect(() => {
  if (
    topDownLevel === 0 &&
    !isZooming &&
    !isExpanded &&
    pendingZoomIndex === null &&
    isCenteredView() &&
    cameraZoomState !== 'zoomed'
  ) {
    setCameraZoomState('zoomed');
  }
}, [topDownLevel, isZooming, isExpanded, pendingZoomIndex, currentIndex, cameraZoomState]);

    useEffect(() => {
      
      if (prevTopDownLevelRef.current > 0 && topDownLevel === 0) {
        setIsTransitioningFromTopDown(true);
        
        
        const timeout = setTimeout(() => {
          setIsTransitioningFromTopDown(false);
        }, 1200); 
        
        prevTopDownLevelRef.current = topDownLevel;
        return () => clearTimeout(timeout);
      }
      
     
      if (topDownLevel > 0) {
        setIsTransitioningFromTopDown(false);
      }
      
      prevTopDownLevelRef.current = topDownLevel;
    }, [topDownLevel]);

   useEffect(() => {
  const indexMap = {
    MAINPAGEMONITOR: 0,
    ABOUTMEMONITOR: 1,
    EXPERIENCEMONITOR: 2,
    PROJECTSMONITOR: 3,
    CONTACTMONITOR: 4,
  };

  const handleJumpToMonitor = (e) => {
    const id = e.detail;
    const newIndex = indexMap[id] ?? 0;

    setIsExpanded(false);
    setIsZooming(false);

    setTimeout(() => {
      setCurrentIndex(newIndex);
      setPendingZoomIndex(newIndex); 
      setIsPreZooming(true);

     
      const anglePerIndex = (2 * Math.PI) / 5;
      const expectedAngle = anglePerIndex * newIndex;
      const currentAngle = window.__CAMERA_ANGLE || 0;

      const normalizedExpected = ((expectedAngle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
      const normalizedCurrent = ((currentAngle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);

      let diff = Math.abs(normalizedExpected - normalizedCurrent);
      if (diff > Math.PI) diff = 2 * Math.PI - diff;

      if (diff < 0.08) {
      setTimeout(() => {
        setIsPreZooming(false);
        setIsZooming(true);
        setPendingZoomIndex(null);
      }, 400);
    }
      setForcedJump(true);
    }, 100);
  };

  window.addEventListener('jumpToMonitor', handleJumpToMonitor);
  return () => window.removeEventListener('jumpToMonitor', handleJumpToMonitor);
}, []);




    const shouldShowMonitorIndicators =
    topDownLevel === 0 &&
    (cameraZoomState === 'zoomed' || isPreZooming) &&
    !isTransitioningFromTopDown &&
    !isExpanded;





  const resetZoomState = useCallback(() => {
    setPendingZoomIndex(null);
    setIsZooming(false);
    setIsExpanded(false);
    setIsNavigationLocked(false);
  }, []);

  const handleZoomComplete = useCallback(() => {
  setCameraZoomState('zoomed');  
  setIsExpanded(true);
  setIsZooming(false);
  setForcedJump(false);
}, []);



  const handleBack = useCallback(() => {
  if (forcedJump) {
    setForcedJump(false);
    setIsExpanded(false);
    setShouldZoomOut(true);
    
  } else {
    setIsExpanded(false);
    setIsZooming(false);
    setPendingZoomIndex(null);

    setTimeout(() => {
      setIsNavigationLocked(false);
    }, 500);
  }
}, [forcedJump]);

const handleZoomOutComplete = useCallback(() => {
  setShouldZoomOut(false);
  setIsNavigationLocked(false);
}, []);


  const handleLeftArrow = useCallback(() => {
    if (isNavigationLocked) return;
    const newIndex = (currentIndex - 1 + 5) % 5;
    setCurrentIndexDebounced(newIndex);
  }, [currentIndex, isNavigationLocked, setCurrentIndexDebounced]);

  const handleRightArrow = useCallback(() => {
    if (isNavigationLocked) return;
    const newIndex = (currentIndex + 1) % 5;
    setCurrentIndexDebounced(newIndex);
  }, [currentIndex, isNavigationLocked, setCurrentIndexDebounced]);

  const handleSliderChange = useCallback((newIndex) => {
    if (isNavigationLocked) return;
    
    
    resetZoomState();
    setCurrentIndex(newIndex);
  }, [isNavigationLocked, resetZoomState]);

 
  const handleTopDownToggle = useCallback(() => {
      const nextLevel = (topDownLevel + 1) % 3;
      setTopDownLevel(nextLevel);
      
    
      if (nextLevel > 0) {
        resetZoomState();
      }
    }, [topDownLevel, resetZoomState]);

    const isCenteredView = () => {
      if (topDownLevel !== 0 || pendingZoomIndex !== null || isZooming || isExpanded) return false;

      const anglePerIndex = (2 * Math.PI) / 5;
      const expectedAngle = anglePerIndex * currentIndex;
      const currentAngle = window.__CAMERA_ANGLE || 0;

      const normalizedExpected = ((expectedAngle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
      const normalizedCurrent = ((currentAngle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);

      let diff = Math.abs(normalizedExpected - normalizedCurrent);
      if (diff > Math.PI) diff = 2 * Math.PI - diff;

      return diff < 0.01;
    };


 
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isNavigationLocked && !isZooming && !isExpanded) {
        console.log('Auto-unlocking navigation');
        setIsNavigationLocked(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isNavigationLocked, isZooming, isExpanded]);

  useEffect(() => {
    if (
      topDownLevel === 0 &&
      !isZooming &&
      !isExpanded &&
      pendingZoomIndex === null &&
      isCenteredView() &&
      cameraZoomState !== 'zoomed'
    ) {
      setCameraZoomState('zoomed');
    }
  }, [topDownLevel, isZooming, isExpanded, pendingZoomIndex, currentIndex, cameraZoomState]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('jumpToMonitor', { detail: 'MAINPAGEMONITOR' }));
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: '100vw', margin: 0, padding: 0, overflow: 'hidden', zIndex: 0 }}>
      <div id="canvas-background">
        <Canvas
          style={{ background: '#111', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}
          camera={{ position: [0, 0, 8], fov: 90, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1000 }}
          onCreated={({ gl, camera, scene }) => {
            gl.setSize(window.innerWidth, window.innerHeight);
            gl.setPixelRatio(window.devicePixelRatio);

            window.__THREE_RENDERER__ = gl;
            window.__THREE_SCENE__ = scene;
            window.__THREE_CAMERA__ = camera;
          }}
          onResize={({ gl, camera }) => {
            gl.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
          }}
        >
          <Stars radius={120} depth={60} count={7000} factor={2.5} fade saturation={0} speed={0.25} />
          <FlickerStars />
          <Nebula />
          <GalaxyArm />
          {!isExpanded && !isZooming && showAsteroids && <AsteroidField />}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 5]} intensity={1.5} />
          <pointLight position={[0, 2, 0]} intensity={0.8} distance={10} decay={2} color={0x444444} />

          {!isExpanded && !isZooming && showPlanets && (
              <>
                <Planet name="Mercury" textureUrl="/8k_mercury.jpg" radius={2} size={0.4} speed={0.015} tilt={0.01} spinDir={1} index={0} />
                <Planet name="Venus" textureUrl="/4k_venus_atmosphere.jpg" radius={3} size={0.6} speed={0.012} tilt={3.09} spinDir={-1} index={1} />
                <Planet name="Earth" textureUrl="/8k_earth_daymap.jpg" radius={4} size={1} speed={0.01} tilt={0.41} spinDir={1} index={2} />
                <Planet name="Mars" textureUrl="/8k_mars.jpg" radius={5} size={0.7} speed={0.0085} tilt={0.44} spinDir={1} index={3} />
                <Planet name="Jupiter" textureUrl="/8k_jupiter.jpg" radius={7} size={1.4} speed={0.0065} tilt={0.05} spinDir={1} index={4} />
                <Planet name="Saturn" textureUrl="/8k_saturn.jpg" ringUrl="/8k_saturn_ring_alpha.png" radius={9} size={1.2} speed={0.0055} tilt={0.47} spinDir={1} index={5} />
                <Planet name="Uranus" textureUrl="/2k_uranus.jpg" radius={11} size={1.1} speed={0.0045} tilt={1.71} spinDir={-1} index={6} />
                <Planet name="Neptune" textureUrl="/2k_neptune.jpg" radius={13} size={1.1} speed={0.0035} tilt={0.49} spinDir={1} index={7} />
              </>
            )}
          <CameraController
            index={currentIndex}
            expanded={isExpanded}
            isZooming={isZooming}
            onZoomComplete={handleZoomComplete}
            topDownLevel={topDownLevel}
            onCameraStateChange={(state) => setCameraZoomState(state)}
            shouldZoomOut={shouldZoomOut} 
            onZoomOutComplete={handleZoomOutComplete} 
          />

          <BasePlatform />
          <CircularMonitors 
            onMonitorClick={handleMonitorClick} 
            topDownLevel={topDownLevel} 
            isNavigationLocked={isNavigationLocked}
          />
        </Canvas>
        {shouldShowMonitorIndicators && (
          <MonitorIndicators topDownLevel={topDownLevel} currentIndex={currentIndex} />
        )}
      </div>

      {/* Planet/Asteroid toggle buttons */}
      {!isExpanded && !isZooming && (
        <div style={{ 
          position: 'fixed', 
          top: '1rem', 
          left: '1rem', 
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div
            style={{
              backgroundColor: '#00000099',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'white',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              textShadow: '0 0 4px #00ffff',
              border: 'none',
              fontSize: '14px',
              userSelect: 'none'
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setShowPlanets(prev => !prev);
            }}
          >
            {showPlanets ? 'Hide Planets' : 'Show Planets'}
          </div>
          <div
            style={{
              backgroundColor: '#00000099',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'white',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              textShadow: '0 0 4px #ffcc00',
              border: 'none',
              fontSize: '14px',
              userSelect: 'none'
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setShowAsteroids(prev => !prev);
            }}
          >
            {showAsteroids ? 'Hide Asteroids' : 'Show Asteroids'}
          </div>
        </div>
      )}
      {/* Top-down view toggle button */}
      {!isExpanded && !isZooming && (
        <button
          onClick={handleTopDownToggle}
          style={{
            position: 'fixed',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 12,
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {topDownLevel === 0
            ? 'Asteroid Belt View'
            : topDownLevel === 1
            ? 'Neptune View'
            : 'Back to Seat View'}
        </button>
      )}
      {!isExpanded && !isZooming && (
        <>
          <button 
            onClick={handleLeftArrow} 
            disabled={isNavigationLocked}
            className="slider-button slider-left" 
            style={{ 
              position: 'fixed', 
              top: '50%', 
              left: '1rem', 
              transform: 'translateY(-50%)', 
              zIndex: 10, 
              background: isNavigationLocked ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.5)', 
              border: 'none', 
              padding: '0.75rem', 
              borderRadius: '50%', 
              color: 'white', 
              fontSize: '1.5rem', 
              cursor: isNavigationLocked ? 'not-allowed' : 'pointer',
              opacity: isNavigationLocked ? 0.5 : 1
            }}
          >
            ←
          </button>
          <button 
            onClick={handleRightArrow} 
            disabled={isNavigationLocked}
            className="slider-button slider-right" 
            style={{ 
              position: 'fixed', 
              top: '50%', 
              right: '1rem', 
              transform: 'translateY(-50%)', 
              zIndex: 10, 
              background: isNavigationLocked ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.5)', 
              border: 'none', 
              padding: '0.75rem', 
              borderRadius: '50%', 
              color: 'white', 
              fontSize: '1.5rem', 
              cursor: isNavigationLocked ? 'not-allowed' : 'pointer',
              opacity: isNavigationLocked ? 0.5 : 1
            }}
          >
            →
          </button>
        </>
      )}

      {!isExpanded && !isZooming && (
        <PageSlider index={currentIndex} setIndex={handleSliderChange} />
      )}

      {isZooming && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 15, color: 'white', fontSize: '1.2rem', textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          Loading...
          <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }` }} />
        </div>
      )}

      {isExpanded && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 20, backgroundColor: 'rgba(0, 0, 0, 0.95)', color: 'white', padding: '2rem', overflowY: 'auto', boxSizing: 'border-box', backdropFilter: 'blur(10px)' }}>
          <button onClick={handleBack} style={{ position: 'absolute', top: '.7rem', right: '1rem', backgroundColor: '#dc2626', fontFamily: '"Space Nova", sans-serif', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer', zIndex: 21 }}>Back</button>
          <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '3rem' }}>
            {currentIndex === 0 && <MainPageContent handleMonitorClick={handleMonitorClick} currentIndex={currentIndex} />}
            {currentIndex === 1 && <AboutMeContent currentIndex={currentIndex} />}
            {currentIndex === 2 && <ExperienceContent currentIndex={currentIndex} />}
            {currentIndex === 3 && <ProjectsContent currentIndex={currentIndex} />}
            {currentIndex === 4 && <ContactContent currentIndex={currentIndex} />} 
          </div>
        </div>
      )}
    </div>
  );
}

export default App;