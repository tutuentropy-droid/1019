import { useState } from 'react';
import type { ParallelPersonality, AgeStage, EmotionTrend } from '@/types';
import { Sparkles, Heart, Brain, Briefcase, Home, AlertCircle, Star, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import PosterCard from './PosterCard';

interface Props {
  personality: ParallelPersonality;
}

const AGES: AgeStage[] = [20, 30, 40, 60];

const emotionTrendConfig: Record<EmotionTrend, { label: string; color: string; icon: string }> = {
  rising: { label: '上升期', color: '#10B981', icon: '↑' },
  falling: { label: '下滑期', color: '#EF4444', icon: '↓' },
  stable: { label: '稳定期', color: '#3B82F6', icon: '→' },
  turbulent: { label: '动荡期', color: '#F59E0B', icon: '↕' }
};

const milestoneTypeConfig: Record<string, { label: string; color: string }> = {
  turning_point: { label: '转折点', color: '#8B5CF6' },
  trauma: { label: '创伤事件', color: '#EF4444' },
  achievement: { label: '重要成就', color: '#10B981' },
  loss: { label: '失去与告别', color: '#6B7280' },
  awakening: { label: '觉醒时刻', color: '#F59E0B' }
};

function getInitialAge(timeline: ParallelPersonality['lifeTimeline']): AgeStage {
  const available = AGES.filter((age) => !!timeline.stages[age]);
  return available.includes(20) ? 20 : (available[0] ?? 20);
}

export default function LifeTimelinePanel({ personality }: Props) {
  const timeline = personality.lifeTimeline;
  const [activeAge, setActiveAge] = useState<AgeStage>(() => getInitialAge(timeline));
  const [showPoster, setShowPoster] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    monologue: true,
    values: false,
    dailyLife: false,
    innerConflict: false,
    worldView: false
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeStage = timeline.stages[activeAge] ?? {
    selfIdentity: '',
    occupation: '',
    livingSituation: '',
    emotionalState: '',
    emotionalTrend: 'stable' as EmotionTrend,
    keyQuote: '',
    monologue: '',
    values: [],
    milestone: { title: '', description: '', impact: '', type: 'turning_point' as const },
    dailyLife: '',
    innerConflict: '',
    worldView: ''
  };
  const stageTradeOff = activeStage.stageTradeOff ?? {
    gainedThisStage: ['该阶段账单未记录（旧版本兼容性）'],
    lostThisStage: ['该阶段账单未记录（旧版本兼容性）'],
    quietRegret: '此人生快照生成于代价计算功能上线前，阶段级账本不可用。请使用新版本重新推演获取。',
    priceTag: '价签缺失：请基于当前版本重新推演，可查看完整年龄账单。'
  };
  const trendConfig = emotionTrendConfig[activeStage.emotionalTrend];
  const milestoneConfig = milestoneTypeConfig[activeStage.milestone.type] || milestoneTypeConfig.turning_point;

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <Sparkles size={18} style={{ color: personality.accentColor }} />
            <h3 className="text-white font-serif text-lg">
              「{personality.codeName}」的人生时间线
            </h3>
          </div>
          <button
            onClick={() => setShowPoster(!showPoster)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: personality.accentColor + '22',
              color: personality.accentColor,
              border: `1px solid ${personality.accentColor}44`
            }}
          >
            <Share2 size={14} />
            {showPoster ? '收起海报' : '生成人生海报'}
          </button>
        </div>

        {showPoster && (
          <div className="mb-6 animate-fade-in">
            <PosterCard personality={personality} />
          </div>
        )}

        <div className="relative mb-8">
          <div className="absolute left-0 right-0 top-1/2 h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${personality.accentColor}33, ${personality.accentColor}, ${personality.accentColor}33)` }} />
          <div className="relative flex justify-between">
            {AGES.filter((age) => !!timeline.stages[age]).map((age) => {
              const isActive = activeAge === age;
              const stage = timeline.stages[age];
              const trend = emotionTrendConfig[stage.emotionalTrend];
              return (
                <button
                  key={age}
                  onClick={() => setActiveAge(age)}
                  className="relative flex flex-col items-center group transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-serif text-lg font-bold transition-all ${isActive ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}
                    style={{
                      backgroundColor: isActive ? personality.accentColor : '#1e293b',
                      color: isActive ? '#fff' : '#94a3b8',
                      boxShadow: isActive ? `0 0 20px ${personality.accentColor}66` : 'none',
                      border: `2px solid ${isActive ? personality.accentColor : '#334155'}`
                    }}
                  >
                    {age}
                  </div>
                  <div className="mt-2 text-center">
                    <div
                      className="text-xs font-medium"
                      style={{ color: isActive ? personality.accentColor : '#64748b' }}
                    >
                      {age}岁
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: trend.color }}>
                      {trend.icon} {trend.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: personality.accentColor + '10',
              borderLeft: `3px solid ${personality.accentColor}`
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Brain size={14} style={{ color: personality.accentColor }} />
                <span className="text-sm font-medium" style={{ color: personality.accentColor }}>
                  自我认知
                </span>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: trendConfig.color + '22', color: trendConfig.color }}
              >
                {trendConfig.icon} {trendConfig.label}
              </span>
            </div>
            <p className="text-white font-serif text-lg">{activeStage.selfIdentity}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-mist-50">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Briefcase size={12} className="text-chronos" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-chronos">职业状态</span>
              </div>
              <p className="text-mist-600 text-xs leading-relaxed">{activeStage.occupation}</p>
            </div>
            <div className="p-3 rounded-xl bg-mist-50">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Home size={12} className="text-nebula" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-nebula">生活状态</span>
              </div>
              <p className="text-mist-600 text-xs leading-relaxed">{activeStage.livingSituation}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-mist-50/80">
            <div className="flex items-center gap-1.5 mb-2">
              <Heart size={13} className="text-ember" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-ember">情绪状态</span>
            </div>
            <p className="text-mist-600 text-sm leading-relaxed">{activeStage.emotionalState}</p>
          </div>

          <div
            className="p-4 rounded-xl relative overflow-hidden"
            style={{
              backgroundColor: '#0f172a',
              border: `1px solid ${personality.accentColor}33`
            }}
          >
            <div
              className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 blur-2xl"
              style={{ backgroundColor: personality.accentColor }}
            />
            <div className="relative">
              <div className="text-[10px] font-mono uppercase tracking-wider text-mist-400 mb-2">
                · {activeAge}岁独白 ·
              </div>
              <p className="text-white/90 font-serif italic text-base leading-relaxed">
                「{activeStage.monologue}」
              </p>
              <div className="mt-3 text-right">
                <span
                  className="text-sm font-serif"
                  style={{ color: personality.accentColor }}
                >
                  —— {activeStage.keyQuote}
                </span>
              </div>
            </div>
          </div>

          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: milestoneConfig.color + '10',
              borderLeft: `3px solid ${milestoneConfig.color}`
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Star size={14} style={{ color: milestoneConfig.color }} />
                <span
                  className="text-xs font-medium"
                  style={{ color: milestoneConfig.color }}
                >
                  {milestoneConfig.label}
                </span>
              </div>
              <span className="text-[10px] font-mono text-mist-400">{activeAge}岁</span>
            </div>
            <h4 className="text-white font-serif text-base mb-2">
              「{activeStage.milestone.title}」
            </h4>
            <p className="text-mist-600 text-xs leading-relaxed mb-2">
              {activeStage.milestone.description}
            </p>
            <div className="p-2.5 rounded-lg bg-mist-50/60">
              <div className="text-[10px] font-mono text-mist-400 uppercase mb-1">人格影响</div>
              <p className="text-mist-500 text-[11px] leading-relaxed">
                {activeStage.milestone.impact}
              </p>
            </div>
          </div>

          <div className="relative pt-3">
            <div className="divider-gradient mb-4" />
            <div
              className="absolute left-1/2 -translate-x-1/2 -top-0.5 px-3 py-0.5 rounded-full text-xs font-mono font-medium"
              style={{
                backgroundColor: '#F59E0B' + '22',
                color: '#F59E0B'
              }}
            >
              · {activeAge}岁账单 · 这一年交换了什么 ·
            </div>
            <div className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className="p-3 rounded-xl border-l-4"
                  style={{ backgroundColor: '#10B981' + '10', borderColor: '#10B981' }}
                >
                  <div className="text-[10px] font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#10B981' }}>
                    <span>＋</span> {activeAge}岁·得到
                  </div>
                  <ul className="space-y-1.5">
                    {stageTradeOff.gainedThisStage.map((g: string, i: number) => (
                      <li key={i} className="text-mist-500 text-[11px] leading-relaxed flex items-start gap-1.5">
                        <span className="text-emerald-500 mt-0.5 text-[10px]">▸</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className="p-3 rounded-xl border-l-4"
                  style={{ backgroundColor: '#EF4444' + '10', borderColor: '#EF4444' }}
                >
                  <div className="text-[10px] font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#EF4444' }}>
                    <span>−</span> {activeAge}岁·失去
                  </div>
                  <ul className="space-y-1.5">
                    {stageTradeOff.lostThisStage.map((l: string, i: number) => (
                      <li key={i} className="text-mist-500 text-[11px] leading-relaxed flex items-start gap-1.5">
                        <span className="text-red-500 mt-0.5 text-[10px]">▸</span>
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3.5 rounded-xl" style={{ backgroundColor: personality.accentColor + '12', borderLeft: `3px solid ${personality.accentColor}` }}>
                <div className="text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: personality.accentColor }}>
                  价签 · 这笔交易的记账方式
                </div>
                <p className="text-mist-300 text-[12px] leading-relaxed font-serif italic">
                  {stageTradeOff.priceTag}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/8 to-orange-500/8 border border-amber-500/20">
                <div className="text-[10px] font-mono uppercase tracking-wider mb-1.5 text-amber-500 flex items-center gap-1.5">
                  <span>✗</span> 深夜未说出口的 · 安静的遗憾
                </div>
                <p className="text-mist-500 text-[12px] leading-relaxed italic">
                  {stageTradeOff.quietRegret}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { key: 'values', label: '核心价值观', icon: Brain, data: activeStage.values.map((v: string) => v), list: true },
              { key: 'dailyLife', label: '日常模式', icon: Home, data: activeStage.dailyLife, list: false },
              { key: 'innerConflict', label: '内心挣扎', icon: AlertCircle, data: activeStage.innerConflict, list: false },
              { key: 'worldView', label: '世界观', icon: Sparkles, data: activeStage.worldView, list: false }
            ].map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedSections[section.key];
              return (
                <div key={section.key} className="rounded-xl bg-mist-50/50 overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.key)}
                    className="w-full flex items-center justify-between p-3 hover:bg-mist-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={13} className="text-chronos" />
                      <span className="text-xs font-medium text-mist-500">{section.label}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={14} className="text-mist-400" />
                    ) : (
                      <ChevronDown size={14} className="text-mist-400" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-0 animate-fade-in">
                      {section.list ? (
                        <ul className="space-y-1.5">
                          {(section.data as string[]).map((item, i) => (
                            <li key={i} className="text-mist-600 text-xs flex items-start gap-1.5">
                              <span className="text-nebula mt-0.5 text-[10px]">◆</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-mist-600 text-xs leading-relaxed">{section.data as string}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-white font-serif text-lg mb-4 flex items-center gap-2">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: personality.accentColor }}
          />
          二十年价值观变迁
        </h3>
        <div className="space-y-3">
          {timeline.valueShifts.map((shift, i) => (
            <div key={i} className="relative pl-6">
              <div
                className="absolute left-0 top-1 w-3 h-3 rounded-full"
                style={{ backgroundColor: personality.accentColor, opacity: 0.3 + i * 0.25 }}
              />
              {i < timeline.valueShifts.length - 1 && (
                <div
                  className="absolute left-[5px] top-5 w-px bottom-[-12px]"
                  style={{ backgroundColor: personality.accentColor + '33' }}
                />
              )}
              <div className="p-3 rounded-xl bg-mist-50/60">
                <div className="flex items-center gap-2 mb-1.5 text-xs">
                  <span className="text-mist-400 line-through">{shift.from}</span>
                  <span className="text-nebula">→</span>
                  <span style={{ color: personality.accentColor }}>{shift.to}</span>
                </div>
                <p className="text-mist-600 text-[11px] leading-relaxed">{shift.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <h3 className="text-white font-serif text-sm mb-3 flex items-center gap-2">
            <AlertCircle size={14} className="text-ember" />
            现实的磨损轨迹
          </h3>
          <p className="text-mist-600 text-xs leading-relaxed italic">{timeline.erosionTrajectory}</p>
        </div>
        <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-white font-serif text-sm mb-3 flex items-center gap-2">
            <Heart size={14} className="text-nebula" />
            未被改变的初心
          </h3>
          <ul className="space-y-2">
            {timeline.preservationPoints.map((point, i) => (
              <li key={i} className="text-mist-600 text-xs flex items-start gap-1.5">
                <span className="text-nebula mt-0.5 text-[10px]">✦</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: '0.25s' }}>
        <h3 className="text-white font-serif text-lg mb-4 flex items-center gap-2">
          <Sparkles size={16} style={{ color: personality.accentColor }} />
          短视频分镜脚本 · 人格纪录片
        </h3>
        <p className="text-mist-400 text-xs mb-5 font-mono uppercase tracking-wider">
          {timeline.poster.worldlineName} · 共{timeline.storyboard.length}个镜头
        </p>
        <div className="space-y-4">
          {timeline.storyboard.map((shot) => (
            <div key={shot.shotNumber} className="relative">
              <div className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-bold"
                  style={{
                    backgroundColor: personality.accentColor + '22',
                    color: personality.accentColor,
                    border: `1px solid ${personality.accentColor}44`
                  }}
                >
                  {shot.shotNumber.toString().padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-white font-medium text-sm">{shot.scene}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-mist-50 text-mist-400 font-mono">
                      {shot.duration}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="p-2.5 rounded-lg bg-mist-50/50">
                      <div className="text-[10px] font-mono text-chronos uppercase mb-1">旁白</div>
                      <p className="text-mist-600 text-xs italic leading-relaxed">{shot.voiceover}</p>
                    </div>
                    <div className="p-2.5 rounded-lg" style={{ backgroundColor: personality.accentColor + '10' }}>
                      <div className="text-[10px] font-mono mb-1" style={{ color: personality.accentColor }}>画面字幕</div>
                      <p className="text-white/80 text-xs leading-relaxed">{shot.subtitle}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-lg bg-mist-50/50">
                        <div className="text-[10px] font-mono text-ember uppercase mb-1">配乐</div>
                        <p className="text-mist-600 text-[11px]">{shot.music}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-mist-50/50">
                        <div className="text-[10px] font-mono text-nebula uppercase mb-1">机位</div>
                        <p className="text-mist-600 text-[11px]">{shot.visual.cameraAngle}</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-mist-50/30">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono text-mist-400 uppercase">视觉描述</span>
                        <span className="text-[10px] text-mist-400">{shot.visual.colorPalette}</span>
                      </div>
                      <p className="text-mist-500 text-xs leading-relaxed">{shot.visual.sceneDescription}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="text-[10px] text-mist-400">氛围：</span>
                        <span className="text-[11px]" style={{ color: personality.accentColor }}>
                          {shot.visual.atmosphere}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {shot.shotNumber < timeline.storyboard.length && (
                <div
                  className="absolute left-5 top-[52px] w-px h-6"
                  style={{ backgroundColor: personality.accentColor + '33' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {timeline.elderlyRetrospective && (
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-2xl opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)' }} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📖</span>
                  <h3 className="text-white font-serif text-xl">
                    · 60岁的自我回望 ·
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-mist-400 uppercase tracking-wider">
                  平行人生相册 · 最后一页
                </span>
              </div>
              <div className="text-mist-400 text-xs font-serif italic mb-6 pl-2 border-l-2" style={{ borderColor: personality.accentColor + '66' }}>
                「翻到这一页的时候，你才会突然意识到——今天的每一个选择，
                都在悄悄塑造着，四十年后那个坐在摇椅上回忆的自己。」
              </div>
            </div>
          </div>

          <div
            className="relative p-6 rounded-2xl mb-6 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${personality.accentColor}15 0%, #0f172a 50%, ${personality.accentColor}08 100%)`,
              border: `1px solid ${personality.accentColor}33`
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: personality.accentColor }} />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10 blur-2xl" style={{ backgroundColor: personality.accentColor }} />

            <div className="relative">
              <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: personality.accentColor }}>
                · 60岁 · 对20岁的自己说 ·
              </div>
              <div
                className="p-5 rounded-xl mb-5 relative"
                style={{
                  backgroundColor: '#020617',
                  borderLeft: `3px solid ${personality.accentColor}`
                }}
              >
                <div className="text-3xl mb-2 opacity-30 font-serif" style={{ color: personality.accentColor }}>"</div>
                <p className="text-white/95 font-serif italic text-lg leading-relaxed">
                  {timeline.elderlyRetrospective.messageToYoungerSelf}
                </p>
                <div className="mt-4 text-right">
                  <span className="text-sm font-serif" style={{ color: personality.accentColor }}>
                    —— 60岁的「{personality.codeName}」
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: '#EF4444' + '10', borderLeft: '3px solid #EF4444' }}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#EF4444' }}>
                      ✗ 一生最大的遗憾
                    </span>
                  </div>
                  <p className="text-mist-400 text-xs leading-relaxed italic">
                    {timeline.elderlyRetrospective.greatestRegret}
                  </p>
                </div>
                <div
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: '#10B981' + '10', borderLeft: '3px solid #10B981' }}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#10B981' }}>
                      ✓ 一生最大的满足
                    </span>
                  </div>
                  <p className="text-mist-400 text-xs leading-relaxed italic">
                    {timeline.elderlyRetrospective.greatestSatisfaction}
                  </p>
                </div>
              </div>

              <div
                className="p-4 rounded-xl mb-4"
                style={{
                  backgroundColor: personality.accentColor + '08',
                  border: `1px dashed ${personality.accentColor}33`
                }}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: personality.accentColor }}>
                  · 60岁的自我画像 ·
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-mist-500 text-xs font-mono mt-0.5">WHO</span>
                    <p className="text-white/80 text-sm font-serif">{timeline.elderlyRetrospective.selfIdentity}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-mist-500 text-xs font-mono mt-0.5">LIVE</span>
                    <p className="text-mist-400 text-xs leading-relaxed">{timeline.elderlyRetrospective.livingSituation}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-mist-500 text-xs font-mono mt-0.5">DAILY</span>
                    <p className="text-mist-400 text-xs leading-relaxed">{timeline.elderlyRetrospective.dailyLife}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-mist-50/40">
                <div className="text-[10px] font-mono uppercase tracking-wider mb-2 text-mist-400">
                  · 60岁独白 ·
                </div>
                <p className="text-white/80 font-serif italic text-sm leading-relaxed">
                  「{timeline.elderlyRetrospective.monologue}」
                </p>
                <div className="mt-3 text-right">
                  <span className="text-xs font-serif" style={{ color: personality.accentColor }}>
                    —— {timeline.elderlyRetrospective.keyQuote}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {timeline.elderlyRetrospective.stageTradeOff && (
            <div className="relative pt-3 mb-4">
              <div className="divider-gradient mb-4" />
              <div
                className="absolute left-1/2 -translate-x-1/2 -top-0.5 px-3 py-0.5 rounded-full text-xs font-mono font-medium"
                style={{
                  backgroundColor: '#F59E0B' + '22',
                  color: '#F59E0B'
                }}
              >
                · 60岁账本 · 这辈子交换了什么 ·
              </div>
              <div className="pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    className="p-3 rounded-xl border-l-4"
                    style={{ backgroundColor: '#10B981' + '10', borderColor: '#10B981' }}
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#10B981' }}>
                      <span>＋</span> 这辈子·得到
                    </div>
                    <ul className="space-y-1.5">
                      {timeline.elderlyRetrospective.stageTradeOff.gainedThisStage.map((g: string, i: number) => (
                        <li key={i} className="text-mist-500 text-[11px] leading-relaxed flex items-start gap-1.5">
                          <span className="text-emerald-500 mt-0.5 text-[10px]">▸</span>
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className="p-3 rounded-xl border-l-4"
                    style={{ backgroundColor: '#EF4444' + '10', borderColor: '#EF4444' }}
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#EF4444' }}>
                      <span>−</span> 这辈子·失去
                    </div>
                    <ul className="space-y-1.5">
                      {timeline.elderlyRetrospective.stageTradeOff.lostThisStage.map((l: string, i: number) => (
                        <li key={i} className="text-mist-500 text-[11px] leading-relaxed flex items-start gap-1.5">
                          <span className="text-red-500 mt-0.5 text-[10px]">▸</span>
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl" style={{ backgroundColor: personality.accentColor + '12', borderLeft: `3px solid ${personality.accentColor}` }}>
                  <div className="text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: personality.accentColor }}>
                    价签 · 这辈子的记账方式
                  </div>
                  <p className="text-mist-300 text-[12px] leading-relaxed font-serif italic">
                    {timeline.elderlyRetrospective.stageTradeOff.priceTag}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/8 to-orange-500/8 border border-amber-500/20">
                  <div className="text-[10px] font-mono uppercase tracking-wider mb-1.5 text-amber-500 flex items-center gap-1.5">
                    <span>✗</span> 深夜未说出口的 · 安静的遗憾
                  </div>
                  <p className="text-mist-500 text-[12px] leading-relaxed italic">
                    {timeline.elderlyRetrospective.stageTradeOff.quietRegret}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-mist-50/50">
              <div className="text-[10px] font-mono uppercase tracking-wider mb-2 text-chronos flex items-center gap-1.5">
                <Sparkles size={12} />
                60岁的价值观
              </div>
              <ul className="space-y-1.5">
                {timeline.elderlyRetrospective.values.map((v: string, i: number) => (
                  <li key={i} className="text-mist-500 text-[11px] leading-relaxed flex items-start gap-1.5">
                    <span className="text-nebula mt-0.5 text-[10px]">◆</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-mist-50/50">
              <div className="text-[10px] font-mono uppercase tracking-wider mb-2 text-nebula flex items-center gap-1.5">
                <Heart size={12} />
                一辈子都没改的东西
              </div>
              <ul className="space-y-1.5">
                {timeline.elderlyRetrospective.preservationPoints.map((p: string, i: number) => (
                  <li key={i} className="text-mist-500 text-[11px] leading-relaxed flex items-start gap-1.5">
                    <span className="text-nebula mt-0.5 text-[10px]">✦</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-mist-50/20">
            <div className="text-center">
              <p className="text-mist-500 text-[11px] font-serif italic leading-relaxed">
                「合上这本相册的时候，你会发现——
                所谓命运，不过是无数个今天的选择，堆积而成的结果。
                而你现在正在做的每一个决定，
                都在悄悄写下，四十年后那个属于你的，最后一页。」
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
