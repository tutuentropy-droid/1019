import { useState } from 'react';
import { Sparkles, MessageSquare, BookOpen, UserCircle2, ArrowRight, Wand2, TreeDeciduous, Brain, Clock, GitFork } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { exampleInputs } from '@/utils/simulationEngine';
import type { InputMode, FactorWeights } from '@/types';
import SnapshotHistory from '@/components/SnapshotHistory';

const MODES: { key: InputMode; label: string; icon: typeof MessageSquare; hint: string }[] = [
  { key: 'sentence', label: '一句话', icon: MessageSquare, hint: '如"我总觉得和这个世界格格不入"' },
  { key: 'experience', label: '一段经历', icon: BookOpen, hint: '描述一段塑造了你的人生经历' },
  { key: 'portrait', label: '人物画像', icon: UserCircle2, hint: '描述一个人的基本画像与处境' }
];

const FACTOR_CONFIG: { key: keyof FactorWeights; label: string; color: string }[] = [
  { key: 'family', label: '家庭环境', color: '#5B3FD9' },
  { key: 'era', label: '时代背景', color: '#00D4AA' },
  { key: 'education', label: '教育经历', color: '#E8A838' },
  { key: 'trauma', label: '创伤事件', color: '#EF4444' },
  { key: 'resources', label: '资源禀赋', color: '#22D3EE' }
];

