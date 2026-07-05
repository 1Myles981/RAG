// ============================================================
// Mock 数据层：结构与 BACKEND_API.md 契约保持一致。
// 后端就绪后，只需配置 VITE_API_BASE_URL，api.js 会自动切换真实接口。
// ============================================================

// ---------- 知识库 ----------

export const knowledgeStats = {
  total: 218,
  regulation: 100,
  table: 100,
  corpus: 18
};

export const knowledgeFiles = [
  { id: 'DOC-001', name: '商业银行资本管理办法.pdf', type: 'PDF', sourceType: '监管制度', status: 'indexed', chunks: 128, size: '2.8 MB', createdAt: '2026-07-01 09:30' },
  { id: 'DOC-002', name: 'G40 资本充足率汇总表.xlsx', type: 'Excel', sourceType: '统计报表', status: 'indexed', chunks: 46, size: '684 KB', createdAt: '2026-07-01 10:12' },
  { id: 'DOC-003', name: '监管统计填报说明.docx', type: 'Word', sourceType: '报表说明', status: 'indexed', chunks: 73, size: '1.4 MB', createdAt: '2026-07-02 14:05' },
  { id: 'DOC-004', name: '授信审批留痕流程.docx', type: 'Word', sourceType: '业务流程', status: 'parsing', chunks: 0, size: '920 KB', createdAt: '2026-07-02 16:20' },
  { id: 'DOC-005', name: '金融消费者投诉处理规范.pdf', type: 'PDF', sourceType: '监管制度', status: 'indexed', chunks: 64, size: '1.1 MB', createdAt: '2026-07-02 17:40' },
  { id: 'DOC-006', name: '风险加权资产明细表.xlsx', type: 'Excel', sourceType: '统计报表', status: 'indexed', chunks: 38, size: '512 KB', createdAt: '2026-07-03 09:05' },
  { id: 'DOC-007', name: '信息披露监管要求.pdf', type: 'PDF', sourceType: '监管制度', status: 'indexed', chunks: 52, size: '860 KB', createdAt: '2026-07-03 09:48' },
  { id: 'DOC-008', name: '商业银行资本管理办法（试行）2012.pdf', type: 'PDF', sourceType: '已废止制度', status: 'indexed', chunks: 96, size: '2.2 MB', createdAt: '2026-07-03 10:22' },
  { id: 'DOC-009', name: '流动性覆盖率统计口径.xlsx', type: 'Excel', sourceType: '统计报表', status: 'indexed', chunks: 41, size: '447 KB', createdAt: '2026-07-03 11:15' },
  { id: 'DOC-010', name: '关联交易管理办法.pdf', type: 'PDF', sourceType: '监管制度', status: 'indexed', chunks: 88, size: '1.6 MB', createdAt: '2026-07-03 13:02' },
  { id: 'DOC-011', name: '反洗钱客户尽调流程.docx', type: 'Word', sourceType: '业务流程', status: 'indexed', chunks: 57, size: '780 KB', createdAt: '2026-07-03 14:36' },
  { id: 'DOC-012', name: '普惠金融贷款统计表.xlsx', type: 'Excel', sourceType: '统计报表', status: 'pending', chunks: 0, size: '390 KB', createdAt: '2026-07-04 09:12' },
  { id: 'DOC-013', name: '支付结算监管报送流程.docx', type: 'Word', sourceType: '业务流程', status: 'indexed', chunks: 44, size: '655 KB', createdAt: '2026-07-04 10:28' },
  { id: 'DOC-014', name: '监管报表核心字段规则.docx', type: 'Word', sourceType: '报表说明', status: 'indexed', chunks: 36, size: '412 KB', createdAt: '2026-07-04 11:47' }
];

// ---------- 文档详情（原文查看 / 图谱节点点击共用） ----------

