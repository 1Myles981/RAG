import React, { useEffect, useRef, useState } from 'react';
import { AudioOutlined, PaperClipOutlined } from '@ant-design/icons';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const stages = [
  { key: 'welcome' },
  { key: 'sources' },
  { key: 'answer' },
  { key: 'graph' }
];

const searchSuggestions = {
  zh: [
    '商业银行资本充足率监管要求是什么？',
    'G40 资本充足率汇总表的填报口径是什么？',
    '风险加权资产和资本净额如何交叉校验？',
    '资料不足时系统应该如何拒答或澄清？'
  ],
  en: [
    'What are the capital adequacy requirements for commercial banks?',
    'What is the reporting scope of the G40 capital adequacy table?',
    'How should RWA and net capital be cross-checked?',
    'How should the system clarify or refuse when evidence is insufficient?'
  ]
};

const sourceItems = {
  zh: [
    { icon: '制', title: '监管制度原文', meta: 'NFRA Word/PDF/附件混合文件，保留标题层级、条款编号、发文机关和发布日期。' },
    { icon: '表', title: '统计报表附件', meta: 'xls/xlsx 监管统计附件，解析表头、指标名称、期间维度、单位和单元格位置。' },
    { icon: '流', title: '业务流程文件', meta: '覆盖信贷审批、资本管理、反洗钱、消保投诉、支付结算和监管报送流程。' }
  ],
  en: [
    { icon: 'R', title: 'Regulatory Texts', meta: 'Word/PDF regulatory files with headings, clause numbers, issuer, and publication dates preserved.' },
    { icon: 'T', title: 'Statistical Tables', meta: 'Excel regulatory reporting files with headers, metric names, periods, units, and cell locations parsed.' },
    { icon: 'P', title: 'Process Documents', meta: 'Credit approval, capital management, AML, consumer protection, payment, and reporting workflows.' }
  ]
};

const uiText = {
  zh: {
    appTitle: '合规智证助手',
    languageSwitch: 'English',
    menu: '菜单',
    newQuestion: '新建问答',
    history: '历史记录',
    settings: '系统设置',
    noHistory: '暂无已回答问题',
    tools: '工具',
    commonTools: '常用工具',
    quickEntry: '快捷入口',
    calculator: '计算器',
    calculatorDesc: '公式、比例、监管指标快速计算',
    emailAssistant: '邮箱助手',
    emailDesc: '邮件草稿、回复润色与事项提炼',
    writerAssistant: '文档写作助手',
    writerDesc: '报告、说明、制度文本辅助写作',
    toolStatus: '工具状态',
    calculatorReady: '计算器：可用',
    emailPending: '邮箱助手：待接入',
    writerPending: '文档写作助手：待接入',
    welcomeTitle: '你好，欢迎使用合规智证助手',
    welcomeSubtitle: '有什么监管制度、报表口径或合规判断需要核验？',
    startSearch: '开始检索',
    uploadFile: '上传文件',
    voiceInput: '语音识别',
    knowledgeBase: '知识库',
    fileList: '文件清单',
    connectedFiles: '已接入资料',
    fileCount: '个文件',
    previousPage: '上一页',
    nextPage: '下一页',
    sourceMaterials: '来源资料',
    viewOriginal: '查看完整原文档',
    statistics: '统计信息',
    sourceCount: '来源数量：18',
    retrievalTime: '检索耗时：8.8 秒',
    confidenceLevel: '置信度：高',
    trustedAnswer: '条款级可信回答',
    smartAnswer: '智能回答',
    confidence: '置信度',
    sourcePreview: '原文档查看',
    close: '关闭',
    documentOutline: '文档目录',
    hitLocation: '当前命中位置',
    graphTitle: '来源文件图谱分析',
    retrievalInfo: '检索信息',
    metricPolicy: '制度准确率',
    metricTable: '表格准确率',
    metricCitation: '引用命中率',
    metricRefusal: '拒答澄清率',
    searching: '混合检索中',
    searchingTitle: '正在生成回答……',
    searchingDesc: '正在进行关键词检索、语义检索、元数据过滤和表格结构检索，随后抽取条款级、段落级和表格单元级证据。',
    waitingInput: '等待输入',
    invalidChars: '算式包含不支持的字符',
    cannotCalculate: '无法计算',
    invalidExpression: '算式格式有误',
    stage: {
      welcome: '欢迎页',
      sources: '知识库',
      answer: '可信答案',
      graph: '检索链路'
    },
    sourceType: {
      监管制度: '监管制度',
      统计报表: '统计报表',
      报表说明: '报表说明',
      业务流程: '业务流程'
    },
    fileStatus: {
      已入库: '已入库',
      解析中: '解析中',
      待校验: '待校验'
    }
  },
  en: {
    appTitle: 'Compliance Evidence Assistant',
    languageSwitch: '中文',
    menu: 'Menu',
    newQuestion: 'New Chat',
    history: 'History',
    settings: 'Settings',
    noHistory: 'No answered questions yet',
    tools: 'Tools',
    commonTools: 'Utilities',
    quickEntry: 'Shortcuts',
    calculator: 'Calculator',
    calculatorDesc: 'Quick calculations for formulas, ratios, and regulatory metrics',
    emailAssistant: 'Email Assistant',
    emailDesc: 'Drafting, reply polishing, and action extraction',
    writerAssistant: 'Document Writer',
    writerDesc: 'Draft reports, explanations, and policy text',
    toolStatus: 'Tool Status',
    calculatorReady: 'Calculator: Ready',
    emailPending: 'Email Assistant: Pending',
    writerPending: 'Document Writer: Pending',
    welcomeTitle: 'Welcome to Compliance Evidence Assistant',
    welcomeSubtitle: 'What regulation, reporting scope, or compliance judgment should be verified?',
    startSearch: 'Search',
    uploadFile: 'Upload file',
    voiceInput: 'Voice input',
    knowledgeBase: 'Knowledge Base',
    fileList: 'File List',
    connectedFiles: 'Connected Files',
    fileCount: 'files',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    sourceMaterials: 'Source Materials',
    viewOriginal: 'View Original Document',
    statistics: 'Statistics',
    sourceCount: 'Sources: 18',
    retrievalTime: 'Retrieval time: 8.8s',
    confidenceLevel: 'Confidence: High',
    trustedAnswer: 'Clause-Level Trusted Answer',
    smartAnswer: 'Smart Answer',
    confidence: 'Confidence',
    sourcePreview: 'Original Document',
    close: 'Close',
    documentOutline: 'Outline',
    hitLocation: 'Current Hit',
    graphTitle: 'Source File Graph Analysis',
    retrievalInfo: 'Retrieval Info',
    metricPolicy: 'Policy Accuracy',
    metricTable: 'Table Accuracy',
    metricCitation: 'Citation Hit Rate',
    metricRefusal: 'Clarification Rate',
    searching: 'Hybrid Retrieval',
    searchingTitle: 'Generating answer...',
    searchingDesc: 'Running keyword retrieval, semantic retrieval, metadata filtering, and table-structure retrieval before extracting clause, paragraph, and cell-level evidence.',
    waitingInput: 'Waiting',
    invalidChars: 'Unsupported characters',
    cannotCalculate: 'Cannot calculate',
    invalidExpression: 'Invalid expression',
    stage: {
      welcome: 'Welcome',
      sources: 'Knowledge Base',
      answer: 'Trusted Answer',
      graph: 'Retrieval Graph'
    },
    sourceType: {
      监管制度: 'Regulation',
      统计报表: 'Statistical Table',
      报表说明: 'Reporting Guide',
      业务流程: 'Business Process'
    },
    fileStatus: {
      已入库: 'Indexed',
      解析中: 'Parsing',
      待校验: 'Pending'
    }
  }
};

