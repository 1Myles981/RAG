import React, { useEffect, useMemo, useState } from 'react';
import {
  AudioOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  LeftOutlined,
  MenuOutlined,
  PaperClipOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  Button,
  Drawer,
  Input,
  Layout,
  List,
  Progress,
  Space,
  Statistic,
  Table,
  Tag,
  Timeline,
  Tooltip,
  Typography
} from 'antd';
import { askQuestion, loadDocuments, loadMetrics } from './api.js';
import complianceRobot from './assets/compliance-robot-cutout.png';
import { sampleQuestions } from './mockData.js';

const { Sider, Content } = Layout;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

const navItems = [
  { key: 'qa', label: '可信问答', icon: <SafetyCertificateOutlined /> },
  { key: 'knowledge', label: '知识库', icon: <DatabaseOutlined /> },
  { key: 'metrics', label: '评估指标', icon: <BarChartOutlined /> }
];

const promptCards = [
  {
    title: '核验监管要求',
    body: '查询制度条款、适用范围、最低监管要求，并返回可追溯证据。'
  },
  {
    title: '解释报表口径',
    body: '定位统计报表字段、计算口径和填报说明，辅助核对指标。'
  },
  {
    title: '生成合规回答',
    body: '基于命中证据生成回答，对证据不足的问题给出拒答或澄清。'
  },
  {
    title: '查看可信依据',
    body: '高亮关键词，悬停查看出处，打开原文片段进行人工复核。'
  }
];

const initialConversationHistory = [
  { id: 1, title: '资本充足率监管要求核验', question: '商业银行资本充足率监管要求是什么？', time: '09:42' },
  { id: 2, title: '流动性覆盖率口径说明', question: '流动性覆盖率的统计口径如何解释？', time: '10:18' },
  { id: 3, title: '关联交易制度条款定位', question: '关联交易管理办法中重点披露要求有哪些？', time: '10:57' },
  { id: 4, title: '普惠金融报表字段解释', question: '普惠金融贷款余额字段应如何填报？', time: '11:26' },
  { id: 5, title: '反洗钱客户尽调流程', question: '客户尽职调查流程需要哪些证明材料？', time: '13:08' },
  { id: 6, title: '授信审批证据追溯', question: '授信审批流程中哪些环节需要留痕？', time: '14:15' },
  { id: 7, title: '绿色金融指标口径', question: '绿色贷款统计口径和监管要求是什么？', time: '15:02' },
  { id: 8, title: '投诉处理时限核验', question: '金融消费者投诉处理时限有什么要求？', time: '15:44' },
  { id: 9, title: '同业业务风险分类', question: '同业业务风险分类依据有哪些？', time: '16:20' }
];

const historyPageSize = 6;

const trustColor = {
  success: 'success',
  warning: 'warning',
  danger: 'error'
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function HighlightText({ text, keywords = [], sourceLabel }) {
  const terms = keywords.filter(Boolean).sort((a, b) => b.length - a.length);

  if (!text || terms.length === 0) {
    return text;
  }

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'g');

  return text.split(pattern).map((part, index) => {
    if (!part) {
      return null;
    }

    return terms.includes(part) ? (
      <Tooltip key={`${part}-${index}`} title={sourceLabel ? `出处：${sourceLabel}` : '出处：命中证据'}>
        <mark className="keyword-mark">{part}</mark>
      </Tooltip>
    ) : (
      part
    );
  });
}

