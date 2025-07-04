import { useEffect, useState } from 'react';
import FallingPlanetCanvas from './FallingPlanetCanvas';

const navButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#ff0000',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
  textShadow: '0 0 5px #ff0000',
  transition: 'all 0.2s ease',
};

export default function MainPageContent({ handleMonitorClick, currentIndex }) {
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mainVisible, setMainVisible] = useState(true); 

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
      <FallingPlanetCanvas />

      {/* Hide/Show Main Button */}
      <div
        style={{
          position: 'fixed',
          top: '4.5rem',
          right: '1rem',
          zIndex: 60,
        }}
      >
        <button
          onClick={() => setMainVisible((v) => !v)}
          style={{
            backgroundColor: '#00000099',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            textShadow: '0 0 4px #FF0000',
          }}
        >
          {mainVisible ? 'Hide Main' : 'Show Main'}
        </button>
      </div>

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
        <div style={{ color: '#ff0000', fontWeight: 'bold', fontSize: '1.25rem' }}>
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
                if (i !== 0) { 
                  window.dispatchEvent(new CustomEvent('jumpToMonitor', { detail: id }));
                }
              }}
              disabled={i === 0}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: i === 0 ? 'not-allowed' : 'pointer',
                opacity: i === 0 ? 0.4 : 1,
                textShadow: '0 0 5px #ff0000',
                transition: 'all 0.2s ease',
              }}
            >
              {sectionLabels[i]}
            </button>
          ))}
        </div>

        <button
          className="hamburger"
          style={{
            ...navButtonStyle,
            fontSize: '1.5rem',
            display: 'none',
          }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '3.5rem',
            right: '1rem',
            background: '#111',
            padding: '1rem',
            borderRadius: '0.5rem',
            boxShadow: '0 0 10px #ff0000',
            zIndex: 60,
          }}
        >
          {monitorIDs.map((id, i) => (
            <div key={id} style={{ marginBottom: '0.5rem' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleMonitorClick(id);
                }}
                style={{ ...navButtonStyle, fontSize: '1rem' }}
              >
                {sectionLabels[i]}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Box */}
      {mainVisible && (
        <div
          style={{
            flex: '0 1 85vw',
            maxWidth: '1000px',
            height: '100%',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16rem clamp(1rem, 4vw, 2rem) 2rem',
            background: 'rgba(255, 255, 255, 0.02)',
            boxShadow: '0 0 30px rgba(255, 0, 0, 0.1)',
            backdropFilter: 'blur(8px)',
            overflowY: 'auto',
            scrollbarWidth: 'none',        
            msOverflowStyle: 'none',       
            boxSizing: 'border-box',
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div
            style={{
              maxWidth: '800px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            
          <h1
            style={{
              background: 'linear-gradient(to right, #ff0000, #ff9900)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              margin: 0,
              textAlign: 'center',
            }}
          >
            Welcome, Explorer!
          </h1>

            <h2 style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', color: '#88f', margin: 0 }}>
              My name is
            </h2>

            <h1
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                color: '#00ffff',
                fontWeight: 'bold',
                margin: 0,
              }}
            >
              Aslam Azes
            </h1>

            <p
              style={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                color: '#ff00ff',
                margin: 0,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              Software Engineer/Fullstack Developer and Future Quantum Software Engineer
            </p>

            <p
              style={{
                fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                lineHeight: '1.6',
                color: '#ccc',
                margin: '1rem 0',
                maxWidth: '100%',
                overflowWrap: 'break-word',
              }}
            >
              This is just the main page of my <span style={{ color: '#00ffff', fontWeight: 'bold' }}>portfolio</span> website. To explore the site while also wanting to learn more about me, click
              <span
                style={{
                  color: '#ff4444',
                  fontWeight: 'bold',
                  margin: '0 0.25rem',
                }}
              >
                Back
              </span>
              on the top right to exit this monitor and use the page sliders to explore the other monitor's contents, or you can use the navbar up here to automatically take you to any of the other pages automatically. If you want to explore the outside environment for fun, you can just use the different view modes to see the cool space environment!
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderLeft: '4px solid #00ffff',
                padding: '1rem',
                marginTop: '1rem',
                fontStyle: 'italic',
                color: '#ccc',
              }}>
                “I love designing with code and pushing the edge of what's possible in the browser.”
              </div>
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                margin: '1rem 0',
                flexWrap: 'wrap',
              }}
            >
              <a
                href="/Aslam's Resume.pdf"
                download
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 16px #ffff00';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 8px #ffff00';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#ffff00',
                  color: '#000',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  boxShadow: '0 0 8px #ffff00',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  transition: 'all 0.2s ease',
                }}
              >
                Download CV
              </a>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('jumpToMonitor', { detail: 'CONTACTMONITOR' }));
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 12px #88f';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.5rem',
                  background: '#ffffff20',
                  border: '1px solid #88f',
                  color: '#88f',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  boxShadow: 'none',
                }}
                href="#"
              >
                Contact Info
              </a>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1.5rem',
                marginTop: '1rem',
              }}
            >
              <a
                href="https://github.com/aaa474"
                target="_blank"
                rel="noopener noreferrer"
                onMouseOver={(e) => {
                  e.currentTarget.children[0].style.filter = 'drop-shadow(0 0 6px #0ff) invert(1)';
                  e.currentTarget.children[0].style.transform = 'scale(1.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.children[0].style.filter = 'invert(1)';
                  e.currentTarget.children[0].style.transform = 'scale(1)';
                }}
              >
                <img
                  src="/Octicons-mark-github.svg"
                  alt="GitHub"
                  style={{
                    height: '30px',
                    filter: 'invert(1)',
                    transition: 'all 0.2s ease',
                  }}
                />
              </a>

              <a
                href="https://www.linkedin.com/in/aazes/"
                target="_blank"
                rel="noopener noreferrer"
                onMouseOver={(e) => {
                  e.currentTarget.children[0].style.filter = 'drop-shadow(0 0 6px #0ff)';
                  e.currentTarget.children[0].style.transform = 'scale(1.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.children[0].style.filter = 'invert(0)';
                  e.currentTarget.children[0].style.transform = 'scale(1)';
                }}
              >
                <img
                  src="/pngimg.com - linkedIn_PNG13.png"
                  alt="LinkedIn"
                  style={{
                    height: '30px',
                    filter: 'invert(0)',
                    transition: 'all 0.2s ease',
                  }}
                />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

<style>{`
  @keyframes blink {
    50% { opacity: 0; }
  }
`}</style>