const knowledgeFiles = [
  { name: '商业银行资本管理办法.pdf', type: 'PDF', source: '监管制度', status: '已入库' },
  { name: 'G40 资本充足率汇总表.xlsx', type: 'Excel', source: '统计报表', status: '已入库' },
  { name: '监管统计填报说明.docx', type: 'Word', source: '报表说明', status: '解析中' },
  { name: '授信审批留痕流程.docx', type: 'Word', source: '业务流程', status: '解析中' },
  { name: '流动性覆盖率统计口径.xlsx', type: 'Excel', source: '统计报表', status: '已入库' },
  { name: '关联交易管理办法.pdf', type: 'PDF', source: '监管制度', status: '已入库' },
  { name: '反洗钱客户尽调流程.docx', type: 'Word', source: '业务流程', status: '已入库' },
  { name: '普惠金融贷款统计表.xlsx', type: 'Excel', source: '统计报表', status: '待校验' },
  { name: '金融消费者投诉处理规范.pdf', type: 'PDF', source: '监管制度', status: '已入库' },
  { name: '支付结算监管报送流程.docx', type: 'Word', source: '业务流程', status: '待校验' }
];

const originalSources = [
  {
    id: 'capital-rules',
    index: '[1]',
    title: '商业银行资本管理办法.pdf',
    type: '监管制度 PDF',
    location: '第二章 资本充足率监管要求',
    excerpt: '商业银行应当按照监管规定计算资本充足率，并满足最低资本要求、储备资本要求和逆周期资本要求。',
    outline: ['文件概览', '第一章 总则', '第二章 资本充足率监管要求', '第三章 资本定义', '第四章 监督检查'],
    fullContent: [
      {
        heading: '文件概览',
        body: '本文件用于规范商业银行资本管理，明确资本充足率计算、资本构成、风险加权资产计量、监管检查和信息披露等要求。系统在入库时保留文件标题、发文机关、发布日期、章节层级、条款编号和来源链接。'
      },
      {
        heading: '第一章 总则',
        body: '商业银行应当建立与风险状况、系统重要性和经营规模相适应的资本管理体系，持续满足资本监管要求，并确保资本能够覆盖信用风险、市场风险、操作风险及其他重要风险。'
      },
      {
        heading: '第二章 资本充足率监管要求',
        body: '商业银行应当按照监管规定计算并表和未并表的资本充足率。资本充足率相关要求包括最低资本要求、储备资本要求、逆周期资本要求以及监管机构根据风险状况提出的附加资本要求。涉及资本充足率解释时，应同时核验适用对象、资本净额、风险加权资产范围和监管口径。'
      },
      {
        heading: '第三章 资本定义',
        body: '资本构成应区分核心一级资本、其他一级资本和二级资本。计算资本净额时，应按监管规定扣除相关项目，并保持资本口径、风险加权资产口径和报表填报口径一致。'
      },
      {
        heading: '第四章 监督检查',
        body: '监管机构可以根据商业银行风险状况、资本管理能力、系统重要性等因素开展监督检查。对资本不足、口径不一致或披露不充分的情况，应要求商业银行进行整改或补充说明。'
      }
    ]
  },
  {
    id: 'g40-table',
    index: '[2]',
    title: 'G40 资本充足率汇总表.xlsx',
    type: '监管统计 Excel',
    location: 'G40 表 / 资本净额与风险加权资产字段',
    excerpt: '资本充足率相关指标应按监管统计制度要求填报，分母采用风险加权资产，分子采用相应层级资本净额。',
    outline: ['报表说明', '核心字段', '取数口径', '校验关系', '填报提示'],
    fullContent: [
      {
        heading: '报表说明',
        body: 'G40 资本充足率汇总表用于反映商业银行资本净额、风险加权资产以及各层级资本充足率情况。系统解析该表时保留工作表名称、行列坐标、字段名称、期间维度、单位和表内校验关系。'
      },
      {
        heading: '核心字段',
        body: '核心字段包括核心一级资本净额、一级资本净额、资本净额、信用风险加权资产、市场风险加权资产、操作风险加权资产和风险加权资产合计。上述字段用于计算不同层级资本充足率。'
      },
      {
        heading: '取数口径',
        body: '资本充足率指标的分子采用相应层级资本净额，分母采用风险加权资产。填报时应确保分子、分母口径与监管统计制度一致，不得将旧版统计口径、内部管理口径或二次加工指标混用。'
      },
      {
        heading: '校验关系',
        body: '表内应校验资本净额与各资本层级项目之间的勾稽关系，并校验风险加权资产合计与信用风险、市场风险、操作风险加权资产之间的汇总关系。系统返回答案时应标明命中的单元格或字段位置。'
      },
      {
        heading: '填报提示',
        body: '涉及监管比例、统计取数和指标变化解释时，应同时引用制度原文和报表填报说明。若资料库中缺少对应期间、机构或字段，应触发澄清或拒答，而不是生成不可核验的结论。'
      }
    ]
  }
];

