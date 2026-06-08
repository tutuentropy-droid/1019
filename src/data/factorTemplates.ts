export interface FactorTemplate {
  id: string;
  label: string;
  description: string;
  bigFiveModifier: {
    openness?: number;
    conscientiousness?: number;
    extraversion?: number;
    agreeableness?: number;
    neuroticism?: number;
  };
}

export const familyTemplates: FactorTemplate[] = [
  {
    id: 'family-1',
    label: '知识分子家庭',
    description: '父母均为大学教师或研究者，家中藏书过千，餐桌话题常涉哲学与历史',
    bigFiveModifier: { openness: 15, conscientiousness: 8, neuroticism: -5 }
  },
  {
    id: 'family-2',
    label: '留守/隔代抚养',
    description: '童年与祖父母同住，父母在远方城市打工，每年见面一两次',
    bigFiveModifier: { openness: -8, extraversion: -12, neuroticism: 10, agreeableness: -6 }
  },
  {
    id: 'family-3',
    label: '单亲母亲家庭',
    description: '母亲独自承担养家重担，家庭经济拮据但情感联结紧密',
    bigFiveModifier: { conscientiousness: 12, neuroticism: 8, agreeableness: 6, extraversion: -5 }
  },
  {
    id: 'family-4',
    label: '企业家家庭',
    description: '父亲经营家族企业，家中常有商务宴请，从小被灌输"赢者通吃"逻辑',
    bigFiveModifier: { extraversion: 12, openness: -6, conscientiousness: 5, agreeableness: -10 }
  },
  {
    id: 'family-5',
    label: '军人/干部家庭',
    description: '父亲从军或从政，家规严格，等级分明，服从是第一美德',
    bigFiveModifier: { conscientiousness: 15, openness: -10, neuroticism: -8, extraversion: 5 }
  },
  {
    id: 'family-6',
    label: '多子女普通家庭',
    description: '家中兄弟姐妹三人以上，资源有限，从小需要争抢和妥协',
    bigFiveModifier: { extraversion: 8, agreeableness: -5, conscientiousness: 3, neuroticism: 3 }
  },
  {
    id: 'family-7',
    label: '艺术家家庭',
    description: '父亲或母亲从事艺术创作，家中氛围自由但经济不稳定',
    bigFiveModifier: { openness: 18, conscientiousness: -10, neuroticism: 8, extraversion: 5 }
  },
  {
    id: 'family-8',
    label: '冲突型家庭',
    description: '父母常年争吵甚至肢体冲突，家是战场而非港湾',
    bigFiveModifier: { neuroticism: 18, agreeableness: -12, openness: -5, conscientiousness: -5 }
  },
  {
    id: 'family-9',
    label: '移民/漂泊家庭',
    description: '童年跟随父母迁居多个城市，永远是"新来的那个"',
    bigFiveModifier: { openness: 10, extraversion: -8, neuroticism: 5, agreeableness: 3 }
  },
  {
    id: 'family-10',
    label: '溺爱独子家庭',
    description: '三代单传，祖父母和父母集万千宠爱于一身，需求即刻满足',
    bigFiveModifier: { extraversion: 5, conscientiousness: -12, agreeableness: -10, neuroticism: 3 }
  }
];

export const eraTemplates: FactorTemplate[] = [
  {
    id: 'era-1',
    label: '改革开放浪潮',
    description: '成长于80-90年代，亲眼目睹社会剧变与造富神话',
    bigFiveModifier: { openness: 12, extraversion: 8, conscientiousness: 5, neuroticism: -3 }
  },
  {
    id: 'era-2',
    label: '互联网原生代',
    description: '成长于00-10年代，手机和社交媒体是童年标配',
    bigFiveModifier: { openness: 10, extraversion: -5, neuroticism: 8, conscientiousness: -6 }
  },
  {
    id: 'era-3',
    label: '文革阴影下',
    description: '成长于60-70年代，政治运动深刻影响家庭命运',
    bigFiveModifier: { openness: -12, conscientiousness: 10, neuroticism: 12, extraversion: -8 }
  },
  {
    id: 'era-4',
    label: '经济黄金期',
    description: '成长于2010年后，社会稳定物质丰裕，上升通道逐渐收窄',
    bigFiveModifier: { openness: 5, conscientiousness: 8, neuroticism: 10, extraversion: -3 }
  },
  {
    id: 'era-5',
    label: '小城镇封闭年代',
    description: '成长于信息闭塞的工业小城，单位大院是全部世界',
    bigFiveModifier: { openness: -15, conscientiousness: 8, extraversion: -5, agreeableness: 5 }
  }
];

