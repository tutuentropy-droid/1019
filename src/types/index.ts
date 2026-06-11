export type InputMode = 'sentence' | 'experience' | 'portrait';

export interface FactorWeights {
  family: number;
  era: number;
  education: number;
  trauma: number;
  resources: number;
}

export interface EraCountryContext {
  era: string;
  country: string;
  eraLabel: string;
  countryLabel: string;
  description: string;
}

export interface SimulationInput {
  mode: InputMode;
  content: string;
  personalityCount: 3 | 4 | 5;
  factorWeights: FactorWeights;
  context?: EraCountryContext;
}

export interface UserChoice {
  id: string;
  timestamp: number;
  choiceType: 'input' | 'personality_select' | 'factor_adjust' | 'path_diverge';
  description: string;
  details: Record<string, unknown>;
}

export interface PersonalitySnapshot {
  id: string;
  timestamp: number;
  sessionId: string;
  label: string;
  input: SimulationInput;
  personalities: ParallelPersonality[];
  selectedPersonalityId: string | null;
  note?: string;
}

export interface TreeNode {
  id: string;
  snapshotId: string;
  timestamp: number;
  parentId: string | null;
  children: string[];
  label: string;
  depth: number;
  dominantArchetype: string;
  bigFiveAvg: BigFive;
  divergeReason?: string;
}

export interface PersonalityTree {
  rootId: string | null;
  nodes: Record<string, TreeNode>;
  snapshots: Record<string, PersonalitySnapshot>;
}

export interface WhatIfScenario {
  id: string;
  originalSnapshotId: string;
  altSnapshotId: string;
  divergePoint: string;
  description: string;
  variableChanged: Partial<SimulationInput>;
  diffSummary: {
    bigFiveChanges: Partial<BigFive>;
    archetypeShift: string;
    keyDifference: string;
  };
}

export interface UserMemory {
  id: string;
  createdAt: number;
  lastUpdated: number;
  choiceHistory: UserChoice[];
  personalityTree: PersonalityTree;
  whatIfScenarios: WhatIfScenario[];
  currentSnapshotId: string | null;
  aggregatedBigFive: BigFive;
  archetypeFrequency: Record<string, number>;
  tags: string[];
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

export interface AppearanceEvolution {
  age20: string;
  age30: string;
  age40: string;
}

export interface PersonalityConflictAxis {
  leftLabel: string;
  rightLabel: string;
  intensity: number;
  description: string;
}

export interface VisualDocumentary {
  appearanceEvolution: AppearanceEvolution;
  dressStyle: string;
  livingSpace: string;
  frequentScenes: string[];
  signatureMonologue: string;
  conflictAxes: PersonalityConflictAxis[];
  characterSilhouette: string;
}

export interface ParallelPersonality {
  id: string;
  archetype: string;
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
  lifeTimeline: LifeTimeline;
  visualDocumentary: VisualDocumentary;
  lifeTradeOff?: LifeTradeOff;
  externalPerspective: ExternalPerspective;
}

export type AppStage = 'home' | 'simulating' | 'result' | 'memory';

export type EmotionType = 'calm' | 'passionate' | 'skeptical' | 'gentle' | 'analytical' | 'defiant';

export type AvatarPose = 'idle' | 'speaking' | 'thinking' | 'listening' | 'reacting' | 'excited';

export interface AvatarAnimation {
  archetype: string;
  primaryColor: string;
  bodyBounce: string;
  armSwing: string;
  headTilt: string;
  eyeBlink: string;
  specialEffect?: string;
}

export interface DialogueTurnDisplay {
  id: string;
  personalityId: string;
  codeName: string;
  accentColor: string;
  archetype: string;
  line: string;
  emotion: EmotionType;
  visible: boolean;
}

export type AgeStage = 20 | 30 | 40;

export type EmotionTrend = 'rising' | 'falling' | 'stable' | 'turbulent';

export interface ValueShift {
  from: string;
  to: string;
  description: string;
}

export interface LifeMilestone {
  title: string;
  description: string;
  impact: string;
  type: 'turning_point' | 'trauma' | 'achievement' | 'loss' | 'awakening';
}

export interface AgeStageState {
  selfIdentity: string;
  occupation: string;
  livingSituation: string;
  emotionalState: string;
  emotionalTrend: EmotionTrend;
  keyQuote: string;
  monologue: string;
  values: string[];
  milestone: LifeMilestone;
  dailyLife: string;
  innerConflict: string;
  worldView: string;
  stageTradeOff?: StageTradeOff;
}

export interface TimelineVisual {
  sceneDescription: string;
  colorPalette: string;
  cameraAngle: string;
  atmosphere: string;
}

export interface StoryboardShot {
  shotNumber: number;
  duration: string;
  scene: string;
  voiceover: string;
  subtitle: string;
  music: string;
  visual: TimelineVisual;
}

export interface LifeTimeline {
  id: string;
  personalityId: string;
  stages: Record<AgeStage, AgeStageState>;
  valueShifts: ValueShift[];
  erosionTrajectory: string;
  preservationPoints: string[];
  poster: TimelinePoster;
  storyboard: StoryboardShot[];
}

export interface PerspectiveView {
  perception: string;
  hiddenTruth: string;
  biasDetail: string;
}

export interface ExternalPerspective {
  friend: PerspectiveView;
  partner: PerspectiveView;
  parent: PerspectiveView;
  stranger: PerspectiveView;
}

export interface TradeOffItem {
  label: string;
  description: string;
  weight: 'light' | 'medium' | 'heavy';
}

export interface LifeTradeOff {
  gains: TradeOffItem[];
  losses: TradeOffItem[];
  regrets: string[];
  exchangeFormula: string;
  hiddenCost: string;
}

export interface StageTradeOff {
  gainedThisStage: string[];
  lostThisStage: string[];
  quietRegret: string;
  priceTag: string;
}

export interface TimelinePoster {
  title: string;
  tagline: string;
  goldenQuote: string;
  subtitle: string;
  characterLines: string[];
  worldlineName: string;
  visualTheme: string;
}

export interface TimelineTemplate {
  stages: Record<AgeStage, AgeStageState>;
  valueShifts: ValueShift[];
  erosionTrajectories: string[];
  preservationPoints: string[];
  posters: TimelinePoster[];
  storyboards: StoryboardShot[][];
}

