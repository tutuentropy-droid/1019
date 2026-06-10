import type {
  UserMemory,
  UserChoice,
  PersonalitySnapshot,
  TreeNode,
  PersonalityTree,
  BigFive,
  ParallelPersonality,
  SimulationInput,
  WhatIfScenario
} from '@/types';
import { runSimulation } from '@/utils/simulationEngine';

const STORAGE_KEY = 'parallel_personality_memory_v1';

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

function createEmptyMemory(): UserMemory {
  return {
    id: generateId(),
    createdAt: Date.now(),
    lastUpdated: Date.now(),
    choiceHistory: [],
    personalityTree: {
      rootId: null,
      nodes: {},
      snapshots: {}
    },
    whatIfScenarios: [],
    currentSnapshotId: null,
    aggregatedBigFive: {
      openness: 50,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 50
    },
    archetypeFrequency: {},
    tags: []
  };
}

export function loadMemory(): UserMemory {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as UserMemory;
    }
  } catch (e) {
    console.error('Failed to load memory:', e);
  }
  const fresh = createEmptyMemory();
  saveMemory(fresh);
  return fresh;
}

export function saveMemory(memory: UserMemory): void {
  try {
    memory.lastUpdated = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch (e) {
    console.error('Failed to save memory:', e);
  }
}

export function resetMemory(): UserMemory {
  const fresh = createEmptyMemory();
  saveMemory(fresh);
  return fresh;
}

export function recordChoice(
  memory: UserMemory,
  choiceType: UserChoice['choiceType'],
  description: string,
  details: Record<string, unknown> = {}
): UserMemory {
  const choice: UserChoice = {
    id: generateId(),
    timestamp: Date.now(),
    choiceType,
    description,
    details
  };
  memory.choiceHistory.push(choice);
  saveMemory(memory);
  return memory;
}

function avgBigFive(personalities: ParallelPersonality[]): BigFive {
  if (personalities.length === 0) {
    return { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 };
  }
  const sum = personalities.reduce(
    (acc, p) => ({
      openness: acc.openness + p.bigFive.openness,
      conscientiousness: acc.conscientiousness + p.bigFive.conscientiousness,
      extraversion: acc.extraversion + p.bigFive.extraversion,
      agreeableness: acc.agreeableness + p.bigFive.agreeableness,
      neuroticism: acc.neuroticism + p.bigFive.neuroticism
    }),
    { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 }
  );
  return {
    openness: Math.round(sum.openness / personalities.length),
    conscientiousness: Math.round(sum.conscientiousness / personalities.length),
    extraversion: Math.round(sum.extraversion / personalities.length),
    agreeableness: Math.round(sum.agreeableness / personalities.length),
    neuroticism: Math.round(sum.neuroticism / personalities.length)
  };
}

function dominantArchetype(personalities: ParallelPersonality[]): string {
  const freq: Record<string, number> = {};
  personalities.forEach((p) => {
    freq[p.archetype] = (freq[p.archetype] || 0) + 1;
  });
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || 'unknown';
}

export function createSnapshot(
  memory: UserMemory,
  input: SimulationInput,
  personalities: ParallelPersonality[],
  selectedPersonalityId: string | null,
  label?: string,
  divergeReason?: string,
  parentSnapshotId?: string
): { memory: UserMemory; snapshotId: string; nodeId: string } {
  const now = Date.now();
  const sessionId = `session-${now}`;
  const snapshotId = `snap-${generateId()}`;
  const nodeId = `node-${generateId()}`;

  const autoLabel =
    label ||
    (input.content.length > 30
      ? `${input.mode === 'sentence' ? '一句话' : input.mode === 'experience' ? '一段经历' : '人物画像'}: ${input.content.slice(0, 28)}…`
      : input.content || '未命名推演');

  const snapshot: PersonalitySnapshot = {
    id: snapshotId,
    timestamp: now,
    sessionId,
    label: autoLabel,
    input: JSON.parse(JSON.stringify(input)),
    personalities: JSON.parse(JSON.stringify(personalities)),
    selectedPersonalityId
  };

  const tree = memory.personalityTree;
  const effectiveParentId = parentSnapshotId ?? memory.currentSnapshotId;
  const parentId = effectiveParentId && tree.snapshots[effectiveParentId] ? findNodeIdBySnapshotId(tree, effectiveParentId) : null;
  const parentNode = parentId ? tree.nodes[parentId] : null;

  const node: TreeNode = {
    id: nodeId,
    snapshotId,
    timestamp: now,
    parentId,
    children: [],
    label: autoLabel,
    depth: parentNode ? parentNode.depth + 1 : 0,
    dominantArchetype: dominantArchetype(personalities),
    bigFiveAvg: avgBigFive(personalities),
    divergeReason
  };

  if (parentNode) {
    parentNode.children.push(nodeId);
  }

  if (!tree.rootId) {
    tree.rootId = nodeId;
  }

  tree.snapshots[snapshotId] = snapshot;
  tree.nodes[nodeId] = node;

  memory.currentSnapshotId = snapshotId;
  updateAggregatedStats(memory);

  recordChoice(
    memory,
    'input',
    `创建推演快照: ${autoLabel}`,
    { snapshotId, inputMode: input.mode, personalityCount: input.personalityCount }
  );

  return { memory, snapshotId, nodeId };
}

function findNodeIdBySnapshotId(tree: PersonalityTree, snapshotId: string): string | null {
  for (const [nodeId, node] of Object.entries(tree.nodes)) {
    if (node.snapshotId === snapshotId) return nodeId;
  }
  return null;
}

function updateAggregatedStats(memory: UserMemory): void {
  const allPersonalities: ParallelPersonality[] = [];
  const archetypeFreq: Record<string, number> = {};

  Object.values(memory.personalityTree.snapshots).forEach((snap) => {
    snap.personalities.forEach((p) => {
      allPersonalities.push(p);
      archetypeFreq[p.archetype] = (archetypeFreq[p.archetype] || 0) + 1;
    });
  });

  memory.aggregatedBigFive = avgBigFive(allPersonalities);
  memory.archetypeFrequency = archetypeFreq;
}

export function getSnapshot(memory: UserMemory, snapshotId: string): PersonalitySnapshot | null {
  return memory.personalityTree.snapshots[snapshotId] || null;
}

export function getAllSnapshots(memory: UserMemory): PersonalitySnapshot[] {
  return Object.values(memory.personalityTree.snapshots).sort((a, b) => b.timestamp - a.timestamp);
}

export function getTreeNodes(memory: UserMemory): TreeNode[] {
  return Object.values(memory.personalityTree.nodes).sort((a, b) => a.depth - b.depth || a.timestamp - b.timestamp);
}

export function getNodeChildren(memory: UserMemory, nodeId: string): TreeNode[] {
  const node = memory.personalityTree.nodes[nodeId];
  if (!node) return [];
  return node.children.map((cid) => memory.personalityTree.nodes[cid]).filter(Boolean);
}

export function getNodePath(memory: UserMemory, nodeId: string): TreeNode[] {
  const path: TreeNode[] = [];
  let current: TreeNode | undefined = memory.personalityTree.nodes[nodeId];
  while (current) {
    path.unshift(current);
    current = current.parentId ? memory.personalityTree.nodes[current.parentId] : undefined;
  }
  return path;
}

export function createWhatIfScenario(
  memory: UserMemory,
  originalSnapshotId: string,
  variableChanged: Partial<SimulationInput>,
  description: string
): { memory: UserMemory; scenario: WhatIfScenario } {
  const original = memory.personalityTree.snapshots[originalSnapshotId];
  if (!original) {
    throw new Error('Original snapshot not found');
  }

  const altInput: SimulationInput = {
    ...original.input,
    ...variableChanged,
    factorWeights: {
      ...original.input.factorWeights,
      ...(variableChanged.factorWeights || {})
    }
  };

  const altPersonalities = runSimulation(altInput);
  const altSnapshot = createSnapshot(
    memory,
    altInput,
    altPersonalities,
    altPersonalities[0]?.id || null,
    `如果... ${description}`,
    `分叉: ${description.slice(0, 16)}`,
    originalSnapshotId
  );

  const originalSelected = original.personalities.find((p) => p.id === original.selectedPersonalityId) || original.personalities[0];
  const altSelected = altPersonalities[0];

  const bigFiveChanges: Partial<BigFive> = {};
  if (originalSelected && altSelected) {
    (Object.keys(originalSelected.bigFive) as (keyof BigFive)[]).forEach((k) => {
      const diff = altSelected.bigFive[k] - originalSelected.bigFive[k];
      if (Math.abs(diff) >= 5) {
        bigFiveChanges[k] = diff;
      }
    });
  }

  let keyDifference = '';
  if (originalSelected && altSelected) {
    if (originalSelected.archetype !== altSelected.archetype) {
      keyDifference = `人格原型从「${originalSelected.codeName}」转向「${altSelected.codeName}」`;
    } else {
      const shifts = Object.entries(bigFiveChanges)
        .map(([k, v]) => `${translateBigFiveKey(k)}${v! > 0 ? '+' : ''}${v}`)
        .join('、');
      keyDifference = shifts ? `人格维度变化：${shifts}` : '核心人格保持稳定，细节有所不同';
    }
  }

  const scenario: WhatIfScenario = {
    id: `whatif-${generateId()}`,
    originalSnapshotId,
    altSnapshotId: altSnapshot.snapshotId,
    divergePoint: variableChanged.content
      ? `改变输入描述为: "${String(variableChanged.content).slice(0, 40)}"`
      : Object.keys(variableChanged).join(' + '),
    description,
    variableChanged,
    diffSummary: {
      bigFiveChanges,
      archetypeShift:
        originalSelected && altSelected
          ? `${originalSelected.codeName} → ${altSelected.codeName}`
          : 'N/A',
      keyDifference
    }
  };

  memory.whatIfScenarios.push(scenario);
  saveMemory(memory);

  return { memory, scenario };
}

function translateBigFiveKey(k: string): string {
  const map: Record<string, string> = {
    openness: '开放性',
    conscientiousness: '尽责性',
    extraversion: '外向性',
    agreeableness: '宜人性',
    neuroticism: '神经质'
  };
  return map[k] || k;
}

export function selectPersonalityInSnapshot(
  memory: UserMemory,
  snapshotId: string,
  personalityId: string
): UserMemory {
  const snap = memory.personalityTree.snapshots[snapshotId];
  if (snap) {
    snap.selectedPersonalityId = personalityId;
    recordChoice(memory, 'personality_select', `在快照中选择人格: ${personalityId}`, { snapshotId, personalityId });
  }
  return memory;
}

export function updateSnapshotNote(
  memory: UserMemory,
  snapshotId: string,
  note: string
): UserMemory {
  const snap = memory.personalityTree.snapshots[snapshotId];
  if (snap) {
    snap.note = note;
    saveMemory(memory);
  }
  return memory;
}

export function deleteSnapshot(memory: UserMemory, snapshotId: string): UserMemory {
  const nodeId = findNodeIdBySnapshotId(memory.personalityTree, snapshotId);
  if (nodeId) {
    const node = memory.personalityTree.nodes[nodeId];
    if (node?.parentId) {
      const parent = memory.personalityTree.nodes[node.parentId];
      if (parent) {
        parent.children = parent.children.filter((c) => c !== nodeId);
      }
    }
    delete memory.personalityTree.nodes[nodeId];
  }
  delete memory.personalityTree.snapshots[snapshotId];
  if (memory.currentSnapshotId === snapshotId) {
    const snaps = getAllSnapshots(memory);
    memory.currentSnapshotId = snaps[0]?.id || null;
  }
  updateAggregatedStats(memory);
  saveMemory(memory);
  return memory;
}

export function getGrowthInsights(memory: UserMemory): string[] {
  const insights: string[] = [];
  const snapCount = Object.keys(memory.personalityTree.snapshots).length;

  if (snapCount === 0) {
    insights.push('开始你的第一次推演，种下人格树的第一颗种子。');
    return insights;
  }

  insights.push(`你已经进行了 ${snapCount} 次人生推演，探索了不同的可能性。`);

  const archetypes = Object.entries(memory.archetypeFrequency).sort((a, b) => b[1] - a[1]);
  if (archetypes.length > 0) {
    const topArchetype = archetypes[0];
    const archetypeNames: Record<string, string> = {
      'the-guardian': '守护者',
      'the-wanderer': '漫游者',
      'the-warrior': '战士',
      'the-healer': '治愈者',
      'the-philosopher': '哲学家'
    };
    insights.push(
      `你身上「${archetypeNames[topArchetype[0]] || topArchetype[0]}」的原型出现得最多，共 ${topArchetype[1]} 次。`
    );
  }

  const bf = memory.aggregatedBigFive;
  const highDimensions = (Object.entries(bf) as [keyof BigFive, number][])
    .filter(([, v]) => v >= 65)
    .map(([k]) => translateBigFiveKey(k));
  if (highDimensions.length > 0) {
    insights.push(`你的高维特质倾向：${highDimensions.join('、')}。`);
  }

  const choiceCount = memory.choiceHistory.length;
  if (choiceCount >= 5) {
    insights.push(`你已记录了 ${choiceCount} 个选择节点，它们共同编织成你的人生之树。`);
  }

  if (memory.whatIfScenarios.length > 0) {
    insights.push(`你探索了 ${memory.whatIfScenarios.length} 条"如果当时"的分岔路径。`);
  }

  return insights;
}

export { generateId };
