import { useAppStore } from '@/store/useAppStore';
import type { BigFive } from '@/types';
import { TrendingUp, Brain, Sparkles, Target, Layers } from 'lucide-react';

const BIG_FIVE_LABELS: Record<keyof BigFive, string> = {
  openness: '开放性',
  conscientiousness: '尽责性',
  extraversion: '外向性',
  agreeableness: '宜人性',
  neuroticism: '神经质'
};

const ARCHETYPE_NAMES: Record<string, string> = {
  'the-guardian': '守护者',
  'the-wanderer': '漫游者',
  'the-warrior': '战士',
  'the-healer': '治愈者',
  'the-philosopher': '哲学家'
};

const ARCHETYPE_COLORS: Record<string, string> = {
  'the-guardian': '#5B3FD9',
  'the-wanderer': '#00D4AA',
  'the-warrior': '#EF4444',
  'the-healer': '#22D3EE',
  'the-philosopher': '#E8A838'
};

export default function GrowthInsights() {
  const memory = useAppStore((s) => s.memory);
  const insights = useAppStore((s) => s.getGrowthInsightList());

  const snapCount = Object.keys(memory.personalityTree.snapshots).length;
  const choiceCount = memory.choiceHistory.length;
  const whatIfCount = memory.whatIfScenarios.length;
  const bf = memory.aggregatedBigFive;

  const archetypes = Object.entries(memory.archetypeFrequency).sort((a, b) => b[1] - a[1]);
  const totalArchetypeCount = archetypes.reduce((sum, [, c]) => sum + c, 0);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-nebula" />
          <h3 className="text-white font-serif text-lg">成长洞察</h3>
        </div>
        {memory.createdAt && (
          <span className="text-mist-400 text-[10px] font-mono">
            自 {new Date(memory.createdAt).toLocaleDateString('zh-CN')} 开始记录
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-nebula/10 border border-nebula/20 text-center">
          <Layers size={18} className="mx-auto text-nebula mb-1" />
          <div className="text-xl font-bold text-white font-mono">{snapCount}</div>
          <div className="text-[10px] text-mist-400">次推演</div>
        </div>
        <div className="p-3 rounded-xl bg-chronos/10 border border-chronos/20 text-center">
          <Target size={18} className="mx-auto text-chronos mb-1" />
          <div className="text-xl font-bold text-white font-mono">{choiceCount}</div>
          <div className="text-[10px] text-mist-400">个选择</div>
        </div>
        <div className="p-3 rounded-xl bg-ember/10 border border-ember/20 text-center">
          <TrendingUp size={18} className="mx-auto text-ember mb-1" />
          <div className="text-xl font-bold text-white font-mono">{whatIfCount}</div>
          <div className="text-[10px] text-mist-400">条分岔</div>
        </div>
      </div>

      {snapCount > 0 && (
        <>
          <div className="mb-5">
            <div className="text-xs text-mist-400 font-mono uppercase tracking-wider mb-3">
              聚合人格倾向
            </div>
            <div className="space-y-2.5">
              {(Object.entries(bf) as [keyof BigFive, number][]).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-mist-500">{BIG_FIVE_LABELS[key]}</span>
                    <span className="text-xs font-mono text-mist-600">{value}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-mist-50 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${value}%`,
                        background: `linear-gradient(90deg, #5B3FD9, #00D4AA)`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {archetypes.length > 0 && (
            <div className="mb-5">
              <div className="text-xs text-mist-400 font-mono uppercase tracking-wider mb-3">
                原型分布
              </div>
              <div className="space-y-2">
                {archetypes.map(([key, count]) => {
                  const pct = totalArchetypeCount > 0 ? Math.round((count / totalArchetypeCount) * 100) : 0;
                  const color = ARCHETYPE_COLORS[key] || '#7C66E8';
                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                          <span className="text-xs text-mist-500">{ARCHETYPE_NAMES[key] || key}</span>
                        </div>
                        <span className="text-[10px] font-mono text-mist-400">{count}次 · {pct}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-mist-50 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <Sparkles size={12} className="text-nebula" />
          <span className="text-xs text-mist-400 font-mono uppercase tracking-wider">洞察</span>
        </div>
        <div className="space-y-2">
          {insights.map((text, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-mist-50/50 border-l-2 border-nebula/40"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <p className="text-mist-600 text-xs leading-relaxed">✨ {text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
