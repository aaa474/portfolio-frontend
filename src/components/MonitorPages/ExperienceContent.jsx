import { useEffect, useState } from 'react';
import SwimmingDuckCanvas from './SwimmingDuckCanvas';

const navButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'yellow',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
  textShadow: '0 0 5px yellow',
  transition: 'all 0.2s ease',
};

  const boxStyle = {
  background: 'rgba(0, 0, 0, 0.65)',
  padding: '1.5rem',
  borderRadius: '8px',
  border: '1px solid rgba(251, 255, 0, 0.2)', 
  boxShadow: '0 0 30px rgba(255, 247, 0, 0.1)',
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
    color: 'yellow',
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

export default function ExperienceContent({ currentIndex }) {
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [experienceVisible, setExperienceVisible] = useState(true);

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
        backgroundImage: 'url(/360_F_637915894_xioRfH3tMwJ7EopQqoGCe5dkzjPYMJLx.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        zIndex: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* Water and Ducks Layer */}
      <SwimmingDuckCanvas />

      {/* Toggle Button */}
      <div
        style={{
          position: 'fixed',
          top: '4.5rem',
          right: '1rem',
          zIndex: 60,
        }}
      >
        <button
          onClick={() => setExperienceVisible((v) => !v)}
          style={{
            backgroundColor: '#00000099',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            textShadow: '0 0 4px #FFFF00',
          }}
        >
          {experienceVisible ? 'Hide Experience' : 'Show Experience'}
        </button>
      </div>

      {/* Experience Box */}
      {experienceVisible && (
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
            className="custom-scrollbar"
          >
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            <div
              style={{
                maxWidth: '800px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                margin: '0 auto',
              }}
            >
              <h1
                style={{
                  background: 'linear-gradient(to right, #FFFF00, #FFFF99)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  textAlign: 'center',
                }}
              >
                Experience
              </h1>

              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.65)',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 0, 0.2)', 
                  boxShadow: '0 0 30px rgba(255, 255, 0, 0.1)',
                }}
              >
                <h2
                  style={{
                    color: '#ffce18',
                    marginBottom: '0.25rem',
                    
                  }}
                >
                  Laboratory Assistant
                </h2>
                <p style={{ color: '#b0d7ff', margin: 0, fontWeight: '500' }}>
                  The Ernest Mario School of Pharmacy | Sep 2022 - Aug 2023
                </p>
                <ul
                  style={{
                    marginTop: '0.5rem',
                    paddingLeft: '1.25rem',
                    color: '#fff',
                    lineHeight: '1.6',
                  }}
                >
                  <li>
                    Maintained 100+ confidential laboratory and student records to ensure accurate documentation and compliance with data privacy regulations
                  </li>
                  <li>
                    Assisted in the handling, disposal, and storage of chemicals adhering to lab safety protocols to minimize hazards
                  </li>
                  <li>
                    Collaborated with a team to trim laboratory operations, reducing inefficiencies and improving workflow
                  </li>
                  <li>
                    Implemented a structured filing system in Excel for student records, improving accessibility and retrieval speeds
                  </li>
                </ul>
              </div>
              <div style={boxStyle}>
                <h2 style={subheadingStyle}> P.S, you can click on the swimming ducks to hear them quack. Feel free to hide this entire box to watch them swim away :)</h2>
              </div>

              <div style={{ paddingBottom: '2rem' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
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
        <div style={{ color: '#ffff00', fontWeight: 'bold', fontSize: '1.25rem' }}>
          Aslam Azes
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginRight: '4.5rem' }}>
          {monitorIDs.map((id, i) => (
            <button
              key={id}
              onClick={() => {
                if (i !== 2) {
                  window.dispatchEvent(new CustomEvent('jumpToMonitor', { detail: id }));
                }
              }}
              disabled={i === 2}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: i === 2 ? 'not-allowed' : 'pointer',
                opacity: i === 2 ? 0.4 : 1,
                textShadow: '0 0 5px #FFff00',
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