const graphNodes = [
  { id: 'capital-rules', label: '资本管理办法', type: 'PDF', x: 110, y: 112, z: 36 },
  { id: 'g40-table', label: 'G40 汇总表', type: 'Excel', x: 284, y: 74, z: 84 },
  { id: 'report-guide', label: '填报说明', type: 'Word', x: 438, y: 118, z: 42 },
  { id: 'risk-weight', label: '风险加权资产表', type: 'Excel', x: 288, y: 238, z: 72 },
  { id: 'approval-flow', label: '授信流程', type: 'Word', x: 526, y: 238, z: 26 },
  { id: 'complaint-rule', label: '消保规范', type: 'PDF', x: 612, y: 104, z: 96 }
];

const graph3DNodes = [
  { id: 'capital-rules', label: { zh: '资本管理办法', en: 'Capital Rules' }, type: { zh: 'PDF', en: 'PDF' }, group: 'rule', position: [-4.2, 0.7, 0.5] },
  { id: 'capital-risk', label: { zh: '资本要求', en: 'Capital Req.' }, type: { zh: '条款', en: 'Clause' }, group: 'rule', position: [-5.3, -0.5, -0.3] },
  { id: 'disclosure', label: { zh: '信息披露', en: 'Disclosure' }, type: { zh: '条款', en: 'Clause' }, group: 'rule', position: [-3.6, -1.6, 0.9] },
  { id: 'g40-table', label: { zh: 'G40 汇总表', en: 'G40 Table' }, type: { zh: 'Excel', en: 'Excel' }, group: 'table', position: [-1.9, 1.1, -0.6] },
  { id: 'risk-weight', label: { zh: '风险加权资产表', en: 'RWA Table' }, type: { zh: 'Excel', en: 'Excel' }, group: 'table', position: [-1.4, -1.3, 0.4] },
  { id: 'metric-cell', label: { zh: '指标单元格', en: 'Metric Cell' }, type: { zh: '字段', en: 'Field' }, group: 'table', position: [0.1, -0.1, -0.2] },
  { id: 'report-guide', label: { zh: '填报说明', en: 'Filing Guide' }, type: { zh: 'Word', en: 'Word' }, group: 'guide', position: [1.5, 0.8, 0.4] },
  { id: 'field-rule', label: { zh: '核心字段', en: 'Core Fields' }, type: { zh: '字段', en: 'Field' }, group: 'guide', position: [2.6, -0.7, -0.8] },
  { id: 'approval-flow', label: { zh: '授信流程', en: 'Credit Flow' }, type: { zh: 'Word', en: 'Word' }, group: 'process', position: [3.8, -1.2, 0.5] },
  { id: 'complaint-rule', label: { zh: '消保规范', en: 'Complaint Rule' }, type: { zh: 'PDF', en: 'PDF' }, group: 'process', position: [4.6, 0.6, -0.1] },
  { id: 'evidence-a', label: { zh: '引用证据', en: 'Citation' }, type: { zh: 'Evidence', en: 'Evidence' }, group: 'evidence', position: [0.3, 1.8, 0.1] },
  { id: 'evidence-b', label: { zh: '拒答依据', en: 'Clarify' }, type: { zh: 'Evidence', en: 'Evidence' }, group: 'evidence', position: [2.5, 1.8, 0.8] }
];

const graph3DLinks = [
  ['capital-rules', 'capital-risk'],
  ['capital-rules', 'disclosure'],
  ['capital-rules', 'g40-table'],
  ['capital-risk', 'risk-weight'],
  ['disclosure', 'metric-cell'],
  ['g40-table', 'risk-weight'],
  ['g40-table', 'metric-cell'],
  ['risk-weight', 'metric-cell'],
  ['metric-cell', 'report-guide'],
  ['report-guide', 'field-rule'],
  ['report-guide', 'evidence-a'],
  ['field-rule', 'approval-flow'],
  ['field-rule', 'complaint-rule'],
  ['approval-flow', 'complaint-rule'],
  ['complaint-rule', 'evidence-b'],
  ['evidence-a', 'evidence-b'],
  ['capital-rules', 'evidence-a'],
  ['g40-table', 'complaint-rule']
];

const graphGroupColors = {
  rule: 0x2f88d8,
  table: 0x22c55e,
  guide: 0xa855f7,
  process: 0x37c87a,
  evidence: 0xf8fafc
};

