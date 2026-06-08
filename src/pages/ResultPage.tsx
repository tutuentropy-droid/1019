import { useState } from 'react';
import { ArrowLeft, RefreshCcw, BarChart3, GitBranch } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import PersonalityCard from '@/components/PersonalityCard';
import RadarChart from '@/components/RadarChart';
import CausalChainPanel from '@/components/CausalChainPanel';

type TabKey = 'overview' | 'radar' | 'causal';

export default function ResultPage() {
  const personalities = useAppStore((s) => s.personalities);
  const selectedId = useAppStore((s) => s.selectedPersonalityId);
  const setSelected = useAppStore((s) => s.setSelectedPersonality);
  const input = useAppStore((s) => s.input);
  const reset = useAppStore((s) => s.reset);
  const setStage = useAppStore((s) => s.setStage);
  const setSimulationProgress = useAppStore((s) => s.setSimulationProgress);

  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const selected = personalities.find((p) => p.id === selectedId) || personalities[0];

  const toggleExpand = (id: string) => {
    setExpandedMap((m) => ({ ...m, [id]: !m[id] }));
  };

  const handleReSimulate = () => {
    setSimulationProgress(0);
    setStage('simulating');
  };

  const TABS: { key: TabKey; label: string; icon: typeof BarChart3 }[] = [
    { key: 'overview', label: '人格画像', icon: BarChart3 },
    { key: 'radar', label: '维度对比', icon: BarChart3 },
    { key: 'causal', label: '因果溯源', icon: GitBranch }
  ];

  return (
    <div className="min-h-screen relative z-10 px-4 md:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-fade-in-down">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={reset}
                className="p-2 rounded-xl bg-mist-50 hover:bg-mist-100 text-mist-500 hover:text-white transition-all"
              >
                <ArrowLeft size={18} />
              </button>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">
                <span className="gradient-text">平行人格</span> 推演结果
              </h1>
            </div>
            <p className="text-mist-500 text-sm ml-11">
              基于你的输入，我们生成了 {personalities.length} 个可能演化出的人格版本
            </p>
          </div>
          <button
            onClick={handleReSimulate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-mist-50 hover:bg-mist-100
              border border-mist-100 text-mist-600 hover:text-white transition-all self-start md:self-auto"
          >
            <RefreshCcw size={16} />
            重新推演
          </button>
        </div>

        <div className="glass-card p-4 md:p-5 mb-8 animate-fade-in">
          <div className="text-xs text-mist-400 font-mono uppercase tracking-wider mb-2">原始输入</div>
          <p className="text-mist-700 font-serif italic leading-relaxed">
            "{input.content}"
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex gap-2 mb-5 flex-wrap">
              {TABS.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`tab-btn flex items-center gap-2 ${activeTab === t.key ? 'active' : ''}`}
                  >
                    <Icon size={15} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {activeTab === 'overview' && (
              <div
                className={`grid gap-5 ${
                  personalities.length <= 3
                    ? 'grid-cols-1 md:grid-cols-3'
                    : personalities.length === 4
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                }`}
              >
                {personalities.map((p, i) => (
                  <PersonalityCard
                    key={p.id}
                    personality={p}
                    index={i}
                    expanded={!!expandedMap[p.id]}
                    onToggle={() => toggleExpand(p.id)}
                  />
                ))}
              </div>
            )}

            {activeTab === 'radar' && (
              <div className="glass-card p-6 animate-fade-in">
                <h3 className="text-white font-serif text-lg mb-4 text-center">大五人格维度对比</h3>
                <RadarChart personalities={personalities} />
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-mist-50">
                    <div className="text-xs text-mist-400 font-mono uppercase mb-1">关于维度</div>
                    <p className="text-mist-600 text-xs leading-relaxed">
                      大五人格（Big Five）是心理学界最广泛认可的人格模型，包含开放性、尽责性、外向性、宜人性、神经质五个独立维度。
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-mist-50">
                    <div className="text-xs text-mist-400 font-mono uppercase mb-1">如何解读</div>
                    <p className="text-mist-600 text-xs leading-relaxed">
                      分数代表该维度的倾向性而非好坏。高神经质可能意味着敏感的艺术感受力，低宜人性也可能是独立思考的代价。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'causal' && selected && (
              <div className="glass-card p-6 animate-fade-in">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: selected.accentColor, boxShadow: `0 0 12px ${selected.accentColor}` }}
                    />
                    <h3 className="text-white font-serif text-lg">「{selected.codeName}」的人格形成路径</h3>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {personalities.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelected(p.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all
                          ${p.id === selectedId
                            ? 'text-white'
                            : 'text-mist-400 hover:text-mist-600'}`}
                        style={{
                          backgroundColor: p.id === selectedId ? p.accentColor + '33' : 'transparent',
                          border: p.id === selectedId ? `1px solid ${p.accentColor}66` : '1px solid transparent'
                        }}
                      >
                        {p.codeName}
                      </button>
                    ))}
                  </div>
                </div>
                <CausalChainPanel personality={selected} />
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            {selected && (
              <div
                className="glass-card p-6 sticky top-8 animate-fade-in"
                style={{ animationDelay: '0.2s', maxHeight: 'calc(100vh - 4rem)', overflowY: 'auto' }}
              >
                <div
                  className="h-1.5 w-full rounded-full mb-5"
                  style={{
                    background: `linear-gradient(90deg, ${selected.accentColor}, transparent)`
                  }}
                />
                <div className="text-xs text-mist-400 font-mono uppercase tracking-wider mb-2">人格档案卡</div>
                <h2 className="font-serif text-2xl font-bold text-white mb-1 flex items-center gap-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: selected.accentColor, boxShadow: `0 0 10px ${selected.accentColor}` }}
                  />
                  「{selected.codeName}」
                </h2>
                <p className="text-mist-500 italic mb-5 text-sm">{selected.tagline}</p>

                <div className="divider-gradient mb-5" />

                <div className="space-y-4">
                  <div className="relative">
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                      style={{ backgroundColor: selected.accentColor }}
                    />
                    <div className="pl-4">
                      <div className="text-xs font-mono text-chronos uppercase tracking-wider mb-1.5">成长背景</div>
                      <p className="text-mist-600 text-xs leading-relaxed">{selected.profile.background}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-mist-50/50">
                      <div className="text-xs font-mono text-chronos uppercase tracking-wider mb-1.5">核心驱动</div>
                      <p className="text-mist-600 text-xs leading-relaxed">{selected.profile.coreMotivation}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-mist-50/50">
                      <div className="text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: '#EF4444' }}>最大恐惧</div>
                      <p className="text-mist-600 text-xs leading-relaxed">{selected.profile.greatestFear}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl" style={{ backgroundColor: selected.accentColor + '10' }}>
                    <div className="text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: selected.accentColor }}>
                      日常行为模式
                    </div>
                    <p className="text-mist-600 text-xs leading-relaxed">{selected.profile.dailyPattern}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-mist-50/50">
                      <div className="text-xs font-mono text-nebula uppercase tracking-wider mb-1">爱情观</div>
                      <p className="text-mist-600 text-[11px] leading-relaxed">{selected.profile.loveView}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-mist-50/50">
                      <div className="text-xs font-mono text-ember uppercase tracking-wider mb-1">消费观</div>
                      <p className="text-mist-600 text-[11px] leading-relaxed">{selected.profile.consumptionView}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-mist-50/50">
                      <div className="text-xs font-mono text-chronos uppercase tracking-wider mb-1">工作风格</div>
                      <p className="text-mist-600 text-[11px] leading-relaxed">{selected.profile.workStyle}</p>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-mono text-chronos uppercase tracking-wider mb-1.5">口头禅</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.catchphrase.map((c, i) => (
                        <div
                          key={i}
                          className="text-ember text-xs font-serif italic bg-mist-50 px-2.5 py-1.5 rounded-lg"
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative pt-2">
                    <div className="divider-gradient mb-3" />
                    <div
                      className="absolute left-1/2 -translate-x-1/2 -top-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium whitespace-nowrap"
                      style={{
                        backgroundColor: selected.accentColor + '22',
                        color: selected.accentColor
                      }}
                    >
                      · 关键分岔 · {selected.divergenceEvent.age}岁 ·
                    </div>
                    <div className="pt-3">
                      <h4 className="font-serif text-base text-white mb-2 text-center">
                        「{selected.divergenceEvent.title}」
                      </h4>
                      <div className="space-y-2">
                        <div className="p-3 rounded-xl bg-mist-50/50">
                          <div className="text-[10px] font-mono text-chronos uppercase tracking-wider mb-1">事件经过</div>
                          <p className="text-mist-600 text-xs leading-relaxed">{selected.divergenceEvent.event}</p>
                        </div>
                        <div
                          className="p-3 rounded-xl"
                          style={{
                            backgroundColor: selected.accentColor + '15',
                            borderLeft: `3px solid ${selected.accentColor}`
                          }}
                        >
                          <div className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: selected.accentColor }}>
                            人格转向
                          </div>
                          <p className="text-mist-600 text-xs leading-relaxed">{selected.divergenceEvent.consequence}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs font-mono text-chronos uppercase tracking-wider mb-1.5">核心价值观</div>
                      <ul className="space-y-1">
                        {selected.values.map((v, i) => (
                          <li key={i} className="text-mist-600 text-xs flex items-start gap-1.5">
                            <span className="text-nebula mt-0.5 text-[10px]">◆</span>
                            <span>{v}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-mono text-chronos uppercase tracking-wider mb-1.5">典型矛盾</div>
                      <ul className="space-y-1">
                        {selected.contradictions.map((c, i) => (
                          <li key={i} className="text-mist-600 text-xs flex items-start gap-1.5 italic">
                            <span className="text-nebula mt-0.5 text-[10px]">⇌</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-mist-300 text-xs">
            人格并非命运，它是我们与世界反复互动中沉淀的形状。
            <br />
            每一个平行版本，都是你身上真实存在的可能性。
          </p>
        </div>
      </div>
    </div>
  );
}
