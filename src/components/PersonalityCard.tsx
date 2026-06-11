import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ParallelPersonality } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import AnimatedAvatar from './AnimatedAvatar';

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
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 -mt-1">
              <AnimatedAvatar
                archetype={personality.archetype}
                accentColor={personality.accentColor}
                size="md"
                pose="idle"
                emotion="calm"
              />
            </div>
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
          <div className="space-y-5 pt-4 border-t border-mist-100 animate-fade-in">
            <div className="relative">
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                style={{ backgroundColor: personality.accentColor }}
              />
              <div className="pl-4">
                <div className="text-xs font-mono text-chronos uppercase tracking-wider mb-2">成长背景</div>
                <p className="text-mist-600 text-sm leading-relaxed">{personality.profile.background}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-mist-50/50">
                <div className="text-xs font-mono text-chronos uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-chronos" />
                  核心驱动力
                </div>
                <p className="text-mist-600 text-sm leading-relaxed">{personality.profile.coreMotivation}</p>
              </div>
              <div className="p-4 rounded-xl bg-mist-50/50">
                <div className="text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#EF4444' }}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#EF4444' }} />
                  最大的恐惧
                </div>
                <p className="text-mist-600 text-sm leading-relaxed">{personality.profile.greatestFear}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl" style={{ backgroundColor: personality.accentColor + '10' }}>
              <div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: personality.accentColor }}>
                日常行为模式
              </div>
              <p className="text-mist-600 text-sm leading-relaxed">{personality.profile.dailyPattern}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-mist-50/50">
                <div className="text-xs font-mono text-nebula uppercase tracking-wider mb-1.5">爱情观</div>
                <p className="text-mist-600 text-xs leading-relaxed">{personality.profile.loveView}</p>
              </div>
              <div className="p-3 rounded-xl bg-mist-50/50">
                <div className="text-xs font-mono text-ember uppercase tracking-wider mb-1.5">消费观</div>
                <p className="text-mist-600 text-xs leading-relaxed">{personality.profile.consumptionView}</p>
              </div>
              <div className="p-3 rounded-xl bg-mist-50/50">
                <div className="text-xs font-mono text-chronos uppercase tracking-wider mb-1.5">工作风格</div>
                <p className="text-mist-600 text-xs leading-relaxed">{personality.profile.workStyle}</p>
              </div>
            </div>

            <div>
              <div className="text-xs font-mono text-chronos uppercase tracking-wider mb-1.5">口头禅</div>
              <div className="flex flex-wrap gap-1.5">
                {personality.catchphrase.map((c, i) => (
                  <div
                    key={i}
                    className="text-ember text-sm font-serif italic bg-mist-50 px-3 py-1.5 rounded-lg"
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="relative pt-4">
              <div className="divider-gradient mb-5" />
              <div
                className="absolute left-1/2 -translate-x-1/2 -top-0.5 px-3 py-0.5 rounded-full text-xs font-mono font-medium"
                style={{
                  backgroundColor: '#EF4444' + '22',
                  color: '#EF4444'
                }}
              >
                · 得失账本 · 人生资源交换清单 ·
              </div>
              <div className="pt-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className="p-4 rounded-xl border-l-4"
                    style={{ backgroundColor: '#10B981' + '10', borderColor: '#10B981' }}
                  >
                    <div className="text-xs font-mono uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#10B981' }}>
                      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#10B981' }} />
                      ✦ 得到了什么（贷方）
                    </div>
                    <ul className="space-y-3">
                      {personality.lifeTradeOff.gains.map((g, i) => (
                        <li key={i} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block px-2 py-0.5 rounded text-[10px] font-mono"
                              style={{
                                backgroundColor: g.weight === 'heavy' ? '#10B98133' : g.weight === 'medium' ? '#10B98122' : '#10B98111',
                                color: '#10B981'
                              }}
                            >
                              {g.weight === 'heavy' ? '重量级' : g.weight === 'medium' ? '中量级' : '轻量级'}
                            </span>
                            <span className="text-white text-sm font-medium">{g.label}</span>
                          </div>
                          <p className="text-mist-500 text-xs leading-relaxed pl-1">{g.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className="p-4 rounded-xl border-l-4"
                    style={{ backgroundColor: '#EF4444' + '10', borderColor: '#EF4444' }}
                  >
                    <div className="text-xs font-mono uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#EF4444' }}>
                      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#EF4444' }} />
                      ✦ 失去了什么（借方）
                    </div>
                    <ul className="space-y-3">
                      {personality.lifeTradeOff.losses.map((l, i) => (
                        <li key={i} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block px-2 py-0.5 rounded text-[10px] font-mono"
                              style={{
                                backgroundColor: l.weight === 'heavy' ? '#EF444433' : l.weight === 'medium' ? '#EF444422' : '#EF444411',
                                color: '#EF4444'
                              }}
                            >
                              {l.weight === 'heavy' ? '重量级' : l.weight === 'medium' ? '中量级' : '轻量级'}
                            </span>
                            <span className="text-white text-sm font-medium">{l.label}</span>
                          </div>
                          <p className="text-mist-500 text-xs leading-relaxed pl-1">{l.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: personality.accentColor + '10', borderLeft: `3px solid ${personality.accentColor}` }}
                >
                  <div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: personality.accentColor }}>
                    ∑ 交换公式
                  </div>
                  <p className="text-mist-200 text-sm font-serif italic leading-relaxed">
                    {personality.lifeTradeOff.exchangeFormula}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-l-4 border-amber-500">
                  <div className="text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5 text-amber-500">
                    <span>⚠</span>
                    隐性成本（对账单上看不到的那一行）
                  </div>
                  <p className="text-mist-400 text-sm leading-relaxed">
                    {personality.lifeTradeOff.hiddenCost}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-mist-50/50">
                  <div className="text-xs font-mono text-nebula uppercase tracking-wider mb-3">
                    ✦ 未完成事项清单 · 那些这辈子都会欠着的遗憾
                  </div>
                  <ul className="space-y-2.5">
                    {personality.lifeTradeOff.regrets.map((r, i) => (
                      <li key={i} className="text-mist-600 text-sm flex items-start gap-2.5">
                        <span className="text-amber-500 mt-0.5 flex-shrink-0">✗</span>
                        <span className="italic leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="relative pt-3">
              <div className="divider-gradient mb-4" />
              <div
                className="absolute left-1/2 -translate-x-1/2 -top-0.5 px-3 py-0.5 rounded-full text-xs font-mono font-medium"
                style={{
                  backgroundColor: personality.accentColor + '22',
                  color: personality.accentColor
                }}
              >
                · 关键分岔事件 · {personality.divergenceEvent.age}岁 ·
              </div>
              <div className="pt-4">
                <h4 className="font-serif text-lg text-white mb-3 text-center">
                  「{personality.divergenceEvent.title}」
                </h4>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-mist-50/50">
                    <div className="text-xs font-mono text-chronos uppercase tracking-wider mb-1.5">事件经过</div>
                    <p className="text-mist-600 text-sm leading-relaxed">{personality.divergenceEvent.event}</p>
                  </div>
                  <div
                    className="p-4 rounded-xl"
                    style={{
                      backgroundColor: personality.accentColor + '15',
                      borderLeft: `3px solid ${personality.accentColor}`
                    }}
                  >
                    <div className="text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: personality.accentColor }}>
                      人格转向
                    </div>
                    <p className="text-mist-600 text-sm leading-relaxed">{personality.divergenceEvent.consequence}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
