import { useState } from 'react';
import { ArrowLeft, Save, Trash2, Sparkles, TreeDeciduous, Clock, GitFork, Brain } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import PersonalityTree from '@/components/PersonalityTree';
import SnapshotHistory from '@/components/SnapshotHistory';
import WhatIfPanel from '@/components/WhatIfPanel';
import GrowthInsights from '@/components/GrowthInsights';

type TabKey = 'tree' | 'history' | 'whatif' | 'insights';

const TABS: { key: TabKey; label: string; icon: typeof TreeDeciduous }[] = [
  { key: 'tree', label: '人格树', icon: TreeDeciduous },
  { key: 'history', label: '历史档案', icon: Clock },
  { key: 'whatif', label: '如果当时', icon: GitFork },
  { key: 'insights', label: '成长洞察', icon: Brain }
];

export default function MemoryPage() {
  const setStage = useAppStore((s) => s.setStage);
  const memory = useAppStore((s) => s.memory);
  const viewingSnapshotId = useAppStore((s) => s.viewingSnapshotId);
  const clearAllMemory = useAppStore((s) => s.clearAllMemory);
  const getSnapshots = useAppStore((s) => s.getSnapshots);

  const [activeTab, setActiveTab] = useState<TabKey>('tree');
  const [confirmClear, setConfirmClear] = useState(false);

  const snaps = getSnapshots();
  const latestSnapshotId = snaps[0]?.id || null;
  const whatIfSnapshotId = viewingSnapshotId || latestSnapshotId;

  return (
    <div className="min-h-screen relative z-10 px-4 md:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-fade-in-down">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => setStage('home')}
                className="p-2 rounded-xl bg-mist-50 hover:bg-mist-100 text-mist-500 hover:text-white transition-all"
              >
                <ArrowLeft size={18} />
              </button>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">
                你的<span className="gradient-text">人格档案</span>
              </h1>
            </div>
            <p className="text-mist-500 text-sm ml-11">
              记录每一次选择，见证你的人生分岔之镜
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-mist-50 border border-mist-100">
              <Sparkles size={14} className="text-nebula" />
              <span className="text-mist-400 text-xs font-mono">
                {Object.keys(memory.personalityTree.snapshots).length} 个快照 · {memory.whatIfScenarios.length} 条分岔
              </span>
            </div>
            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="p-2 rounded-xl bg-mist-50 hover:bg-red-500/10 text-mist-500 hover:text-red-400 transition-all"
                title="清空所有记忆"
              >
                <Trash2 size={16} />
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    clearAllMemory();
                    setConfirmClear(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors"
                >
                  确认清空
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-3 py-1.5 rounded-xl bg-mist-50 text-mist-400 text-xs hover:bg-mist-100 transition-colors"
                >
                  取消
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
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

        <div className="animate-fade-in">
          {activeTab === 'tree' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PersonalityTree />
              </div>
              <div className="lg:col-span-1">
                <GrowthInsights />
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SnapshotHistory />
              </div>
              <div className="lg:col-span-1 space-y-6">
                <GrowthInsights />
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Save size={16} className="text-chronos" />
                    <h4 className="text-white font-serif text-sm">关于档案</h4>
                  </div>
                  <p className="text-mist-500 text-xs leading-relaxed">
                    每次推演完成后，结果都会自动保存在这里。你可以随时回访过去的自己，
                    看看不同阶段的你在思考什么，以及那些让你分岔的选择。
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'whatif' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {whatIfSnapshotId ? (
                  <WhatIfPanel snapshotId={whatIfSnapshotId} />
                ) : (
                  <div className="glass-card p-8 text-center">
                    <GitFork size={32} className="mx-auto text-ember opacity-40 mb-3" />
                    <p className="text-mist-500 font-serif text-lg mb-2">还没有快照可供探索</p>
                    <p className="text-mist-400 text-sm">先完成一次推演，种下人格树的第一颗种子</p>
                    <button
                      onClick={() => setStage('home')}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-nebula/20 text-nebula text-sm
                        hover:bg-nebula/30 transition-colors"
                    >
                      <Sparkles size={14} />
                      开始第一次推演
                    </button>
                  </div>
                )}
              </div>
              <div className="lg:col-span-1 space-y-6">
                <SnapshotHistory compact />
                <GrowthInsights />
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GrowthInsights />
              <PersonalityTree />
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <p className="text-mist-300 text-xs">
            人生没有标准答案，但每一个版本的你，都值得被看见。
            <br />
            这面分岔之镜，记录你走过的和你可能走过的所有路。
          </p>
        </div>
      </div>
    </div>
  );
}
