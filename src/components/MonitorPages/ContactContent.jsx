import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import SpinningStar from './SpinningStar';

export default function ContactContent({ currentIndex }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [showStars, setShowStars] = useState(true);

  const baseImageRef = useRef(null);
  const [baseImgLoaded, setBaseImgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/pngimg.com - star_PNG41515.png';
    img.onload = () => {
      baseImageRef.current = img;
      setBaseImgLoaded(true);
    };
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

  const sectionLabels = ['Main', 'About', 'Experience', 'Projects', 'Contact'];
  const monitorIDs = ['MAINPAGEMONITOR', 'ABOUTMEMONITOR', 'EXPERIENCEMONITOR', 'PROJECTSMONITOR', 'CONTACTMONITOR'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${API_URL}/api/contact`, formData);
      if (res.data.success) {
        setStatus('Message sent!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('Failed to send. Try again.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error sending message.');
    }
  };

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
      {/* 3D Stars in background */}
      <Canvas
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -3,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <Stars radius={50} depth={20} count={3000} fade />
      </Canvas>

      {/* Colorful glowing PNG stars */}
      {showStars && baseImgLoaded &&
        [...Array(5)].map((_, i) => (
          <SpinningStar key={i} baseImg={baseImageRef.current} visible={true} />
        ))}

      {/* Toggle Stars Button */}
      <button
        onClick={() => setShowStars(!showStars)}
        style={{
          position: 'fixed',
          top: '4rem',
          left: '1rem',
          zIndex: 10,
          padding: '0.5rem 1rem',
          background: '#111',
          color: 'white',
          border: '1px solid #0ff',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontWeight: 'bold',
          textShadow: '0 0 4px #0ff',
        }}
      >
        {showStars ? 'Hide Stars' : 'Show Stars'}
      </button>

      <style>
        {`
          @keyframes pulse {
            0% { text-shadow: 0 0 5px #00ffff; }
            50% { text-shadow: 0 0 20px #00ffff; }
            100% { text-shadow: 0 0 5px #00ffff; }
          }
        `}
      </style>

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
        <div style={{ color: '#00ffff', fontWeight: 'bold', fontSize: '1.25rem' }}>
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
                if (i !== 4) { 
                  window.dispatchEvent(new CustomEvent('jumpToMonitor', { detail: id }));
                }
              }}
              disabled={i === 4}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: i === 4 ? 'not-allowed' : 'pointer',
                opacity: i === 4 ? 0.4 : 1,
                textShadow: '0 0 5px #00ffff',
                transition: 'all 0.2s ease',
              }}
            >
              {sectionLabels[i]}
            </button>
          ))}

        </div>
      </div>

      {/* Contact Form Box */}
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
          padding: '6rem clamp(1rem, 4vw, 2rem) 2rem',
          background: 'rgba(255, 255, 255, 0.02)',
          boxShadow: '0 0 30px rgba(0, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <h1
            style={{
              background: 'linear-gradient(to right, #00FFFF,rgb(162, 251, 251))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              textAlign: 'center',
            }}
          >
            Get in Touch
          </h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
            <button
              type="submit"
              style={{
                background: '#00ffff',
                color: '#000',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem',
                cursor: 'pointer',
                transition: 'background 0.3s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#00cccc')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#00ffff')}
            >
              Send Message
            </button>
          </form>

          {status && (
            <p
              style={{
                textAlign: 'center',
                marginTop: '1rem',
                color: status.startsWith('Message sent') ? '#00ffcc' : '#ff4444',
                fontWeight: 'bold',
              }}
            >
              {status}
            </p>
          )}

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <a href="mailto:aazespf@gmail.com" style={linkStyle}>
              Email
            </a>
            |
            <a href="https://linkedin.com/in/aazes" style={linkStyle} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            |
            <a href="https://github.com/aaa474" style={linkStyle} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '1px solid #555',
  borderRadius: '8px',
  background: '#2a2a3d',
  color: '#fff',
  fontSize: '1rem',
  fontFamily: 'Space Nova, sans-serif',
};

const linkStyle = {
  color: '#00ffff',
  margin: '0 0.5rem',
  textDecoration: 'none',
  fontWeight: 'bold',
};
