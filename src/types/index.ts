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

export interface DivergenceEvent {
  age: number;
  title: string;
  event: string;
  consequence: string;
}

export interface ProfileCard {
  background: string;
  coreMotivation: string;
  greatestFear: string;
  dailyPattern: string;
  loveView: string;
  consumptionView: string;
  workStyle: string;
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
  profile: ProfileCard;
  divergenceEvent: DivergenceEvent;
}

export type AppStage = 'home' | 'simulating' | 'result';
