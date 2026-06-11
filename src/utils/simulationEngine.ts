import type { SimulationInput, ParallelPersonality, BigFive, CausalEvent, FactorWeights, ProfileCard, DivergenceEvent, LifeTimeline, AgeStage, VisualDocumentary, LifeTradeOff, StageTradeOff } from '@/types';
import type { DivergenceEventTemplate } from '@/data/personalityTemplates';
import { familyTemplates, eraTemplates, educationTemplates, traumaTemplates, resourcesTemplates, FactorTemplate } from '@/data/factorTemplates';
import { archetypeLibrary, seedKeywords, visualDocumentaryLibrary, tradeOffLibrary } from '@/data/personalityTemplates';
import { causalChainTemplates } from '@/data/causalChainTemplates';
import { timelineLibrary } from '@/data/timelineTemplates';

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

function buildProfile(
  archetype: typeof archetypeLibrary[keyof typeof archetypeLibrary],
  index: number
): ProfileCard {
  return {
    background: archetype.backgrounds[index % archetype.backgrounds.length],
    coreMotivation: archetype.coreMotivations[index % archetype.coreMotivations.length],
    greatestFear: archetype.greatestFears[index % archetype.greatestFears.length],
    dailyPattern: archetype.dailyPatterns[index % archetype.dailyPatterns.length],
    loveView: archetype.loveViews[index % archetype.loveViews.length],
    consumptionView: archetype.consumptionViews[index % archetype.consumptionViews.length],
    workStyle: archetype.workStyles[index % archetype.workStyles.length]
  };
}

function buildDivergenceEvent(
  archetype: typeof archetypeLibrary[keyof typeof archetypeLibrary],
  index: number
): DivergenceEvent {
  const events = archetype.divergenceEvents;
  const selected = events[index % events.length] as DivergenceEventTemplate;
  return {
    age: selected.age,
    title: selected.title,
    event: selected.event,
    consequence: selected.consequence
  };
}

function buildLifeTimeline(
  seedArchetype: string,
  personalityId: string,
  index: number,
  codeName: string,
  accentColor: string
): LifeTimeline {
  const template = timelineLibrary[seedArchetype];
  if (!template) {
    const fallbackTemplate = timelineLibrary['the-guardian'];
    return buildLifeTimeline('the-guardian', personalityId, index, codeName, accentColor);
  }

  const poster = template.posters[index % template.posters.length];
  const erosionTrajectory = template.erosionTrajectories[index % template.erosionTrajectories.length];
  const storyboard = template.storyboards[index % template.storyboards.length];

  const stagesWithFactors = {} as Record<AgeStage, any>;
  const ages: AgeStage[] = [20, 30, 40];
  
  for (const age of ages) {
    const stage = template.stages[age];
    stagesWithFactors[age] = {
      ...stage,
      occupation: stage.occupation,
      dailyLife: stage.dailyLife,
      stageTradeOff: buildStageTradeOff(seedArchetype, age, index)
    };
  }

  return {
    id: `tl-${Date.now()}-${index}`,
    personalityId,
    stages: stagesWithFactors,
    valueShifts: template.valueShifts,
    erosionTrajectory,
    preservationPoints: template.preservationPoints,
    poster: {
      ...poster,
      subtitle: `「${codeName}」世界线 · 20→30→40`
    },
    storyboard
  };
}

function buildVisualDocumentary(
  seedArchetype: string,
  index: number
): VisualDocumentary {
  const lib = visualDocumentaryLibrary[seedArchetype];
  if (!lib) {
    return {
      appearanceEvolution: { age20: '', age30: '', age40: '' },
      dressStyle: '',
      livingSpace: '',
      frequentScenes: [],
      signatureMonologue: '',
      conflictAxes: [],
      characterSilhouette: ''
    };
  }

  const appearance = lib.appearanceEvolution[index % lib.appearanceEvolution.length];
  const conflictSet = lib.conflictAxes[index % lib.conflictAxes.length];
  const scenes = lib.frequentScenes[index % lib.frequentScenes.length];

  return {
    appearanceEvolution: appearance,
    dressStyle: lib.dressStyle[index % lib.dressStyle.length],
    livingSpace: lib.livingSpace[index % lib.livingSpace.length],
    frequentScenes: scenes,
    signatureMonologue: lib.signatureMonologue[index % lib.signatureMonologue.length],
    conflictAxes: conflictSet,
    characterSilhouette: lib.characterSilhouette[index % lib.characterSilhouette.length]
  };
}

