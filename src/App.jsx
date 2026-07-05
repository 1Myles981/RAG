import React, { useEffect, useRef, useState } from 'react';
import { AudioOutlined, PaperClipOutlined } from '@ant-design/icons';
import { uiText } from './i18n.js';
import { scenarioQuestions } from './mockData.js';
import { askQuestion, loadDocuments, loadMetrics, getDocument, uploadDocument } from './api.js';
import AnswerView from './components/AnswerView.jsx';
import LoadingSearch from './components/LoadingSearch.jsx';
import KnowledgeBase from './components/KnowledgeBase.jsx';
import SourcePreview from './components/SourcePreview.jsx';
import SourceGraph3D from './components/SourceGraph3D.jsx';
import MascotXiaohe from './components/MascotXiaohe.jsx';

const TABS = ['qa', 'kb', 'graph'];

function App() {
  const [language, setLanguage] = useState('zh');
  const [activeTab, setActiveTab] = useState('qa');
  const [qaPhase, setQaPhase] = useState('welcome'); // welcome | loading | answer
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [preview, setPreview] = useState(null);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [isRailExpanded, setIsRailExpanded] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [qaHistory, setQaHistory] = useState([]);
  const [docs, setDocs] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [topK, setTopK] = useState(5);
  const [retrievalMode, setRetrievalMode] = useState('hybrid');
  const [isListening, setIsListening] = useState(false);

  const uploadInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const t = (key) => uiText[language][key];
  const suggestions = scenarioQuestions.map((item) => item.question);
  const activeSuggestion = suggestions[suggestionIndex % suggestions.length];

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = t('appTitle');
  }, [language]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSuggestionIndex((value) => (value + 1) % suggestions.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [suggestions.length]);

  useEffect(() => {
    loadDocuments(language).then(setDocs);
    loadMetrics(language).then(setMetrics);
  }, [language]);

  async function ask(rawQuestion) {
    const question = (rawQuestion ?? query).trim() || activeSuggestion;
    setQuery(question);
    setActiveTab('qa');
    setQaPhase('loading');
    setResponse(null);
    setPreview(null);

    const result = await askQuestion(question, { language, topK, mode: retrievalMode });
    setResponse(result);
  }

  function handleLoadingDone() {
    setQaPhase('answer');

    if (response) {
      setQaHistory((items) => [
        {
          id: Date.now(),
          question: response.question,
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          response
        },
        ...items.filter((item) => item.question !== response.question)
      ]);
    }
  }

  function startNewQuestion() {
    setQuery('');
    setResponse(null);
    setQaPhase('welcome');
    setActiveTab('qa');
  }

  function openHistoryItem(item) {
    setQuery(item.question);
    setResponse(item.response);
    setQaPhase('answer');
    setActiveTab('qa');
  }

  async function openEvidence(evidence) {
    const detail = await getDocument(evidence.documentId);
    if (detail) {
      setPreview({ detail, hitLocation: evidence.section, hitCell: evidence.cellRef || null });
    }
  }

  async function openDocumentById(documentId) {
    const detail = await getDocument(documentId);
    if (detail) {
      setPreview({ detail, hitLocation: detail.location, hitCell: null });
    }
  }

  async function handleUpload(file) {
    const uploaded = await uploadDocument(file);
    const doc = {
      id: uploaded.documentId,
      name: uploaded.name || file.name,
      type: uploaded.type || 'FILE',
      sourceType: '监管制度',
      status: 'parsing',
      chunks: 0,
      progress: 8,
      createdAt: new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    };

    setUploads((items) => [doc, ...items]);
    setActiveTab('kb');

    const timer = window.setInterval(() => {
      setUploads((items) => items.map((item) => {
        if (item.id !== doc.id) {
          return item;
        }
        const progress = Math.min(100, (item.progress ?? 0) + 12 + Math.round(Math.random() * 14));
        if (progress >= 100) {
          window.clearInterval(timer);
          return { ...item, progress: 100, status: 'indexed', chunks: 24 + Math.round(Math.random() * 80) };
        }
        return { ...item, progress };
      }));
    }, 480);
  }

  function toggleVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      window.alert(t('voiceUnsupported'));
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'zh' ? 'zh-CN' : 'en-US';
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript;
      if (text) {
        setQuery(text);
      }
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }

  return (
    <div className="demo-shell">
      <div className={['product-window', isRailExpanded ? 'rail-expanded' : ''].filter(Boolean).join(' ')}>
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
                    <small>{item.time} · {item.response?.trust?.label}</small>
                  </button>
                ))
              )}
            </section>
          )}
        </aside>

        <aside className="project-sidebar">
          <div className="project-title">
            <span>{t('sidebarEyebrow')}</span>
            <h1>{t('sidebarTitle')}</h1>
          </div>

          <section className="sidebar-block">
            <h2>{t('quickAsk')}</h2>
            <div className="tool-list">
              {scenarioQuestions.map((item) => (
                <button className="tool-item" key={item.scenario} type="button" onClick={() => ask(item.question)}>
                  <span>{item.tag.slice(0, 1)}</span>
                  <div>
                    <strong>{item.tag}</strong>
                    <small>{item.question}</small>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="sidebar-block">
            <h2>{t('metricsTitle')}</h2>
            <div className="metric-list">
              {metrics.map((metric) => (
                <div className="metric-row" key={metric.label}>
                  <span>{metric.label}</span>
                  <div>
                    <strong>{metric.value}</strong>
                    <small>{metric.target}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="sidebar-block">
            <h2>{t('settingsTitle')}</h2>
            <div className="setting-row">
              <span>{t('topKLabel')}</span>
              <div className="segmented">
                {[3, 5, 8].map((value) => (
                  <button
                    className={topK === value ? 'active' : ''}
                    key={value}
                    type="button"
                    onClick={() => setTopK(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className="setting-row">
              <span>{t('modeLabel')}</span>
              <div className="segmented">
                {[
                  { key: 'hybrid', label: t('modeHybrid') },
                  { key: 'keyword', label: t('modeKeyword') },
                  { key: 'semantic', label: t('modeSemantic') }
                ].map((mode) => (
                  <button
                    className={retrievalMode === mode.key ? 'active' : ''}
                    key={mode.key}
                    type="button"
                    onClick={() => setRetrievalMode(mode.key)}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </aside>

        <main className="workspace">
          <header className="workspace-header">
            <div className="brand-copy">
              <span>{t('appTitle')}</span>
            </div>

            <nav className="nav-tabs" aria-label={t('menu')}>
              {TABS.map((tab) => (
                <button
                  className={activeTab === tab ? 'nav-tab active' : 'nav-tab'}
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                >
                  {t(tab === 'qa' ? 'navQa' : tab === 'kb' ? 'navKb' : 'navGraph')}
                </button>
              ))}
            </nav>

            <button
              className="language-toggle"
              type="button"
              onClick={() => setLanguage((value) => (value === 'zh' ? 'en' : 'zh'))}
            >
              {t('languageSwitch')}
            </button>
          </header>

          <section className="stage-frame">
            {activeTab === 'qa' && qaPhase === 'welcome' && (
              <div className="welcome-hero view-enter">
                <div className="welcome-glow-mark">证</div>
                <h2>{t('welcomeTitle')}</h2>
                <p>{t('welcomeSubtitle')}</p>
                <div className="welcome-search-bar">
                  <input
                    value={query}
                    placeholder={isListening ? t('voiceListening') : activeSuggestion}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        ask();
                      }
                    }}
                  />
                  <button
                    className="search-icon-button"
                    type="button"
                    aria-label={t('uploadFile')}
                    title={t('uploadFile')}
                    onClick={() => uploadInputRef.current?.click()}
                  >
                    <PaperClipOutlined />
                  </button>
                  <input
                    ref={uploadInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    hidden
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        handleUpload(file);
                      }
                      event.target.value = '';
                    }}
                  />
                  <button
                    className={isListening ? 'search-icon-button listening' : 'search-icon-button'}
                    type="button"
                    aria-label={t('voiceInput')}
                    title={t('voiceInput')}
                    onClick={toggleVoiceInput}
                  >
                    <AudioOutlined />
                  </button>
                  <button className="search-submit-button" type="button" onClick={() => ask()}>
                    {t('startSearch')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'qa' && qaPhase === 'loading' && (
              <div className="query-view view-enter">
                <LoadingSearch response={response} onDone={handleLoadingDone} t={t} />
              </div>
            )}

            {activeTab === 'qa' && qaPhase === 'answer' && response && (
              <div className="answer-view view-enter">
                <AnswerView
                  response={response}
                  onOpenEvidence={openEvidence}
                  onAskFollowUp={(question) => ask(question)}
                  t={t}
                />
              </div>
            )}

            {activeTab === 'kb' && (
              <div className="sources-view view-enter">
                <KnowledgeBase
                  docs={docs}
                  uploads={uploads}
                  onUpload={handleUpload}
                  onOpenDocument={openDocumentById}
                  t={t}
                />
              </div>
            )}

            {activeTab === 'graph' && (
              <div className="graph-view view-enter">
                <section className="graph-stage">
                  <div className="rag-graph-card">
                    <div className="section-heading">
                      <h2>{t('graphTitle')}</h2>
                      <p className="graph-hint">{t('graphHint')}</p>
                    </div>
                    <SourceGraph3D onOpenNode={openDocumentById} language={language} />
                  </div>

                  <aside className="retrieval-info-card">
                    <span className="section-eyebrow">{t('retrievalInfo')}</span>
                    <dl>
                      {metrics.slice(0, 4).map((metric) => (
                        <div key={metric.label}>
                          <dt>{metric.label}</dt>
                          <dd>{metric.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </aside>
                </section>
              </div>
            )}
          </section>
        </main>
      </div>

      <SourcePreview preview={preview} onClose={() => setPreview(null)} t={t} />

      <MascotXiaohe
        phase={activeTab === 'qa' ? qaPhase : 'welcome'}
        language={language}
        onActivate={startNewQuestion}
      />
    </div>
  );
}

export default App;