export const documentDetails = {
  'DOC-001': {
    id: 'DOC-001',
    title: '商业银行资本管理办法.pdf',
    type: '监管制度 PDF',
    issuer: '国家金融监督管理总局',
    docNumber: '总局令 2023 年第 4 号',
    publishDate: '2023-11-01',
    effectiveStatus: '现行有效',
    location: '第二章 资本充足率监管要求',
    outline: ['文件概览', '第一章 总则', '第二章 资本充足率监管要求', '第三章 资本定义', '第四章 监督检查'],
    fullContent: [
      { heading: '文件概览', body: '本文件用于规范商业银行资本管理，明确资本充足率计算、资本构成、风险加权资产计量、监管检查和信息披露等要求。系统在入库时保留文件标题、发文机关、发布日期、章节层级、条款编号和来源链接。' },
      { heading: '第一章 总则', body: '商业银行应当建立与风险状况、系统重要性和经营规模相适应的资本管理体系，持续满足资本监管要求，并确保资本能够覆盖信用风险、市场风险、操作风险及其他重要风险。' },
      { heading: '第二章 资本充足率监管要求', body: '商业银行应当按照监管规定计算并表和未并表的资本充足率。资本充足率相关要求包括最低资本要求、储备资本要求、逆周期资本要求以及监管机构根据风险状况提出的附加资本要求。涉及资本充足率解释时，应同时核验适用对象、资本净额、风险加权资产范围和监管口径。' },
      { heading: '第三章 资本定义', body: '资本构成应区分核心一级资本、其他一级资本和二级资本。计算资本净额时，应按监管规定扣除相关项目，并保持资本口径、风险加权资产口径和报表填报口径一致。' },
      { heading: '第四章 监督检查', body: '监管机构可以根据商业银行风险状况、资本管理能力、系统重要性等因素开展监督检查。对资本不足、口径不一致或披露不充分的情况，应要求商业银行进行整改或补充说明。' }
    ]
  },
  'DOC-002': {
    id: 'DOC-002',
    title: 'G40 资本充足率汇总表.xlsx',
    type: '监管统计 Excel',
    issuer: '国家金融监督管理总局',
    docNumber: '监管统计制度 G40',
    publishDate: '2025-01-15',
    effectiveStatus: '现行有效',
    location: '资本充足率汇总 / C7',
    outline: ['报表说明', '资本充足率汇总（表）', '取数口径', '校验关系'],
    fullContent: [
      { heading: '报表说明', body: 'G40 资本充足率汇总表用于反映商业银行资本净额、风险加权资产以及各层级资本充足率情况。系统解析该表时保留工作表名称、行列坐标、字段名称、期间维度、单位和表内校验关系。' },
      {
        heading: '资本充足率汇总（表）',
        table: {
          sheet: '资本充足率汇总',
          columns: ['指标名称', '2025年3月末', '2025年6月末', '2025年9月末'],
          rows: [
            ['核心一级资本净额（亿元）', '1,842.60', '1,879.34', '1,915.82'],
            ['一级资本净额（亿元）', '2,067.35', '2,104.90', '2,148.27'],
            ['资本净额（亿元）', '2,486.12', '2,530.66', '2,585.40'],
            ['风险加权资产合计（亿元）', '18,524.70', '18,662.18', '18,857.55'],
            ['核心一级资本充足率（%）', '9.95', '10.07', '10.16'],
            ['一级资本充足率（%）', '11.16', '11.28', '11.39'],
            ['资本充足率（%）', '13.42', '13.56', '13.71']
          ]
        }
      },
      { heading: '取数口径', body: '资本充足率指标的分子采用相应层级资本净额，分母采用风险加权资产。填报时应确保分子、分母口径与监管统计制度一致，不得将旧版统计口径、内部管理口径或二次加工指标混用。' },
      { heading: '校验关系', body: '表内应校验资本净额与各资本层级项目之间的勾稽关系，并校验风险加权资产合计与信用风险、市场风险、操作风险加权资产之间的汇总关系。系统返回答案时应标明命中的单元格或字段位置。' }
    ]
  },
  'DOC-003': {
    id: 'DOC-003',
    title: '监管统计填报说明.docx',
    type: '报表说明 Word',
    issuer: '国家金融监督管理总局',
    docNumber: '金规〔2025〕2 号附件',
    publishDate: '2025-02-10',
    effectiveStatus: '现行有效',
    location: '填报说明 / 资本类报表',
    outline: ['填报范围', '核心字段', '取数说明', '异常处理'],
    fullContent: [
      { heading: '填报范围', body: '填报说明解释资本类监管报表的适用机构、期间口径、报送频率和填报边界。' },
      { heading: '核心字段', body: '核心字段包括资本净额、风险加权资产、各层级资本充足率及相关扣减项。' },
      { heading: '取数说明', body: '取数应回到监管统计制度和原始报表字段，避免引用二次加工表。' },
      { heading: '异常处理', body: '资料缺少期间、机构或字段时，应触发澄清或拒答，而不是生成不可核验结论。' }
    ]
  },
  'DOC-004': {
    id: 'DOC-004',
    title: '授信审批留痕流程.docx',
    type: '业务流程 Word',
    issuer: '南京银行（内部规程）',
    docNumber: '内部流程 2025-11',
    publishDate: '2025-04-18',
    effectiveStatus: '现行有效',
    location: '授信流程 / 留痕要求',
    outline: ['流程概览', '审批节点', '证据留痕'],
    fullContent: [
      { heading: '流程概览', body: '授信审批流程记录客户准入、额度测算、风险审查、审批决策和贷后检查等节点。' },
      { heading: '审批节点', body: '每个审批节点应保留责任人、审批时间、风险意见和关键材料清单。' },
      { heading: '证据留痕', body: '流程类资料用于辅助解释监管问答中的业务背景，但不能替代制度原文和报表口径。' }
    ]
  },
  'DOC-005': {
    id: 'DOC-005',
    title: '金融消费者投诉处理规范.pdf',
    type: '监管制度 PDF',
    issuer: '国家金融监督管理总局',
    docNumber: '总局令 2024 年第 1 号',
    publishDate: '2024-03-01',
    effectiveStatus: '现行有效',
    location: '投诉处理 / 合规要求',
    outline: ['受理要求', '处理时限', '整改反馈'],
    fullContent: [
      { heading: '受理要求', body: '投诉处理规范明确受理渠道、记录字段、责任部门和材料留存要求。' },
      { heading: '处理时限', body: '涉及消费者权益保护的问题应检查处理时限、反馈要求和监管报送要求。' },
      { heading: '整改反馈', body: '对重复投诉或重大投诉，应形成整改闭环并保留可追溯证据。' }
    ]
  },
  'DOC-006': {
    id: 'DOC-006',
    title: '风险加权资产明细表.xlsx',
    type: '监管统计 Excel',
    issuer: '国家金融监督管理总局',
    docNumber: '监管统计制度 G4A',
    publishDate: '2025-01-15',
    effectiveStatus: '现行有效',
    location: '风险加权资产 / 汇总字段',
    outline: ['报表说明', '资产分类', '汇总关系', '校验规则'],
    fullContent: [
      { heading: '报表说明', body: '风险加权资产明细表用于承接信用风险、市场风险和操作风险加权资产的分类统计。' },
      { heading: '资产分类', body: '资产分类应按照监管统计制度和资本管理办法要求识别，不同风险权重不能混填。' },
      { heading: '汇总关系', body: '风险加权资产合计应与各风险类别加权资产之和保持一致，并与资本充足率分母口径一致。' },
      { heading: '校验规则', body: '系统在返回答案时应标明命中字段、工作表位置和与 G40 汇总表之间的勾稽关系。' }
    ]
  },
  'DOC-007': {
    id: 'DOC-007',
    title: '信息披露监管要求.pdf',
    type: '监管制度 PDF',
    issuer: '国家金融监督管理总局',
    docNumber: '总局发〔2024〕18 号',
    publishDate: '2024-06-20',
    effectiveStatus: '现行有效',
    location: '信息披露 / 资本管理',
    outline: ['披露范围', '披露频率', '披露校验'],
    fullContent: [
      { heading: '披露范围', body: '资本管理相关披露应覆盖资本构成、风险加权资产、资本充足率水平及重要口径说明。' },
      { heading: '披露频率', body: '对外披露应符合监管规定的周期和口径要求，不能以内部统计结果替代正式披露口径。' },
      { heading: '披露校验', body: '披露数据应与监管报表和制度原文保持一致，发现口径差异时应补充说明。' }
    ]
  },
  'DOC-008': {
    id: 'DOC-008',
    title: '商业银行资本管理办法（试行）2012.pdf',
    type: '监管制度 PDF（已废止）',
    issuer: '原中国银监会',
    docNumber: '银监会令 2012 年第 1 号',
    publishDate: '2012-06-07',
    effectiveStatus: '已废止',
    location: '第一章 总则 / 废止说明',
    outline: ['废止说明', '第一章 总则', '资本充足率要求（旧版）'],
    fullContent: [
      { heading: '废止说明', body: '本办法自 2024 年 1 月 1 日起废止，由《商业银行资本管理办法》（国家金融监督管理总局令 2023 年第 4 号）替代。系统保留旧版全文用于版本对比与历史口径追溯，回答现行问题时不应引用本办法作为依据。' },
      { heading: '第一章 总则', body: '为加强商业银行资本监管，维护银行体系稳健运行，依据相关法律法规制定本办法（试行）。' },
      { heading: '资本充足率要求（旧版）', body: '旧版办法对资本充足率、储备资本及逆周期资本的计算口径与 2023 年版存在差异，特别是风险加权资产计量方法（权重法细项、内评法适用范围）和资本扣减项的处理不同。' }
    ]
  },
  'DOC-014': {
    id: 'DOC-014',
    title: '监管报表核心字段规则.docx',
    type: '字段规则 Word',
    issuer: '南京银行（内部规程）',
    docNumber: '内部规范 2025-04',
    publishDate: '2025-03-02',
    effectiveStatus: '现行有效',
    location: '核心字段 / 字段校验',
    outline: ['字段定义', '字段别名', '校验逻辑'],
    fullContent: [
      { heading: '字段定义', body: '核心字段规则用于统一监管报表字段名称、含义、单位和适用期间。' },
      { heading: '字段别名', body: '同一指标可能存在简称或历史字段名，系统需要在返回答案时展示标准字段。' },
      { heading: '校验逻辑', body: '字段校验应同时检查数值范围、汇总关系和制度约束，避免单一字段孤立解释。' }
    ]
  }
};

