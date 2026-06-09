import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { TreeNode } from '@/types';
import { GitBranch, Sparkles } from 'lucide-react';

const ARCHETYPE_COLORS: Record<string, string> = {
  'the-guardian': '#5B3FD9',
  'the-wanderer': '#00D4AA',
  'the-warrior': '#EF4444',
  'the-healer': '#22D3EE',
  'the-philosopher': '#E8A838'
};

const ARCHETYPE_NAMES: Record<string, string> = {
  'the-guardian': '守护者',
  'the-wanderer': '漫游者',
  'the-warrior': '战士',
  'the-healer': '治愈者',
  'the-philosopher': '哲学家'
};

interface PositionedNode extends TreeNode {
  x: number;
  y: number;
}

function layoutTree(nodes: TreeNode[]): PositionedNode[] {
  const byDepth: Record<number, TreeNode[]> = {};
  nodes.forEach((n) => {
    if (!byDepth[n.depth]) byDepth[n.depth] = [];
    byDepth[n.depth].push(n);
  });

  const positioned: PositionedNode[] = [];
  const depths = Object.keys(byDepth)
    .map(Number)
    .sort((a, b) => a - b);

  const verticalStep = 140;
  const startY = 80;

  depths.forEach((depth) => {
    const depthNodes = byDepth[depth];
    const horizontalStep = 720 / (depthNodes.length + 1);
    const startX = 40;

    depthNodes.forEach((node, i) => {
      positioned.push({
        ...node,
        x: startX + horizontalStep * (i + 1),
        y: startY + depth * verticalStep
      });
    });
  });

  return positioned;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${m}/${day} ${h}:${min}`;
}

interface Props {
  onSelectNode?: (snapshotId: string) => void;
}

export default function PersonalityTree({ onSelectNode }: Props) {
  const memory = useAppStore((s) => s.memory);
  const memoryVersion = useAppStore((s) => s.memoryVersion);
  const viewingSnapshotId = useAppStore((s) => s.viewingSnapshotId);
  const loadSnapshot = useAppStore((s) => s.loadSnapshot);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<PositionedNode[]>([]);

  const allNodes = Object.values(memory.personalityTree.nodes);
  const positioned = layoutTree(allNodes);
  nodesRef.current = positioned;

  const canvasHeight = 200 + Math.max(0, (positioned.length > 0 ? Math.max(...positioned.map((n) => n.y)) : 0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 800 * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = '800px';
    canvas.style.height = `${canvasHeight}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, 800, canvasHeight);

    const nodeById: Record<string, PositionedNode> = {};
    positioned.forEach((n) => (nodeById[n.id] = n));

    positioned.forEach((node) => {
      if (node.parentId && nodeById[node.parentId]) {
        const parent = nodeById[node.parentId];
        const gradient = ctx.createLinearGradient(parent.x, parent.y, node.x, node.y);
        const color = ARCHETYPE_COLORS[node.dominantArchetype] || '#7C66E8';
        gradient.addColorStop(0, ARCHETYPE_COLORS[parent.dominantArchetype] || '#7C66E8');
        gradient.addColorStop(1, color);

        ctx.beginPath();
        const midY = (parent.y + node.y) / 2;
        ctx.moveTo(parent.x, parent.y + 20);
        ctx.bezierCurveTo(parent.x, midY, node.x, midY, node.x, node.y - 20);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });

    positioned.forEach((node) => {
      const color = ARCHETYPE_COLORS[node.dominantArchetype] || '#7C66E8';
      const isSelected = viewingSnapshotId === node.snapshotId;

      const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 35);
      glow.addColorStop(0, color + '66');
      glow.addColorStop(1, color + '00');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 35, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, isSelected ? 22 : 18, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(node.x - 5, node.y - 5, 0, node.x, node.y, isSelected ? 22 : 18);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, color);
      grad.addColorStop(1, color + 'aa');
      ctx.fillStyle = grad;
      ctx.fill();

      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(node.depth + 1), node.x, node.y);
    });
  }, [positioned, memoryVersion, viewingSnapshotId, canvasHeight]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 800;
    const y = ((e.clientY - rect.top) / rect.height) * canvasHeight;

    for (const node of nodesRef.current) {
      const dist = Math.hypot(node.x - x, node.y - y);
      if (dist < 25) {
        loadSnapshot(node.snapshotId);
        onSelectNode?.(node.snapshotId);
        return;
      }
    }
  };

  if (allNodes.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mist-50 mb-4">
          <Sparkles size={16} className="text-nebula" />
          <span className="text-xs text-mist-400 font-mono uppercase tracking-wider">人格树</span>
        </div>
        <p className="text-mist-500 font-serif text-lg mb-2">你的人格之树还未种下</p>
        <p className="text-mist-400 text-sm">完成第一次推演后，这里将开始生长出你的人生分岔</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GitBranch size={18} className="text-nebula" />
          <h3 className="text-white font-serif text-lg">人格分岔树</h3>
          <span className="px-2 py-0.5 rounded-full bg-mist-50 text-mist-400 text-xs font-mono">
            {allNodes.length} 个节点
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(ARCHETYPE_NAMES).map(([key, name]) => (
            <span key={key} className="flex items-center gap-1 text-xs text-mist-400">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: ARCHETYPE_COLORS[key] }}
              />
              {name}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="mx-auto cursor-pointer rounded-xl"
          style={{ background: 'radial-gradient(ellipse at top, #121826 0%, #0A0E1A 70%)' }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {positioned.slice(-4).reverse().map((node) => (
          <button
            key={node.id}
            onClick={() => {
              loadSnapshot(node.snapshotId);
              onSelectNode?.(node.snapshotId);
            }}
            className={`p-3 rounded-xl text-left transition-all border ${
              viewingSnapshotId === node.snapshotId
                ? 'bg-mist-50 border-nebula/40'
                : 'bg-mist-50/30 border-transparent hover:bg-mist-50'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: ARCHETYPE_COLORS[node.dominantArchetype] || '#7C66E8' }}
              />
              <span className="text-xs text-mist-500 font-mono">第{node.depth + 1}层 · {formatDate(node.timestamp)}</span>
            </div>
            <p className="text-mist-600 text-xs line-clamp-2" title={node.label}>
              {node.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