export const educationTemplates: FactorTemplate[] = [
  {
    id: 'edu-1',
    label: '重点学校精英路径',
    description: '从重点小学到重点中学再到名牌大学，一路在竞争中胜出',
    bigFiveModifier: { conscientiousness: 15, openness: 5, neuroticism: 10, agreeableness: -5 }
  },
  {
    id: 'edu-2',
    label: '职业教育/技能路线',
    description: '高中后进入职校或专科，掌握一门具体手艺',
    bigFiveModifier: { conscientiousness: 5, openness: -5, extraversion: 3, neuroticism: -5 }
  },
  {
    id: 'edu-3',
    label: '辍学早入社会',
    description: '中学阶段离开校园，过早进入成人世界讨生活',
    bigFiveModifier: { extraversion: 8, openness: -8, conscientiousness: -3, neuroticism: 5 }
  },
  {
    id: 'edu-4',
    label: '艺术/体育特长生',
    description: '从小在绘画、音乐或体育方向接受高强度专业训练',
    bigFiveModifier: { openness: 12, conscientiousness: 10, neuroticism: 8, extraversion: 3 }
  },
  {
    id: 'edu-5',
    label: '海外留学经历',
    description: '本科或研究生阶段出国留学，深度体验异国文化',
    bigFiveModifier: { openness: 18, extraversion: 10, agreeableness: 5, neuroticism: 3 }
  },
  {
    id: 'edu-6',
    label: '自学/终身学习',
    description: '未受过正规高等教育，但保持旺盛自学热情，知识体系杂而广',
    bigFiveModifier: { openness: 12, conscientiousness: 5, extraversion: -3, agreeableness: 3 }
  }
];

export const traumaTemplates: FactorTemplate[] = [
  {
    id: 'trauma-0',
    label: '无重大创伤',
    description: '人生总体平顺，未经历过重大的丧失或伤害事件',
    bigFiveModifier: { neuroticism: -10, agreeableness: 5 }
  },
  {
    id: 'trauma-1',
    label: '校园霸凌受害者',
    description: '中学阶段曾遭受持续性的校园霸凌，无力反抗也无人求助',
    bigFiveModifier: { neuroticism: 18, extraversion: -15, agreeableness: -8, openness: -5 }
  },
  {
    id: 'trauma-2',
    label: '亲人早逝',
    description: '童年或少年期失去父母一方，世界第一次显露出残酷面目',
    bigFiveModifier: { neuroticism: 15, openness: 8, agreeableness: 3, conscientiousness: 5 }
  },
  {
    id: 'trauma-3',
    label: '重大疾病/残疾',
    description: '自身或至亲罹患重病，长期与医院和病痛为伍',
    bigFiveModifier: { neuroticism: 12, openness: 10, conscientiousness: 5, extraversion: -10 }
  },
  {
    id: 'trauma-4',
    label: '情感背叛',
    description: '曾被深度信任的人（恋人、挚友、导师）无情背叛',
    bigFiveModifier: { neuroticism: 15, agreeableness: -15, openness: 3, extraversion: -5 }
  },
  {
    id: 'trauma-5',
    label: '事业/学业重大失败',
    description: '曾投入数年心血的项目或考试遭遇毁灭性失败',
    bigFiveModifier: { neuroticism: 10, conscientiousness: 8, openness: -3, extraversion: -5 }
  },
  {
    id: 'trauma-6',
    label: '贫困饥饿记忆',
    description: '童年有过长期物质匮乏、吃不饱穿不暖的经历',
    bigFiveModifier: { neuroticism: 12, conscientiousness: 15, agreeableness: -5, extraversion: -3 }
  }
];

export const resourcesTemplates: FactorTemplate[] = [
  {
    id: 'res-1',
    label: '家财万贯',
    description: '家庭净资产过亿，无需为金钱做任何妥协',
    bigFiveModifier: { openness: 10, extraversion: 10, neuroticism: -10, conscientiousness: -8 }
  },
  {
    id: 'res-2',
    label: '中产小康',
    description: '家庭年收入50万以上，衣食无忧，可负担教育投资',
    bigFiveModifier: { openness: 5, neuroticism: -5, conscientiousness: 3 }
  },
  {
    id: 'res-3',
    label: '普通工薪',
    description: '双职工家庭，衣食基本无忧，但抗风险能力弱',
    bigFiveModifier: { conscientiousness: 5, neuroticism: 5, openness: -3 }
  },
  {
    id: 'res-4',
    label: '社会底层',
    description: '家庭长期处于贫困线以下，生存是第一要务',
    bigFiveModifier: { neuroticism: 12, conscientiousness: 8, openness: -10, agreeableness: 3 }
  },
  {
    id: 'res-5',
    label: '贵人相助',
    description: '人生中曾遇到一位或多位关键贵人，彻底改变命运轨迹',
    bigFiveModifier: { extraversion: 8, openness: 8, agreeableness: 5, neuroticism: -5 }
  },
  {
    id: 'res-6',
    label: '家道中落',
    description: '童年家境优渥，后因变故家道中落，体验过两种人生',
    bigFiveModifier: { openness: 10, neuroticism: 10, conscientiousness: 8, extraversion: -3 }
  }
];