export default function Home() {
  const input = useAppStore((s) => s.input);
  const updateInput = useAppStore((s) => s.updateInput);
  const setStage = useAppStore((s) => s.setStage);
  const setSimulationProgress = useAppStore((s) => s.setSimulationProgress);
  const memory = useAppStore((s) => s.memory);
  const getGrowthInsightList = useAppStore((s) => s.getGrowthInsightList);
  const getSnapshots = useAppStore((s) => s.getSnapshots);

  const [hoveredExample, setHoveredExample] = useState<InputMode | null>(null);
  const [showArchive, setShowArchive] = useState(false);

  const charCount = input.content.length;
  const canSubmit = charCount >= 8;
  const snapCount = getSnapshots().length;
  const insights = getGrowthInsightList();

  const handleStart = () => {
    if (!canSubmit) return;
    setSimulationProgress(0);
    setStage('simulating');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative z-10">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="text-center mb-10 animate-fade-in-down">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mist-50 border border-mist-100 mb-6">
                <Sparkles size={14} className="text-nebula" />
                <span className="text-xs text-mist-500 font-mono tracking-wider uppercase">
                  Parallel Universe · 人生分岔镜
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
                人格<span className="gradient-text">平行宇宙</span>
                <br />
                模拟器
              </h1>
              <p className="text-mist-500 text-lg max-w-xl mx-auto leading-relaxed">
                如果人生的变量被拨动——家庭、时代、教育、创伤、资源——
                <br className="hidden md:block" />
                你会演化成怎样的人？这不仅是一次测试，更是一面记录你所有分岔的镜子。
              </p>
            </div>

            <div className="divider-gradient mb-8" />

            <div className="glass-card p-6 md:p-8 animate-fade-in-up">
              <div className="flex flex-wrap gap-2 mb-6">
                {MODES.map((m) => {
                  const Icon = m.icon;
                  const isActive = input.mode === m.key;
                  return (
                    <button
                      key={m.key}
                      onClick={() => updateInput({ mode: m.key })}
                      onMouseEnter={() => setHoveredExample(m.key)}
                      className={`tab-btn flex items-center gap-2 ${isActive ? 'active' : ''}`}
                    >
                      <Icon size={16} />
                      {m.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative mb-4">
                <textarea
                  value={input.content}
                  onChange={(e) => updateInput({ content: e.target.value })}
                  placeholder={MODES.find((m) => m.key === input.mode)?.hint}
                  rows={6}
                  className="w-full bg-cosmos-800/60 border border-mist-100 rounded-2xl p-5 text-mist-700 placeholder-mist-300
                    font-sans text-base leading-relaxed resize-none outline-none focus:border-nebula/60
                    focus:ring-2 focus:ring-nebula/20 transition-all duration-300"
                />
                <div className="absolute bottom-4 right-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono
                      ${charCount >= 8 ? 'bg-chronos/15 text-chronos' : 'bg-mist-50 text-mist-400'}`}
                  >
                    {charCount} / {charCount >= 8 ? '✓' : '至少8字'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mb-6 flex-wrap">
                <button
                  onClick={() => updateInput({ content: exampleInputs[input.mode] })}
                  className="inline-flex items-center gap-1.5 text-xs text-mist-400 hover:text-chronos
                    px-3 py-1.5 rounded-lg bg-mist-50 hover:bg-mist-100 transition-colors"
                >
                  <Wand2 size={12} />
                  填充示例
                </button>
                {hoveredExample && (
                  <span className="text-xs text-mist-400 italic px-3 py-1.5">
                    试试：{MODES.find((m) => m.key === hoveredExample)?.hint}
                  </span>
                )}
              </div>

              <div className="mb-8">
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="text-white font-serif text-base font-medium">推演参数</h3>
                  <span className="text-xs text-mist-400">平行人格数量：</span>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-6">
                  {([3, 4, 5] as const).map((n) => (
                    <button
                      key={n}
                      onClick={() => updateInput({ personalityCount: n })}
                      className={`py-2.5 rounded-xl font-mono text-sm transition-all duration-300
                        ${input.personalityCount === n
                          ? 'bg-gradient-to-br from-nebula/40 to-chronos/30 text-white border border-nebula/40'
                          : 'bg-mist-50 text-mist-400 border border-mist-100 hover:text-mist-600 hover:bg-mist-100'
                        }`}
                    >
                      {n} 个版本
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {FACTOR_CONFIG.map((f) => (
                    <div key={f.key}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-mist-500">{f.label}</span>
                        <span className="text-xs font-mono" style={{ color: f.color }}>
                          {input.factorWeights[f.key]}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={input.factorWeights[f.key]}
                        onChange={(e) =>
                          updateInput({
                            factorWeights: { ...input.factorWeights, [f.key]: Number(e.target.value) }
                          })
                        }
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-mist-50"
                        style={{
                          background: `linear-gradient(to right, ${f.color} 0%, ${f.color} ${input.factorWeights[f.key]}%, rgba(255,255,255,0.05) ${input.factorWeights[f.key]}%, rgba(255,255,255,0.05) 100%)`
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStart}
                disabled={!canSubmit}
                className="btn-primary w-full flex items-center justify-center gap-2 text-base font-medium"
              >
                开启推演
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-5">
            <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain size={16} className="text-nebula" />
                  <h3 className="text-white font-serif text-sm">你的成长数据</h3>
                </div>
                <button
                  onClick={() => setStage('memory')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-nebula/15 text-nebula text-xs hover:bg-nebula/25 transition-colors"
                >
                  <TreeDeciduous size={12} />
                  人格档案
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="p-2.5 rounded-xl bg-mist-50/50 text-center">
                  <div className="text-lg font-bold text-white font-mono">{snapCount}</div>
                  <div className="text-[10px] text-mist-400">次推演</div>
                </div>
                <div className="p-2.5 rounded-xl bg-mist-50/50 text-center">
                  <div className="text-lg font-bold text-white font-mono">{memory.choiceHistory.length}</div>
                  <div className="text-[10px] text-mist-400">个选择</div>
                </div>
                <div className="p-2.5 rounded-xl bg-mist-50/50 text-center">
                  <div className="text-lg font-bold text-white font-mono">{memory.whatIfScenarios.length}</div>
                  <div className="text-[10px] text-mist-400">条分岔</div>
                </div>
              </div>

              <div className="space-y-2">
                {insights.slice(0, 3).map((text, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-mist-50/50">
                    <p className="text-mist-500 text-[11px] leading-relaxed">✨ {text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-chronos" />
                  <h3 className="text-white font-serif text-sm">最近记录</h3>
                </div>
                <button
                  onClick={() => setShowArchive(!showArchive)}
                  className="text-[10px] text-mist-400 hover:text-chronos transition-colors"
                >
                  {showArchive ? '收起' : '展开'}
                </button>
              </div>
              {snapCount > 0 ? (
                showArchive ? (
                  <SnapshotHistory compact />
                ) : (
                  <div className="space-y-2">
                    {getSnapshots().slice(0, 3).map((snap) => (
                      <button
                        key={snap.id}
                        onClick={() => setStage('memory')}
                        className="w-full p-2.5 rounded-lg bg-mist-50/30 hover:bg-mist-50 text-left transition-all"
                      >
                        <p className="text-mist-600 text-[11px] line-clamp-1">{snap.label}</p>
                        <p className="text-mist-400 text-[10px] font-mono mt-0.5">
                          {snap.personalities.length} 个人格 · {new Date(snap.timestamp).toLocaleDateString('zh-CN')}
                        </p>
                      </button>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-4">
                  <p className="text-mist-400 text-xs">完成第一次推演后，这里将显示你的历史记录</p>
                </div>
              )}
            </div>

            <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2 mb-3">
                <GitFork size={16} className="text-ember" />
                <h3 className="text-white font-serif text-sm">关于产品</h3>
              </div>
              <div className="space-y-2.5">
                <p className="text-mist-500 text-[11px] leading-relaxed">
                  <span className="text-ember font-medium">🌱 长期记忆</span>
                  <br />
                  记录你的每一次推演和选择，形成专属于你的人格档案。
                </p>
                <p className="text-mist-500 text-[11px] leading-relaxed">
                  <span className="text-nebula font-medium">🌳 人格树</span>
                  <br />
                  可视化你的人生分岔路径，每次新推演都会从当下长出新的分支。
                </p>
                <p className="text-mist-500 text-[11px] leading-relaxed">
                  <span className="text-chronos font-medium">🔮 如果当时</span>
                  <br />
                  改变过去的某个变量，看看另一条人生道路上的你会是什么样子。
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-mist-300 text-xs mt-10 animate-fade-in">
          本模拟基于大五人格模型与社会心理学因子交互，仅供思辨与创作参考
        </p>
      </div>
    </div>
  );
}
