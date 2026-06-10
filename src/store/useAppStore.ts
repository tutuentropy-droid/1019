import { create } from 'zustand';
import type { AppStage, SimulationInput, ParallelPersonality, UserMemory, PersonalitySnapshot, WhatIfScenario, SimulationInput as SimInput } from '@/types';
import {
  loadMemory,
  saveMemory,
  resetMemory,
  createSnapshot,
  getSnapshot,
  getAllSnapshots,
  createWhatIfScenario,
  selectPersonalityInSnapshot,
  updateSnapshotNote,
  deleteSnapshot,
  getGrowthInsights
} from '@/utils/memoryStore';

interface AppState {
  stage: AppStage;
  input: SimulationInput;
  personalities: ParallelPersonality[];
  selectedPersonalityId: string | null;
  isSimulating: boolean;
  simulationProgress: number;

  memory: UserMemory;
  memoryVersion: number;
  viewingSnapshotId: string | null;
  whatIfScenarios: WhatIfScenario[];

  setStage: (stage: AppStage) => void;
  updateInput: (partial: Partial<SimulationInput>) => void;
  setPersonalities: (personalities: ParallelPersonality[]) => void;
  setSelectedPersonality: (id: string | null) => void;
  setIsSimulating: (val: boolean) => void;
  setSimulationProgress: (val: number) => void;
  reset: () => void;

  refreshMemory: () => void;
  saveCurrentAsSnapshot: (label?: string) => string;
  loadSnapshot: (snapshotId: string) => void;
  closeSnapshotView: () => void;
  updateCurrentSnapshotNote: (note: string) => void;
  removeSnapshot: (snapshotId: string) => void;
  generateWhatIf: (snapshotId: string, variableChanged: Partial<SimInput>, description: string) => WhatIfScenario | null;
  clearAllMemory: () => void;
  getSnapshots: () => PersonalitySnapshot[];
  getGrowthInsightList: () => string[];
}

export const useAppStore = create<AppState>((set, get) => ({
  stage: 'home',
  input: {
    mode: 'experience',
    content: '',
    personalityCount: 4,
    factorWeights: {
      family: 60,
      era: 50,
      education: 70,
      trauma: 40,
      resources: 50
    }
  },
  personalities: [],
  selectedPersonalityId: null,
  isSimulating: false,
  simulationProgress: 0,

  memory: loadMemory(),
  memoryVersion: 0,
  viewingSnapshotId: null,
  whatIfScenarios: [],

  setStage: (stage) => set({ stage }),
  updateInput: (partial) =>
    set((state) => ({
      input: { ...state.input, ...partial, factorWeights: { ...state.input.factorWeights, ...(partial.factorWeights || {}) } }
    })),
  setPersonalities: (personalities) => set({ personalities, selectedPersonalityId: personalities[0]?.id || null }),
  setSelectedPersonality: (id) => {
    const state = get();
    if (state.viewingSnapshotId) {
      const mem = { ...state.memory };
      selectPersonalityInSnapshot(mem, state.viewingSnapshotId, id);
      set({ memory: mem, selectedPersonalityId: id, memoryVersion: state.memoryVersion + 1 });
    } else {
      set({ selectedPersonalityId: id });
    }
  },
  setIsSimulating: (val) => set({ isSimulating: val }),
  setSimulationProgress: (val) => set({ simulationProgress: val }),
  reset: () =>
    set({
      stage: 'home',
      personalities: [],
      selectedPersonalityId: null,
      isSimulating: false,
      simulationProgress: 0,
      viewingSnapshotId: null
    }),

  refreshMemory: () => {
    const fresh = loadMemory();
    set({ memory: fresh, memoryVersion: get().memoryVersion + 1 });
  },

  saveCurrentAsSnapshot: (label) => {
    const state = get();
    if (state.personalities.length === 0) return '';
    const mem = JSON.parse(JSON.stringify(state.memory));
    const parentSnapId = state.viewingSnapshotId ?? mem.currentSnapshotId;
    const result = createSnapshot(mem, state.input, state.personalities, state.selectedPersonalityId, label, undefined, parentSnapId);
    saveMemory(result.memory);
    set({ memory: result.memory, memoryVersion: get().memoryVersion + 1, viewingSnapshotId: result.snapshotId });
    return result.snapshotId;
  },

  loadSnapshot: (snapshotId) => {
    const state = get();
    const mem = JSON.parse(JSON.stringify(state.memory));
    const snap = getSnapshot(mem, snapshotId);
    if (snap) {
      mem.currentSnapshotId = snapshotId;
      saveMemory(mem);
      set({
        memory: mem,
        memoryVersion: state.memoryVersion + 1,
        viewingSnapshotId: snapshotId,
        input: JSON.parse(JSON.stringify(snap.input)),
        personalities: JSON.parse(JSON.stringify(snap.personalities)),
        selectedPersonalityId: snap.selectedPersonalityId,
        stage: 'result'
      });
    }
  },

  closeSnapshotView: () => set({ viewingSnapshotId: null }),

  updateCurrentSnapshotNote: (note) => {
    const state = get();
    if (!state.viewingSnapshotId) return;
    const mem = JSON.parse(JSON.stringify(state.memory));
    updateSnapshotNote(mem, state.viewingSnapshotId, note);
    saveMemory(mem);
    set({ memory: mem, memoryVersion: state.memoryVersion + 1 });
  },

  removeSnapshot: (snapshotId) => {
    const state = get();
    const mem = JSON.parse(JSON.stringify(state.memory));
    deleteSnapshot(mem, snapshotId);
    saveMemory(mem);
    const newViewing = state.viewingSnapshotId === snapshotId ? null : state.viewingSnapshotId;
    set({
      memory: mem,
      memoryVersion: state.memoryVersion + 1,
      viewingSnapshotId: newViewing
    });
  },

  generateWhatIf: (snapshotId, variableChanged, description) => {
    const state = get();
    try {
      const mem = JSON.parse(JSON.stringify(state.memory));
      const result = createWhatIfScenario(mem, snapshotId, variableChanged, description);
      saveMemory(result.memory);
      set({ memory: result.memory, memoryVersion: state.memoryVersion + 1 });
      return result.scenario;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  clearAllMemory: () => {
    const fresh = resetMemory();
    set({
      memory: fresh,
      memoryVersion: get().memoryVersion + 1,
      viewingSnapshotId: null,
      personalities: [],
      selectedPersonalityId: null,
      stage: 'home'
    });
  },

  getSnapshots: () => getAllSnapshots(get().memory),

  getGrowthInsightList: () => getGrowthInsights(get().memory)
}));