// ---------- 问答场景（四类三态） ----------

const scenarios = {
  policy: {
    qaType: '制度事实',
    trust: {
      score: 0.92,
      level: 'success',
      label: '高可信',
      reason: '命中 3 条现行有效监管原文，关键条款、适用对象和报表口径均可追溯。'
    },
    answer:
      '商业银行应当按照监管规定计算并表和未并表的资本充足率，持续满足最低资本要求、储备资本要求和逆周期资本要求，监管机构还可根据风险状况提出附加资本要求[1]。在解释资本充足率等监管指标时，应同时核验适用对象、资本净额与风险加权资产口径[1]，并与 G40 报表的填报口径保持一致：分子采用相应层级资本净额，分母采用风险加权资产[2]。涉及对外解释时，应回到制度原文和填报说明交叉核验，不应仅引用二次加工材料[3]。',
    evidence: [
      {
        id: 'EV-001',
        documentId: 'DOC-001',
        title: '商业银行资本管理办法.pdf',
        source: '监管制度 PDF',
        section: '第二章 资本充足率监管要求',
        excerpt: '商业银行应当按照监管规定计算并表和未并表的资本充足率，并满足最低资本要求、储备资本要求和逆周期资本要求。',
        hitScore: 0.94,
        issuer: '国家金融监督管理总局',
        docNumber: '总局令 2023 年第 4 号',
        publishDate: '2023-11-01',
        effectiveStatus: '现行有效'
      },
      {
        id: 'EV-002',
        documentId: 'DOC-002',
        title: 'G40 资本充足率汇总表.xlsx',
        source: '监管统计 Excel',
        section: '取数口径',
        excerpt: '资本充足率指标的分子采用相应层级资本净额，分母采用风险加权资产，填报口径应与监管统计制度一致。',
        hitScore: 0.89,
        issuer: '国家金融监督管理总局',
        docNumber: '监管统计制度 G40',
        publishDate: '2025-01-15',
        effectiveStatus: '现行有效'
      },
      {
        id: 'EV-003',
        documentId: 'DOC-003',
        title: '监管统计填报说明.docx',
        source: '报表说明 Word',
        section: '取数说明',
        excerpt: '取数应回到监管统计制度和原始报表字段，避免引用二次加工表。',
        hitScore: 0.82,
        issuer: '国家金融监督管理总局',
        docNumber: '金规〔2025〕2 号附件',
        publishDate: '2025-02-10',
        effectiveStatus: '现行有效'
      }
    ],
    retrievalSteps: [
      { title: '解析问题', detail: '识别主题为资本充足率，问题类型为制度事实问答。' },
      { title: '混合召回', detail: '关键词 + 语义 + 元数据过滤，从制度 PDF、报表 Excel、说明 Word 召回 18 个候选片段。' },
      { title: '版本过滤', detail: '过滤已废止版本（2012 试行版），仅保留现行有效文件。' },
      { title: '证据重排', detail: '按语义相似度、来源权威性和条款命中情况筛选前 3 条。' },
      { title: '生成回答', detail: '仅基于命中证据生成答案，逐句挂载引用标记。' }
    ],
    stats: { sourceCount: 18, retrievalTimeMs: 2400, confidence: '高' }
  },

  table: {
    qaType: '表格取数',
    trust: {
      score: 0.88,
      level: 'success',
      label: '高可信',
      reason: '命中 G40 报表具体单元格，数值、期间与口径说明可交叉核验。'
    },
    answer:
      '根据 G40 资本充足率汇总表，2025 年 6 月末资本充足率为 13.56%[1]，较 3 月末的 13.42% 上升 0.14 个百分点；同期资本净额为 2,530.66 亿元、风险加权资产合计为 18,662.18 亿元[1]。该指标取数口径为：分子采用资本净额，分母采用风险加权资产合计，两者均须与监管统计制度一致[2]。上述数值来源于表内命中单元格，已通过资本净额与风险加权资产的勾稽关系校验[1]。',
    evidence: [
      {
        id: 'EV-101',
        documentId: 'DOC-002',
        title: 'G40 资本充足率汇总表.xlsx',
        source: '监管统计 Excel',
        section: '资本充足率汇总（表）',
        excerpt: '资本充足率（%）｜2025年6月末｜13.56',
        hitScore: 0.96,
        issuer: '国家金融监督管理总局',
        docNumber: '监管统计制度 G40',
        publishDate: '2025-01-15',
        effectiveStatus: '现行有效',
        cellRef: { sheet: '资本充足率汇总', cell: 'C8', row: 6, col: 2 }
      },
      {
        id: 'EV-102',
        documentId: 'DOC-003',
        title: '监管统计填报说明.docx',
        source: '报表说明 Word',
        section: '核心字段',
        excerpt: '核心字段包括资本净额、风险加权资产、各层级资本充足率及相关扣减项。',
        hitScore: 0.84,
        issuer: '国家金融监督管理总局',
        docNumber: '金规〔2025〕2 号附件',
        publishDate: '2025-02-10',
        effectiveStatus: '现行有效'
      }
    ],
    retrievalSteps: [
      { title: '解析问题', detail: '识别为表格取数问题，抽取指标名称「资本充足率」与期间「2025年6月末」。' },
      { title: '表格结构检索', detail: '按指标名称 + 期间维度匹配 G40 工作表行列坐标。' },
      { title: '单元格定位', detail: '命中工作表「资本充足率汇总」C8 单元格。' },
      { title: '勾稽校验', detail: '用资本净额 / 风险加权资产复算，与表内数值一致。' },
      { title: '生成回答', detail: '返回数值 + 单元格坐标 + 取数口径说明。' }
    ],
    stats: { sourceCount: 6, retrievalTimeMs: 1800, confidence: '高' }
  },

  conflict: {
    qaType: '版本对比',
    trust: {
      score: 0.63,
      level: 'warning',
      label: '版本提示',
      reason: '检索到新旧两个版本的资本管理办法，存在口径差异，请注意适用版本。'
    },
    answer:
      '知识库中同时命中两个版本的《商业银行资本管理办法》：现行有效的 2023 年版（国家金融监督管理总局令 2023 年第 4 号，2024 年 1 月 1 日起施行）[1]，以及已废止的 2012 年试行版（银监会令 2012 年第 1 号）[2]。两版在风险加权资产计量方法、资本扣减项处理上存在口径差异[2]。回答现行监管要求时应以 2023 年版为准[1]；如需追溯历史报表口径，请明确说明所涉期间，以便按当期有效版本核验。',
    evidence: [
      {
        id: 'EV-201',
        documentId: 'DOC-001',
        title: '商业银行资本管理办法.pdf',
        source: '监管制度 PDF',
        section: '第二章 资本充足率监管要求',
        excerpt: '商业银行应当按照监管规定计算并表和未并表的资本充足率……',
        hitScore: 0.91,
        issuer: '国家金融监督管理总局',
        docNumber: '总局令 2023 年第 4 号',
        publishDate: '2023-11-01',
        effectiveStatus: '现行有效'
      },
      {
        id: 'EV-202',
        documentId: 'DOC-008',
        title: '商业银行资本管理办法（试行）2012.pdf',
        source: '监管制度 PDF',
        section: '资本充足率要求（旧版）',
        excerpt: '旧版办法对资本充足率、储备资本及逆周期资本的计算口径与 2023 年版存在差异……',
        hitScore: 0.87,
        issuer: '原中国银监会',
        docNumber: '银监会令 2012 年第 1 号',
        publishDate: '2012-06-07',
        effectiveStatus: '已废止'
      }
    ],
    retrievalSteps: [
      { title: '解析问题', detail: '识别为版本对比问题，检索目标为同名制度的多个版本。' },
      { title: '混合召回', detail: '按文件名称 + 语义召回，命中 2012 试行版与 2023 现行版。' },
      { title: '版本甄别', detail: '读取 manifest 中发布日期与废止说明，标记 2012 版为已废止。' },
      { title: '差异抽取', detail: '对比两版资本计量与扣减条款，提取口径差异点。' },
      { title: '生成回答', detail: '输出版本适用建议，并对旧版证据附加「已废止」标签。' }
    ],
    stats: { sourceCount: 9, retrievalTimeMs: 2900, confidence: '中' }
  },

  refusal: {
    qaType: '拒答澄清',
    trust: {
      score: 0.18,
      level: 'error',
      label: '拒答 / 澄清',
      reason: '知识库中缺少支撑该问题的充分依据，为避免幻觉，系统拒绝生成确定性结论。'
    },
    answer:
      '当前知识库无法为该问题提供可核验的依据。检索仅命中 1 条弱相关片段（相似度 0.42，低于证据阈值 0.60）[1]，且缺少该问题所需的期间数据与制度条款。根据可信问答原则，系统不生成无法溯源的结论，请参考下方澄清问题补充信息，或上传相关制度 / 报表文件后重试。',
    evidence: [
      {
        id: 'EV-301',
        documentId: 'DOC-007',
        title: '信息披露监管要求.pdf',
        source: '监管制度 PDF',
        section: '披露范围',
        excerpt: '资本管理相关披露应覆盖资本构成、风险加权资产、资本充足率水平及重要口径说明。（弱相关，未达证据阈值）',
        hitScore: 0.42,
        issuer: '国家金融监督管理总局',
        docNumber: '总局发〔2024〕18 号',
        publishDate: '2024-06-20',
        effectiveStatus: '现行有效'
      }
    ],
    missing: [
      '所询期间的统计报表数据未入库',
      '未检索到与问题直接相关的制度条款',
      '问题涉及预测 / 库外信息，超出知识库边界'
    ],
    clarifications: [
      '您询问的是哪个报表期间（如 2025 年 6 月末）？',
      '涉及的机构范围是并表口径还是法人口径？',
      '能否上传相关制度原文或统计附件以补充依据？'
    ],
    retrievalSteps: [
      { title: '解析问题', detail: '未能匹配到知识库内的制度主题或报表指标。' },
      { title: '混合召回', detail: '关键词 + 语义召回，仅返回 1 条相似度 0.42 的弱相关片段。' },
      { title: '证据阈值判断', detail: '最高命中分低于证据阈值 0.60，判定依据不足。' },
      { title: '拒答决策', detail: '触发拒答策略，生成澄清问题而非确定性结论。' }
    ],
    stats: { sourceCount: 1, retrievalTimeMs: 1300, confidence: '不足' }
  }
};

