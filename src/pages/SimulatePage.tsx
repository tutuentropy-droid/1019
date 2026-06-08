import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { runSimulation } from '@/utils/simulationEngine';

const FACTOR_TAGS = [
  { label: '家庭环境', color: '#5B3FD9' },
  { label: '时代背景', color: '#00D4AA' },
  { label: '教育经历', color: '#E8A838' },
  { label: '创伤事件', color: '#EF4444' },
  { label: '资源禀赋', color: '#22D3EE' }
];

const STAGES = [
  { threshold: 10, text: '正在解析人格种子……' },
  { threshold: 25, text: '采样环境因子矩阵……' },
  { threshold: 45, text: '推演蝴蝶效应路径……' },
  { threshold: 65, text: '合成平行人格版本……' },
  { threshold: 85, text: '构建因果溯源链条……' },
  { threshold: 100, text: '推演完成' }
];

export default function SimulatePage() {
  const progress = useAppStore((s) => s.simulationProgress);
  const store = useAppStore;
  const startedRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<{ x: number; y: number; vx: number; vy: number; r: number; color: string; label: string }[]>([]);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const st = store.getState();
    st.setIsSimulating(true);
    st.setSimulationProgress(0);

    let currentProgress = 0;
    const interval = window.setInterval(() => {
      currentProgress += Math.random() * 12 + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        window.clearInterval(interval);
        const curState = store.getState();
        const result = runSimulation(curState.input);
        curState.setPersonalities(result);
        window.setTimeout(() => {
          const s = store.getState();
          s.setStage('result');
          s.setIsSimulating(false);
        }, 500);
      }
      store.getState().setSimulationProgress(currentProgress);
    }, 220);

    return () => window.clearInterval(interval);
  }, [store]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    if (nodesRef.current.length === 0) {
      for (let i = 0; i < 14; i++) {
        const factor = FACTOR_TAGS[i % FACTOR_TAGS.length];
        nodesRef.current.push({
          x: W() / 2 + (Math.random() - 0.5) * 200,
          y: H() / 2 + (Math.random() - 0.5) * 200,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 5 + 3,
          color: factor.color,
          label: factor.label
        });
      }
    }

    let raf = 0;
    const render = () => {
      ctx.clearRect(0, 0, W(), H());

      const cx = W() / 2;
      const cy = H() / 2;

      const progressRatio = progress / 100;
      const spreadRadius = 80 + progressRatio * 160;

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, spreadRadius * 1.5);
      glow.addColorStop(0, `rgba(91, 63, 217, ${0.15 + progressRatio * 0.2})`);
      glow.addColorStop(0.5, `rgba(0, 212, 170, ${0.05 + progressRatio * 0.1})`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W(), H());

      for (let ring = 0; ring < 3; ring++) {
        const ringRadius = 40 + ring * 50 + progressRatio * 80;
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(91, 63, 217, ${0.08 + (1 - progressRatio) * 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const nodePositions: { x: number; y: number; color: string }[] = [];
      for (const node of nodesRef.current) {
        node.x += node.vx + (cx - node.x) * 0.003;
        node.y += node.vy + (cy - node.y) * 0.003;

        const angle = Math.atan2(node.y - cy, node.x - cx);
        const dist = Math.hypot(node.x - cx, node.y - cy);
        const targetDist = 60 + progressRatio * 150 + Math.sin(Date.now() / 1000 + node.r * 10) * 10;
        if (dist > 0) {
          node.x = cx + Math.cos(angle) * targetDist;
          node.y = cy + Math.sin(angle) * targetDist;
        }

        nodePositions.push({ x: node.x, y: node.y, color: node.color });

        const nodeGlow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r * 4);
        nodeGlow.addColorStop(0, node.color + 'aa');
        nodeGlow.addColorStop(1, node.color + '00');
        ctx.fillStyle = nodeGlow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < nodePositions.length; i++) {
        for (let j = i + 1; j < nodePositions.length; j++) {
          const a = nodePositions[i];
          const b = nodePositions[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 140) {
            const alpha = (1 - d / 140) * 0.3 * progressRatio;
            ctx.strokeStyle = `rgba(160, 150, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      const coreSize = 16 + progressRatio * 12 + Math.sin(Date.now() / 300) * 3;
      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreSize * 3);
      coreGlow.addColorStop(0, 'rgba(255,255,255,0.9)');
      coreGlow.addColorStop(0.3, 'rgba(124, 102, 232, 0.6)');
      coreGlow.addColorStop(1, 'rgba(124, 102, 232, 0)');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, coreSize * 3, 0, Math.PI * 2);
      ctx.fill();

      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreSize);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.4, '#7C66E8');
      coreGrad.addColorStop(1, '#5B3FD9');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreSize, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(render);
    };
    render();

    const pulseInt = setInterval(() => setPulse((p) => p + 1), 2000);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
      clearInterval(pulseInt);
    };
  }, [progress, pulse]);

  const currentStage = STAGES.find((s, i) => {
    const next = STAGES[i + 1];
    return progress >= s.threshold && (!next || progress < next.threshold);
  }) || STAGES[STAGES.length - 1];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10">
      <div className="w-full max-w-2xl">
        <div ref={(el) => el && el.setAttribute('data-pulse', String(pulse))} className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-[420px] rounded-3xl"
            style={{ background: 'radial-gradient(ellipse at center, #121826 0%, #0A0E1A 70%)' }}
          />
        </div>

        <div className="text-center mt-8 mb-6">
          <p className="text-white font-serif text-xl mb-2 animate-pulse">
            {currentStage.text}
          </p>
          <p className="text-mist-400 text-sm font-mono">
            正在为你推演 {store.getState().input.personalityCount} 个平行人格版本
          </p>
        </div>

        <div className="mb-8">
          <div className="relative h-2 rounded-full bg-mist-50 overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #5B3FD9 0%, #00D4AA 50%, #E8A838 100%)',
                boxShadow: '0 0 20px rgba(124, 102, 232, 0.6)'
              }}
            />
          </div>
          <div className="text-right mt-2">
            <span className="text-mist-500 font-mono text-sm">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {FACTOR_TAGS.map((f, i) => (
            <span
              key={f.label}
              className="px-3 py-1.5 rounded-full text-xs font-medium border"
              style={{
                borderColor: f.color + '66',
                color: f.color,
                backgroundColor: f.color + '15',
                opacity: progress > 20 ? 1 : 0.3,
                transition: `opacity 0.6s ease ${i * 0.1}s`
              }}
            >
              {f.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
