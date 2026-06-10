import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { TreeNode } from '@/types';
import { GitBranch, Sparkles, ArrowRight } from 'lucide-react';

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
  subtreeWidth: number;
}

function getSubtreeWidth(
  node: TreeNode,
  nodesById: Record<string, TreeNode>,
  depth: number
): number {
  if (node.children.length === 0) {
    return 120;
  }
  const childrenWidth = node.children.reduce((sum, cid) => {
    const child = nodesById[cid];
    if (!child) return sum;
    return sum + getSubtreeWidth(child, nodesById, depth + 1);
  }, 0);
  const gap = 20 * Math.max(1, node.children.length - 1);
  return Math.max(160, childrenWidth + gap);
}

function layoutNodes(
  node: TreeNode,
  nodesById: Record<string, TreeNode>,
  depth: number,
  x: number,
  y: number,
  result: PositionedNode[]
): number {
  const subtreeWidth = getSubtreeWidth(node, nodesById, depth);
  const verticalStep = 190;

  const centerX = x + subtreeWidth / 2;
  const nodeY = y + 90;

  result.push({
    ...node,
    x: centerX,
    y: nodeY,
    subtreeWidth
  });

  if (node.children.length > 0) {
    let childX = x;
    const gap = node.children.length > 1 ? 30 : 0;

    node.children.forEach((cid) => {
      const child = nodesById[cid];
      if (!child) return;
      const childWidth = getSubtreeWidth(child, nodesById, depth + 1);
      layoutNodes(child, nodesById, depth + 1, childX, nodeY + verticalStep - 90, result);
      childX += childWidth + gap;
    });
  }

  return subtreeWidth;
}

