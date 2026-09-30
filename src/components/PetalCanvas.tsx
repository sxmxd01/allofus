import React, { useEffect, useRef } from 'react';

interface PetalCanvasProps {
  active: boolean;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  swaySpeed: number;
  swayDist: number;
  swayCounter: number;
}

export const PetalCanvas: React.FC<PetalCanvasProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Rose petals palette
    const colors = [
      'rgba(244, 114, 182, 0.75)', // pink-400
      'rgba(251, 113, 133, 0.75)', // rose-400
      'rgba(249, 168, 212, 0.7)',  // pink-300
      'rgba(225, 29, 72, 0.65)',   // rose-600
      'rgba(253, 164, 175, 0.8)',  // rose-300
    ];

    const petalCount = 28;
    const petals: Petal[] = Array.from({ length: petalCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: 10 + Math.random() * 12,
      speedY: 0.8 + Math.random() * 1.4,
      speedX: -0.5 + Math.random() * 1.0,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      opacity: 0.5 + Math.random() * 0.45,
      color: colors[Math.floor(Math.random() * colors.length)],
      swaySpeed: 0.02 + Math.random() * 0.02,
      swayDist: 15 + Math.random() * 25,
      swayCounter: Math.random() * Math.PI * 2,
    }));

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      // Draw smooth petal ellipse curve
      ctx.ellipse(0, 0, p.size * 0.6, p.size, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.swayCounter += p.swaySpeed;
        p.x += Math.sin(p.swayCounter) * 0.8 + p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        drawPetal(p);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-700"
      style={{ opacity: 0.85 }}
    />
  );
};
