export interface DebateTopic {
  id: string;
  title: string;
  subtitle: string;
  question: string;
}

export interface PersonalityVoice {
  archetype: string;
  speechStyle: {
    sentenceLength: 'short' | 'medium' | 'long' | 'mixed';
    tone: string;
    vocabulary: string[];
    fillers: string[];
    argumentPattern: string;
  };
  cognitiveBiases: string[];
  debateTactics: string[];
}

export interface DialogueTurn {
  archetype: string;
  line: string;
  emotion: 'calm' | 'passionate' | 'skeptical' | 'gentle' | 'analytical' | 'defiant';
}

export interface DialogueScript {
  topicId: string;
  rounds: DialogueTurn[][];
}

export const DEBATE_TOPICS: DebateTopic[] = [
  {
    id: 'stability-vs-freedom',
    title: '安稳还是自由？',
    subtitle: '人生的终极选择',
    question: '如果只能选一个，你愿意过一眼望到头的安稳人生，还是永远充满未知的漂泊人生？'
  },
  {
    id: 'love-vs-ambition',
    title: '爱情还是事业？',
    subtitle: '心与路的抉择',
    question: '在人生的关键路口，你会选择留下来陪你爱的人，还是独自奔赴那个可能改变命运的机会？'
  },
  {
    id: 'principles-vs-results',
    title: '原则还是结果？',
    subtitle: '手段与目的的永恒争论',
    question: '为了一个好的结果，你愿意在多大程度上妥协自己的原则？'
  },
  {
    id: 'self-vs-others',
    title: '为自己活还是为别人活？',
    subtitle: '责任与自我的边界',
    question: '人这一生，到底应该优先满足自己的期待，还是优先满足身边人的期待？'
  }
];

export const PERSONALITY_VOICES: Record<string, PersonalityVoice> = {
  'the-guardian': {
    archetype: 'the-guardian',
    speechStyle: {
      sentenceLength: 'medium',
      tone: '沉稳、坚定、带着不容置疑的责任感',
      vocabulary: ['承诺', '责任', '说到做到', '靠谱', '兜底', '原则', '底线', '踏实', '稳定', '守护'],
      fillers: ['说实话', '讲真', '我一直认为', '你仔细想想'],
      argumentPattern: '从经验和责任出发，用具体事例支撑，强调承诺和后果'
    },
    cognitiveBiases: [
      '责任偏差：过度把别人的问题扛到自己身上',
      '现状偏差：对稳定和已知有天然偏好，恐惧变化',
      '承诺升级：一旦做出承诺就会不计代价地守住'
    ],
    debateTactics: [
      '用"如果每个人都这样想"做道德推演',
      '抛出极端场景拷问对方的底线',
      '用自己或身边人的真实经历作为论据'
    ]
  },
  'the-wanderer': {
    archetype: 'the-wanderer',
    speechStyle: {
      sentenceLength: 'mixed',
      tone: '慵懒、诗意、带着一丝看破的洒脱',
      vocabulary: ['体验', '自由', '在路上', '旷野', '当下', '可能性', '漂泊', '感受', '灵魂', '风景'],
      fillers: ['哎呀', '你懂的', '其实吧', '怎么说呢', '无所谓啦'],
      argumentPattern: '用比喻和意象说话，绕开逻辑直接击中原型，强调体验本身的价值'
    },
    cognitiveBiases: [
      '新奇偏差：高估新体验的价值，低估稳定的好处',
      '承诺恐惧：对任何长期绑定都有本能的排斥',
      '浪漫化偏差：把"在路上"的生活过度诗意化'
    ],
    debateTactics: [
      '用诗意的类比消解对方严肃的论证',
      '抛出"你死前会后悔什么"的终极问题',
      '用个人经历的故事而非数据说服'
    ]
  },
  'the-warrior': {
    archetype: 'the-warrior',
    speechStyle: {
      sentenceLength: 'short',
      tone: '锐利、强势、带着不容反驳的底气',
      vocabulary: ['赢', '战斗', '强者', '靠自己', '尊严', '拼命', '底线', '证明', '掌控', '胜利'],
      fillers: ['听着', '我跟你说', '别扯别的', '说白了', '现实就是'],
      argumentPattern: '直截了当，直击要害，用结果和实力说话，不绕弯子'
    },
    cognitiveBiases: [
      '控制偏差：相信一切都可以通过努力和意志掌控',
      '力量偏差：把所有问题都转化为强弱之争',
      '胜利偏差：高估赢的价值，忽视胜利的代价'
    ],
    debateTactics: [
      '直接打断对方的逻辑链条，抛出更尖锐的问题',
      '用"弱者才会..."的句式进行框架压制',
      '把抽象的哲学问题拉回具体的生存现实'
    ]
  },
  'the-healer': {
    archetype: 'the-healer',
    speechStyle: {
      sentenceLength: 'long',
      tone: '温柔、包容、带着共情的理解',
      vocabulary: ['理解', '感受', '陪伴', '看见', '温暖', '联结', '心疼', '接纳', '治愈', '共情'],
      fillers: ['我能理解', '其实你有没有想过', '也许', '会不会是', '没关系的'],
      argumentPattern: '先共情再表达，关注每个人的感受，用柔软的方式说出深刻的话'
    },
    cognitiveBiases: [
      '共情偏差：过度代入他人的痛苦而失去判断',
      '圣母偏差：相信自己可以拯救任何人',
      '回避偏差：为了维持和谐而回避必要的冲突'
    ],
    debateTactics: [
      '先接住对方的情绪再表达不同观点',
      '问"你为什么会这么想"来探寻深层动机',
      '用"每个人都有自己的难处"来化解对立'
    ]
  },
  'the-philosopher': {
    archetype: 'the-philosopher',
    speechStyle: {
      sentenceLength: 'long',
      tone: '冷静、抽离、带着旁观者的清明',
      vocabulary: ['本质', '表象', '意义', '存在', '思考', '假设', '逻辑', '前提', '解构', '真理'],
      fillers: ['等一下', '这里有个问题', '我们先定义一下', '从逻辑上讲', '其实反过来想'],
      argumentPattern: '先澄清概念和前提，再推演逻辑，最后解构问题本身'
    },
    cognitiveBiases: [
      '过度思考偏差：分析瘫痪，想得太多做得太少',
      '解构偏差：能解构一切意义，却难以建构任何东西',
      '超然偏差：过度抽离，难以投入真实的生活'
    ],
    debateTactics: [
      '质疑问题本身的前提，指出"你们都在错误的框架里争论"',
      '用思想实验把对方推向逻辑的极端',
      '指出各方观点中隐藏的自相矛盾'
    ]
  }
};