function layoutTree(nodes: TreeNode[]): PositionedNode[] {
  if (nodes.length === 0) return [];

  const nodesById: Record<string, TreeNode> = {};
  nodes.forEach((n) => (nodesById[n.id] = n));
  const result: PositionedNode[] = [];

  const roots = nodes.filter((n) => !n.parentId);

  if (roots.length === 0 && nodes.length > 0) {
    const sorted = [...nodes].sort((a, b) => a.timestamp - b.timestamp);
    roots.push(sorted[0]);
  }

  let offsetX = 40;
  roots.forEach((root) => {
    const width = getSubtreeWidth(root, nodesById, 0);
    layoutNodes(root, nodesById, 0, offsetX, 0, result);
    offsetX += width + 80;
  });

  return result;
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

  const canvasWidth = positioned.length > 0
    ? Math.max(800, Math.ceil(Math.max(...positioned.map((n) => n.x + n.subtreeWidth / 2 + 40))))
    : 800;
  const canvasHeight = 260 + Math.max(0, (positioned.length > 0 ? Math.max(...positioned.map((n) => n.y)) : 0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const nodeById: Record<string, PositionedNode> = {};
    positioned.forEach((n) => (nodeById[n.id] = n));

    positioned.forEach((node) => {
      if (node.parentId && nodeById[node.parentId]) {
        const parent = nodeById[node.parentId];
        const gradient = ctx.createLinearGradient(parent.x, parent.y, node.x, node.y);
        const color = ARCHETYPE_COLORS[node.dominantArchetype] || '#7C66E8';
        const parentColor = ARCHETYPE_COLORS[parent.dominantArchetype] || '#7C66E8';
        gradient.addColorStop(0, parentColor);
        gradient.addColorStop(1, color);

        const midY = (parent.y + node.y) / 2;
        const cpOffset = Math.max(40, Math.abs(node.x - parent.x) * 0.35);

        ctx.beginPath();
        ctx.moveTo(parent.x, parent.y + 28);
        ctx.bezierCurveTo(
          parent.x,
          parent.y + cpOffset,
          node.x,
          node.y - cpOffset,
          node.x,
          node.y - 28
        );
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 0.75;
        ctx.stroke();
        ctx.globalAlpha = 1;

        if (node.divergeReason) {
          const labelX = (parent.x + node.x) / 2;
          const labelY = midY - 10;
          const reasonText = node.divergeReason.length > 16 ? node.divergeReason.slice(0, 16) + '…' : node.divergeReason;
          ctx.font = '10px system-ui, -apple-system, sans-serif';
          const textWidth = ctx.measureText(reasonText).width;
          const padX = 8;
          const padY = 4;
          const boxW = textWidth + padX * 2;
          const boxH = 20;
          const boxX = labelX - boxW / 2;
          const boxY = labelY - boxH / 2;
          const r = 6;

          ctx.fillStyle = 'rgba(124, 102, 232, 0.15)';
          ctx.strokeStyle = 'rgba(124, 102, 232, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(boxX + r, boxY);
          ctx.lineTo(boxX + boxW - r, boxY);
          ctx.quadraticCurveTo(boxX + boxW, boxY, boxX + boxW, boxY + r);
          ctx.lineTo(boxX + boxW, boxY + boxH - r);
          ctx.quadraticCurveTo(boxX + boxW, boxY + boxH, boxX + boxW - r, boxY + boxH);
          ctx.lineTo(boxX + r, boxY + boxH);
          ctx.quadraticCurveTo(boxX, boxY + boxH, boxX, boxY + boxH - r);
          ctx.lineTo(boxX, boxY + r);
          ctx.quadraticCurveTo(boxX, boxY, boxX + r, boxY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#A78BFA';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
          ctx.fillText('⚡ ' + reasonText, labelX, labelY);
        }

        const arrowY = node.y - 30;
        ctx.beginPath();
        ctx.moveTo(node.x, arrowY + 4);
        ctx.lineTo(node.x - 5, arrowY - 4);
        ctx.lineTo(node.x + 5, arrowY - 4);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });

    positioned.forEach((node) => {
      const color = ARCHETYPE_COLORS[node.dominantArchetype] || '#7C66E8';
      const isSelected = viewingSnapshotId === node.snapshotId;
      const archetypeName = ARCHETYPE_NAMES[node.dominantArchetype] || '未命名';
      const childCount = node.children.length;
      const nodeRadius = isSelected ? 30 : 25;

      const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 65);
      glow.addColorStop(0, color + '33');
      glow.addColorStop(0.6, color + '11');
      glow.addColorStop(1, color + '00');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 65, 0, Math.PI * 2);
      ctx.fill();

      if (isSelected) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.4;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(node.x - 7, node.y - 7, 0, node.x, node.y, nodeRadius);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, color);
      grad.addColorStop(1, color + 'bb');
      ctx.fillStyle = grad;
      ctx.fill();

      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius - 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`L${node.depth + 1}`, node.x, node.y - 6);

      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
      ctx.fillText(archetypeName, node.x, node.y + 6);

      if (childCount > 0) {
        ctx.beginPath();
        ctx.arc(node.x + nodeRadius - 4, node.y - nodeRadius + 4, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(17, 24, 39, 0.9)';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.font = 'bold 9px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`×${childCount}`, node.x + nodeRadius - 4, node.y - nodeRadius + 4);
      }

      const labelText = node.label.length > 20 ? node.label.slice(0, 20) + '…' : node.label;
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      const textWidth = ctx.measureText(labelText).width;
      const labelX = node.x;
      const labelY = node.y + nodeRadius + 26;

      ctx.fillStyle = 'rgba(17, 24, 39, 0.75)';
      const pad = 7;
      const boxW = textWidth + pad * 2;
      const boxH = 24;
      const boxX = labelX - boxW / 2;
      const boxY = labelY - boxH / 2;
      const r = 7;
      ctx.beginPath();
      ctx.moveTo(boxX + r, boxY);
      ctx.lineTo(boxX + boxW - r, boxY);
      ctx.quadraticCurveTo(boxX + boxW, boxY, boxX + boxW, boxY + r);
      ctx.lineTo(boxX + boxW, boxY + boxH - r);
      ctx.quadraticCurveTo(boxX + boxW, boxY + boxH, boxX + boxW - r, boxY + boxH);
      ctx.lineTo(boxX + r, boxY + boxH);
      ctx.quadraticCurveTo(boxX, boxY + boxH, boxX, boxY + boxH - r);
      ctx.lineTo(boxX, boxY + r);
      ctx.quadraticCurveTo(boxX, boxY, boxX + r, boxY);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = isSelected ? color + '66' : 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#E5E7EB';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labelText, labelX, labelY);

      ctx.fillStyle = '#6B7280';
      ctx.font = '9px system-ui, -apple-system, sans-serif';
      ctx.fillText(formatDate(node.timestamp), node.x, labelY + 17);
    });

    positioned.forEach((node) => {
      if (node.parentId && nodeById[node.parentId]) {
        const parent = nodeById[node.parentId];
        const color = ARCHETYPE_COLORS[node.dominantArchetype] || '#7C66E8';
        const midY = (parent.y + node.y) / 2;

        ctx.beginPath();
        ctx.arc(node.x, node.y - 28, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.arc(parent.x, parent.y + 28, 3, 0, Math.PI * 2);
        const parentColor = ARCHETYPE_COLORS[parent.dominantArchetype] || '#7C66E8';
        ctx.fillStyle = parentColor;
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });
  }, [positioned, memoryVersion, viewingSnapshotId, canvasHeight, canvasWidth]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvasWidth;
    const y = ((e.clientY - rect.top) / rect.height) * canvasHeight;

    for (const node of nodesRef.current) {
      const dist = Math.hypot(node.x - x, node.y - y);
      const labelDist = Math.hypot(node.x - x, (node.y + 50) - y);
      if (dist < 38 || labelDist < 32) {
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

  const snapshotIdToCount: Record<string, number> = {};
  positioned.forEach((n) => {
    if (n.parentId && snapshotIdToCount[n.snapshotId] === undefined) {
      const parentNode = Object.values(memory.personalityTree.nodes).find(nd => nd.id === n.parentId);
      if (parentNode) {
        snapshotIdToCount[parentNode.snapshotId] = (snapshotIdToCount[parentNode.snapshotId] || 0) + 1;
      }
    }
  });

  return (
    <div className="glass-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <GitBranch size={18} className="text-nebula" />
          <h3 className="text-white font-serif text-lg">人格分岔树</h3>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="px-2 py-0.5 rounded-full bg-mist-50 text-mist-400 text-xs font-mono">
              {allNodes.length} 个节点
            </span>
            <span className="px-2 py-0.5 rounded-full bg-nebula/10 text-nebula text-xs font-mono">
              {Object.values(memory.personalityTree.snapshots).filter(s => !s.label?.startsWith('如果')).length} 次推演
            </span>
            <span className="px-2 py-0.5 rounded-full bg-ember/10 text-ember text-xs font-mono">
              {memory.whatIfScenarios.length} 条分岔
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-mist-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-nebula" />
            推演节点
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-ember" />
            分岔起点
          </span>
          <div className="w-px h-4 bg-mist-200" />
          {Object.entries(ARCHETYPE_NAMES).map(([key, name]) => (
            <span key={key} className="flex items-center gap-1">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: ARCHETYPE_COLORS[key] }}
              />
              {name}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-mist-100" style={{ background: 'radial-gradient(ellipse at top, #121826 0%, #0A0E1A 70%)' }}>
        <div className="p-4 min-w-full">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="mx-auto cursor-pointer"
          />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center gap-2 text-xs text-mist-400">
          <ArrowRight size={12} />
          <span>点击任意节点可跳转查看对应版本 · 右上角 ×N 表示该节点分出的路径数</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-3">
          {positioned.slice(-4).reverse().map((node) => {
            const childCount = node.children.length;
            const isSelected = viewingSnapshotId === node.snapshotId;
            const color = ARCHETYPE_COLORS[node.dominantArchetype] || '#7C66E8';
            return (
              <button
                key={node.id}
                onClick={() => {
                  loadSnapshot(node.snapshotId);
                  onSelectNode?.(node.snapshotId);
                }}
                className={`p-3.5 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-mist-50 border-nebula/40 shadow-lg shadow-nebula/10'
                    : 'bg-mist-50/30 border-transparent hover:bg-mist-50 hover:border-mist-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-mist-500 font-mono">第{node.depth + 1}层 · {formatDate(node.timestamp)}</span>
                  </div>
                  {childCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-ember bg-ember/10">
                      {childCount} 分支
                    </span>
                  )}
                </div>
                <p className="text-mist-600 text-xs line-clamp-2 leading-relaxed" title={node.label}>
                  {node.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
