import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { FactorWeights, SimulationInput, BigFive } from '@/types';
import { GitFork, Sparkles, Eye, Play } from 'lucide-react';
import { contextTemplates } from '@/data/contextTemplates';

const FACTOR_CONFIG: { key: keyof FactorWeights; label: string; color: string }[] = [
  { key: 'family', label: '家庭环境', color: '#5B3FD9' },
  { key: 'era', label: '时代背景', color: '#00D4AA' },
  { key: 'education', label: '教育经历', color: '#E8A838' },
  { key: 'trauma', label: '创伤事件', color: '#EF4444' },
  { key: 'resources', label: '资源禀赋', color: '#22D3EE' }
];

const ERA_COUNTRY_SCENARIOS = contextTemplates.map((ctx) => ({
  label: `🌍 如果生在${ctx.eraLabel}${ctx.countryLabel}`,
  description: ctx.description.slice(0, 50) + (ctx.description.length > 50 ? '…' : ''),
  modify: (input: SimulationInput): Partial<SimulationInput> => ({
    context: {
      era: ctx.era,
      country: ctx.country,
      eraLabel: ctx.eraLabel,
      countryLabel: ctx.countryLabel,
      description: ctx.description
    },
    factorWeights: { ...input.factorWeights, era: Math.min(100, input.factorWeights.era + 20) }
  })
}));

const PRESET_SCENARIOS: { label: string; description: string; modify: (input: SimulationInput) => Partial<SimulationInput> }[] = [
  {
    label: '如果家庭环境更支持我',
    description: '提高家庭因子权重，降低创伤影响',
    modify: (input) => ({
      factorWeights: { ...input.factorWeights, family: Math.min(100, input.factorWeights.family + 30), trauma: Math.max(0, input.factorWeights.trauma - 25) }
    })
  },
  {
    label: '如果我出生在另一个时代',
    description: '大幅调整时代背景因子',
    modify: (input) => ({
      factorWeights: { ...input.factorWeights, era: input.factorWeights.era > 50 ? Math.max(0, input.factorWeights.era - 40) : Math.min(100, input.factorWeights.era + 40) }
    })
  },
  {
    label: '如果我接受了更好的教育',
    description: '提高教育因子权重',
    modify: (input) => ({
      factorWeights: { ...input.factorWeights, education: Math.min(100, input.factorWeights.education + 35) }
    })
  },
  {
    label: '如果我没有经历那次创伤',
    description: '大幅降低创伤因子',
    modify: (input) => ({
      factorWeights: { ...input.factorWeights, trauma: Math.max(0, input.factorWeights.trauma - 50) }
    })
  },
  {
    label: '如果我有更多资源',
    description: '提高资源禀赋权重',
    modify: (input) => ({
      factorWeights: { ...input.factorWeights, resources: Math.min(100, input.factorWeights.resources + 35) }
    })
  },
  ...ERA_COUNTRY_SCENARIOS
];

const BIG_FIVE_LABELS: Record<keyof BigFive, string> = {
  openness: '开放性',
  conscientiousness: '尽责性',
  extraversion: '外向性',
  agreeableness: '宜人性',
  neuroticism: '神经质'
};

interface Props {
  snapshotId: string;
  onScenarioGenerated?: (altSnapshotId: string) => void;
}