const S1 = DEBATE_TOPICS[0].id;
const S2 = DEBATE_TOPICS[1].id;
const S3 = DEBATE_TOPICS[2].id;
const S4 = DEBATE_TOPICS[3].id;

export const DIALOGUE_SCRIPTS: Record<string, DialogueScript> = {
  [S1]: {
    topicId: S1,
    rounds: [
      [
        { archetype: 'the-warrior', line: '听着，这问题根本不用想。安稳？安稳是给弱者准备的。我见过太多人二十岁就死了，八十岁才埋——一辈子活在别人画的框框里，临死前连一件值得说的事都没有。', emotion: 'defiant' },
        { archetype: 'the-guardian', line: '说得轻巧。你去问问那些半夜被房东赶出来的人，问问那些孩子生病拿不出钱的人，安稳对他们来说是什么？安稳不是懦弱，安稳是你给家人撑起的那片天。', emotion: 'passionate' }
      ],
      [
        { archetype: 'the-wanderer', line: '哎呀你们俩，一个说要打天下一个说要守老家，其实都在被同一个东西骗——就是"人生必须选一条路走到底"这个念头。人生不是轨道啊，是旷野。你可以今天在写字楼里开会，明天在草原上看星星，两者不矛盾的。', emotion: 'calm' },
        { archetype: 'the-philosopher', line: '等一下，这里有个更根本的问题。我们先定义一下"安稳"和"自由"。你说的安稳，是内心的安稳还是外在的安稳？你说的自由，是选择的自由还是逃避的自由？很多人以为自己在追求自由，其实只是在逃避对自己人生的责任。', emotion: 'analytical' }
      ],
      [
        { archetype: 'the-healer', line: '我能理解大家说的每一种。其实有没有可能，我们选的不是安稳或者自由，而是"不后悔"？守夜人守着自己的承诺不后悔，追风者追着风不后悔，战士赢了不后悔——只要是你自己选的，怎么都好。最怕的是，选了A，一辈子都在想B的好。', emotion: 'gentle' },
        { archetype: 'the-warrior', line: '别扯这些模棱两可的话。现实就是——你不拼，连选的资格都没有。安稳也是要靠实力撑的，不是你想安稳就能安稳的。', emotion: 'defiant' },
        { archetype: 'the-guardian', line: '这我同意。但拼不一定要拿一切去赌。有些东西输了就赢不回来了——比如信任，比如陪伴，比如那些人还在的日子。', emotion: 'calm' }
      ],
      [
        { archetype: 'the-wanderer', line: '哈哈哈，你们看，说着说着又说到一起去了。其实争论这个问题本身就很有意思——我们每个人心里都住着想安稳的部分和想自由的部分，不是吗？那个不敢辞职的你，和那个想买张单程票的你，都是真的你。', emotion: 'calm' },
        { archetype: 'the-philosopher', line: '从逻辑上讲，这个问题本身就是个伪命题。没有人能永远安稳，也没有人能永远自由。我们终其一生，只是在这两者之间找一个自己能接受的平衡点而已。承认这一点，反而自由了。', emotion: 'analytical' }
      ]
    ]
  },
  [S2]: {
    topicId: S2,
    rounds: [
      [
        { archetype: 'the-guardian', line: '说实话，我见过太多人为了所谓的"机会"丢了最珍贵的东西。功成名就回来，物是人非，那个等你的人已经不在了。这样的机会，要来干什么？', emotion: 'passionate' },
        { archetype: 'the-warrior', line: '你反过来想呢？如果你留下来了，一辈子庸庸碌碌，夜深人静的时候你会不会想——当年如果我走了，会不会不一样？这种"如果"最折磨人。', emotion: 'defiant' }
      ],
      [
        { archetype: 'the-healer', line: '我能理解两边的难。其实选哪条路都会后悔的，只是后悔的东西不一样。留下来的人后悔"我本可以"，走了的人后悔"我错过了"。我们能做的，只是选一个自己更能承受的后悔。', emotion: 'gentle' },
        { archetype: 'the-wanderer', line: '怎么说呢，我觉得这个问题的前提就有问题。为什么爱和事业一定是二选一？如果那个人真的爱你，TA会希望你变成更好的自己，而不是把你绑在身边。真正的爱，是两个自由的灵魂选择同行，不是互相捆绑。', emotion: 'skeptical' }
      ],
      [
        { archetype: 'the-philosopher', line: '我们先定义一下"爱"。你说的爱，是占有还是成全？你说的事业，是自我实现还是逃避亲密的借口？很多人喊着"我要搞事业"，其实只是害怕进入一段真正的亲密关系，因为那意味着暴露脆弱、意味着失控。', emotion: 'analytical' },
        { archetype: 'the-warrior', line: '听着，不管你怎么定义，有一点是现实——你弱的时候，连选择爱的资格都没有。你拿什么去爱？空口说白话吗？先有能力站着，再谈爱谁。', emotion: 'passionate' },
        { archetype: 'the-guardian', line: '但等你终于"站着"了，可能那个愿意和你一起蹲着的人已经走了。人生不是打游戏，没有存档读档。', emotion: 'calm' }
      ],
      [
        { archetype: 'the-healer', line: '你们有没有发现一个有意思的事？我们讨论这个问题的时候，其实都在假设"那个人"是被动的——留下来等的是TA，被抛弃的是TA。但其实，爱情里的两个人都有选择权。如果真的相爱，应该是两个人一起商量去哪，而不是一个人等另一个人。', emotion: 'gentle' },
        { archetype: 'the-wanderer', line: '对嘛！最好的情况不就是——你走你的路，我走我的路，如果顺路就一起走一段。如果不顺路，那也各自精彩，彼此祝福。为什么非要把爱情搞成牺牲和亏欠？', emotion: 'calm' }
      ]
    ]
  },
  [S3]: {
    topicId: S3,
    rounds: [
      [
        { archetype: 'the-warrior', line: '说白了，这世界只看结果。你手段再干净，输了就是输了，没人记得你。你手段不那么好看，但赢了，所有人都会给你找理由。现实就是这样。', emotion: 'defiant' },
        { archetype: 'the-guardian', line: '那底线呢？有些事你做了，一辈子都回不了头。钱可以再赚，机会可以再等，但你变成了自己讨厌的那种人，这个结果谁来承担？', emotion: 'passionate' }
      ],
      [
        { archetype: 'the-philosopher', line: '等一下，我们先搞清楚"原则"是谁的原则。是你自己真心认同的原则，还是社会灌输给你的、父母教给你的、别人期待你遵守的原则？很多人死守的"原则"，其实根本不是自己的，只是从未质疑过而已。', emotion: 'analytical' },
        { archetype: 'the-healer', line: '我能理解想赢的心情，也能理解想守住底线的心情。但有没有第三种可能——不用非要在"肮脏的赢"和"干净的输"之间选？也许还有一条路，慢一点，难一点，但既对得起结果，也对得起自己。', emotion: 'gentle' }
      ],
      [
        { archetype: 'the-wanderer', line: '哎呀，你们都太严肃了。其实吧，过个十年二十年回头看，你当时以为天大的"原则"和天大的"结果"，可能都没那么重要。重要的是，你每天早上照镜子的时候，能不能直视自己的眼睛。别的都是虚的。', emotion: 'calm' },
        { archetype: 'the-warrior', line: '别站着说话不腰疼。当你身后站着一大家子人等你吃饭的时候，你跟我谈照镜子？有些妥协不是为了自己，是为了身后的人。这你怎么说？', emotion: 'defiant' },
        { archetype: 'the-guardian', line: '为了身后的人妥协可以理解，但不能什么都妥协。有些事，你以为是为了家人，其实是把家人拖进了更深的泥沼。', emotion: 'calm' }
      ],
      [
        { archetype: 'the-philosopher', line: '从逻辑上讲，这里有个有趣的悖论：你为了一个"好结果"放弃原则，但那个结果之所以"好"，恰恰是因为有原则的人在遵守规则。如果所有人都不择手段，那你想要的那个"好结果"本身也就不存在了。', emotion: 'analytical' },
        { archetype: 'the-healer', line: '也许答案不在"要不要妥协"，而在"妥协到什么程度"。画一条自己的线——这条线以内，怎么都好商量；这条线以外，谁来都不行。每个人的线不一样，但你得知道自己的线在哪。', emotion: 'gentle' }
      ]
    ]
  },
  [S4]: {
    topicId: S4,
    rounds: [
      [
        { archetype: 'the-guardian', line: '讲真，人不能只为自己活。你小的时候，是谁一把屎一把尿把你拉扯大的？你能站在这里说话，是因为有人在你看不见的地方替你扛了太多。说"为自己活"之前，先把欠的债还了。', emotion: 'passionate' },
        { archetype: 'the-wanderer', line: '欠债？你把人生说成欠账了？父母养孩子是为了"收债"吗？那这爱也太功利了吧。每个人都是独立的个体，你欠父母的是爱和陪伴，不是按他们的剧本活一辈子。', emotion: 'skeptical' }
      ],
      [
        { archetype: 'the-warrior', line: '听着，我跟你说句实在的——你只有先把自己活明白了，才能真正对别人好。你自己都活得憋屈、怨天尤人，你以为你能给身边人带来什么？负能量罢了。先顾好自己，这不是自私，是基础。', emotion: 'defiant' },
        { archetype: 'the-healer', line: '我能理解两边的心情。那些说"要为自己活"的人，可能从小到大都在满足别人的期待，从来没有过自己的人生；那些说"不能只为自己活"的人，可能见过太多被"自我"两个字冲昏头、做出伤害家人的事的人。其实我们都是在说自己的伤。', emotion: 'gentle' }
      ],
      [
        { archetype: 'the-philosopher', line: '这里有个更根本的问题：这个"自己"是谁？你以为的"自己的选择"，真的是你自己的吗？还是消费主义、社交媒体、你羡慕的某个人生观灌输给你的？"为自己活"这三个字说起来很酷，但前提是你得先搞清楚"自己"到底是谁。', emotion: 'analytical' },
        { archetype: 'the-guardian', line: '这话我同意一半。但哪怕"自己"是被塑造的，责任是真实的。你爸妈老了病了需要人照顾，你跟他们说"我要去寻找自我"？这说得出口吗？', emotion: 'calm' },
        { archetype: 'the-warrior', line: '那你有没有想过，你爸妈真正想要的是什么？是你按他们的剧本活一辈子，还是你真正过得开心？大多数父母最后都会妥协的——只要你真的过得好。', emotion: 'passionate' }
      ],
      [
        { archetype: 'the-healer', line: '会不会，我们在讨论的其实不是"选A还是选B"，而是"有没有可能不选"？有没有可能，我们既照顾好身边的人，也不放弃自己？虽然很难，虽然需要更多的智慧和耐心，但不是不可能。非黑即白的选择，往往是因为我们懒得去找第三条路。', emotion: 'gentle' },
        { archetype: 'the-wanderer', line: '就是嘛！人生又不是考试，没有唯一正确答案。你可以周一到周五好好上班养家人，周末背着包去爬山；你可以在小城市陪着父母，但心里装着整个世界。这两者不矛盾的。真正困住我们的，从来不是现实，是"必须二选一"的执念。', emotion: 'calm' },
        { archetype: 'the-philosopher', line: '最后还有一点：无论你选哪条路，不要用"我是为了你好"来为自己的选择找借口。为自己活就承认是为自己活，为别人活也承认是自己的选择。不把选择的重量甩给别人，这才是真正的负责。', emotion: 'analytical' }
      ]
    ]
  }
};

export const ARCHETYPE_EMOJI: Record<string, string> = {
  'the-guardian': '🛡️',
  'the-wanderer': '🌿',
  'the-warrior': '⚔️',
  'the-healer': '💚',
  'the-philosopher': '🔮'
};