// 示例问题（欢迎页轮播 + 侧栏快捷入口），每条对应一个演示场景
export const scenarioQuestions = [
  { scenario: 'policy', tag: '制度事实', question: '商业银行资本充足率监管要求是什么？' },
  { scenario: 'table', tag: '表格取数', question: '根据 G40 报表，2025 年 6 月末资本充足率是多少？' },
  { scenario: 'conflict', tag: '版本对比', question: '资本管理办法 2012 试行版和 2023 年版应适用哪一版？' },
  { scenario: 'refusal', tag: '拒答澄清', question: '2027 年监管对绿色信贷占比的要求会是多少？' }
];

const scenarioTriggers = [
  { scenario: 'refusal', pattern: /(预测|会是|将会|明年|202[7-9]|20[3-9]\d|股价|市值|房价|天气|未来)/ },
  { scenario: 'conflict', pattern: /(旧版|新版|版本|废止|试行|2012|哪一版|哪个版)/ },
  { scenario: 'table', pattern: /(G40|G4A|取数|多少|数值|余额|合计|单元格|月末|季度末|季末|环比|同比)/i },
  { scenario: 'policy', pattern: /./ }
];

export function buildMockAnswer(question, options = {}) {
  const matched = scenarioTriggers.find(({ pattern }) => pattern.test(question)) || scenarioTriggers.at(-1);
  const scenario = scenarios[matched.scenario];

  return {
    question,
    topK: options.topK ?? 5,
    mode: options.mode ?? 'hybrid',
    ...JSON.parse(JSON.stringify(scenario))
  };
}

