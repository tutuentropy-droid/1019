import type { ParallelPersonality } from '@/types';

interface CausalChainPanelProps {
  personality: ParallelPersonality;
}

const FACTOR_LABELS: Record<keyof ParallelPersonality['factors'], { label: string; icon: string; color: string }> = {
  family: { label: '家庭', icon: '家', color: '#5B3FD9' },
  era: { label: '时代', icon: '时', color: '#00D4AA' },
  education: { label: '教育', icon: '育', color: '#E8A838' },
  trauma: { label: '创伤', icon: '伤', color: '#EF4444' },
  resources: { label: '资源', icon: '资', color: '#22D3EE' }
};

export default function CausalChainPanel({ personality }: CausalChainPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-white font-serif text-lg mb-3 flex items-center gap-2">
          <span className="text-nebula">◈</span>
          人格塑造因子
        </h4>
        <div className="grid grid-cols-5 gap-2">
          {(Object.entries(personality.factors) as [keyof ParallelPersonality['factors'], string][]).map(([key, val]) => {
            const meta = FACTOR_LABELS[key];
            return (
              <div
                key={key}
                className="p-2.5 rounded-xl bg-mist-50 border border-mist-100 text-center"
              >
                <div
                  className="w-7 h-7 rounded-lg mx-auto mb-1.5 flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: meta.color }}
                >
                  {meta.icon}
                </div>
                <div className="text-[10px] text-mist-400 font-mono mb-0.5">{meta.label}</div>
                <div className="text-xs text-mist-600 font-medium leading-tight">{val}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-white font-serif text-lg mb-4 flex items-center gap-2">
          <span className="text-chronos">◈</span>
          因果溯源时间线
        </h4>
        <div className="relative pl-6">
          <div
            className="absolute left-2 top-2 bottom-2 w-px"
            style={{
              background: `linear-gradient(180deg, ${personality.accentColor}aa, transparent)`
            }}
          />
          {personality.causalChain.map((event, i) => (
            <div key={i} className="relative mb-5 last:mb-0">
              <div
                className="absolute -left-[22px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                style={{
                  borderColor: personality.accentColor,
                  backgroundColor: '#0A0E1A'
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: personality.accentColor }}
                />
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span
                  className="font-mono text-sm font-bold"
                  style={{ color: personality.accentColor }}
                >
                  {event.age}岁
                </span>
                <span className="text-xs text-mist-400">关键节点</span>
              </div>
              <p className="text-mist-600 text-sm mb-1 leading-relaxed">{event.event}</p>
              <p className="text-mist-400 text-xs italic">→ {event.impact}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