const graphSourceDocuments = Object.fromEntries([
  ...originalSources,
  {
    id: 'capital-risk',
    title: '资本充足率监管要求摘录.docx',
    type: '监管制度条款',
    location: '第二章 / 资本要求',
    outline: ['条款概览', '最低资本要求', '储备资本要求', '附加资本要求'],
    fullContent: [
      { heading: '条款概览', body: '该节点汇总资本充足率监管要求中的关键约束，用于解释最低资本、储备资本、逆周期资本以及附加资本要求之间的关系。' },
      { heading: '最低资本要求', body: '商业银行应持续满足核心一级资本充足率、一级资本充足率和资本充足率的最低监管要求，相关解释需要回到制度原文核验。' },
      { heading: '储备资本要求', body: '储备资本要求用于增强银行吸收损失能力，不能与内部管理口径或非监管口径混用。' },
      { heading: '附加资本要求', body: '监管机构可根据系统重要性、风险状况和资本管理能力提出附加资本要求，回答时需要说明适用对象。' }
    ]
  },
  {
    id: 'disclosure',
    title: '信息披露监管要求.pdf',
    type: '监管制度 PDF',
    location: '信息披露 / 资本管理',
    outline: ['披露范围', '披露频率', '披露校验'],
    fullContent: [
      { heading: '披露范围', body: '资本管理相关披露应覆盖资本构成、风险加权资产、资本充足率水平及重要口径说明。' },
      { heading: '披露频率', body: '对外披露应符合监管规定的周期和口径要求，不能以内部统计结果替代正式披露口径。' },
      { heading: '披露校验', body: '披露数据应与监管报表和制度原文保持一致，发现口径差异时应补充说明。' }
    ]
  },
  {
    id: 'risk-weight',
    title: '风险加权资产明细表.xlsx',
    type: '监管统计 Excel',
    location: '风险加权资产 / 汇总字段',
    outline: ['报表说明', '资产分类', '汇总关系', '校验规则'],
    fullContent: [
      { heading: '报表说明', body: '风险加权资产明细表用于承接信用风险、市场风险和操作风险加权资产的分类统计。' },
      { heading: '资产分类', body: '资产分类应按照监管统计制度和资本管理办法要求识别，不同风险权重不能混填。' },
      { heading: '汇总关系', body: '风险加权资产合计应与各风险类别加权资产之和保持一致，并与资本充足率分母口径一致。' },
      { heading: '校验规则', body: '系统在返回答案时应标明命中字段、工作表位置和与 G40 汇总表之间的勾稽关系。' }
    ]
  },
  {
    id: 'metric-cell',
    title: '资本指标单元格映射表.xlsx',
    type: '字段映射表',
    location: '指标单元格 / 字段映射',
    outline: ['字段字典', '单元格位置', '口径说明'],
    fullContent: [
      { heading: '字段字典', body: '该映射表记录资本净额、风险加权资产、核心一级资本充足率等指标的标准字段名称。' },
      { heading: '单元格位置', body: '系统保留工作表、行列坐标和字段别名，用于实现表格单元格级证据追溯。' },
      { heading: '口径说明', body: '字段口径应与监管统计制度保持一致，不能将内部衍生指标作为正式证据。' }
    ]
  },
  {
    id: 'report-guide',
    title: '监管统计填报说明.docx',
    type: '报表说明 Word',
    location: '填报说明 / 资本类报表',
    outline: ['填报范围', '核心字段', '取数说明', '异常处理'],
    fullContent: [
      { heading: '填报范围', body: '填报说明解释资本类监管报表的适用机构、期间口径、报送频率和填报边界。' },
      { heading: '核心字段', body: '核心字段包括资本净额、风险加权资产、各层级资本充足率及相关扣减项。' },
      { heading: '取数说明', body: '取数应回到监管统计制度和原始报表字段，避免引用二次加工表。' },
      { heading: '异常处理', body: '资料缺少期间、机构或字段时，应触发澄清或拒答，而不是生成不可核验结论。' }
    ]
  },
  {
    id: 'field-rule',
    title: '监管报表核心字段规则.docx',
    type: '字段规则 Word',
    location: '核心字段 / 字段校验',
    outline: ['字段定义', '字段别名', '校验逻辑'],
    fullContent: [
      { heading: '字段定义', body: '核心字段规则用于统一监管报表字段名称、含义、单位和适用期间。' },
      { heading: '字段别名', body: '同一指标可能存在简称或历史字段名，系统需要在返回答案时展示标准字段。' },
      { heading: '校验逻辑', body: '字段校验应同时检查数值范围、汇总关系和制度约束，避免单一字段孤立解释。' }
    ]
  },
  {
    id: 'approval-flow',
    title: '授信审批留痕流程.docx',
    type: '业务流程 Word',
    location: '授信流程 / 留痕要求',
    outline: ['流程概览', '审批节点', '证据留痕'],
    fullContent: [
      { heading: '流程概览', body: '授信审批流程记录客户准入、额度测算、风险审查、审批决策和贷后检查等节点。' },
      { heading: '审批节点', body: '每个审批节点应保留责任人、审批时间、风险意见和关键材料清单。' },
      { heading: '证据留痕', body: '流程类资料用于辅助解释监管问答中的业务背景，但不能替代制度原文和报表口径。' }
    ]
  },
  {
    id: 'complaint-rule',
    title: '金融消费者投诉处理规范.pdf',
    type: '监管制度 PDF',
    location: '投诉处理 / 合规要求',
    outline: ['受理要求', '处理时限', '整改反馈'],
    fullContent: [
      { heading: '受理要求', body: '投诉处理规范明确受理渠道、记录字段、责任部门和材料留存要求。' },
      { heading: '处理时限', body: '涉及消费者权益保护的问题应检查处理时限、反馈要求和监管报送要求。' },
      { heading: '整改反馈', body: '对重复投诉或重大投诉，应形成整改闭环并保留可追溯证据。' }
    ]
  },
  {
    id: 'evidence-a',
    title: '引用证据命中记录.json',
    type: '检索证据',
    location: '证据记录 / 引用命中',
    outline: ['命中片段', '引用关系', '置信说明'],
    fullContent: [
      { heading: '命中片段', body: '该节点记录系统在制度原文、报表字段和填报说明之间命中的证据片段。' },
      { heading: '引用关系', body: '引用关系用于连接答案中的结论和具体来源位置，支持点击查看原文。' },
      { heading: '置信说明', body: '只有当证据来源、字段口径和适用对象一致时，系统才输出高置信回答。' }
    ]
  },
  {
    id: 'evidence-b',
    title: '拒答澄清依据记录.json',
    type: '检索证据',
    location: '证据记录 / 拒答澄清',
    outline: ['缺失字段', '澄清问题', '拒答条件'],
    fullContent: [
      { heading: '缺失字段', body: '当资料库缺少期间、机构、字段或监管口径时，系统记录缺失项并提示用户补充材料。' },
      { heading: '澄清问题', body: '澄清问题用于确认适用机构、报表期间、指标定义和业务场景。' },
      { heading: '拒答条件', body: '证据不足或来源冲突时，系统应拒绝生成确定性结论，并说明缺少哪些依据。' }
    ]
  }
].map((source) => [
  source.id,
  {
    index: source.index || '',
    excerpt: source.excerpt || source.fullContent[0]?.body || '',
    ...source
  }
]));