export default function WhatIfPanel({ snapshotId, onScenarioGenerated }: Props) {
  const memory = useAppStore((s) => s.memory);
  const generateWhatIf = useAppStore((s) => s.generateWhatIf);
  const loadSnapshot = useAppStore((s) => s.loadSnapshot);

  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customContent, setCustomContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'history'>('presets');

  function resolveRootOriginalId(snapId: string): string {
    let current = snapId;
    const visited = new Set<string>();
    while (!visited.has(current)) {
      visited.add(current);
      const asAlt = memory.whatIfScenarios.find((s) => s.altSnapshotId === current);
      if (!asAlt) break;
      current = asAlt.originalSnapshotId;
    }
    return current;
  }

  const rootOriginalId = resolveRootOriginalId(snapshotId);
  const baseSnapshotId = rootOriginalId;
  const snap = memory.personalityTree.snapshots[snapshotId];
  const baseSnap = memory.personalityTree.snapshots[baseSnapshotId] || snap;
  const currentlyViewingAltId = memory.whatIfScenarios.find((s) => s.altSnapshotId === snapshotId)?.id;

  const scenarios = memory.whatIfScenarios.filter((s) => {
    return resolveRootOriginalId(s.originalSnapshotId) === baseSnapshotId;
  });

  if (!snap) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-mist-400 text-sm">请先选择一个历史快照</p>
      </div>
    );
  }

  const handleGeneratePreset = (index: number) => {
    const preset = PRESET_SCENARIOS[index];
    const changes = preset.modify(baseSnap.input);
    setIsGenerating(true);
    setSelectedPreset(index);
    setActiveTab('history');

    setTimeout(() => {
      const scenario = generateWhatIf(baseSnapshotId, changes, preset.label);
      setIsGenerating(false);
      setSelectedPreset(null);
      if (scenario) {
        loadSnapshot(scenario.altSnapshotId);
        if (onScenarioGenerated) {
          onScenarioGenerated(scenario.altSnapshotId);
        }
      }
    }, 800);
  };

  const handleGenerateCustom = () => {
    if (!customContent.trim()) return;
    setIsGenerating(true);
    setActiveTab('history');

    setTimeout(() => {
      const scenario = generateWhatIf(
        baseSnapshotId,
        { content: customContent },
        customContent.slice(0, 30)
      );
      setIsGenerating(false);
      setCustomContent('');
      if (scenario) {
        loadSnapshot(scenario.altSnapshotId);
        if (onScenarioGenerated) {
          onScenarioGenerated(scenario.altSnapshotId);
        }
      }
    }, 800);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <GitFork size={18} className="text-ember" />
        <h3 className="text-white font-serif text-lg">如果当时...</h3>
        <span className="text-xs text-mist-400">探索人生的另一种可能</span>
      </div>

      <div className="flex gap-2 mb-5">
        {(['presets', 'custom', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab
                ? 'bg-ember/20 text-ember border border-ember/40'
                : 'bg-mist-50 text-mist-400 hover:text-mist-600 border border-transparent'
            }`}
          >
            {tab === 'presets' ? '预设场景' : tab === 'custom' ? '自定义' : `已探索 (${scenarios.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'presets' && (
        <div className="space-y-2">
          {PRESET_SCENARIOS.map((preset, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-mist-50/50 border border-transparent hover:border-ember/30 hover:bg-mist-50 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-mist-700 text-sm font-medium mb-1">{preset.label}</h4>
                  <p className="text-mist-400 text-xs">{preset.description}</p>

                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {Object.entries(preset.modify(baseSnap.input).factorWeights || {}).map(([k, v]) => {
                      const original = baseSnap.input.factorWeights[k as keyof FactorWeights];
                      const diff = (v as number) - original;
                      if (diff === 0) return null;
                      const config = FACTOR_CONFIG.find((f) => f.key === k);
                      return (
                        <span
                          key={k}
                          className="px-2 py-0.5 rounded text-[10px] font-mono"
                          style={{
                            backgroundColor: (config?.color || '#7C66E8') + '22',
                            color: config?.color || '#7C66E8'
                          }}
                        >
                          {config?.label || k} {diff > 0 ? '+' : ''}{diff}
                        </span>
                      );
                    })}
                    {preset.modify(baseSnap.input).context && (
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-chronos/20 text-chronos"
                      >
                        📍 {preset.modify(baseSnap.input).context?.eraLabel}{preset.modify(baseSnap.input).context?.countryLabel}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleGeneratePreset(i)}
                  disabled={isGenerating}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ember/20 text-ember text-xs
                    hover:bg-ember/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {isGenerating && selectedPreset === i ? (
                    <Sparkles size={12} className="animate-pulse" />
                  ) : (
                    <Play size={12} />
                  )}
                  推演
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="space-y-3">
          <div>
            <label className="text-mist-500 text-xs font-medium block mb-2">
              描述一个不同的人生版本...
            </label>
            <textarea
              value={customContent}
              onChange={(e) => setCustomContent(e.target.value)}
              placeholder="例如：如果我当初选择了出国留学而不是留下来工作..."
              rows={4}
              className="w-full bg-cosmos-800/60 border border-mist-100 rounded-xl p-4 text-mist-700 placeholder-mist-300
                text-sm leading-relaxed resize-none outline-none focus:border-ember/40 focus:ring-2 focus:ring-ember/10 transition-all"
            />
          </div>
          <button
            onClick={handleGenerateCustom}
            disabled={!customContent.trim() || isGenerating}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-ember/20 text-ember text-sm font-medium
              hover:bg-ember/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Sparkles size={14} className="animate-pulse" />
            ) : (
              <GitFork size={14} />
            )}
            {isGenerating ? '正在推演分岔路径...' : '生成分岔版本'}
          </button>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-2">
          {scenarios.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-mist-500 text-sm">还没有探索过分岔路径</p>
              <p className="text-mist-400 text-xs mt-1">选择一个预设场景或自定义描述开始探索</p>
            </div>
          ) : (
            scenarios.slice().reverse().map((scenario) => {
              const altSnap = memory.personalityTree.snapshots[scenario.altSnapshotId];
              const origSnap = memory.personalityTree.snapshots[scenario.originalSnapshotId];
              const isCurrent = currentlyViewingAltId === scenario.id;

              const origP = origSnap?.personalities?.[origSnap.selectedPersonalityId ? origSnap.personalities.findIndex((pp) => pp.id === origSnap.selectedPersonalityId) : 0];
              const altP = altSnap?.personalities?.[altSnap.selectedPersonalityId ? altSnap.personalities.findIndex((pp) => pp.id === altSnap.selectedPersonalityId) : 0];
              const origTradeOff = origP?.lifeTradeOff;
              const altTradeOff = altP?.lifeTradeOff;

              const tradeOffDiff = (() => {
                if (!origTradeOff || !altTradeOff) return null;
                const newGains = altTradeOff.gains
                  .filter((g) => !origTradeOff.gains.some((og) => og.label === g.label))
                  .map((g) => g.label);
                const lostNow = altTradeOff.losses
                  .filter((l) => !origTradeOff.losses.some((ol) => ol.label === l.label))
                  .map((l) => l.label);
                const newRegret = altTradeOff.regrets
                  .filter((r) => !origTradeOff.regrets.some((or) => or === r))
                  .slice(0, 1);
                return { newGains, lostNow, newRegret, newFormula: altTradeOff.exchangeFormula, newHidden: altTradeOff.hiddenCost };
              })();

              return (
                <div
                  key={scenario.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-nebula/10 border-nebula/50'
                      : 'bg-mist-50/50 border-transparent hover:border-nebula/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-mist-700 text-sm font-medium mb-1">{scenario.description}</h4>
                      <p className="text-mist-400 text-xs mb-2">{scenario.divergePoint}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-mist-400">人格转向:</span>
                          <span className="text-ember font-mono">{scenario.diffSummary.archetypeShift}</span>
                        </div>
                        {Object.keys(scenario.diffSummary.bigFiveChanges).length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(scenario.diffSummary.bigFiveChanges).map(([k, v]) => (
                              <span
                                key={k}
                                className="px-1.5 py-0.5 rounded text-[10px] font-mono"
                                style={{
                                  backgroundColor: (v as number) > 0 ? '#00D4AA22' : '#EF444422',
                                  color: (v as number) > 0 ? '#00D4AA' : '#EF4444'
                                }}
                              >
                                {BIG_FIVE_LABELS[k as keyof BigFive]} {(v as number) > 0 ? '+' : ''}{v}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-mist-500 text-xs italic">💡 {scenario.diffSummary.keyDifference}</p>

                        {tradeOffDiff && (tradeOffDiff.newGains.length > 0 || tradeOffDiff.lostNow.length > 0) && (
                          <div className="pt-2 mt-2 border-t border-mist-100 space-y-1.5">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-chronos mb-1">⇅ 代价维度变化（相对原始版本）</div>
                            {tradeOffDiff.newGains.length > 0 && (
                              <div className="flex flex-wrap gap-1 items-center">
                                <span className="text-[10px] font-mono text-emerald-500">＋新增所得：</span>
                                {tradeOffDiff.newGains.slice(0, 2).map((g, i) => (
                                  <span key={i} className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 text-[10px]">
                                    {g}
                                  </span>
                                ))}
                              </div>
                            )}
                            {tradeOffDiff.lostNow.length > 0 && (
                              <div className="flex flex-wrap gap-1 items-center">
                                <span className="text-[10px] font-mono text-red-500">－新添代价：</span>
                                {tradeOffDiff.lostNow.slice(0, 2).map((l, i) => (
                                  <span key={i} className="px-1.5 py-0.5 rounded bg-red-500/15 text-red-500 text-[10px]">
                                    {l}
                                  </span>
                                ))}
                              </div>
                            )}
                            {tradeOffDiff.newRegret.length > 0 && (
                              <p className="text-[11px] text-amber-500 italic leading-relaxed">
                                ✗ 新遗憾：{tradeOffDiff.newRegret[0].length > 45 ? tradeOffDiff.newRegret[0].slice(0, 45) + '…' : tradeOffDiff.newRegret[0]}
                              </p>
                            )}
                          </div>
                        )}
                        {!tradeOffDiff && (
                          <div className="pt-2 mt-2 border-t border-mist-100">
                            <p className="text-[10px] text-mist-400 italic">（此版本生成于代价计算功能上线前，无法提供代价维度对比）</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {altSnap && (
                      <button
                        onClick={() => {
                          loadSnapshot(scenario.altSnapshotId);
                          onScenarioGenerated?.(scenario.altSnapshotId);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-nebula/20 text-nebula text-xs
                          hover:bg-nebula/30 transition-colors flex-shrink-0"
                      >
                        <Eye size={12} />
                        查看
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <div className="mt-5 pt-5 border-t border-mist-100 space-y-2">
        {currentlyViewingAltId && (
          <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-nebula/10 border border-nebula/30">
            <Sparkles size={12} className="text-nebula" />
            <span className="text-nebula">你正在查看一个分岔版本</span>
            <button
              onClick={() => {
                loadSnapshot(baseSnapshotId);
                onScenarioGenerated?.(baseSnapshotId);
              }}
              className="ml-auto text-nebula hover:text-nebula/70 underline underline-offset-2"
            >
              返回原始版本
            </button>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-mist-400">
          <Sparkles size={12} className="text-ember" />
          <span>
            基于原始输入："{baseSnap.input.content.length > 50 ? baseSnap.input.content.slice(0, 50) + '…' : baseSnap.input.content}"
          </span>
        </div>
      </div>
    </div>
  );
}
