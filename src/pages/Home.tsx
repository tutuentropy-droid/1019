import { useState } from 'react';
import { Sparkles, MessageSquare, BookOpen, UserCircle2, ArrowRight, Wand2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { exampleInputs } from '@/utils/simulationEngine';
import type { InputMode, FactorWeights } from '@/types';

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

  const [hoveredExample, setHoveredExample] = useState<InputMode | null>(null);

  const charCount = input.content.length;
  const canSubmit = charCount >= 8;

  const handleStart = () => {
    if (!canSubmit) return;
    setSimulationProgress(0);
    setStage('simulating');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative z-10">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mist-50 border border-mist-100 mb-6">
            <Sparkles size={14} className="text-nebula" />
            <span className="text-xs text-mist-500 font-mono tracking-wider uppercase">
              Parallel Universe Simulator
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
            人格<span className="gradient-text">平行宇宙</span>
            <br />
            模拟器
          </h1>
          <p className="text-mist-500 text-lg max-w-xl mx-auto leading-relaxed">
            如果人生的变量被拨动——家庭、时代、教育、创伤、资源——
            <br className="hidden md:block" />
            你会演化成怎样的人？基于心理学与社会学的因果推演，而非娱乐标签。
          </p>
        </div>

        <div className="divider-gradient mb-10" />

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

        <p className="text-center text-mist-300 text-xs mt-8 animate-fade-in">
          本模拟基于大五人格模型与社会心理学因子交互，仅供思辨与创作参考
        </p>
      </div>
    </div>
  );
}
