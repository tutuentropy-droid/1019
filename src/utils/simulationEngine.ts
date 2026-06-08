import type { SimulationInput, ParallelPersonality, BigFive, CausalEvent, FactorWeights } from '@/types';
import { familyTemplates, eraTemplates, educationTemplates, traumaTemplates, resourcesTemplates, FactorTemplate } from '@/data/factorTemplates';
import { archetypeLibrary, seedKeywords } from '@/data/personalityTemplates';
import { causalChainTemplates } from '@/data/causalChainTemplates';

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomN = <T,>(arr: T[], n: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
};

function detectSeedArchetype(content: string): string {
  const lowerContent = content.toLowerCase();
  for (const [keywords, archetype] of Object.entries(seedKeywords) as [string, string][]) {
    const pattern = new RegExp(keywords.split('|').join('|'), 'i');
    if (pattern.test(lowerContent)) {
      return archetype;
    }
  }
  const all = Object.keys(archetypeLibrary);
  return all[Math.floor(Math.random() * all.length)];
}

function weightedSample<T extends FactorTemplate>(
  templates: T[],
  weight: number,
  totalWeight: number
): T {
  const normalizedWeight = weight / totalWeight;
  const scores = templates.map((_, i) => {
    const base = Math.random();
    return base + normalizedWeight * (i % 2 === 0 ? 0.3 : -0.1);
  });
  const maxIndex = scores.indexOf(Math.max(...scores));
  return templates[maxIndex];
}

function sampleFactors(weights: FactorWeights) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  return {
    family: weightedSample(familyTemplates, weights.family, total),
    era: weightedSample(eraTemplates, weights.era, total),
    education: weightedSample(educationTemplates, weights.education, total),
    trauma: weightedSample(traumaTemplates, weights.trauma, total),
    resources: weightedSample(resourcesTemplates, weights.resources, total)
  };
}

function computeBaseBigFive(seedArchetype: string): BigFive {
  const base: Record<string, BigFive> = {
    'the-guardian': { openness: 40, conscientiousness: 85, extraversion: 45, agreeableness: 65, neuroticism: 45 },
    'the-wanderer': { openness: 90, conscientiousness: 40, extraversion: 60, agreeableness: 55, neuroticism: 55 },
    'the-warrior': { openness: 55, conscientiousness: 75, extraversion: 65, agreeableness: 35, neuroticism: 70 },
    'the-healer': { openness: 70, conscientiousness: 55, extraversion: 50, agreeableness: 90, neuroticism: 65 },
    'the-philosopher': { openness: 85, conscientiousness: 60, extraversion: 30, agreeableness: 60, neuroticism: 50 }
  };
  if (base[seedArchetype]) {
    return { ...base[seedArchetype] };
  }
  return { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 };
}

function applyFactorModifiers(
  base: BigFive,
  factors: { family: FactorTemplate; era: FactorTemplate; education: FactorTemplate; trauma: FactorTemplate; resources: FactorTemplate }
): BigFive {
  const result = { ...base };
  const all = [factors.family, factors.era, factors.education, factors.trauma, factors.resources];
  for (const factor of all) {
    const mod = factor.bigFiveModifier;
    for (const [key, value] of Object.entries(mod)) {
      if (value && key in result) {
        (result as any)[key] += value + (Math.random() * 10 - 5);
      }
    }
  }
  return {
    openness: clamp(result.openness),
    conscientiousness: clamp(result.conscientiousness),
    extraversion: clamp(result.extraversion),
    agreeableness: clamp(result.agreeableness),
    neuroticism: clamp(result.neuroticism)
  };
}

function generateCausalChain(
  factors: { family: FactorTemplate; era: FactorTemplate; education: FactorTemplate; trauma: FactorTemplate; resources: FactorTemplate },
  _bigFive: BigFive
): CausalEvent[] {
  const chain: CausalEvent[] = [];
  const factorMap: Record<string, FactorTemplate> = {
    family: factors.family,
    era: factors.era,
    education: factors.education,
    trauma: factors.trauma,
    resources: factors.resources
  };

  for (const template of causalChainTemplates) {
    const factor = factorMap[template.factor];
    const eventBase = random(template.events);
    const impactBase = random(template.impacts);
    const age = template.ageRange[0] + Math.floor(Math.random() * (template.ageRange[1] - template.ageRange[0] + 1));
    chain.push({
      age,
      event: `${factor.label}背景下：${eventBase}`,
      impact: impactBase
    });
  }

  return chain.sort((a, b) => a.age - b.age);
}

function buildPersonality(
  seedArchetype: string,
  factors: { family: FactorTemplate; era: FactorTemplate; education: FactorTemplate; trauma: FactorTemplate; resources: FactorTemplate },
  index: number,
  total: number
): ParallelPersonality {
  const archetype = archetypeLibrary[seedArchetype];
  const bigFive = applyFactorModifiers(computeBaseBigFive(seedArchetype), factors);
  const causalChain = generateCausalChain(factors, bigFive);

  const codeName = archetype.codeNames[index % archetype.codeNames.length];
  const tagline = archetype.taglines[index % archetype.taglines.length];
  const personality = archetype.personalities[index % archetype.personalities.length];
  const accentColor = archetype.accentColors[index % archetype.accentColors.length];

  const factorContext = `在「${factors.family.label}」「${factors.era.label}」「${factors.education.label}」「${factors.trauma.label}」「${factors.resources.label}」的多重作用下——`;

  return {
    id: `p-${Date.now()}-${index}`,
    codeName,
    accentColor,
    tagline,
    personality: factorContext + personality,
    catchphrase: randomN(archetype.catchphrases, 3),
    values: randomN(archetype.values, 4),
    lifeChoices: randomN(archetype.lifeChoices, 4),
    contradictions: randomN(archetype.contradictions, 3),
    bigFive,
    causalChain,
    factors: {
      family: factors.family.label,
      era: factors.era.label,
      education: factors.education.label,
      trauma: factors.trauma.label,
      resources: factors.resources.label
    }
  };
}

export function runSimulation(input: SimulationInput): ParallelPersonality[] {
  const seedArchetype = detectSeedArchetype(input.content);
  const allArchetypes = Object.keys(archetypeLibrary);
  const selectedArchetypes = new Set<string>([seedArchetype]);

  while (selectedArchetypes.size < input.personalityCount) {
    selectedArchetypes.add(random(allArchetypes));
  }

  const archetypeList = Array.from(selectedArchetypes);

  return archetypeList.map((archetype, i) => {
    const factors = sampleFactors(input.factorWeights);
    return buildPersonality(archetype, factors, i, input.personalityCount);
  });
}

export const exampleInputs = {
  sentence: '我从小就觉得自己和别人不一样，总想搞清楚这一切是为什么。',
  experience: '高中三年都是班长，高考那年父亲意外去世，我放弃了北大去了本地的一所大学照顾母亲。',
  portrait: '男，28岁，小镇做题家出身，目前在一线城市互联网大厂做程序员，单身，存款50万，时常感觉人生没有意义。'
};
