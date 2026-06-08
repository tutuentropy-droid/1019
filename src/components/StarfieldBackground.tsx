import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  twinkle: number;
  twinkleSpeed: number;
  color: string;
}

const STAR_COLORS = [
  'rgba(255, 255, 255, ',
  'rgba(180, 170, 255, ',
  'rgba(255, 220, 180, ',
  'rgba(170, 220, 255, '
];

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const starCount = Math.min(300, Math.floor((window.innerWidth * window.innerHeight) / 6000));
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1 + 0.3,
        size: Math.random() * 1.8 + 0.3,
        speed: Math.random() * 0.08 + 0.02,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.03 + 0.005,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]
      });
    }
    starsRef.current = stars;

    const render = () => {
      ctx.fillStyle = '#050810';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.2, canvas.height * 0.3, 0,
        canvas.width * 0.2, canvas.height * 0.3, Math.max(canvas.width, canvas.height) * 0.5
      );
      gradient1.addColorStop(0, 'rgba(91, 63, 217, 0.12)');
      gradient1.addColorStop(1, 'rgba(91, 63, 217, 0)');
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.8, canvas.height * 0.7, 0,
        canvas.width * 0.8, canvas.height * 0.7, Math.max(canvas.width, canvas.height) * 0.4
      );
      gradient2.addColorStop(0, 'rgba(0, 212, 170, 0.08)');
      gradient2.addColorStop(1, 'rgba(0, 212, 170, 0)');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const star of starsRef.current) {
        star.twinkle += star.twinkleSpeed;
        star.y += star.speed * star.z;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        const alpha = 0.4 + Math.sin(star.twinkle) * 0.4;
        ctx.fillStyle = `${star.color}${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * star.z, 0, Math.PI * 2);
        ctx.fill();

        if (star.z > 0.8 && Math.sin(star.twinkle) > 0.7) {
          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
          glow.addColorStop(0, `${star.color}${alpha * 0.4})`);
          glow.addColorStop(1, `${star.color}0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: '#050810' }}
    />
  );
}