function SourceCard({ item }) {
  return (
    <article className="source-selector-card">
      <span className="source-selector-icon">{item.icon}</span>
      <div>
        <h3>{item.title}</h3>
        <p>{item.meta}</p>
      </div>
    </article>
  );
}

function FileListPanel({ t, language }) {
  const pageSize = 4;
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(knowledgeFiles.length / pageSize);
  const start = page * pageSize;
  const visibleFiles = knowledgeFiles.slice(start, start + pageSize);
  const canGoBack = page > 0;
  const canGoForward = page < pageCount - 1;

  return (
    <section className="file-list-panel">
      <div className="file-list-header">
        <div>
          <span className="section-eyebrow">{t('fileList')}</span>
          <h3>{t('connectedFiles')}</h3>
        </div>
        <strong>{knowledgeFiles.length} {t('fileCount')}</strong>
      </div>

      <div className="file-list-scroll" aria-label={t('fileList')}>
        {visibleFiles.map((file) => (
          <article className="file-list-item" key={file.name}>
            <div>
              <h4>{file.name}</h4>
              <p>{t('sourceType')[file.source] || file.source}</p>
            </div>
            <span>{file.type}</span>
            <em>{t('fileStatus')[file.status] || file.status}</em>
          </article>
        ))}
      </div>

      <div className="file-list-pagination" aria-label="文件分页">
        <button type="button" onClick={() => setPage(page - 1)} disabled={!canGoBack} aria-label={t('previousPage')}>
          ‹
        </button>
        <span>{page + 1} / {pageCount}</span>
        <button type="button" onClick={() => setPage(page + 1)} disabled={!canGoForward} aria-label={t('nextPage')}>
          ›
        </button>
      </div>
    </section>
  );
}

function EvidenceMark({ children, source }) {
  return (
    <span className="evidence-mark" data-source={source}>
      {children}
    </span>
  );
}

function AnswerCard({ onOpenSource, t, language }) {
  return (
    <article className="answer-detail-card">
      <div className="answer-copy">
        <span className="section-eyebrow">{t('trustedAnswer')}</span>
        <h2>{t('smartAnswer')}</h2>
        {language === 'zh' ? (
          <p className="answer-paragraph">
            根据命中的
            <EvidenceMark source="来源：[1] 商业银行资本管理办法.pdf / 第二章 资本充足率监管要求">监管制度原文</EvidenceMark>
            和
            <EvidenceMark source="来源：[2] G40 资本充足率汇总表.xlsx / 资本净额与风险加权资产字段">统计报表口径</EvidenceMark>
            ，商业银行在解释
            <EvidenceMark source="来源：[1] 商业银行资本管理办法.pdf / 资本充足率监管要求">资本充足率</EvidenceMark>
            等监管指标时，应同时核验
            <EvidenceMark source="来源：[1] 商业银行资本管理办法.pdf / 适用对象条款">适用对象</EvidenceMark>
            、
            <EvidenceMark source="来源：[2] G40 资本充足率汇总表.xlsx / 指标口径说明">指标口径</EvidenceMark>
            、
            <EvidenceMark source="来源：[2] G40 资本充足率汇总表.xlsx / 风险加权资产字段">风险加权资产范围</EvidenceMark>
            和
            <EvidenceMark source="来源：[2] G40 资本充足率汇总表.xlsx / 填报说明">报表填报说明</EvidenceMark>
            。当前回答基于可追溯证据生成，并保留来源依据
            <EvidenceMark source="点击下方 [1] 可查看监管制度原文片段"> [1]</EvidenceMark>
            <EvidenceMark source="点击下方 [2] 可查看统计报表原文片段"> [2]</EvidenceMark>
            。
          </p>
        ) : (
          <p className="answer-paragraph">
            Based on the matched
            <EvidenceMark source="Source: [1] Commercial Bank Capital Management Rules / Chapter 2"> regulatory text</EvidenceMark>
            and
            <EvidenceMark source="Source: [2] G40 Capital Adequacy Summary / net capital and RWA fields"> reporting scope</EvidenceMark>
            , the system cross-checks applicability, metric definitions, risk-weighted asset scope, and filing guidance before producing a traceable answer
            <EvidenceMark source="Open [1] to inspect the regulatory excerpt"> [1]</EvidenceMark>
            <EvidenceMark source="Open [2] to inspect the table excerpt"> [2]</EvidenceMark>
            .
          </p>
        )}

        <div className="answer-columns">
          <section>
            <h3>{t('sourceMaterials')}</h3>
            {originalSources.map((source) => (
              <button className="source-link" key={source.id} type="button" onClick={() => onOpenSource(source)}>
                <span>{source.index}</span>
                {source.title}
                <small>{t('viewOriginal')}</small>
              </button>
            ))}
            </section>
            <section>
              <h3>{t('statistics')}</h3>
              <p>{t('sourceCount')}</p>
            <p>{t('retrievalTime')}</p>
            <p>{t('confidenceLevel')}</p>
          </section>
        </div>
      </div>

      <div className="confidence-gauge" aria-label={`${t('confidence')} 92%`}>
        <svg viewBox="0 0 120 120" role="img">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="62%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
          </defs>
          <circle className="gauge-track" cx="60" cy="60" r="48" />
          <circle className="gauge-value" cx="60" cy="60" r="48" />
        </svg>
        <div className="gauge-center">
          <strong>92%</strong>
          <span>{t('confidence')}</span>
        </div>
      </div>
    </article>
  );
}

