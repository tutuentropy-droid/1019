export type InputMode = 'sentence' | 'experience' | 'portrait';

export interface FactorWeights {
  family: number;
  era: number;
  education: number;
  trauma: number;
  resources: number;
}

export interface SimulationInput {
  mode: InputMode;
  content: string;
  personalityCount: 3 | 4 | 5;
  factorWeights: FactorWeights;
}

export interface BigFive {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface CausalEvent {
  age: number;
  event: string;
  impact: string;
}

export interface ParallelPersonality {
  id: string;
  codeName: string;
  accentColor: string;
  tagline: string;
  personality: string;
  catchphrase: string[];
  values: string[];
  lifeChoices: string[];
  contradictions: string[];
  bigFive: BigFive;
  causalChain: CausalEvent[];
  factors: {
    family: string;
    era: string;
    education: string;
    trauma: string;
    resources: string;
  };
}

export type AppStage = 'home' | 'simulating' | 'result';
