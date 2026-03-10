/**
 * src/components/Confetti.jsx
 * Mounts the canvas and exposes window.launchConfetti().
 * Called automatically when the timer reaches zero.
 */
import { useEffect, useRef } from 'react';

export default function Confetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const COLORS  = ['#e85d3c', '#1a472a', '#f0703f', '#ffd700', '#ff69b4', '#fff'];
    const COUNT   = 180;
    const DURATION = 6000;

    window.launchConfetti = function () {
      canvas.style.display = 'block';
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx       = canvas.getContext('2d');
      const particles = [];

      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x:     Math.random() * canvas.width,
          y:     -20,
          w:     Math.random() * 10 + 4,
          h:     Math.random() * 6  + 3,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          vy:    Math.random() * 3 + 2,
          vx:    (Math.random() - 0.5) * 3,
          angle: Math.random() * 360,
          spin:  (Math.random() - 0.5) * 6,
        });
      }

      let frame;
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        for (const p of particles) {
          p.y += p.vy; p.x += p.vx; p.angle += p.spin;
          if (p.y < canvas.height + 30) alive = true;
          ctx.save();
          ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
          ctx.rotate((p.angle * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
        if (alive) frame = requestAnimationFrame(draw);
        else { canvas.style.display = 'none'; }
      }
      draw();
      setTimeout(() => { cancelAnimationFrame(frame); canvas.style.display = 'none'; }, DURATION);
    };

    return () => { window.launchConfetti = null; };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, display: 'none' }}
    />
  );
}