function SourcePreview({ source, onClose, t }) {
  const sectionRefs = useRef({});

  if (!source) {
    return null;
  }

  function scrollToSection(item) {
    const matchedSection = source.fullContent.find((section) => (
      section.heading === item || section.heading.includes(item) || item.includes(section.heading)
    ));
    const target = sectionRefs.current[item] || sectionRefs.current[matchedSection?.heading];

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <div className="source-preview-backdrop" role="dialog" aria-modal="true" aria-label={t('sourcePreview')}>
      <section className="source-preview">
        <header>
          <div>
            <span className="section-eyebrow">{t('sourcePreview')}</span>
            <h2>{source.title}</h2>
          </div>
          <button type="button" onClick={onClose}>{t('close')}</button>
        </header>
        <div className="source-preview-meta">
          <span>{source.type}</span>
          <span>{source.location}</span>
        </div>
        <div className="source-document-viewer">
          <nav className="source-document-outline" aria-label={t('documentOutline')}>
            <h3>{t('documentOutline')}</h3>
            {source.outline.map((item) => (
                <button
                  className={item === source.location || source.location.includes(item) ? 'active' : ''}
                  key={item}
                  type="button"
                  onClick={() => scrollToSection(item)}
                >
                  {item}
                </button>
            ))}
          </nav>

          <article className="source-document-body">
            <div className="hit-banner">
              <strong>{t('hitLocation')}</strong>
              <span>{source.location}</span>
            </div>
            {source.fullContent.map((section) => {
              const isHit = source.location.includes(section.heading);
              return (
                  <section
                    className={isHit ? 'document-section hit-section' : 'document-section'}
                    key={section.heading}
                    ref={(element) => { sectionRefs.current[section.heading] = element; }}
                  >
                    <h3>{section.heading}</h3>
                    <p>{section.body}</p>
                  </section>
              );
            })}
          </article>
        </div>
      </section>
    </div>
  );
}

const calculatorKeys = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '←', '+'];

function CalculatorPanel({ open, expression, result, onChange, onCalculate, onKey, onClose, t }) {
  if (!open) {
    return null;
  }

  return (
    <aside className="calculator-panel" aria-label={t('calculator')}>
      <header>
        <div>
          <span className="section-eyebrow">{t('commonTools')}</span>
          <h2>{t('calculator')}</h2>
        </div>
        <button type="button" onClick={onClose}>{t('close')}</button>
      </header>

      <div className="calculator-display">
        <input
          value={expression}
          placeholder="0"
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onCalculate();
            }
          }}
        />
        <strong>{result || t('waitingInput')}</strong>
      </div>

      <div className="calculator-keypad">
        <button className="calculator-clear" type="button" onClick={() => onKey('C')}>C</button>
        <button type="button" onClick={() => onKey('(')}>(</button>
        <button type="button" onClick={() => onKey(')')}>)</button>
        <button className="operator" type="button" onClick={() => onKey('/')}>/</button>

        {calculatorKeys.map((key) => (
          <button
            className={['/', '*', '-', '+', '←'].includes(key) ? 'operator' : ''}
            key={key}
            type="button"
            onClick={() => onKey(key)}
          >
            {key}
          </button>
        ))}

        <button className="calculator-equals" type="button" onClick={onCalculate}>=</button>
      </div>
    </aside>
  );
}

function createLabelSprite(label, type) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 116;

  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = '700 22px "Microsoft YaHei", sans-serif';
  context.fillStyle = '#17313a';
  context.textAlign = 'center';
  context.fillText(label, 128, 48);
  context.font = '700 16px "Microsoft YaHei", sans-serif';
  context.fillStyle = '#0f9689';
  context.fillText(type, 128, 78);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.12, 0.52, 1);
  sprite.renderOrder = 10;

  return sprite;
}

