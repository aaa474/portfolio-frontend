import { useEffect, useState } from 'react';

export default function SpinningStar({ baseImg, visible }) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [rotation, setRotation] = useState(0);
  const [dataUrl, setDataUrl] = useState(null);

  const hue = Math.floor(Math.random() * 360);
  const glowColor = `hsl(${hue}, 100%, 65%)`;
  const fillColor = `hsl(${hue}, 100%, 60%)`;

  useEffect(() => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top, left;
  do {
    top = Math.random() * vh;
    left = Math.random() * vw;
  } while (
    top > vh * 0.3 &&
    top < vh * 0.7 &&
    left > vw * 0.25 &&
    left < vw * 0.75
  );

  setPosition({ top, left });

  if (baseImg && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      const canvas = document.createElement('canvas');
      canvas.width = baseImg.width;
      canvas.height = baseImg.height;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = fillColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(baseImg, 0, 0);

      setDataUrl(canvas.toDataURL());
    });
  }
}, [baseImg]);


  const handleClick = () => {
    let spin = 0;
    const interval = setInterval(() => {
      spin += 10;
      setRotation(spin);
      if (spin >= 360) clearInterval(interval);
    }, 16);
  };

  if (!visible || !dataUrl) return null;

  return (
    <img
      onClick={handleClick}
      src={dataUrl}
      alt="star"
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        width: '40px',
        height: '40px',
        zIndex: -2,
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.1s linear',
        pointerEvents: 'auto',
        filter: `drop-shadow(0 0 6px ${glowColor})`,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    />
  );
}
