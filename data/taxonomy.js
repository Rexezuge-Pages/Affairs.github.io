/* 模块树 / 分类体系 —— 覆盖 2025.9 — 2026.11 银行校招笔试 */
window.BSQ = window.BSQ || {};
BSQ.taxonomy = {
  window: '2025.9 — 2026.11',
  exam: '银行校招 / 社招笔试 · 行测常识 + 综合知识',

  tracks: [
    { id: 'politics', name: '时政', icon: '📰', desc: '国内大事 · 理论思想 · 中央文件 · 科技航天 · 地理' },
    { id: 'banking',  name: '银行行情', icon: '🏦', desc: '9 家银行企业文化战略 + 金融市场行情' }
  ],

  modules: [
    // ── 时政 ──────────────────────────────────────────────
    { id: 'domestic', track: 'politics', icon: '🇨🇳', order: 1, name: '国内大事与重要会议',
      desc: '二十届四中/五中全会 · 全国两会 · 中央政治局会议 · 全国人大常委会',
      kw: '四中全会 五中全会 两会 政治局会议 人大常委会 建议 纲要 特别国债 注资 全面从严治党 习近平党建思想 二十一大' },
    { id: 'diplomacy', track: 'politics', icon: '🤝', order: 2, name: '外事活动与大国关系',
      desc: '元首外事 · 中俄美元首会晤 · APEC 深圳 · 中俄/中欧/东盟/中美/中东 · 外交金句',
      kw: '特朗普 普京 古特雷斯 上合峰会 金砖 一带一路 人类命运共同体 外交 五定位 中亚 中俄美元首 深圳展望 和平宣言' },
    { id: 'docs', track: 'politics', icon: '📜', order: 3, name: '中央文件与重大政策',
      desc: '双碳考核 · 美丽中国 · 新就业群体 · 党内法规 · 公积金 · 乌镇峰会 · 进博会',
      kw: '碳达峰 碳中和 美丽中国 双碳 新就业群体 公积金 党内法规 地方委员会工作条例 生态 乌镇峰会 进博会 依规治党' },
    { id: 'tech', track: 'politics', icon: '🚀', order: 4, name: '科技 · 航天 · 诺奖 · 荣誉',
      desc: '2025/2026 诺奖 · 最高科技奖 · 神舟二十四号 · 载人月球探测 · 全球首个/最大清单',
      kw: '诺贝尔奖 2026诺奖 1200万 最高科学技术奖 共和国勋章 人民英雄 全球首个 全球最大 量子 碳纤维 脑机接口 梦舟 揽月 嫦娥 朱雀 长征 神舟 巴基斯坦' },
    { id: 'party', track: 'politics', icon: '★', order: 5, name: '党的理论与思想',
      desc: '党的基本知识 · 二十大两步走 · 习近平党建思想 · 伟大精神 · 依规治党',
      kw: '党的最高理想 执政兴国 全国代表大会 二十大 中国式现代化 六个必须坚持 伟大建党精神 精神谱系 新年贺词 求是 习近平党建思想 依规治党' },
    { id: 'plan15', track: 'politics', icon: '📈', order: 6, name: '十五五规划',
      desc: '7 大目标 · 20 项指标 · 四中全会《建议》 · 7.30 政治局会议',
      kw: '十五五 7个目标 20项指标 建议 纲要 承前启后 关键时期 新质生产力 人工智能+ 内卷式竞争 春秋假' },
    { id: 'finance', track: 'politics', icon: '💰', order: 7, name: '金融政策与货币政策',
      desc: '五篇大文章 · 金融强国 · 适度宽松 · 金融法二审 · BNSF · 外汇存准率 · DR001',
      kw: '五篇大文章 金融强国 适度宽松 双支柱 结构性货币政策 贴息 再贷款 数字人民币 金融法 金融机构治理 ESG 1+N+X 债市非银大额赎回互换便利 BNSF 外汇存款准备金率 DR001 金融工作报告' },
    { id: 'law', track: 'politics', icon: '⚖️', order: 8, name: '法律',
      desc: '民法典 · 劳动法 · 广告法 · 商业银行法 · 反洗钱 · 个人信息 · 2026.11 新立法',
      kw: '民法典 物权 合同 婚姻家庭 侵权 诉讼时效 试用期 加班费 经济补偿 广告法 商业银行法 关系人 票据 支票 反洗钱 个人信息 接管 反跨境腐败法 检察公益诉讼法 水法' },
    { id: 'geo', track: 'politics', icon: '🗺️', order: 9, name: '地理与黄河',
      desc: '四大高原 · 秦岭淮河 · 胡焕庸线 · 黄河全解 · 凌汛 · 水利枢纽',
      kw: '高原 秦岭 淮河 胡焕庸 黑河 腾冲 黄河 地上河 凌汛 河口 桃花峪 小浪底 三门峡 龙羊峡 刘家峡 四水四定' },
    { id: 'livelihood', track: 'politics', icon: '🌾', order: 10, name: '民生社保与乡村振兴',
      desc: '社保第六险长护险 · 精准救助 · 二十字方针 · 五大振兴 · 银行涉农实务',
      kw: '长护险 第六险 职业伤害保障 低保 共同富裕 乡村振兴 二十字方针 五大振兴 头雁工程 智慧农田贷 银税互动 农民丰收节' },
    { id: 'multilateral', track: 'politics', icon: '🌐', order: 11, name: '多边机制与国际组织',
      desc: 'APEC 深圳会议 · 上合 · 金砖 · 世界人工智能合作组织 · 亚投行 · 全球治理倡议',
      kw: '上合组织 金砖 新开发银行 一带一路 亚投行 全球治理倡议 全球治理之友 雄安 枫桥 联合反腐 APEC 深圳展望 世界人工智能合作组织 世界湾区经济合作联盟' },
    { id: 'essay', track: 'politics', icon: '🎤', order: 12, name: '面试论述与情景分析',
      desc: '综合分析题 · 实务应用题 · 答题框架与政策落点',
      kw: '面试 综合分析 实务应用 破题 答题思路 政策背景 核心举措 银行业务落点 尽职免责' },

    // ── 银行行情 ──────────────────────────────────────────
    { id: 'spdb', track: 'banking', icon: 'bank:spdb', order: 20, name: '浦发银行', bank: 'spdb',
      desc: '数智化战略 · 五大赛道 · 五观 · 600000 · 2026H1 经营数据',
      kw: '浦发 SPDB 数智化 五大赛道 五观 同心跨越 600000 浦科 浦链通 浦闪贷 北斗司库 离岸贸易 临港' },
    { id: 'ccb', track: 'banking', icon: 'bank:ccb', order: 21, name: '建设银行', bank: 'ccb',
      desc: '三大战略 · 新金融行动 · 双子星 · CCB · 银行家 1000 强第二',
      kw: '建行 CCB 住房租赁 普惠金融 金融科技 惠懂你 裕农通 劳动者港湾 健养安 建融家园 双子星 善建者行 诚公稳创 新金融' },
    { id: 'cmb', track: 'banking', icon: 'bank:cmb', order: 22, name: '招商银行', bank: 'cmb',
      desc: '因您而变 · 金葵花 · 掌上生活 · 1987 深圳蛇口 · CMB',
      kw: '招行 CMB 因您而变 金葵花 掌上生活 摩羯智投 AUM FPA 零售之王 招银理财 杏仁财经' },
    { id: 'citic', track: 'banking', icon: 'bank:citic', order: 23, name: '中信银行', bank: 'citic',
      desc: '四有银行 · 3+3 战略 · 两稳两强 · 出国金融 · 601998',
      kw: '中信 CITIC 四有银行 3+3 两稳两强 出国金融 信碳通 动卡空间 客尊诚信 五个领先' },
    { id: 'icbc', track: 'banking', icon: 'bank:icbc', order: 24, name: '工商银行', bank: 'icbc',
      desc: '工于至诚行以致远 · 数字工行 D-ICBC · 宇宙行 · 1984',
      kw: '工行 ICBC 工于至诚 行以致远 数字工行 宇宙行 宇宙第一行 e缴费 融e行 牡丹 灵通 牡丹卡' },
    { id: 'boc', track: 'banking', icon: 'bank:boc', order: 25, name: '中国银行', bank: 'boc',
      desc: '1912 · 百年 Bank of China · 唯一双奥银行 · 跨境金融',
      kw: '中行 BOC 1912 双奥银行 全球服务 跨境 外汇 中银 全球 环球 长城 数字化' },
    { id: 'pab', track: 'banking', icon: 'bank:pab', order: 26, name: '平安银行', bank: 'pab',
      desc: '零售做强对公做精同业做专 · 智能化银行 3.0 · 平安集团',
      kw: '平安银行 PAB 智能化银行3.0 零售做强 对公做精 同业做专 平安口袋银行 橙e网 科技金融' },
    { id: 'abc', track: 'banking', icon: 'bank:abc', order: 27, name: '农业银行', bank: 'abc',
      desc: '大行德广伴您成长 · 服务三农 · 乡村振兴 · 1951',
      kw: '农行 ABC 大行德广 伴您成长 三农 乡村振兴 惠农e贷 裕农通 掌银 惠农卡 金穗 乡村' },
    { id: 'bocom', track: 'banking', icon: 'bank:bocom', order: 28, name: '交通银行', bank: 'bocom',
      desc: '深耕上海主场 · 数智化转型 · 交行 1908 · 五大金融',
      kw: '交行 BOCOM 1908 深耕上海主场 数智化 交银 沃德 交行生活 五大金融 蓝色 普惠' },
    { id: 'market', track: 'banking', icon: '📈', order: 29, name: '金融市场行情', bank: null,
      desc: '汇率 · 债券 · 货币市场工具 · 期权 · 票据 · 银行指标体系 · 三道防线',
      kw: '汇率 国际收支 利率平价 债券价格 利率反向 MLF SLF OMO SLO LPR 再贴现 期权 看涨 票据贴现 货币市场 净息差 不良率 拨备覆盖率 资本充足率 三道防线 操作风险' }
  ],

  banks: ['spdb','ccb','cmb','citic','icbc','boc','pab','abc','bocom'],

  tags: {
    must:  { name: '必背',  cls: 't-must'  },
    hot:   { name: '高频',  cls: 't-hot'   },
    num:   { name: '数字',  cls: 't-num'   },
    new:   { name: '新提法', cls: 't-new'   },
    trap:  { name: '易错',  cls: 't-trap'  },
    bank:  { name: '银行专属', cls: 't-bank' }
  },

  // 题库分布（用于首页统计）
  qtypes: [
    { id: 'single', name: '单选题' },
    { id: 'multi',  name: '多选题' },
    { id: 'judge',  name: '判断题' },
    { id: 'case',   name: '情景/案例题' }
  ]
};