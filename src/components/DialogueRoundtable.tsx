import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, RefreshCw, MessageCircle, Users } from 'lucide-react';
import type { ParallelPersonality, EmotionType, AvatarPose } from '@/types';
import AnimatedAvatar from './AnimatedAvatar';
import {
  DEBATE_TOPICS,
  DIALOGUE_SCRIPTS,
  PERSONALITY_VOICES,
  type DebateTopic,
  type DialogueTurn
} from '@/data/dialogueTemplates';

interface DialogueRoundtableProps {
  personalities: ParallelPersonality[];
}

interface TurnState {
  turn: DialogueTurn;
  personality: ParallelPersonality;
  visible: boolean;
}

const EMOTION_POSE_MAP: Record<EmotionType, AvatarPose> = {
  calm: 'listening',
  passionate: 'excited',
  skeptical: 'thinking',
  gentle: 'listening',
  analytical: 'thinking',
  defiant: 'reacting'
};

export default function DialogueRoundtable({ personalities }: DialogueRoundtableProps) {
  const [selectedTopic, setSelectedTopic] = useState<DebateTopic>(DEBATE_TOPICS[0]);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentTurnInRound, setCurrentTurnInRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleTurns, setVisibleTurns] = useState<TurnState[]>([]);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  const script = useMemo(() => DIALOGUE_SCRIPTS[selectedTopic.id], [selectedTopic.id]);

  const personalityByArchetype = useMemo(() => {
    const map: Record<string, ParallelPersonality> = {};
    for (const p of personalities) {
      map[p.archetype] = p;
    }
    return map;
  }, [personalities]);

  const allRoundsFlattened = useMemo(() => {
    const result: { round: number; turnIndex: number; turn: DialogueTurn }[] = [];
    script?.rounds.forEach((round, ri) => {
      round.forEach((turn, ti) => {
        if (personalityByArchetype[turn.archetype]) {
          result.push({ round: ri, turnIndex: ti, turn });
        }
      });
    });
    return result;
  }, [script, personalityByArchetype]);

  const currentGlobalIndex = useMemo(() => {
    let idx = 0;
    for (let ri = 0; ri < currentRound; ri++) {
      idx += (script?.rounds[ri]?.length || 0);
    }
    return idx + currentTurnInRound;
  }, [currentRound, currentTurnInRound, script]);

  const totalTurns = allRoundsFlattened.length;

  const advanceTurn = useCallback(() => {
    if (!script) return;

    if (currentRound >= script.rounds.length) {
      setIsPlaying(false);
      setSpeakingId(null);
      return;
    }

    const round = script.rounds[currentRound];
    if (!round) return;

    let turnToShow: DialogueTurn | null = null;
    let ti = currentTurnInRound;

    while (ti < round.length && !turnToShow) {
      if (personalityByArchetype[round[ti].archetype]) {
        turnToShow = round[ti];
      } else {
        ti++;
      }
    }

    if (!turnToShow) {
      if (currentRound + 1 < script.rounds.length) {
        setCurrentRound(r => r + 1);
        setCurrentTurnInRound(0);
      } else {
        setIsPlaying(false);
        setSpeakingId(null);
      }
      return;
    }

    const personality = personalityByArchetype[turnToShow.archetype];
    setSpeakingId(personality.id);

    const newTurn: TurnState = {
      turn: turnToShow,
      personality,
      visible: false
    };

    setVisibleTurns(prev => [...prev, newTurn]);

    setTimeout(() => {
      setVisibleTurns(prev => {
        const copy = [...prev];
        if (copy.length > 0) {
          copy[copy.length - 1] = { ...copy[copy.length - 1], visible: true };
        }
        return copy;
      });
    }, 50);

    const nextTi = ti + 1;
    const readTime = Math.max(2500, turnToShow.line.length * 60);

    timerRef.current = window.setTimeout(() => {
      setSpeakingId(null);
      if (nextTi < round.length) {
        setCurrentTurnInRound(nextTi);
      } else if (currentRound + 1 < script.rounds.length) {
        setCurrentRound(r => r + 1);
        setCurrentTurnInRound(0);
      } else {
        setIsPlaying(false);
      }
    }, readTime);
  }, [script, currentRound, currentTurnInRound, personalityByArchetype]);

  useEffect(() => {
    if (isPlaying) {
      advanceTurn();
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, currentRound, currentTurnInRound, advanceTurn]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [visibleTurns.length]);

  const handlePlayPause = () => {
    if (currentGlobalIndex >= totalTurns && !isPlaying) {
      handleRestart();
      return;
    }
    setIsPlaying(p => !p);
  };

  const handleRestart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisibleTurns([]);
    setCurrentRound(0);
    setCurrentTurnInRound(0);
    setSpeakingId(null);
    setIsPlaying(true);
  };

  const handleTopicChange = (topic: DebateTopic) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSelectedTopic(topic);
    setVisibleTurns([]);
    setCurrentRound(0);
    setCurrentTurnInRound(0);
    setSpeakingId(null);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (isPlaying) setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    advanceTurn();
  };

  const handleStepBack = () => {
    if (isPlaying) setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (visibleTurns.length > 0) {
      setVisibleTurns(prev => prev.slice(0, -1));
    }
  };

  const seatPositions = useMemo(() => {
    const count = Math.min(personalities.length, 5);
    const positions: { angle: number }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 360 - 90;
      positions.push({ angle });
    }
    return positions;
  }, [personalities.length]);

  return (
    <div className="glass-card overflow-hidden animate-fade-in">
      <div className="p-5 border-b border-mist-100">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle size={18} className="text-chronos" />
          <h3 className="font-serif text-xl font-bold text-white">人格圆桌会议</h3>
        </div>
        <p className="text-mist-500 text-sm mb-4">
          让不同版本的你坐下来，聊聊那些人生中最难的选择。
        </p>

        <div className="flex flex-wrap gap-2">
          {DEBATE_TOPICS.map(topic => (
            <button
              key={topic.id}
              onClick={() => handleTopicChange(topic)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${topic.id === selectedTopic.id
                  ? 'text-white shadow-lg'
                  : 'bg-mist-50 text-mist-500 hover:text-white hover:bg-mist-100'
                }`}
              style={{
                background: topic.id === selectedTopic.id
                  ? 'linear-gradient(135deg, rgba(91, 63, 217, 0.4), rgba(0, 212, 170, 0.25))'
                  : undefined,
                border: topic.id === selectedTopic.id ? '1px solid rgba(91, 63, 217, 0.5)' : '1px solid transparent'
              }}
            >
              {topic.title}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 bg-mist-50/30 border-b border-mist-100">
        <div className="text-xs text-mist-400 font-mono uppercase tracking-wider mb-1">
          {selectedTopic.subtitle}
        </div>
        <p className="text-mist-700 font-serif italic text-lg leading-relaxed">
          "{selectedTopic.question}"
        </p>
      </div>

      <div className="relative h-64 md:h-72 border-b border-mist-100 overflow-hidden"
           style={{
             background: 'radial-gradient(ellipse at center, rgba(91, 63, 217, 0.15) 0%, transparent 70%)'
           }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-40 h-40 md:w-52 md:h-52 rounded-full border-2 border-mist-100 relative"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(91, 63, 217, 0.08) 100%)',
              boxShadow: 'inset 0 0 40px rgba(91, 63, 217, 0.15)'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Users size={28} className="text-mist-400 mx-auto mb-1" />
                <div className="text-[10px] text-mist-400 font-mono uppercase">Roundtable</div>
              </div>
            </div>
            <div className="absolute inset-0 rounded-full border border-dashed border-mist-100 animate-spin-slow" style={{ animationDuration: '60s' }} />
          </div>
        </div>

        {personalities.map((p, i) => {
          if (i >= seatPositions.length) return null;
          const pos = seatPositions[i];
          const isSpeaking = speakingId === p.id;
          const emotion = visibleTurns[visibleTurns.length - 1]?.personality.id === p.id
            ? visibleTurns[visibleTurns.length - 1].turn.emotion
            : 'calm';
          return (
            <div
              key={p.id}
              className="absolute transition-all duration-500"
              style={{
                left: `calc(50% + ${Math.cos((pos.angle * Math.PI) / 180) * 110}px)`,
                top: `calc(50% + ${Math.sin((pos.angle * Math.PI) / 180) * 95}px)`,
                transform: 'translate(-50%, -50%)',
                zIndex: isSpeaking ? 10 : 1,
                filter: isSpeaking ? 'none' : 'brightness(0.7)',
                scale: isSpeaking ? 1.15 : 1
              }}
            >
              <AnimatedAvatar
                archetype={p.archetype}
                accentColor={p.accentColor}
                size="lg"
                pose={isSpeaking ? 'speaking' : EMOTION_POSE_MAP[emotion]}
                emotion={emotion}
                speaking={isSpeaking}
              />
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-mono whitespace-nowrap"
                style={{
                  backgroundColor: p.accentColor + '33',
                  color: p.accentColor,
                  border: `1px solid ${p.accentColor}55`
                }}
              >
                {p.codeName}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-b border-mist-100 flex items-center justify-between gap-3 bg-mist-50/20">
        <div className="flex items-center gap-2">
          <button
            onClick={handleStepBack}
            disabled={visibleTurns.length === 0}
            className="p-2 rounded-lg bg-mist-50 hover:bg-mist-100 text-mist-500 hover:text-white disabled:opacity-30 transition-all"
            title="上一句"
          >
            <SkipBack size={18} />
          </button>
          <button
            onClick={handlePlayPause}
            className="p-3 rounded-full text-white transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #5B3FD9, #00D4AA)',
              boxShadow: '0 4px 20px rgba(91, 63, 217, 0.4)'
            }}
            title={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={handleStepForward}
            disabled={currentGlobalIndex >= totalTurns}
            className="p-2 rounded-lg bg-mist-50 hover:bg-mist-100 text-mist-500 hover:text-white disabled:opacity-30 transition-all"
            title="下一句"
          >
            <SkipForward size={18} />
          </button>
          <button
            onClick={handleRestart}
            className="p-2 rounded-lg bg-mist-50 hover:bg-mist-100 text-mist-500 hover:text-white transition-all"
            title="重新开始"
          >
            <RefreshCw size={18} />
          </button>
        </div>
        <div className="text-xs text-mist-400 font-mono">
          进度 {Math.min(visibleTurns.length, totalTurns)} / {totalTurns}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="max-h-96 overflow-y-auto p-5 space-y-4"
      >
        {visibleTurns.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle size={36} className="text-mist-300 mx-auto mb-3 opacity-50" />
            <p className="text-mist-400 text-sm">点击播放按钮，让对话开始…</p>
          </div>
        )}

        {visibleTurns.map((vt, i) => {
          const voice = PERSONALITY_VOICES[vt.turn.archetype];
          return (
            <div
              key={i}
              className={`flex gap-3 transition-all duration-500 ease-out
                ${vt.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex-shrink-0 pt-1">
                <AnimatedAvatar
                  archetype={vt.personality.archetype}
                  accentColor={vt.personality.accentColor}
                  size="sm"
                  emotion={vt.turn.emotion}
                  speaking={speakingId === vt.personality.id && i === visibleTurns.length - 1}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span
                    className="font-serif font-bold text-sm"
                    style={{ color: vt.personality.accentColor }}
                  >
                    「{vt.personality.codeName}」
                  </span>
                  <span className="text-[10px] text-mist-400 font-mono">
                    {voice?.speechStyle.tone.split('、')[0]}
                  </span>
                </div>
                <div
                  className="relative rounded-2xl rounded-tl-sm p-4 text-mist-700 leading-relaxed text-sm"
                  style={{
                    backgroundColor: vt.personality.accentColor + '12',
                    borderLeft: `3px solid ${vt.personality.accentColor}`
                  }}
                >
                  <span className="font-serif">{vt.turn.line}</span>
                </div>
                {voice && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {voice.cognitiveBiases.slice(0, 1).map((b, bi) => (
                      <span
                        key={bi}
                        className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          color: vt.personality.accentColor,
                          border: `1px solid ${vt.personality.accentColor}33`
                        }}
                      >
                        {b.split('：')[0]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