// ---------- 评测指标（侧栏） ----------

export const evaluationMetrics = [
  { label: '制度事实准确率', target: '≥85%', value: '87.4%' },
  { label: '表格取数准确率', target: '≥80%', value: '83.1%' },
  { label: '证据引用命中率', target: '≥90%', value: '91.3%' },
  { label: '拒答 / 澄清率', target: '≥80%', value: '82.6%' },
  { label: '关键数字错误率', target: '≤5%', value: '3.2%' }
];

// ---------- 3D 图谱 ----------

export const graphGroupColors = {
  rule: 0x2f88d8,
  table: 0x22c55e,
  guide: 0xa855f7,
  process: 0x37c87a,
  evidence: 0xf8fafc
};

export const graph3DNodes = [
  { id: 'DOC-001', label: { zh: '资本管理办法', en: 'Capital Rules' }, type: { zh: 'PDF', en: 'PDF' }, group: 'rule', position: [-4.2, 0.7, 0.5] },
  { id: 'DOC-008', label: { zh: '2012 试行版（废止）', en: '2012 Repealed' }, type: { zh: 'PDF', en: 'PDF' }, group: 'rule', position: [-5.3, -0.5, -0.3] },
  { id: 'DOC-007', label: { zh: '信息披露', en: 'Disclosure' }, type: { zh: 'PDF', en: 'PDF' }, group: 'rule', position: [-3.6, -1.6, 0.9] },
  { id: 'DOC-002', label: { zh: 'G40 汇总表', en: 'G40 Table' }, type: { zh: 'Excel', en: 'Excel' }, group: 'table', position: [-1.9, 1.1, -0.6] },
  { id: 'DOC-006', label: { zh: '风险加权资产表', en: 'RWA Table' }, type: { zh: 'Excel', en: 'Excel' }, group: 'table', position: [-1.4, -1.3, 0.4] },
  { id: 'DOC-003', label: { zh: '填报说明', en: 'Filing Guide' }, type: { zh: 'Word', en: 'Word' }, group: 'guide', position: [0.1, -0.1, -0.2] },
  { id: 'DOC-014', label: { zh: '核心字段规则', en: 'Core Fields' }, type: { zh: 'Word', en: 'Word' }, group: 'guide', position: [1.5, 0.8, 0.4] },
  { id: 'DOC-004', label: { zh: '授信流程', en: 'Credit Flow' }, type: { zh: 'Word', en: 'Word' }, group: 'process', position: [3.8, -1.2, 0.5] },
  { id: 'DOC-005', label: { zh: '消保规范', en: 'Complaint Rule' }, type: { zh: 'PDF', en: 'PDF' }, group: 'process', position: [4.6, 0.6, -0.1] },
  { id: 'DOC-011', label: { zh: '反洗钱尽调', en: 'AML Process' }, type: { zh: 'Word', en: 'Word' }, group: 'process', position: [2.6, -0.7, -0.8] },
  { id: 'evidence-a', label: { zh: '引用证据', en: 'Citation' }, type: { zh: 'Evidence', en: 'Evidence' }, group: 'evidence', position: [0.3, 1.8, 0.1] },
  { id: 'evidence-b', label: { zh: '拒答依据', en: 'Clarify' }, type: { zh: 'Evidence', en: 'Evidence' }, group: 'evidence', position: [2.5, 1.8, 0.8] }
];

