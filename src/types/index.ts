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
}

export type AppStage = 'home' | 'simulating' | 'result';

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

