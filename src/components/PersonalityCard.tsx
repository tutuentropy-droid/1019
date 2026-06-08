import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ParallelPersonality } from '@/types';
import { useAppStore } from '@/store/useAppStore';

interface PersonalityCardProps {
  personality: ParallelPersonality;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}

const DIMENSION_LABELS: Record<keyof ParallelPersonality['bigFive'], string> = {
  openness: '开放性',
  conscientiousness: '尽责性',
  extraversion: '外向性',
  agreeableness: '宜人性',
  neuroticism: '神经质'
};

export default function PersonalityCard({ personality, index, expanded, onToggle }: PersonalityCardProps) {
  const setSelected = useAppStore((s) => s.setSelectedPersonality);
  const selectedId = useAppStore((s) => s.selectedPersonalityId);
  const isSelected = selectedId === personality.id;

  return (
    <div
      className={`glass-card overflow-hidden transition-all duration-500 cursor-pointer
        ${isSelected ? 'ring-2 ring-offset-2 ring-offset-cosmos-900' : ''}
        hover:transform hover:-translate-y-1`}
      style={{
        animation: 'fadeInUp 0.7s ease-out both',
        animationDelay: `${index * 0.12}s`,
        ...(isSelected ? { boxShadow: `0 0 30px ${personality.accentColor}55` } : {})
      }}
      onClick={() => setSelected(personality.id)}
    >
      <div
        className="h-2 w-full"
        style={{
          background: `linear-gradient(90deg, ${personality.accentColor}cc, ${personality.accentColor}66, transparent)`
        }}
      />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: personality.accentColor, boxShadow: `0 0 10px ${personality.accentColor}` }}
              />
              <h3 className="font-serif text-xl font-bold text-white tracking-wide">
                「{personality.codeName}」
              </h3>
            </div>
            <p className="text-mist-500 text-sm italic">{personality.tagline}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="p-1.5 rounded-lg bg-mist-50 hover:bg-mist-100 text-mist-500 transition-colors"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        <div className="grid grid-cols-5 gap-1.5 mb-4">
          {(Object.entries(personality.bigFive) as [keyof ParallelPersonality['bigFive'], number][]).map(([key, val]) => (
            <div key={key} className="text-center">
              <div className="text-[10px] text-mist-400 mb-1 font-mono">{DIMENSION_LABELS[key]}</div>
              <div className="h-10 w-full bg-mist-50 rounded-full overflow-hidden relative">
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    height: `${val}%`,
                    background: `linear-gradient(180deg, ${personality.accentColor}44, ${personality.accentColor})`
                  }}
                />
              </div>
              <div className="text-[10px] text-mist-500 mt-1 font-mono">{Math.round(val)}</div>
            </div>
          ))}
        </div>

        {expanded && (
          <div className="space-y-4 pt-4 border-t border-mist-100 animate-fade-in">
            <div>
              <div className="text-xs font-mono text-chronos uppercase tracking-wider mb-1.5">性格画像</div>
              <p className="text-mist-600 text-sm leading-relaxed">{personality.personality}</p>
            </div>

            <div>
              <div className="text-xs font-mono text-chronos uppercase tracking-wider mb-1.5">口头禅</div>
              <div className="space-y-1.5">
                {personality.catchphrase.map((c, i) => (
                  <div
                    key={i}
                    className="text-ember text-sm font-serif italic bg-mist-50 px-3 py-1.5 rounded-lg inline-block mr-2 mb-1"
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-mono text-chronos uppercase tracking-wider mb-1.5">核心价值观</div>
              <ul className="space-y-1">
                {personality.values.map((v, i) => (
                  <li key={i} className="text-mist-600 text-sm flex items-start gap-2">
                    <span className="text-nebula mt-0.5">◆</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-xs font-mono text-chronos uppercase tracking-wider mb-1.5">关键人生选择</div>
              <ul className="space-y-1.5">
                {personality.lifeChoices.map((lc, i) => (
                  <li key={i} className="text-mist-600 text-sm flex items-start gap-2">
                    <span className="text-chronos mt-0.5 font-mono text-xs">0{i + 1}</span>
                    <span>{lc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-xs font-mono text-chronos uppercase tracking-wider mb-1.5">典型内在矛盾</div>
              <ul className="space-y-1.5">
                {personality.contradictions.map((c, i) => (
                  <li key={i} className="text-mist-600 text-sm flex items-start gap-2">
                    <span className="text-nebula mt-0.5">⇌</span>
                    <span className="italic">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