export const graph3DLinks = [
  ['DOC-001', 'DOC-008'],
  ['DOC-001', 'DOC-007'],
  ['DOC-001', 'DOC-002'],
  ['DOC-008', 'DOC-006'],
  ['DOC-007', 'DOC-003'],
  ['DOC-002', 'DOC-006'],
  ['DOC-002', 'DOC-003'],
  ['DOC-006', 'DOC-003'],
  ['DOC-003', 'DOC-014'],
  ['DOC-014', 'DOC-004'],
  ['DOC-014', 'DOC-005'],
  ['DOC-011', 'DOC-005'],
  ['DOC-004', 'DOC-011'],
  ['DOC-005', 'evidence-b'],
  ['DOC-003', 'evidence-a'],
  ['evidence-a', 'evidence-b'],
  ['DOC-001', 'evidence-a'],
  ['DOC-002', 'evidence-a']
];

// 图谱里的证据节点也支持点击查看
export const graphExtraDetails = {
  'evidence-a': {
    id: 'evidence-a',
    title: '引用证据命中记录.json',
    type: '检索证据',
    issuer: '系统生成',
    docNumber: '—',
    publishDate: '—',
    effectiveStatus: '现行有效',
    location: '证据记录 / 引用命中',
    outline: ['命中片段', '引用关系', '置信说明'],
    fullContent: [
      { heading: '命中片段', body: '该节点记录系统在制度原文、报表字段和填报说明之间命中的证据片段。' },
      { heading: '引用关系', body: '引用关系用于连接答案中的结论和具体来源位置，支持点击查看原文。' },
      { heading: '置信说明', body: '只有当证据来源、字段口径和适用对象一致时，系统才输出高置信回答。' }
    ]
  },
  'evidence-b': {
    id: 'evidence-b',
    title: '拒答澄清依据记录.json',
    type: '检索证据',
    issuer: '系统生成',
    docNumber: '—',
    publishDate: '—',
    effectiveStatus: '现行有效',
    location: '证据记录 / 拒答澄清',
    outline: ['缺失字段', '澄清问题', '拒答条件'],
    fullContent: [
      { heading: '缺失字段', body: '当资料库缺少期间、机构、字段或监管口径时，系统记录缺失项并提示用户补充材料。' },
      { heading: '澄清问题', body: '澄清问题用于确认适用机构、报表期间、指标定义和业务场景。' },
      { heading: '拒答条件', body: '证据不足或来源冲突时，系统应拒绝生成确定性结论，并说明缺少哪些依据。' }
    ]
  }
};
