import type { ParallelPersonality, AgeStage } from '@/types';
import { User, Shirt, Home, MapPin, Quote, Swords, Scan } from 'lucide-react';
import AnimatedAvatar from './AnimatedAvatar';

interface Props {
  personality: ParallelPersonality;
}

const AGES: AgeStage[] = [20, 30, 40];

const AGE_LABELS: Record<AgeStage, string> = {
  20: '20岁',
  30: '30岁',
  40: '40岁'
};

export default function VisualDocumentaryCard({ personality }: Props) {
  const vd = personality.visualDocumentary;

  return (
    <div className="space-y-6">
      <div
        className="glass-card overflow-hidden animate-fade-in"
        style={{ border: `1px solid ${personality.accentColor}22` }}
      >
        <div
          className="h-2 w-full"
          style={{
            background: `linear-gradient(90deg, ${personality.accentColor}, ${personality.accentColor}66, transparent)`
          }}
        />

        <div className="p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <AnimatedAvatar
              archetype={personality.archetype}
              accentColor={personality.accentColor}
              size="lg"
              pose="idle"
              emotion="calm"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: personality.accentColor, boxShadow: `0 0 10px ${personality.accentColor}` }}
                />
                <h2 className="font-serif text-2xl font-bold text-white">
                  「{personality.codeName}」
                </h2>
              </div>
              <p className="text-mist-500 text-sm italic">{personality.tagline}</p>
            </div>
          </div>

          <div
            className="p-5 rounded-xl relative overflow-hidden mb-5"
            style={{ backgroundColor: '#0f172a', border: `1px solid ${personality.accentColor}33` }}
          >
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-3xl"
              style={{ backgroundColor: personality.accentColor }}
            />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Quote size={16} style={{ color: personality.accentColor }} />
                <span className="text-xs font-mono uppercase tracking-wider" style={{ color: personality.accentColor }}>
                  内心独白
                </span>
              </div>
              <p className="text-white/90 font-serif text-lg italic leading-relaxed">
                {vd.signatureMonologue}
              </p>
            </div>
          </div>

          <div
            className="p-4 rounded-xl mb-5"
            style={{ backgroundColor: personality.accentColor + '10', border: `1px solid ${personality.accentColor}22` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Scan size={14} style={{ color: personality.accentColor }} />
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color: personality.accentColor }}>
                角色剪影
              </span>
            </div>
            <p className="text-mist-300 text-sm italic leading-relaxed">{vd.characterSilhouette}</p>
          </div>

          <div className="mb-5">
            <div className="flex items-center gap-2 mb-4">
              <User size={16} style={{ color: personality.accentColor }} />
              <h3 className="text-white font-serif text-base font-medium">外观蜕变 · 20→30→40</h3>
            </div>
            <div className="relative">
              <div
                className="absolute left-6 top-0 bottom-0 w-px"
                style={{ backgroundColor: personality.accentColor + '33' }}
              />
              <div className="space-y-4">
                {AGES.map((age) => {
                  const ageKey = age === 20 ? 'age20' : age === 30 ? 'age30' : 'age40';
                  const desc = vd.appearanceEvolution[ageKey];
                  return (
                    <div key={age} className="relative pl-12">
                      <div
                        className="absolute left-3.5 top-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{
                          backgroundColor: personality.accentColor + '33',
                          color: personality.accentColor,
                          border: `1.5px solid ${personality.accentColor}66`
                        }}
                      >
                        {age}
                      </div>
                      <div className="p-3 rounded-xl bg-mist-50/60">
                        <div className="text-xs font-mono text-mist-400 mb-1">{AGE_LABELS[age]}</div>
                        <p className="text-mist-600 text-xs leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="p-4 rounded-xl bg-mist-50/60">
              <div className="flex items-center gap-2 mb-2">
                <Shirt size={14} className="text-chronos" />
                <span className="text-xs font-mono uppercase tracking-wider text-chronos">穿衣风格</span>
              </div>
              <p className="text-mist-600 text-sm leading-relaxed">{vd.dressStyle}</p>
            </div>
            <div className="p-4 rounded-xl bg-mist-50/60">
              <div className="flex items-center gap-2 mb-2">
                <Home size={14} className="text-nebula" />
                <span className="text-xs font-mono uppercase tracking-wider text-nebula">生活空间</span>
              </div>
              <p className="text-mist-600 text-sm leading-relaxed">{vd.livingSpace}</p>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} style={{ color: personality.accentColor }} />
              <h3 className="text-white font-serif text-base font-medium">常出现的场景</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {vd.frequentScenes.map((scene, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl relative overflow-hidden"
                  style={{ backgroundColor: personality.accentColor + (10 + i * 5).toString(16) }}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                      style={{ backgroundColor: personality.accentColor + '33', color: personality.accentColor }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-mist-200 text-xs leading-relaxed">{scene}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="glass-card p-5 md:p-6 animate-fade-in"
        style={{ animationDelay: '0.1s', border: `1px solid ${personality.accentColor}22` }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Swords size={18} style={{ color: personality.accentColor }} />
          <h3 className="text-white font-serif text-lg">人格冲突光谱</h3>
        </div>

        <div className="space-y-5">
          {vd.conflictAxes.map((axis, i) => (
            <div key={i} className="p-4 rounded-xl bg-mist-50/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: personality.accentColor }}>
                  {axis.leftLabel}
                </span>
                <span className="text-xs font-mono text-mist-400">
                  冲突强度 {axis.intensity}%
                </span>
                <span className="text-xs font-medium" style={{ color: personality.accentColor }}>
                  {axis.rightLabel}
                </span>
              </div>
              <div className="relative h-2.5 bg-mist-100 rounded-full overflow-hidden mb-3">
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${axis.intensity}%`,
                    background: `linear-gradient(90deg, ${personality.accentColor}88, ${personality.accentColor})`
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 transition-all duration-1000"
                  style={{
                    left: `calc(${axis.intensity}% - 7px)`,
                    borderColor: personality.accentColor,
                    backgroundColor: '#0f172a',
                    boxShadow: `0 0 8px ${personality.accentColor}66`
                  }}
                />
              </div>
              <p className="text-mist-500 text-xs leading-relaxed italic">{axis.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="glass-card p-5 md:p-6 animate-fade-in"
        style={{ animationDelay: '0.15s', border: `1px solid ${personality.accentColor}22` }}
      >
        <div className="text-center">
          <div className="text-xs font-mono text-mist-400 uppercase tracking-wider mb-3">
            可直接用于短视频/插画分镜
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            {AGES.map((age, i) => {
              const ageKey = age === 20 ? 'age20' : age === 30 ? 'age30' : 'age40';
              const desc = vd.appearanceEvolution[ageKey];
              return (
                <div key={age} className="text-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-serif text-sm font-bold mb-1.5 mx-auto"
                    style={{
                      backgroundColor: personality.accentColor + '22',
                      color: personality.accentColor,
                      border: `1px solid ${personality.accentColor}44`
                    }}
                  >
                    {age}
                  </div>
                  <p className="text-mist-500 text-[10px] max-w-[80px] leading-snug mx-auto line-clamp-3">
                    {desc.slice(0, 20)}…
                  </p>
                </div>
              );
            })}
          </div>
          <div className="divider-gradient mb-4" />
          <p className="text-mist-400 text-[10px] font-mono uppercase tracking-wider mb-2">
            世界线标识
          </p>
          <div
            className="inline-block px-4 py-2 rounded-full"
            style={{
              backgroundColor: personality.accentColor + '15',
              border: `1px solid ${personality.accentColor}33`
            }}
          >
            <span className="font-serif text-sm" style={{ color: personality.accentColor }}>
              「{personality.codeName}」· {personality.lifeTimeline.poster.worldlineName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