const stageTradeOffTemplates: Record<string, Record<AgeStage, StageTradeOff[]>> = {
  'the-guardian': {
    20: [
      {
        gainedThisStage: ['成为了所有人都信赖的那个人', '用行动建立了「靠谱」的个人品牌', '第一次感受到「被需要」的满足感'],
        lostThisStage: ['任性的资格', '偶尔偷懒的权利', '那个想为自己而活的少年梦'],
        quietRegret: '有次朋友约我去西藏旅行，我因为答应了帮同事顶班而拒绝了。现在想想，那是我最后一次可以说走就走的机会。',
        priceTag: '用「一个人的自由」，换来了「一群人的安心」。这笔交易，我当时以为赚了。'
      }
    ],
    30: [
      {
        gainedThisStage: ['稳定的家庭和事业基础', '家人的生活因为我的努力而变好了', '在团队中成为了不可或缺的支柱'],
        lostThisStage: ['每天下班后的那两个小时属于自己的时间', '和妻子说真心话的欲望（因为说了只会增加她的焦虑）', '在地下车库独处的十分钟里，突然发现自己已经不会笑了'],
        quietRegret: '儿子第一次叫爸爸那天，我在外地出差。后来他会说很多话了，但那句「爸爸」，我永远错过了最开始的那一声。',
        priceTag: '用「参与一个孩子成长的细节」，换来了「给他提供更好生活的能力」。这个交换，没人告诉我到底值不值。'
      }
    ],
    40: [
      {
        gainedThisStage: ['物质上终于不用再担心了', '家人都健康平安——这是最大的收获', '终于在某个深夜，承认了自己也需要被人照顾'],
        lostThisStage: ['那个二十岁想写诗的少年，已经彻底找不到了', '健康（体检报告上的箭头越来越多）', '和父母好好聊一次天的机会（他们已经老了，很多话题来不及了）'],
        quietRegret: '母亲在世时总说「你忙你的，不用回来」，我就真的没怎么回去。现在每次路过她常去的菜市场，都会停很久——想跟她说一句「我今天不忙，陪你逛逛」。',
        priceTag: '用「对自己的残忍」，换来了「对所有人的尽责」。这笔账算到四十岁，才发现自己是最大的负债方。'
      }
    ]
  },
  'the-wanderer': {
    20: [
      {
        gainedThisStage: ['第一次知道了「世界这么大」是什么感觉', '摆脱了所有「应该」的束缚', '遇到了很多一辈子都不会忘的人（虽然大多数都失去了联系）'],
        lostThisStage: ['同龄人的起点（他们毕业工作攒钱的时候，我在路上）', '稳定的恋爱关系（谁会跟一个不知道下个月在哪的人认真？）', '父母的期待——他们每次打电话都欲言又止，最后只说「注意安全」'],
        quietRegret: '在拉萨认识的那个浙江姑娘，说想跟我一起走。我当时害怕被束缚，连夜就走了。后来再也没遇到过像她那样眼睛里有星星的人。',
        priceTag: '用「所有人觉得「正常」的人生」，换来了「一个属于自己的、不被理解的人生」。我以为赚了，偶尔在深夜会怀疑。'
      }
    ],
    30: [
      {
        gainedThisStage: ['终于可以靠自己喜欢的事情养活自己了', '内心比二十岁平静了，不再需要用「在路上」证明什么', '有了几个虽然散落在世界各地但可以说心里话的朋友'],
        lostThisStage: ['母亲病重那年，我在亚马逊雨林里没信号，等我知道的时候已经是三个月后', '「落地生根」的可能性——试过，但扎根的能力已经退化了', '同龄人已经有的一切：房子、车子、稳定的社会身份'],
        quietRegret: '在大理那一年，真的差一点就留下来了。客栈、她、还有那个没能出生的孩子。有时候会梦见他们，梦里我们有一个院子，院子里种满了花。',
        priceTag: '用「一个可以回去的家」，换来了「无数个可以去的远方」。这个交换的重量，三十岁才开始慢慢感受到。'
      }
    ],
    40: [
      {
        gainedThisStage: ['终于不再需要向任何人解释我的活法了', '内心真正的安定——不再需要用物理上的移动来逃避什么', '写了一本书，记录了二十年的旅途，有人说它改变了自己的人生'],
        lostThisStage: ['身体（常年旅途留下的各种小毛病）', '父亲去世时没赶上最后一面——这是这辈子最大的遗憾', '跟老友重新坐在一起时，发现我们已经没有共同语言了'],
        quietRegret: '去年回了一趟那个小镇，走在童年的街道上，突然哭了。不是因为怀念，是因为我终于承认——我走了二十年，其实一直在跟这个地方较劲。而它，早就不记得我了。',
        priceTag: '用「所有人都看得见的「成功」」，换来了「只有自己才懂的「自由」」。这笔交易是否划算，我至今没有答案。但如果再选一次——可能还是会走同样的路。'
      }
    ]
  },
  'the-warrior': {
    20: [
      {
        gainedThisStage: ['第一次打败了那个看不起我的人', '建立了「只要够拼就没有得不到」的信念', '身体和意志都被锻造得像钢铁一样硬'],
        lostThisStage: ['温柔——那个年纪应该有的柔软，全部被我亲手掐死了', '信任人的能力（被背叛过一次之后，就再也学不会了）', '好好谈一场恋爱的机会（我把所有异性都当成了需要征服的目标）'],
        quietRegret: '大二那年有个姑娘对我特别好，她说「你不用什么事都赢的」。我当时觉得她幼稚，故意说了很难听的话让她走。后来再也没人跟我说过那样的话。',
        priceTag: '用「柔软的心」，换来了「锋利的铠甲」。当时觉得赚翻了，后来才发现——铠甲穿久了，会长在肉里，脱不下来。'
      }
    ],
    30: [
      {
        gainedThisStage: ['三十岁就赚到了别人一辈子赚不到的钱', '站在了曾经仰望的位置上', '那些曾经看不起我的人，现在都要仰着头看我'],
        lostThisStage: ['分辨「我喜欢」和「我应该赢」的能力（什么事都变成了战斗，包括谈恋爱）', '好好睡一觉的能力（失眠是常态，脑子里永远在想下一场仗怎么打）', '父亲最后那几年——我们没说过超过十句话，每次见面都吵架'],
        quietRegret: '前女友跟我分手那天，收拾东西的时候她看着我说「你有没有想过，你可能永远不会爱一个人？」我当时冷冷地说「爱能当饭吃吗？」。现在我有了一辈子吃不完的饭，才发现——原来她问的那个问题，我真的没有答案。',
        priceTag: '用「爱一个人的能力」，换来了「被所有人仰视的位置」。站在山顶的那一天，我才发现——山顶的风，真的很冷。'
      }
    ],
    40: [
      {
        gainedThisStage: ['终于明白了「赢不是一切」这个道理（虽然来得有点晚）', '遇到了一个能让我卸下盔甲的人（虽然我花了三年才敢在她面前哭）', '开始学着做一个「不那么有用」的人——第一次觉得，活着不是为了战斗'],
        lostThisStage: ['健康（高血压、脂肪肝、长期失眠——身体开始跟我算总账了）', '跟母亲和解的机会（她走的时候，我还在开一个会。等我赶到，她已经凉了）', '当年一起打天下的兄弟——因为一次误会，我把他赶走了，再也没联系过'],
        quietRegret: '父亲去世一周年那天，我一个人去了墓地。在他的墓碑前坐了一下午，把这些年发生的事都跟他说了——包括那些我赢了的、输了的、骄傲的、后悔的。临走的时候，我终于说了那句憋了半辈子的话：「爸，我做到了。你可以，夸我一句吗？」风很大，没人回答我。',
        priceTag: '用「二十年的寿命和爱的能力」，换来了「世俗意义上的成功」。四十岁这年，我终于决定——停止这笔交易。虽然亏了，但剩下的日子，我想为自己活。'
      }
    ]
  },
  'the-healer': {
    20: [
      {
        gainedThisStage: ['第一次真真切切地感受到「我改变了某个人的人生」', '有了一群掏心掏肺的朋友（他们都说「你是最懂我的人」）', '知道了自己的天赋——能接住别人接不住的情绪'],
        lostThisStage: ['「优先考虑自己」的习惯（已经彻底忘了那是什么感觉）', '关手机的权利——永远担心万一有人需要我怎么办', '对别人说「不」之后，不产生强烈负罪感的能力'],
        quietRegret: '有天深夜我真的很累，跟一个朋友说「今天能不能聊点别的？」她当时沉默了一下说「对不起，打扰你了」。后来她再也没主动找过我。我后来才知道，那时候她正准备自杀。现在每次想起她那句「打扰你了」，都像有刀在心上划。',
        priceTag: '用「照顾好自己的本能」，换来了「照顾好所有人的能力」。这笔账从一开始就不平衡，但我当时以为——我能扛。'
      }
    ],
    30: [
      {
        gainedThisStage: ['成了业内小有名气的咨询师/老师，帮助过很多很多人', '有了稳定的收入和一个看起来很温馨的家', '来访者走的时候都说「谢谢你，你是我生命里的光」'],
        lostThisStage: ['深度睡眠——经常做噩梦，梦见自己掉进了情绪的海里，怎么游都游不上来', '身体——慢性疲劳、偏头痛、肠胃紊乱，医生说「你需要休息」，但我怎么停得下来？', '那段陪我走过抑郁症低谷的友谊——因为我太忙了，慢慢就淡了。等我想起来的时候，已经没有联系方式了'],
        quietRegret: '妈妈在世的时候总说「你能不能也关心关心你自己？」我每次都说「我没事，你放心」。后来她走了，我在整理她遗物的时候，看到她笔记本里写着一句话：「我这孩子什么都好，就是太不爱自己了。」那天我在她房间里，哭到虚脱。',
        priceTag: '用「自己的情绪健康」，换来了「无数人的情绪解脱」。到三十岁才发现——这个账户，早就透支了。而我，连申请破产的资格都没有。'
      }
    ],
    40: [
      {
        gainedThisStage: ['终于学会了说「不」——而且说完之后，不再内疚了（虽然花了整整两年）', '开始真正明白「先爱自己再爱别人」这句话，不是鸡汤是真理', '遇到了一个会跟我说「今天你什么都不用做，让我来照顾你」的人'],
        lostThisStage: ['二十年里那些被我消耗掉的生命力——它不会回来了', '那段没能挽救的友谊——如果当时我多问一句「你怎么了」，会不会结果不一样？', '健康——透支的身体，需要花很久很久才能修复，有些甚至修不好了'],
        quietRegret: '今年生日那天，我给自己买了一个蛋糕，然后一个人坐在家里，把那句「祝你生日快乐」认认真真地对自己说了一遍。说着说着就哭了——因为我发现，这是我四十年来，第一次把自己当成一个需要被庆祝的人。',
        priceTag: '用「前半辈子燃烧自己」，换来了「后半辈子学会爱自己」。这个交换的代价太大了。但好在——我终于开始了。虽然晚了四十年，但总比一辈子没开始好。'
      }
    ]
  },
  'the-philosopher': {
    20: [
      {
        gainedThisStage: ['建立了「未经审视的人生不值得过」的信念', '拥有了一个任何人都拿不走的内在宇宙', '第一次体验到「想通了一个困扰很久的问题」那种狂喜'],
        lostThisStage: ['「正常地生活」的能力——看到什么都想问「为什么」，包括「人为什么要上班」', '跟大多数人的共同语言——同龄人聊房子车子工作的时候，我在想「人活着到底为了什么」', '行动的勇气——总在「想清楚」和「做」之间犹豫，结果很多事想了很久，最后都没做'],
        quietRegret: '大三那年有个去德国交换的机会，名额已经拿到了。但那段时间我正陷在存在主义危机里，觉得「去哪都一样，反正人生没有意义」，就放弃了。后来才知道——意义不是想出来的，是活出来的。',
        priceTag: '用「脚踏实地地生活」，换来了「仰望星空地思考」。当时以为这是一个高尚的选择，后来才发现——没有脚踏实地的仰望星空，很容易掉下去。'
      }
    ],
    30: [
      {
        gainedThisStage: ['终于能靠「思考」这件事养活自己了（虽然赚得不多但很开心）', '有了一两个能真正聊到灵魂深处的朋友——这种深度联结，比一百个泛泛之交珍贵', '思想比二十岁时更沉了，不再是为了语出惊人而思考'],
        lostThisStage: ['那个叫「行动力」的东西——它依然很弱，很多事想到了，但总在「等想清楚」的过程中错过了', '父亲最后那几年——他总想跟我聊点「实在的」，比如工作、结婚、钱。我总觉得那些话题太庸俗，不愿意聊。', '一段本可以很幸福的感情——她说「我不需要你想那么多，我只想要你陪我好好过日子」，我当时觉得那是「未经审视的人生」'],
        quietRegret: '父亲临终前一周，他给我打电话，说「回来看看我吧」。我那时候正在改一篇论文，说「等我改完这一段就回」。等我改完，接到的是我哥的电话。回家的火车上，我把他这辈子对我说过的每一句话，都在心里过了一遍。才发现——那些我觉得「庸俗」的话，每一句都是他能想到的、表达爱的方式。',
        priceTag: '用「参与生活的热情」，换来了「观察生活的清醒」。三十岁这年我终于承认——清醒的旁观者，有时候不如糊涂的参与者幸福。'
      }
    ],
    40: [
      {
        gainedThisStage: ['终于不再执着于「找到终极答案」了——因为我明白了，提问的过程本身就是答案', '在思想和生活之间找到了一个平衡点——可以仰望星空，也可以好好交房租', '遇到了一个人，她不需要我「想太多」，她只是喜欢跟我一起待着，什么都不说也很好'],
        lostThisStage: ['二十年里那些因为「等想清楚」而错过的人和事——它们不会再回来了', '那种「只要找到真理一切就会好起来」的少年心气——它被现实磨平了，说不清是好事还是坏事', '跟母亲好好聊一次天的机会——她走的时候，我在做讲座，等我赶到，她已经等不及了'],
        quietRegret: '去年整理旧物，翻出了二十岁时写的日记。那本日记的最后一页，写着一行字：「如果有一天我变成了一个庸俗的大人，请记得叫醒我。」我坐在地上，把那本日记看了整整一下午，然后在最后一页的后面，又写了一行字：「对不起，我变成了你最讨厌的那种人。但是——我现在很快乐。这种快乐，不是你能懂的那种。」',
        priceTag: '用「少年时那种纯粹的、不计代价的理想主义」，换来了「中年时那种平和的、与生活和解的通透」。这个交换，我到四十岁才终于觉得——也许，不亏。'
      }
    ]
  }
};