function formatTime(date) {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

function getHistoryTitle(value) {
  const text = value.trim();
  return text.length > 16 ? `${text.slice(0, 16)}...` : text;
}

function App() {
  const [question, setQuestion] = useState(sampleQuestions[0]);
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('qa');
  const [sideExpanded, setSideExpanded] = useState(false);
  const [promptActiveIndex, setPromptActiveIndex] = useState(0);
  const [visibleAnswerText, setVisibleAnswerText] = useState('');
  const [answerTextDone, setAnswerTextDone] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [conversationHistory, setConversationHistory] = useState(initialConversationHistory);
  const [documents, setDocuments] = useState([]);
  const [metrics, setMetrics] = useState([]);

  const evidenceRows = useMemo(() => answer?.evidence ?? [], [answer]);
  const keywords = answer?.keywords ?? [];
  const answerSourceLabel = answer
    ? answer.evidence.map((item) => `${item.title} / ${item.section}`).join('；')
    : '';
  const historyPageCount = Math.ceil(conversationHistory.length / historyPageSize);
  const visibleHistory = useMemo(() => {
    const start = (historyPage - 1) * historyPageSize;
    return conversationHistory.slice(start, start + historyPageSize);
  }, [conversationHistory, historyPage]);

  useEffect(() => {
    if (!answer?.answer) {
      setVisibleAnswerText('');
      setAnswerTextDone(false);
      return undefined;
    }

    setVisibleAnswerText('');
    setAnswerTextDone(false);

    let index = 0;
    const timer = window.setInterval(() => {
      index += 2;
      setVisibleAnswerText(answer.answer.slice(0, index));

      if (index >= answer.answer.length) {
        window.clearInterval(timer);
        setAnswerTextDone(true);
      }
    }, 26);

    return () => window.clearInterval(timer);
  }, [answer]);

  useEffect(() => {
    let active = true;

    Promise.all([loadDocuments(), loadMetrics()]).then(([nextDocuments, nextMetrics]) => {
      if (!active) {
        return;
      }

      setDocuments(nextDocuments);
      setMetrics(nextMetrics);
    });

    return () => {
      active = false;
    };
  }, []);

  async function handleAsk() {
    const nextQuestion = question.trim();

    if (!nextQuestion) {
      return;
    }

    setLoading(true);
    try {
      const nextAnswer = await askQuestion(nextQuestion);
      setAnswer(nextAnswer);
      setConversationHistory((items) => [
        {
          id: Date.now(),
          title: getHistoryTitle(nextQuestion),
          question: nextQuestion,
          time: formatTime(new Date())
        },
        ...items.filter((item) => item.question !== nextQuestion)
      ]);
      setHistoryPage(1);
    } finally {
      setLoading(false);
    }
  }

  function handleNewChat() {
    setActiveView('qa');
    setQuestion('');
    setAnswer(null);
    setSelectedEvidence(null);
    setVisibleAnswerText('');
    setAnswerTextDone(false);
  }

  function rotatePromptCards(direction) {
    setPromptActiveIndex((value) => (value + direction + promptCards.length) % promptCards.length);
  }

  function getPromptCardPosition(index) {
    const offset = (index - promptActiveIndex + promptCards.length) % promptCards.length;

    if (offset === 0) {
      return 'center';
    }

    if (offset === 1) {
      return 'right';
    }

    if (offset === promptCards.length - 1) {
      return 'left';
    }

    return 'back';
  }

  async function openHistoryItem(item) {
    setActiveView('qa');
    setQuestion(item.question);
    setLoading(true);
    try {
      setAnswer(await askQuestion(item.question));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout className={sideExpanded ? 'app-shell side-expanded' : 'app-shell'}>
      <Sider className={sideExpanded ? 'rail expanded' : 'rail'} width={sideExpanded ? 220 : 76}>
        <Tooltip title={sideExpanded ? '收起菜单' : '展开菜单'} placement="right">
          <Button
            className="rail-button"
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setSideExpanded((value) => !value)}
            aria-label={sideExpanded ? '收起侧边栏' : '展开侧边栏'}
          >
            <span className="rail-label">菜单</span>
          </Button>
        </Tooltip>
        <Button className="rail-add" type="text" icon={<PlusOutlined />} onClick={handleNewChat}>
          <span className="rail-label">新建问答</span>
        </Button>
        <div className="rail-nav">
          {navItems.map((item) => (
            <Tooltip title={item.label} placement="right" key={item.key}>
              <Button
                className={activeView === item.key ? 'rail-nav-button active' : 'rail-nav-button'}
                type="text"
                icon={item.icon}
                onClick={() => setActiveView(item.key)}
              >
                <span className="rail-label">{item.label}</span>
              </Button>
            </Tooltip>
          ))}
        </div>
        <div className="rail-history">
          <Text className="rail-section-title">对话历史</Text>
          <div className="history-list">
            {visibleHistory.map((item) => (
              <Tooltip title={item.title} placement="right" key={item.id}>
                <button className="history-item" type="button" onClick={() => openHistoryItem(item)}>
                  <span className="history-title">{item.title}</span>
                  <span className="history-meta">{item.time}</span>
                </button>
              </Tooltip>
            ))}
          </div>
          <div className="history-pager">
            <Button
              type="text"
              size="small"
              icon={<LeftOutlined />}
              disabled={historyPage === 1}
              onClick={() => setHistoryPage((value) => Math.max(1, value - 1))}
              aria-label="上一页历史"
            />
            <Text>{historyPage} / {historyPageCount}</Text>
            <Button
              type="text"
              size="small"
              icon={<RightOutlined />}
              disabled={historyPage === historyPageCount}
              onClick={() => setHistoryPage((value) => Math.min(historyPageCount, value + 1))}
              aria-label="下一页历史"
            />
          </div>
        </div>
        <div className="rail-bottom">
          <Button type="text" icon={<QuestionCircleOutlined />} onClick={() => setHelpOpen(true)}>
            <span className="rail-label">帮助</span>
          </Button>
          <Button type="text" icon={<SettingOutlined />}>
            <span className="rail-label">设置</span>
          </Button>
        </div>
      </Sider>

      <Content className="main-shell">
        <header className="topbar">
          <div className="model-title">
            <span>合规智证</span>
            <span className="model-tier">助手</span>
          </div>
          <Space size="middle">
            <div className="avatar">
              <UserOutlined />
            </div>
          </Space>
        </header>

        {activeView === 'qa' && (
          <main className="chat-stage">
            {!answer ? (
              <section className="welcome-panel">
                <img className="welcome-mascot" src={complianceRobot} alt="合规智证助手机器人形象" />
                <Title className="hello-title">你好，欢迎使用合规智证助手</Title>
                <div className="hello-speech-bubble" aria-live="polite">
                  <span className="speech-trail-dot speech-trail-dot-1" aria-hidden="true" />
                  <span className="speech-trail-dot speech-trail-dot-2" aria-hidden="true" />
                  <span className="speech-trail-dot speech-trail-dot-3" aria-hidden="true" />
                  <span className="speech-trail-dot speech-trail-dot-4" aria-hidden="true" />
                  <Title className="hello-subtitle">有什么我可以帮你的吗？</Title>
                </div>

                <div className="prompt-carousel">
                  <Button
                    className="prompt-arrow"
                    shape="circle"
                    icon={<LeftOutlined />}
                    onClick={() => rotatePromptCards(-1)}
                    aria-label="上一组提示"
                  />
                  <div className="prompt-card-viewport">
                    <div className="prompt-card-stage">
                      {promptCards.map((card, index) => (
                        <button
                          className={`prompt-card prompt-card-${getPromptCardPosition(index)}`}
                          key={card.title}
                          type="button"
                          onClick={() => {
                            setPromptActiveIndex(index);
                            setQuestion(sampleQuestions[index % sampleQuestions.length]);
                          }}
                        >
                          <Text strong>{card.title}</Text>
                          <Paragraph>{card.body}</Paragraph>
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button
                    className="prompt-arrow"
                    shape="circle"
                    icon={<RightOutlined />}
                    onClick={() => rotatePromptCards(1)}
                    aria-label="下一组提示"
                  />
                </div>
              </section>
            ) : (
              <section className="answer-panel answer-enter" key={answer.question}>
                <div className="answer-head">
                  <div>
                    <Text type="secondary">当前问题</Text>
                    <Title level={3}>{answer.question}</Title>
                  </div>
                  <Tag color={trustColor[answer.trust.level]}>{answer.trust.label}</Tag>
                </div>

                <div className="trust-strip">
                  <Progress
                    type="circle"
                    percent={Math.round(answer.trust.score * 100)}
                    size={78}
                    strokeColor="#1677ff"
                  />
                  <Paragraph className="trust-reason">{answer.trust.reason}</Paragraph>
                </div>

                <Space wrap className="keyword-row">
                  {keywords.map((keyword) => (
                    <Tag color="gold" key={keyword}>
                      {keyword}
                    </Tag>
                  ))}
                </Space>

                <Paragraph className="answer-text">
                  <HighlightText text={visibleAnswerText} keywords={keywords} sourceLabel={answerSourceLabel} />
                  {!answerTextDone && <span className="typing-caret" />}
                </Paragraph>

                <div className={answerTextDone ? 'answer-detail-grid detail-ready' : 'answer-detail-grid detail-waiting'}>
                  <section className="detail-block">
                    <Title level={5}>来源说明</Title>
                    <List
                      className="evidence-list"
                      dataSource={evidenceRows}
                      renderItem={(item, index) => (
                        <List.Item
                          className="evidence-item-animated"
                          style={{ '--item-delay': `${index * 120}ms` }}
                          actions={[
                            <Button key="open" type="link" onClick={() => setSelectedEvidence(item)}>
                              查看原文
                            </Button>
                          ]}
                        >
                          <List.Item.Meta
                            title={
                              <Space wrap>
                                <Text strong>{item.title}</Text>
                                <Tag>{item.source}</Tag>
                                <Tag color="blue">{item.section}</Tag>
                              </Space>
                            }
                            description={
                              <HighlightText
                                text={item.excerpt}
                                keywords={keywords}
                                sourceLabel={`${item.title} / ${item.section} / 命中 ${Math.round(item.hitScore * 100)}%`}
                              />
                            }
                          />
                          <Text className="score-text">{Math.round(item.hitScore * 100)}%</Text>
                        </List.Item>
                      )}
                    />
                  </section>

                  <section className="detail-block retrieval-block">
                    <Title level={5}>检索过程</Title>
                    <Timeline
                      items={answer.retrievalSteps.map((step) => ({
                        children: (
                          <div>
                            <Text strong>{step.title}</Text>
                            <Paragraph className="timeline-detail">{step.detail}</Paragraph>
                          </div>
                        )
                      }))}
                    />
                  </section>
                </div>
              </section>
            )}

            <section className="composer-wrap">
              <div className="composer">
                <TextArea
                  value={question}
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="输入一个需要核验的问题"
                  onPressEnter={(event) => {
                    if (!event.shiftKey) {
                      event.preventDefault();
                      handleAsk();
                    }
                  }}
                />
                <Space className="composer-actions">
                  <Button shape="circle" type="text" icon={<PaperClipOutlined />} />
                  <Button shape="circle" type="text" icon={<AudioOutlined />} />
                  <Button
                    shape="circle"
                    type="primary"
                    icon={<SendOutlined />}
                    loading={loading}
                    onClick={handleAsk}
                  />
                </Space>
              </div>
            </section>
          </main>
        )}

        {activeView === 'knowledge' && (
          <section className="workspace-panel">
            <Title level={3}>知识库文档</Title>
            <Table
              rowKey="name"
              dataSource={documents}
              pagination={false}
              columns={[
                { title: '文件名', dataIndex: 'name' },
                { title: '类型', dataIndex: 'type', width: 120 },
                { title: '切片数', dataIndex: 'chunks', width: 120 },
                {
                  title: '状态',
                  dataIndex: 'status',
                  width: 120,
                  render: (value) => <Tag color={value === '已入库' ? 'success' : 'processing'}>{value}</Tag>
                }
              ]}
            />
          </section>
        )}

        {activeView === 'metrics' && (
          <section className="metric-grid">
            {metrics.map((item) => (
              <div className="metric-tile" key={item.label}>
                <Statistic title={item.label} value={item.value} />
              </div>
            ))}
          </section>
        )}
      </Content>

      <Drawer
        title={selectedEvidence?.title}
        open={Boolean(selectedEvidence)}
        onClose={() => setSelectedEvidence(null)}
        width={560}
      >
        {selectedEvidence && (
          <Space direction="vertical" size="middle" className="drawer-body">
            <Space wrap>
              <Tag>{selectedEvidence.source}</Tag>
              <Tag color="blue">{selectedEvidence.section}</Tag>
              <Tag color="purple">命中 {Math.round(selectedEvidence.hitScore * 100)}%</Tag>
            </Space>
            <Paragraph>
              <HighlightText
                text={selectedEvidence.originalText}
                keywords={keywords}
                sourceLabel={`${selectedEvidence.title} / ${selectedEvidence.section} / 命中 ${Math.round(
                  selectedEvidence.hitScore * 100
                )}%`}
              />
            </Paragraph>
          </Space>
        )}
      </Drawer>

      <Drawer title="使用说明" open={helpOpen} onClose={() => setHelpOpen(false)} width={460}>
        <Space direction="vertical" size="large" className="help-body">
          <section>
            <Title level={5}>1. 可信问答</Title>
            <Paragraph>
              在底部输入框输入监管制度、统计报表或流程文档相关问题，点击发送按钮生成回答。按 Enter
              发送，Shift + Enter 换行。
            </Paragraph>
          </section>

          <section>
            <Title level={5}>2. 复核回答</Title>
            <Paragraph>
              回答上方会显示可信标签和可信分数。黄色高亮词表示命中的关键依据，鼠标悬停可查看出处。
            </Paragraph>
          </section>

          <section>
            <Title level={5}>3. 查看来源</Title>
            <Paragraph>
              在“来源说明”中查看命中文档、章节和命中分数。点击“查看原文”可打开原文片段，用于人工复核。
            </Paragraph>
          </section>

          <section>
            <Title level={5}>4. 切换页面</Title>
            <Paragraph>
              左侧栏可切换“可信问答”“知识库”“评估指标”。顶部菜单按钮可以展开侧边栏，查看完整功能名称。
            </Paragraph>
          </section>

          <section>
            <Title level={5}>当前限制</Title>
            <Paragraph>
              目前仍是前端原型，回答、证据和指标来自模拟数据；附件上传和语音输入按钮暂为视觉占位。
            </Paragraph>
          </section>
        </Space>
      </Drawer>
    </Layout>
  );
}

export default App;
