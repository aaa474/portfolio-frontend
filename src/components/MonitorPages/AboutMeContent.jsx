import { useEffect, useState } from 'react';
import PoolBallsCanvas from './PoolBallsCanvas';

export default function AboutMeContent({ currentIndex }) {
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [aboutVisible, setAboutVisible] = useState(true);
  const boxStyle = {
  background: 'rgba(0, 0, 0, 0.65)',
  padding: '1.5rem',
  borderRadius: '8px',
  border: '1px solid rgba(255, 165, 0, 0.2)', 
  boxShadow: '0 0 30px rgba(255, 165, 0, 0.1)',
  };


  const textStyle = {
  color: 'white',
  fontSize: 'clamp(1rem, 2vw, 1.125rem)',
  lineHeight: '1.8',
  fontFamily: 'Space Nova, sans-serif',
  textAlign: 'left',
  margin: 0,
  };


  const subheadingStyle = {
    color: '#FFA500',
    marginBottom: '0.75rem',
    fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
  };

  const listStyle = {
  paddingLeft: '1.25rem',
  color: 'white',
  lineHeight: '1.8',
  fontSize: 'clamp(1rem, 2vw, 1.125rem)',
  fontFamily: 'Space Nova, sans-serif',
  textAlign: 'left',
  listStyleType: 'disc',
  };


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

  const sectionLabels = ['Main', 'About', 'Experience', 'Projects', 'Contact'];
  const monitorIDs = ['MAINPAGEMONITOR', 'ABOUTMEMONITOR', 'EXPERIENCEMONITOR', 'PROJECTSMONITOR', 'CONTACTMONITOR'];

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        fontFamily: 'Space Nova, sans-serif',
        background: 'radial-gradient(ellipse at center, #0d0f1a 0%, #050510 100%)',
        color: 'white',
        zIndex: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* Background Image Layer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          zIndex: -2,
          backgroundImage: 'url(/istockphoto-184983947-612x612.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      />

      <PoolBallsCanvas />

      {/* Top Navbar */}
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
          zIndex: 50,
          backdropFilter: 'blur(8px)',
          opacity: navbarVisible ? 1 : 0,
          pointerEvents: navbarVisible ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ color: '#FFA500', fontWeight: 'bold', fontSize: '1.25rem' }}>
          Aslam Azes
        </div>

        <div
          className="nav-links"
          style={{
            display: 'flex',
            gap: '1.5rem',
            marginRight: '4.5rem',
          }}
        >
          {monitorIDs.map((id, i) => (
            <button
              key={id}
              onClick={() => {
                if (i !== 1) { 
                  window.dispatchEvent(new CustomEvent('jumpToMonitor', { detail: id }));
                }
              }}
              disabled={i === 1}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: i === 1 ? 'not-allowed' : 'pointer',
                opacity: i === 1 ? 0.4 : 1,
                textShadow: '0 0 5px #FFA500',
                transition: 'all 0.2s ease',
              }}
            >
              {sectionLabels[i]}
            </button>
          ))}
        </div>
      </div>

      {/* Hide About Toggle Button */}
      <div
        style={{
          position: 'fixed',
          top: '4.5rem',
          right: '1rem',
          zIndex: 60,
        }}
      >
        <button
          onClick={() => setAboutVisible((v) => !v)}
          style={{
            backgroundColor: '#00000099',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            textShadow: '0 0 4px #FFA500',
          }}
        >
          {aboutVisible ? 'Hide About' : 'Show About'}
        </button>
      </div>

      {/* Floating About Info Box */}
      {aboutVisible && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(85vw, 1000px)',
            height: '70vh',
            background: 'rgba(0, 0, 0, 0.5)',
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.1)',
            borderRadius: '8px',
            zIndex: 1,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              overflowY: 'auto',
              padding: '2rem clamp(1rem, 4vw, 2rem)',
              boxSizing: 'border-box',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div
              style={{
                maxWidth: '800px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
              }}
            >
              <h1
                style={{
                  background: 'linear-gradient(to right, #FFA500, #FFCC66)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  textAlign: 'center',
                }}
              >
                About Me
              </h1>

              {/* Personal Intro */}
              <div style={boxStyle}>
                <p style={{textStyle, color: '#f26302'}}>
                  Hi! I'm Aslam Azes, a computer science student passionate about building immersive interactive experiences using 3D web technologies, simulations, and AI. I enjoy coding and designing content as a way to hone my skills as a Computer Scientist.
                </p>
              </div>

              {/* Academic Background */}
              <div style={boxStyle}>
                <h2 style={subheadingStyle}> Academic Background</h2>
                <ul style={listStyle}>
                  <li> Currently a rising Senior at Rutgers Universiy</li>
                  <li> Started unversity from September 2022 and expected to graduate in May 2026</li>
                  <li> Currently pursuing a B.S in Computer Science</li>
                  <li> Also currently pursuing a minor in Mathematics at Rutgers University</li>
                  <p style={textStyle}>
                    Before this, I attended South Brunswick High School from 2018-2022
                  </p>
                </ul>
              </div>

              {/* Career Goals */}
              <div style={boxStyle}>
                <h2 style={subheadingStyle}> Career Goals</h2>
                <p style={textStyle}>
                  I'm aiming for roles in full-stack development, frontend engineering as well as Machine Learning/AI. In the future I plan to apply these skills to get a Master's in Computer Science and Electrical Engineering so I can work in the quantum computing field.
                </p>
              </div>

              {/* Sample */}
              <div style={boxStyle}>
                <h2 style={subheadingStyle}> Miscellaneous Facts</h2>
                <p style={textStyle}>
                  <li>I'm good at using Blender to help with designing my coding projects like this one</li>
                  <li>My future interest is to pivot to Quantum Computing using my future knowledge in Computer Science and Math</li>
                  <li>My favorite sport is soccer</li>
                </p>
              </div>

              {/* Timeline / Milestones */}
              <div style={boxStyle}>
                <h2 style={subheadingStyle}> Timeline Highlights</h2>
                <ul style={listStyle}>
                  <li>2022: Graduated high school and began Computer Science at Rutgers</li>
                  <li>2023: Built some starter projects using my primitive knowledge in coding like a To-Do List</li>
                  <li>2024: Learned how to use Blender in order to make models for my future website as well as learning other coding lanuages</li>
                  <li>2025: Launching a full professional site and seeking internships</li>
                </ul>
              </div>

              <div style={boxStyle}>
                <h2 style={subheadingStyle}> P.S, You can use the button on the top right to hide this box and play with the pool balls by clicking on the Cue Ball to hit the closest ball :)</h2>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