function buildLifeTradeOff(
  seedArchetype: string,
  index: number
): LifeTradeOff {
  const templates = tradeOffLibrary[seedArchetype];
  if (!templates || templates.length === 0) {
    return {
      gains: [],
      losses: [],
      regrets: [],
      exchangeFormula: '',
      hiddenCost: ''
    };
  }
  const selected = templates[index % templates.length];
  return {
    gains: JSON.parse(JSON.stringify(selected.gains)),
    losses: JSON.parse(JSON.stringify(selected.losses)),
    regrets: [...selected.regrets],
    exchangeFormula: selected.exchangeFormulas[index % selected.exchangeFormulas.length],
    hiddenCost: selected.hiddenCosts[index % selected.hiddenCosts.length]
  };
}

function buildStageTradeOff(
  seedArchetype: string,
  age: AgeStage,
  index: number
): StageTradeOff {
  const archetypeTemplates = stageTradeOffTemplates[seedArchetype];
  if (!archetypeTemplates) {
    return {
      gainedThisStage: [],
      lostThisStage: [],
      quietRegret: '',
      priceTag: ''
    };
  }
  const ageTemplates = archetypeTemplates[age];
  if (!ageTemplates || ageTemplates.length === 0) {
    return {
      gainedThisStage: [],
      lostThisStage: [],
      quietRegret: '',
      priceTag: ''
    };
  }
  const selected = ageTemplates[index % ageTemplates.length];
  return JSON.parse(JSON.stringify(selected));
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

  const id = `p-${Date.now()}-${index}`;
  const lifeTimeline = buildLifeTimeline(seedArchetype, id, index, codeName, accentColor);
  const visualDocumentary = buildVisualDocumentary(seedArchetype, index);

  return {
    id,
    archetype: seedArchetype,
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
    },
    profile: buildProfile(archetype, index),
    divergenceEvent: buildDivergenceEvent(archetype, index),
    lifeTimeline,
    visualDocumentary,
    lifeTradeOff: buildLifeTradeOff(seedArchetype, index)
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