function SourceGraph3D({ onOpenSource, language }) {
  const mountRef = useRef(null);
  const onOpenSourceRef = useRef(onOpenSource);

  useEffect(() => {
    onOpenSourceRef.current = onOpenSource;
  }, [onOpenSource]);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 1.5, 11.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 7;
    controls.maxDistance = 16;
    controls.rotateSpeed = 0.8;

    scene.add(new THREE.AmbientLight(0xffffff, 1.8));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(-3, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x7dd3fc, 2.4, 16);
    fillLight.position.set(0, -2, 6);
    scene.add(fillLight);

    const group = new THREE.Group();
    group.rotation.x = 0.08;
    group.rotation.y = -0.32;
    group.scale.setScalar(1.45);
    scene.add(group);

    const nodeById = new Map();
    const sphereGeometry = new THREE.SphereGeometry(0.22, 32, 32);

    graph3DNodes.forEach((node) => {
      const color = graphGroupColors[node.group];
      const material = new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.34,
        metalness: 0.06,
        clearcoat: 0.55,
        emissive: color,
        emissiveIntensity: node.group === 'evidence' ? 0.12 : 0.08
      });

      const sphere = new THREE.Mesh(sphereGeometry, material);
      sphere.position.set(...node.position);
      sphere.userData.baseY = node.position[1];
      sphere.userData.sourceId = node.id;
      group.add(sphere);

      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.34, 32, 32),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.12,
          depthWrite: false
        })
      );
      halo.position.copy(sphere.position);
      halo.userData.sourceId = node.id;
      group.add(halo);

      const label = createLabelSprite(node.label[language] || node.label.zh, node.type[language] || node.type.zh);
      label.position.set(node.position[0], node.position[1] - 0.45, node.position[2]);
      label.userData.sourceId = node.id;
      group.add(label);

      nodeById.set(node.id, { sphere, halo, label, position: sphere.position });
    });

    const linkMaterial = new THREE.LineBasicMaterial({
      color: 0x98f7d2,
      transparent: true,
      opacity: 0.64
    });
    const linkGlowMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28
    });

    graph3DLinks.forEach(([from, to]) => {
      const start = nodeById.get(from).position;
      const end = nodeById.get(to).position;
      const points = [start.clone(), end.clone()];

      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), linkMaterial);
      group.add(line);

      const glow = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), linkGlowMaterial);
      glow.scale.setScalar(1.002);
      group.add(glow);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const clickableNodes = [...nodeById.values()].flatMap(({ sphere, halo, label }) => [sphere, halo, label]);
    let pointerDown = null;

    const updatePointer = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const pickNode = () => {
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(clickableNodes, false)[0]?.object;
    };

    const handlePointerDown = (event) => {
      pointerDown = { x: event.clientX, y: event.clientY };
    };

    const handlePointerMove = (event) => {
      updatePointer(event);
      renderer.domElement.style.cursor = pickNode() ? 'pointer' : 'grab';
    };

    const handlePointerUp = (event) => {
      updatePointer(event);
      const movement = pointerDown
        ? Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y)
        : 0;
      pointerDown = null;

      if (movement > 5) {
        return;
      }

      const pickedNode = pickNode();
      const source = graphSourceDocuments[pickedNode?.userData.sourceId];

      if (source) {
        onOpenSourceRef.current(source);
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      controls.dispose();
      mount.removeChild(renderer.domElement);
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            if (material.map) {
              material.map.dispose();
            }
            material.dispose();
          });
        }
      });
      renderer.dispose();
    };
  }, [language]);

  return <div className="rag-graph-3d" ref={mountRef} role="img" aria-label="可拖拽旋转的来源文件三维图谱" />;
}

function RagGraph({ onOpenSource, t, language }) {

  return (
    <section className="graph-stage">
          <div className="rag-graph-card">
            <div className="section-heading">
              <h2>{t('graphTitle')}</h2>
            </div>

          <SourceGraph3D onOpenSource={onOpenSource} language={language} />
        </div>

      <aside className="retrieval-info-card">
        <span className="section-eyebrow">{t('retrievalInfo')}</span>
        <dl>
          <div><dt>{t('metricPolicy')}</dt><dd>85%+</dd></div>
          <div><dt>{t('metricTable')}</dt><dd>80%+</dd></div>
          <div><dt>{t('metricCitation')}</dt><dd>90%+</dd></div>
          <div><dt>{t('metricRefusal')}</dt><dd>80%+</dd></div>
        </dl>
      </aside>
    </section>
  );
}

function LoadingSearch({ t }) {
  return (
    <section className="generating-panel">
      <div className="scanner">
        <span />
        <span />
        <span />
      </div>
      <div>
        <span className="section-eyebrow">{t('searching')}</span>
        <h2>{t('searchingTitle')}</h2>
        <p>{t('searchingDesc')}</p>
      </div>
    </section>
  );
}

