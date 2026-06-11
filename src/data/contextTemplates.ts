import type { BigFive, EraCountryContext } from '@/types';

export interface ContextTemplate {
  id: string;
  era: string;
  country: string;
  eraLabel: string;
  countryLabel: string;
  description: string;
  opportunityStructure: {
    available: string[];
    restricted: string[];
    mobility: string;
  };
  expressionStyle: {
    communication: string;
    socialNorms: string;
    emotionalDisplay: string;
  };
  valueSystem: {
    prioritized: string[];
    stigmatized: string[];
    successDefinition: string;
  };
  bigFiveModifier: Partial<BigFive>;
  eraFactor: {
    label: string;
    description: string;
    bigFiveModifier: Partial<BigFive>;
  };
}

export const contextTemplates: ContextTemplate[] = [
  {
    id: 'china-1990s',
    era: '1990s',
    country: 'china',
    eraLabel: '90年代',
    countryLabel: '中国',
    description: '改革开放浪潮翻涌，铁饭碗打破，下海经商成风，新旧观念激烈碰撞的剧变时代',
    opportunityStructure: {
      available: ['下海经商', '国企改制', '外资企业进入', '个体工商户', '高考扩招前的精英教育'],
      restricted: ['互联网创业', '出国留学（少数人）', '自由职业', '文化创意产业'],
      mobility: '社会流动性极高，胆大就能致富，出身不再决定一切'
    },
    expressionStyle: {
      communication: '说话含蓄讲究分寸，集体主义优先，不轻易表露个人情感',
      socialNorms: '看重单位和身份，人情关系比规则重要，面子大于利益',
      emotionalDisplay: '情感表达克制，强调"忍"和"沉稳"，喜怒不形于色'
    },
    valueSystem: {
      prioritized: ['勤劳致富', '铁饭碗', '集体荣誉', '稳定', '人情关系'],
      stigmatized: ['投机倒把', '个体户（早期）', '离婚', '不结婚'],
      successDefinition: '进好单位、当官、或者成为"万元户"'
    },
    bigFiveModifier: { openness: 8, conscientiousness: 10, extraversion: -5, neuroticism: -8 },
    eraFactor: {
      label: '90年代中国改革开放',
      description: '见证从计划经济向市场经济转型，"时间就是金钱，效率就是生命"',
      bigFiveModifier: { openness: 12, conscientiousness: 8, neuroticism: -5 }
    }
  },
  {
    id: 'tokyo-1980s',
    era: '1980s',
    country: 'japan',
    eraLabel: '80年代',
    countryLabel: '东京',
    description: '泡沫经济顶峰，日本第一的自信爆棚，银座夜夜笙歌，全民炒股炒房的浮华时代',
    opportunityStructure: {
      available: ['终身雇佣制', '名牌大学=成功', '股市楼市投资', '海外旅行', '消费主义盛宴'],
      restricted: ['创业（大公司优先）', '女性职业发展', '打破常规', '独立思考'],
      mobility: '社会流动性稳定，按部就班熬资历，学历决定人生轨迹'
    },
    expressionStyle: {
      communication: '极度讲究礼貌和层级，说话留有余地，"读空气"是基本生存技能',
      socialNorms: '集体至上，不能与众不同，加班是敬业的证明，下班后和同事喝酒是义务',
      emotionalDisplay: '公共场合极度克制，私人场合彻底释放，压力通过酒精和娱乐宣泄'
    },
    valueSystem: {
      prioritized: ['公司忠诚', '学历出身', '精致生活', '品牌消费', '集体和谐'],
      stigmatized: ['被裁员', '不结婚（女性）', '特立独行', '失败'],
      successDefinition: '进入一流企业，年功序列晋升，贷款买一户建'
    },
    bigFiveModifier: { conscientiousness: 15, agreeableness: 10, extraversion: -8, openness: -5, neuroticism: 8 },
    eraFactor: {
      label: '80年代东京泡沫经济',
      description: '日本经济如日中天，"卖掉东京就能买下整个美国"的自信与焦虑并存',
      bigFiveModifier: { conscientiousness: 12, agreeableness: 8, neuroticism: 10 }
    }
  },
  {
    id: 'silicon-valley-2010s',
    era: '2010s',
    country: 'usa',
    eraLabel: '2010年代',
    countryLabel: '硅谷',
    description: '移动互联网爆发，FAANG崛起，风险投资泛滥，20岁亿万富翁层出不穷的造富神话时代',
    opportunityStructure: {
      available: ['创业融资', '科技巨头高薪', '远程工作', '个人品牌', '全球化市场'],
      restricted: ['传统制造业', '政府公职', '按部就班的职业', '没有技术背景'],
      mobility: '社会流动性极高，英雄不问出处，一个idea就能改变命运'
    },
    expressionStyle: {
      communication: '直接坦率，强调"透明"和"反馈"，数据驱动，不讲虚礼',
      socialNorms: '崇拜创始人精神，推崇"快速失败"，工作和生活边界模糊，24/7在线',
      emotionalDisplay: '情绪表达开放，强调"做自己"，激情和热情被推崇，允许脆弱但不允许平庸'
    },
    valueSystem: {
      prioritized: ['创新颠覆', '快速迭代', '个人自由', '财务自由', '改变世界'],
      stigmatized: ['稳定平庸', '为钱工作', '大公司病', '不热爱工作'],
      successDefinition: '创办独角兽公司，IPO，或者进入顶级科技公司'
    },
    bigFiveModifier: { openness: 18, extraversion: 12, conscientiousness: 5, agreeableness: -8, neuroticism: 5 },
    eraFactor: {
      label: '2010年代硅谷互联网浪潮',
      description: '"Move fast and break things"，每个工程师都相信自己能改变世界',
      bigFiveModifier: { openness: 15, extraversion: 10, conscientiousness: -5 }
    }
  },
  {
    id: 'japan-lost-decades',
    era: '2000s',
    country: 'japan',
    eraLabel: '00年代',
    countryLabel: '日本',
    description: '泡沫破裂后的"失去的二十年"，经济停滞，终身雇佣制瓦解，"低欲望社会"悄然形成',
    opportunityStructure: {
      available: ['非正式雇佣', '零工经济', '躺平文化', '小众兴趣变现', '节俭生活'],
      restricted: ['高薪工作', '传统职场晋升', '买房', '结婚生子（经济压力）'],
      mobility: '社会流动性下降，阶层固化，努力不再有回报'
    },
    expressionStyle: {
      communication: '更加内敛，避免竞争，"不给别人添麻烦"成为最高道德',
      socialNorms: '不羡慕成功者，不歧视失败者，各人自扫门前雪',
      emotionalDisplay: '情感表达极度克制，甚至冷漠，对未来不抱期待也不抱失望'
    },
    valueSystem: {
      prioritized: ['岁月静好', '小确幸', '不竞争', '自给自足', '精神自由'],
      stigmatized: ['野心勃勃', '高调炫耀', '给别人添麻烦', '卷'],
      successDefinition: '不被裁员、有个小爱好、过平静的小日子'
    },
    bigFiveModifier: { openness: -10, extraversion: -15, conscientiousness: 5, neuroticism: -10, agreeableness: 8 },
    eraFactor: {
      label: '日本失去的二十年',
      description: '经济增长神话破灭，"努力就会成功"的信念崩塌，低欲望成为生存策略',
      bigFiveModifier: { extraversion: -12, neuroticism: -8, openness: -8 }
    }
  },
  {
    id: 'china-economic-miracle',
    era: '2010s',
    country: 'china',
    eraLabel: '2010年代',
    countryLabel: '中国',
    description: 'GDP每年增速8%+，移动互联网弯道超车，城市化浪潮，所有人都在往前跑的狂飙时代',
    opportunityStructure: {
      available: ['互联网大厂', '跨境电商', '自媒体创业', '房地产投资', '出国留学'],
      restricted: ['传统制造业', '体制内（收入相对低）', '农业'],
      mobility: '社会流动性极高，小镇做题家也能进大厂年薪百万'
    },
    expressionStyle: {
      communication: '直接务实，谈钱不尴尬，效率优先，结果导向',
      socialNorms: '崇拜成功，焦虑贩卖盛行，比较心重，35岁危机',
      emotionalDisplay: '情绪表达功利化，正能量是政治正确，脆弱等于失败'
    },
    valueSystem: {
      prioritized: ['搞钱', '买房', '阶级跃升', '成功学', '效率'],
      stigmatized: ['贫穷', '稳定但穷', '大龄未婚', '不努力'],
      successDefinition: '一线城市买房、年薪百万、实现财务自由'
    },
    bigFiveModifier: { conscientiousness: 15, extraversion: 8, neuroticism: 15, agreeableness: -10, openness: 5 },
    eraFactor: {
      label: '中国经济高速增长期',
      description: '"站在风口上猪都能飞"，每个人都怕错过时代的列车',
      bigFiveModifier: { conscientiousness: 12, neuroticism: 15, extraversion: 8 }
    }
  },
  {
    id: 'china-post-covid',
    era: '2020s',
    country: 'china',
    eraLabel: '2020年代',
    countryLabel: '中国',
    description: '后疫情时代，经济增速放缓，"卷不动了"成为集体心声，年轻人开始寻找新的生存哲学',
    opportunityStructure: {
      available: ['灵活就业', '体制内（考公热）', '兴趣变现', '低成本生活', '精神消费'],
      restricted: ['大厂高薪（裁员潮）', '房地产投资', '高风险创业', '出国'],
      mobility: '社会流动性下降，上升通道收窄，努力的边际效益递减'
    },
    expressionStyle: {
      communication: '反PUA话术流行，边界感觉醒，拒绝无意义加班',
      socialNorms: '不再迷信成功学，"躺平"不是贬义词，"Gap day"是奢侈',
      emotionalDisplay: '情绪表达真实化，"emo"是日常，允许自己不正能量'
    },
    valueSystem: {
      prioritized: ['身体健康', '精神内耗减少', '稳定', '小确幸', '家人平安'],
      stigmatized: ['狼性文化', '996福报', '为了工作牺牲生活'],
      successDefinition: '有份稳定的工作、不内耗、家人健康平安'
    },
    bigFiveModifier: { openness: 3, conscientiousness: -8, extraversion: -5, neuroticism: 10, agreeableness: 5 },
    eraFactor: {
      label: '后疫情时代中国',
      description: '从"更快更高更强"到"活着就好"，价值观的集体转向',
      bigFiveModifier: { conscientiousness: -10, neuroticism: 8, agreeableness: 8 }
    }
  },
  {
    id: 'us-gilded-age',
    era: '1880s',
    country: 'usa',
    eraLabel: '1880年代',
    countryLabel: '美国',
    description: '镀金时代，洛克菲勒、卡内基等石油钢铁大亨崛起，贫富差距悬殊，社会达尔文主义盛行',
    opportunityStructure: {
      available: ['石油钢铁铁路', '白手起家', '西部拓荒', '移民创业', '工业制造'],
      restricted: ['女性职业', '种族平等', '劳工权益', '公务员（无油水）'],
      mobility: '社会流动性极高，也是极度残酷，适者生存'
    },
    expressionStyle: {
      communication: '男权主导，说话直接粗暴，强者通吃，弱者不配发声',
      socialNorms: '崇拜财富和权力，炫耀性消费，等级分明，种族歧视公开化',
      emotionalDisplay: '男性不许示弱，女性只能柔弱，情感表达符合刻板印象'
    },
    valueSystem: {
      prioritized: ['财富积累', '个人主义', '冒险精神', '社会地位', '征服'],
      stigmatized: ['贫穷', '软弱', '依赖救济', '不成功'],
      successDefinition: '成为百万富翁，拥有自己的企业，进入上流社会'
    },
    bigFiveModifier: { extraversion: 12, openness: 5, conscientiousness: 10, agreeableness: -15, neuroticism: -5 },
    eraFactor: {
      label: '美国镀金时代',
      description: '"从衣衫褴褛到万贯家财"的美国梦最狂热的时期',
      bigFiveModifier: { extraversion: 15, agreeableness: -12, conscientiousness: 8 }
    }
  }
];

export const getContextById = (id: string): ContextTemplate | undefined => {
  return contextTemplates.find((c) => c.id === id);
};

export const getEraCountryContext = (id: string): EraCountryContext | undefined => {
  const template = getContextById(id);
  if (!template) return undefined;
  return {
    era: template.era,
    country: template.country,
    eraLabel: template.eraLabel,
    countryLabel: template.countryLabel,
    description: template.description
  };
};

export const getContextBigFiveModifier = (id: string): Partial<BigFive> => {
  const template = getContextById(id);
  return template?.bigFiveModifier || {};
};
