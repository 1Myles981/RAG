export const mockDataByLanguage = {
  zh: {
    sampleQuestions: [
      '商业银行资本充足率监管要求是什么？',
      '监管报表中不良贷款率如何计算？',
      '如果资料里没有答案，系统应该怎么处理？',
      '授信审批流程中哪些环节需要留痕？'
    ],
    history: [
      { id: 1, title: '资本充足率监管要求核验', question: '商业银行资本充足率监管要求是什么？', time: '09:42' },
      { id: 2, title: '流动性覆盖率口径说明', question: '流动性覆盖率的统计口径如何解释？', time: '10:18' },
      { id: 3, title: '关联交易制度条款定位', question: '关联交易管理办法中重点披露要求有哪些？', time: '10:57' },
      { id: 4, title: '普惠金融报表字段解释', question: '普惠金融贷款余额字段应如何填报？', time: '11:26' },
      { id: 5, title: '反洗钱客户尽调流程', question: '客户尽职调查流程需要哪些证明材料？', time: '13:08' },
      { id: 6, title: '授信审批证据追溯', question: '授信审批流程中哪些环节需要留痕？', time: '14:15' }
    ],
    mockResponse: {
      keywords: ['商业银行', '资本充足率', '监管要求', '资本净额', '风险加权资产', '报表口径'],
      trust: {
        label: '高可信',
        level: 'success',
        score: 0.92,
        reason: '命中 3 条监管原文，证据均来自正式制度文件，关键数字和报表口径可追溯。'
      },
      answer:
        '商业银行应持续满足资本充足率监管要求，并按监管口径识别核心一级资本、一级资本和资本净额。实际申报或业务解释时，应以最新监管文件原文为准，同时核对适用机构类型、风险加权资产口径和报表填报说明。证据不足时，系统应提示需要补充材料，而不是直接给出确定结论。',
      evidence: [
        {
          id: 'EV-001',
          title: '商业银行资本管理办法',
          source: '监管制度 PDF',
          section: '第二章 资本充足率监管要求',
          hitScore: 0.94,
          excerpt:
            '商业银行应当按照本办法规定计算并表和未并表的资本充足率，并满足最低资本要求、储备资本要求和逆周期资本要求。',
          originalText:
            '商业银行应当按照本办法规定计算并表和未并表的资本充足率，并满足最低资本要求、储备资本要求和逆周期资本要求。银行业监督管理机构可以根据商业银行风险状况、系统重要性等因素提出附加资本要求。'
        },
        {
          id: 'EV-002',
          title: '银行业监管统计报表填报说明',
          source: '统计报表 Excel',
          section: 'G40 资本充足率汇总表',
          hitScore: 0.89,
          excerpt:
            '资本充足率相关指标应按监管统计制度要求填报，分母采用风险加权资产，分子采用相应层级资本净额。',
          originalText:
            'G40 资本充足率汇总表用于反映银行资本净额、风险加权资产及各层级资本充足率情况。填报时应遵循监管统计制度的口径说明，确保分子分母口径一致。'
        },
        {
          id: 'EV-003',
          title: '内部合规问答记录',
          source: '业务流程 Word',
          section: '资本监管常见问题',
          hitScore: 0.82,
          excerpt:
            '涉及监管比例、填报口径、适用范围的问题，应回到制度原文和报表说明进行交叉核验。',
          originalText:
            '对外提供监管比例解释时，不应只引用二次加工材料。涉及监管比例、填报口径、适用范围的问题，应回到制度原文和报表说明进行交叉核验。'
        }
      ],
      retrievalSteps: [
        { title: '解析问题', detail: '识别主题为资本充足率，问题类型为监管事实问答。' },
        { title: '召回候选段落', detail: '从制度 PDF、报表 Excel、流程 Word 中召回 18 个片段。' },
        { title: '证据重排', detail: '按语义相似度、来源权威性和数字命中情况筛选前 3 条。' },
        { title: '证据提取', detail: '抽取条款、报表口径和适用范围，形成结构化来源说明。' },
        { title: '生成回答', detail: '仅基于命中证据生成答案，并保留拒答或澄清判断。' }
      ]
    },
    documents: [
      {
        id: 'DOC-001',
        name: '商业银行资本管理办法.pdf',
        type: 'PDF',
        size: '2.8 MB',
        createdAt: '2026-07-01 09:30',
        sourceType: '监管制度',
        chunks: 128,
        status: 'indexed'
      },
      {
        id: 'DOC-002',
        name: 'G40资本充足率汇总表.xlsx',
        type: 'XLSX',
        size: '684 KB',
        createdAt: '2026-07-01 10:12',
        sourceType: '统计报表',
        chunks: 46,
        status: 'indexed'
      },
      {
        id: 'DOC-003',
        name: '监管统计填报说明.docx',
        type: 'DOCX',
        size: '1.4 MB',
        createdAt: '2026-07-02 14:05',
        sourceType: '报表说明',
        chunks: 73,
        status: 'building'
      },
      {
        id: 'DOC-004',
        name: '授信审批留痕流程.docx',
        type: 'DOCX',
        size: '920 KB',
        createdAt: '2026-07-02 16:20',
        sourceType: '业务流程',
        chunks: 61,
        status: 'parsing'
      }
    ],
    metrics: [
      { label: '证据命中率', value: '91.3%' },
      { label: '表格查询准确率', value: '84.6%' },
      { label: '拒答正确率', value: '80.2%' },
      { label: '平均响应时间', value: '2.4s' }
    ]
  },
  en: {
    sampleQuestions: ['What are the capital adequacy requirements for commercial banks?'],
    history: [],
    mockResponse: {},
    documents: [],
    metrics: []
  }
};

export function getMockData(language = 'zh') {
  return mockDataByLanguage[language] ?? mockDataByLanguage.zh;
}
