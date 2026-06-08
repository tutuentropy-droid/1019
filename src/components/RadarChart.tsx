import type { BigFive, ParallelPersonality } from '@/types';

interface RadarChartProps {
  personalities: ParallelPersonality[];
  width?: number;
  height?: number;
}

const DIMENSIONS: { key: keyof BigFive; label: string }[] = [
  { key: 'openness', label: '开放性' },
  { key: 'conscientiousness', label: '尽责性' },
  { key: 'extraversion', label: '外向性' },
  { key: 'agreeableness', label: '宜人性' },
  { key: 'neuroticism', label: '神经质' }
];

function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

export default function RadarChart({ personalities, width = 420, height = 420 }: RadarChartProps) {
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = Math.min(width, height) / 2 - 50;
  const levels = 5;
  const angleStep = 360 / DIMENSIONS.length;

  const renderGrid = () => {
    const lines = [];
    for (let i = 1; i <= levels; i++) {
      const r = (maxRadius / levels) * i;
      const points = DIMENSIONS.map((_, j) => {
        const pos = polarToCartesian(cx, cy, r, j * angleStep);
        return `${pos.x},${pos.y}`;
      }).join(' ');
      lines.push(
        <polygon
          key={`grid-${i}`}
          points={points}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      );
    }
    return lines;
  };

  const renderAxes = () =>
    DIMENSIONS.map((_, j) => {
      const pos = polarToCartesian(cx, cy, maxRadius, j * angleStep);
      return (
        <line
          key={`axis-${j}`}
          x1={cx}
          y1={cy}
          x2={pos.x}
          y2={pos.y}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      );
    });

  const renderLabels = () =>
    DIMENSIONS.map((dim, j) => {
      const pos = polarToCartesian(cx, cy, maxRadius + 28, j * angleStep);
      return (
        <text
          key={`label-${j}`}
          x={pos.x}
          y={pos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.6)"
          fontSize="13"
          fontFamily="'Noto Sans SC', sans-serif"
        >
          {dim.label}
        </text>
      );
    });

  const renderPersonalityPolygon = (p: ParallelPersonality, index: number) => {
    const points = DIMENSIONS.map((dim, j) => {
      const value = p.bigFive[dim.key];
      const r = (value / 100) * maxRadius;
      const pos = polarToCartesian(cx, cy, r, j * angleStep);
      return `${pos.x},${pos.y}`;
    }).join(' ');

    return (
      <g key={p.id} style={{ opacity: 0.85 }}>
        <polygon
          points={points}
          fill={p.accentColor}
          fillOpacity="0.12"
          stroke={p.accentColor}
          strokeWidth="2"
          style={{
            filter: `drop-shadow(0 0 8px ${p.accentColor}55)`,
            animation: `fadeInUp 0.8s ease-out ${index * 0.15}s both`
          }}
        />
      </g>
    );
  };

  const renderDots = (p: ParallelPersonality) =>
    DIMENSIONS.map((dim, j) => {
      const value = p.bigFive[dim.key];
      const r = (value / 100) * maxRadius;
      const pos = polarToCartesian(cx, cy, r, j * angleStep);
      return (
        <circle
          key={`dot-${p.id}-${j}`}
          cx={pos.x}
          cy={pos.y}
          r="3.5"
          fill={p.accentColor}
          style={{ filter: `drop-shadow(0 0 4px ${p.accentColor})` }}
        />
      );
    });

  return (
    <div className="w-full flex flex-col items-center">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(91,63,217,0.08)" />
            <stop offset="100%" stopColor="rgba(91,63,217,0)" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={maxRadius + 10} fill="url(#radarGlow)" />
        {renderGrid()}
        {renderAxes()}
        {renderLabels()}
        {personalities.map((p, i) => renderPersonalityPolygon(p, i))}
        {personalities.map((p) => renderDots(p))}
      </svg>
      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 justify-center">
        {personalities.map((p) => (
          <div key={p.id} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: p.accentColor, boxShadow: `0 0 8px ${p.accentColor}` }}
            />
            <span className="text-mist-500 text-sm font-mono">
              {p.codeName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
