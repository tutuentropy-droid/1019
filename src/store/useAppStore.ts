import { create } from 'zustand';
import type { AppStage, SimulationInput, ParallelPersonality } from '@/types';

interface AppState {
  stage: AppStage;
  input: SimulationInput;
  personalities: ParallelPersonality[];
  selectedPersonalityId: string | null;
  isSimulating: boolean;
  simulationProgress: number;

  setStage: (stage: AppStage) => void;
  updateInput: (partial: Partial<SimulationInput>) => void;
  setPersonalities: (personalities: ParallelPersonality[]) => void;
  setSelectedPersonality: (id: string | null) => void;
  setIsSimulating: (val: boolean) => void;
  setSimulationProgress: (val: number) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
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

  setStage: (stage) => set({ stage }),
  updateInput: (partial) =>
    set((state) => ({
      input: { ...state.input, ...partial, factorWeights: { ...state.input.factorWeights, ...(partial.factorWeights || {}) } }
    })),
  setPersonalities: (personalities) => set({ personalities, selectedPersonalityId: personalities[0]?.id || null }),
  setSelectedPersonality: (id) => set({ selectedPersonalityId: id }),
  setIsSimulating: (val) => set({ isSimulating: val }),
  setSimulationProgress: (val) => set({ simulationProgress: val }),
  reset: () =>
    set({
      stage: 'home',
      personalities: [],
      selectedPersonalityId: null,
      isSimulating: false,
      simulationProgress: 0
    })
}));
