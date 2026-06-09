import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { PersonalitySnapshot } from '@/types';
import { Clock, Trash2, Eye, Edit3, Save, Sparkles, BookOpen } from 'lucide-react';

const ARCHETYPE_COLORS: Record<string, string> = {
  'the-guardian': '#5B3FD9',
  'the-wanderer': '#00D4AA',
  'the-warrior': '#EF4444',
  'the-healer': '#22D3EE',
  'the-philosopher': '#E8A838'
};

function formatDate(ts: number): string {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${d.getFullYear()}/${m}/${day} ${h}:${min}`;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return '刚刚';
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} 天前`;
  return formatDate(ts);
}

function getDominantArchetype(snap: PersonalitySnapshot): string {
  const freq: Record<string, number> = {};
  snap.personalities.forEach((p) => {
    freq[p.archetype] = (freq[p.archetype] || 0) + 1;
  });
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || 'unknown';
}

interface Props {
  onSelect?: (snapshotId: string) => void;
  compact?: boolean;
}

export default function SnapshotHistory({ onSelect, compact = false }: Props) {
  const memory = useAppStore((s) => s.memory);
  const viewingSnapshotId = useAppStore((s) => s.viewingSnapshotId);
  const loadSnapshot = useAppStore((s) => s.loadSnapshot);
  const removeSnapshot = useAppStore((s) => s.removeSnapshot);
  const updateCurrentSnapshotNote = useAppStore((s) => s.updateCurrentSnapshotNote);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const snapshots = Object.values(memory.personalityTree.snapshots).sort(
    (a, b) => b.timestamp - a.timestamp
  );

  const handleView = (id: string) => {
    loadSnapshot(id);
    onSelect?.(id);
  };

  const handleEdit = (snap: PersonalitySnapshot) => {
    setEditingId(snap.id);
    setEditNote(snap.note || '');
  };

  const handleSaveNote = (id: string) => {
    if (viewingSnapshotId === id) {
      updateCurrentSnapshotNote(editNote);
    }
    setEditingId(null);
  };

  if (snapshots.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mist-50 mb-4">
          <BookOpen size={16} className="text-chronos" />
          <span className="text-xs text-mist-400 font-mono uppercase tracking-wider">历史档案</span>
        </div>
        <p className="text-mist-500 font-serif text-lg mb-2">暂无历史记录</p>
        <p className="text-mist-400 text-sm">完成推演后，结果将保存在这里，方便你随时回访过去的自己</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {snapshots.slice(0, 5).map((snap) => {
          const archetype = getDominantArchetype(snap);
          const color = ARCHETYPE_COLORS[archetype] || '#7C66E8';
          const isActive = viewingSnapshotId === snap.id;
          return (
            <button
              key={snap.id}
              onClick={() => handleView(snap.id)}
              className={`w-full p-3 rounded-xl text-left transition-all border ${
                isActive ? 'bg-mist-50 border-nebula/40' : 'bg-mist-50/30 border-transparent hover:bg-mist-50'
              }`}
            >
              <div className="flex items-start gap-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0"
                  style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-mist-600 text-xs line-clamp-1 font-medium">{snap.label}</p>
                  <p className="text-mist-400 text-[10px] font-mono mt-0.5">
                    {timeAgo(snap.timestamp)} · {snap.personalities.length} 个人格
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-chronos" />
          <h3 className="text-white font-serif text-lg">人生档案</h3>
          <span className="px-2 py-0.5 rounded-full bg-mist-50 text-mist-400 text-xs font-mono">
            {snapshots.length} 条记录
          </span>
        </div>
        <Sparkles size={14} className="text-nebula opacity-60" />
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {snapshots.map((snap) => {
          const archetype = getDominantArchetype(snap);
          const color = ARCHETYPE_COLORS[archetype] || '#7C66E8';
          const isActive = viewingSnapshotId === snap.id;
          const isEditing = editingId === snap.id;
          const isDeleting = confirmDelete === snap.id;

          return (
            <div
              key={snap.id}
              className={`p-4 rounded-xl transition-all border ${
                isActive ? 'bg-mist-50/80 border-nebula/40' : 'bg-mist-50/30 border-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  onClick={() => handleView(snap.id)}
                  className="flex items-start gap-3 flex-1 text-left min-w-0"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: color + '22', boxShadow: `inset 0 0 20px ${color}11` }}
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-mist-700 text-sm font-medium line-clamp-1">{snap.label}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-mist-400 text-[10px] font-mono">{formatDate(snap.timestamp)}</span>
                      <span className="text-mist-300">·</span>
                      <span className="text-mist-400 text-[10px]">{snap.personalities.length} 个平行人格</span>
                      <span className="text-mist-300">·</span>
                      <span className="text-mist-400 text-[10px]">{timeAgo(snap.timestamp)}</span>
                    </div>
                    {snap.note && !isEditing && (
                      <p className="text-mist-500 text-xs mt-2 italic line-clamp-2">📝 {snap.note}</p>
                    )}
                    {isEditing && (
                      <div className="mt-2">
                        <textarea
                          value={editNote}
                          onChange={(e) => setEditNote(e.target.value)}
                          placeholder="给这个版本的自己写点什么..."
                          rows={2}
                          className="w-full bg-cosmos-800/80 border border-mist-100 rounded-lg p-2 text-xs text-mist-600
                            placeholder-mist-300 resize-none outline-none focus:border-nebula/40"
                          autoFocus
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveNote(snap.id);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-nebula/20 text-nebula text-xs hover:bg-nebula/30 transition-colors"
                          >
                            <Save size={10} />
                            保存
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(null);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-mist-50 text-mist-400 text-xs hover:bg-mist-100 transition-colors"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </button>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {!isEditing && (
                    <>
                      <button
                        onClick={() => handleView(snap.id)}
                        className="p-1.5 rounded-lg text-mist-400 hover:text-white hover:bg-mist-100 transition-colors"
                        title="查看"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleEdit(snap)}
                        className="p-1.5 rounded-lg text-mist-400 hover:text-white hover:bg-mist-100 transition-colors"
                        title="添加笔记"
                      >
                        <Edit3 size={14} />
                      </button>
                      {!isDeleting ? (
                        <button
                          onClick={() => setConfirmDelete(snap.id)}
                          className="p-1.5 rounded-lg text-mist-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="删除"
                        >
                          <Trash2 size={14} />
                        </button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              removeSnapshot(snap.id);
                              setConfirmDelete(null);
                            }}
                            className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-[10px] hover:bg-red-500/30 transition-colors"
                          >
                            确认
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-2 py-1 rounded-lg bg-mist-50 text-mist-400 text-[10px] hover:bg-mist-100 transition-colors"
                          >
                            取消
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