function App() {
  const [language, setLanguage] = useState('zh');
  const [stage, setStage] = useState('welcome');
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewSource, setPreviewSource] = useState(null);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [isRailExpanded, setIsRailExpanded] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [qaHistory, setQaHistory] = useState([]);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calculatorExpression, setCalculatorExpression] = useState('');
  const [calculatorResult, setCalculatorResult] = useState('');

  const t = (key) => uiText[language][key];
  const activeSuggestions = searchSuggestions[language];
  const activeSuggestion = activeSuggestions[suggestionIndex % activeSuggestions.length];

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = t('appTitle');
  }, [language]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSuggestionIndex((value) => (value + 1) % activeSuggestions.length);
    }, 2400);

    return () => window.clearInterval(timer);
  }, [activeSuggestions.length]);

  useEffect(() => {
    setSuggestionIndex(0);
  }, [language]);

  function startSearch() {
    const submittedQuery = query.trim() || activeSuggestion;

    setQuery(submittedQuery);
    setIsGenerating(true);

    window.setTimeout(() => {
      setIsGenerating(false);
      setStage('answer');
      setQaHistory((items) => [
        {
          id: Date.now(),
          question: submittedQuery,
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        },
        ...items.filter((item) => item.question !== submittedQuery)
      ]);
    }, 1500);
  }

  function goToStage(nextKey) {
    setIsGenerating(false);
    setStage(nextKey);
  }

  function startNewQuestion() {
    setQuery('');
    setIsGenerating(false);
    setStage('welcome');
  }

  function openHistoryItem(item) {
    setQuery(item.question);
    setIsGenerating(false);
    setStage('answer');
  }

  function calculateExpression() {
    const expression = calculatorExpression.trim();

    if (!expression) {
      setCalculatorResult('');
      return;
    }

    if (!/^[\d+\-*/().\s]+$/.test(expression)) {
      setCalculatorResult(t('invalidChars'));
      return;
    }

    try {
      const value = Function(`"use strict"; return (${expression})`)();
      setCalculatorResult(Number.isFinite(value) ? String(value) : t('cannotCalculate'));
    } catch {
      setCalculatorResult(t('invalidExpression'));
    }
  }

  function handleCalculatorKey(key) {
    if (key === 'C') {
      setCalculatorExpression('');
      setCalculatorResult('');
      return;
    }

    if (key === '←') {
      setCalculatorExpression((value) => value.slice(0, -1));
      return;
    }

    setCalculatorExpression((value) => `${value}${key}`);
  }

  return (
    <div className="demo-shell">
      <div
        className={[
          'product-window',
          isRailExpanded ? 'rail-expanded' : '',
          calculatorOpen ? 'calculator-open' : ''
        ].filter(Boolean).join(' ')}
      >
        <aside className="icon-rail" aria-label={t('menu')}>
          <button type="button" title={t('menu')} onClick={() => setIsRailExpanded((value) => !value)}>
            <span className="rail-icon">☰</span>
            <span className="rail-label">{t('menu')}</span>
          </button>
          <button type="button" title={t('newQuestion')} onClick={startNewQuestion}>
            <span className="rail-icon">＋</span>
            <span className="rail-label">{t('newQuestion')}</span>
          </button>
          <button
            type="button"
            title={t('history')}
            onClick={() => {
              setIsRailExpanded(true);
              setIsHistoryOpen((value) => !value);
            }}
          >
            <span className="rail-icon">◷</span>
            <span className="rail-label">{t('history')}</span>
          </button>
          <button type="button" title={t('settings')}>
            <span className="rail-icon">⚙</span>
            <span className="rail-label">{t('settings')}</span>
          </button>

          {isRailExpanded && isHistoryOpen && (
            <section className="rail-history" aria-label={t('history')}>
              <h2>{t('history')}</h2>
              {qaHistory.length === 0 ? (
                <p>{t('noHistory')}</p>
              ) : (
                qaHistory.map((item) => (
                  <button className="history-entry" key={item.id} type="button" onClick={() => openHistoryItem(item)}>
                    <span>{item.question}</span>
                    <small>{item.time}</small>
                  </button>
                ))
              )}
            </section>
          )}
        </aside>

        <aside className="project-sidebar">
          <div className="project-title">
            <span>{t('tools')}</span>
            <h1>{t('commonTools')}</h1>
          </div>

          <section className="sidebar-block">
            <h2>{t('quickEntry')}</h2>
            <div className="tool-list">
              <button className="tool-item" type="button" onClick={() => setCalculatorOpen(true)}>
                <span>算</span>
                <div>
                  <strong>{t('calculator')}</strong>
                  <small>{t('calculatorDesc')}</small>
                </div>
              </button>
              <button className="tool-item" type="button">
                <span>邮</span>
                <div>
                  <strong>{t('emailAssistant')}</strong>
                  <small>{t('emailDesc')}</small>
                </div>
              </button>
              <button className="tool-item" type="button">
                <span>文</span>
                <div>
                  <strong>{t('writerAssistant')}</strong>
                  <small>{t('writerDesc')}</small>
                </div>
              </button>
            </div>
          </section>

          <section className="sidebar-block">
            <h2>{t('toolStatus')}</h2>
            <div className="activity-item">{t('calculatorReady')}</div>
            <div className="activity-item">{t('emailPending')}</div>
            <div className="activity-item">{t('writerPending')}</div>
          </section>
        </aside>

        <CalculatorPanel
          open={calculatorOpen}
          expression={calculatorExpression}
          result={calculatorResult}
          onChange={setCalculatorExpression}
          onCalculate={calculateExpression}
          onKey={handleCalculatorKey}
          onClose={() => setCalculatorOpen(false)}
          t={t}
        />

        <main className="workspace">
          <header className="workspace-header">
            <div className="brand-copy">
              <span>{t('appTitle')}</span>
            </div>
            <button
              className="language-toggle"
              type="button"
              onClick={() => setLanguage((value) => (value === 'zh' ? 'en' : 'zh'))}
            >
              {t('languageSwitch')}
            </button>
          </header>

          <section className="stage-frame" data-stage={stage}>
            {isGenerating && (
              <div className="query-view view-enter">
                <LoadingSearch t={t} />
              </div>
            )}

            {!isGenerating && stage === 'welcome' && (
              <div className="welcome-hero view-enter">
                <div className="welcome-glow-mark">证</div>
                <h2>{t('welcomeTitle')}</h2>
                <p>{t('welcomeSubtitle')}</p>
                <div className="welcome-search-bar">
                  <input
                    value={query}
                    placeholder={activeSuggestion}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <button className="search-icon-button" type="button" aria-label={t('uploadFile')} title={t('uploadFile')}>
                    <PaperClipOutlined />
                  </button>
                  <button className="search-icon-button" type="button" aria-label={t('voiceInput')} title={t('voiceInput')}>
                    <AudioOutlined />
                  </button>
                  <button className="search-submit-button" type="button" onClick={startSearch}>{t('startSearch')}</button>
                </div>
              </div>
            )}

            {!isGenerating && stage === 'sources' && (
              <div className="sources-view view-enter">
                <div className="section-heading">
                  <span className="section-eyebrow">{t('knowledgeBase')}</span>
                </div>
                <div className="source-selector-grid">
                  {sourceItems[language].map((item) => <SourceCard item={item} key={item.title} />)}
                </div>
                <FileListPanel t={t} language={language} />
              </div>
            )}

            {!isGenerating && stage === 'answer' && (
              <div className="answer-view view-enter">
                <AnswerCard onOpenSource={setPreviewSource} t={t} language={language} />
              </div>
            )}

            {!isGenerating && stage === 'graph' && (
              <div className="graph-view view-enter">
                <RagGraph onOpenSource={setPreviewSource} t={t} language={language} />
              </div>
            )}
          </section>
        </main>
      </div>

      <footer className="demo-controls">
        <div className="stage-progress" aria-label={t('stage')[stage]}>
          {stages.map((item) => (
            <button
              className={stage === item.key ? 'stage-dot active' : 'stage-dot'}
              key={item.key}
              type="button"
              onClick={() => goToStage(item.key)}
              aria-label={t('stage')[item.key]}
              title={t('stage')[item.key]}
            />
          ))}
        </div>

      </footer>

      <SourcePreview source={previewSource} onClose={() => setPreviewSource(null)} t={t} />
    </div>
  );
}

export default App;
