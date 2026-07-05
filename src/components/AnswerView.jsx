import React from 'react';

const GAUGE_CIRCUMFERENCE = 2 * Math.PI * 48;

const gaugeGradients = {
  success: ['#2dd4bf', '#22c55e', '#7dd3fc'],
  warning: ['#fbbf24', '#f59e0b', '#fb923c'],
  error: ['#fda4af', '#fb7185', '#f43f5e']
};

function renderAnswerText(text, evidence, onOpenEvidence) {
  return text.split(/(\[\d+\])/g).map((part, index) => {
    const match = part.match(/^\[(\d+)\]$/);
    if (match) {
      const item = evidence[Number(match[1]) - 1];
      if (item) {
        return (
          <button
            className="citation-chip"
            key={`cite-${index}`}
            type="button"
            title={`${item.title} / ${item.section}`}
            onClick={() => onOpenEvidence(item)}
          >
            {part}
          </button>
        );
      }
    }
    return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>;
  });
}

function ConfidenceGauge({ trust, t }) {
  const score = Math.round((trust?.score ?? 0) * 100);
  const level = trust?.level || 'success';
  const [c1, c2, c3] = gaugeGradients[level] || gaugeGradients.success;
  const offset = GAUGE_CIRCUMFERENCE * (1 - (trust?.score ?? 0));

  return (
    <div className="confidence-gauge" aria-label={`${t('confidence')} ${score}%`}>
      <svg viewBox="0 0 120 120" role="img">
        <defs>
          <linearGradient id={`gauge-${level}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="62%" stopColor={c2} />
            <stop offset="100%" stopColor={c3} />
          </linearGradient>
        </defs>
        <circle className="gauge-track" cx="60" cy="60" r="48" />
        <circle
          className="gauge-value"
          cx="60"
          cy="60"
          r="48"
          style={{
            stroke: `url(#gauge-${level})`,
            strokeDasharray: GAUGE_CIRCUMFERENCE,
            strokeDashoffset: offset
          }}
        />
      </svg>
      <div className="gauge-center">
        <strong>{score}%</strong>
        <span>{t('confidence')}</span>
      </div>
    </div>
  );
}

function EvidenceCard({ item, index, onOpen, t }) {
  const repealed = item.effectiveStatus === '已废止';
  const scorePercent = Math.round((item.hitScore ?? 0) * 100);

  return (
    <article className={repealed ? 'evidence-card repealed' : 'evidence-card'}>
      <header>
        <span className="evidence-index">[{index + 1}]</span>
        <h4>{item.title}</h4>
        <em className={repealed ? 'status-tag repealed' : 'status-tag'}>{item.effectiveStatus}</em>
      </header>

      <p className="evidence-excerpt">{item.excerpt}</p>

      <div className="evidence-meta">
        <span>{item.source}</span>
        <span>{item.section}</span>
        {item.issuer && <span>{t('issuer')}：{item.issuer}</span>}
        {item.docNumber && <span>{t('docNumber')}：{item.docNumber}</span>}
        {item.publishDate && <span>{t('publishDate')}：{item.publishDate}</span>}
        {item.cellRef && (
          <span className="cell-ref">
            {t('tableCell')}：{item.cellRef.sheet} / {item.cellRef.cell}
          </span>
        )}
      </div>

      <footer>
        <div className="hit-score" title={`${t('hitScore')} ${scorePercent}%`}>
          <span>{t('hitScore')}</span>
          <div className="hit-score-track">
            <div className="hit-score-bar" style={{ width: `${scorePercent}%` }} />
          </div>
          <strong>{scorePercent}%</strong>
        </div>
        <button type="button" onClick={() => onOpen(item)}>{t('viewOriginal')} →</button>
      </footer>
    </article>
  );
}

function RetrievalStrip({ steps, t }) {
  if (!steps?.length) {
    return null;
  }

  return (
    <section className="retrieval-strip" aria-label={t('retrievalSteps')}>
      <h3>{t('retrievalSteps')}</h3>
      <ol>
        {steps.map((step, index) => (
          <li key={step.title}>
            <span className="step-dot">{index + 1}</span>
            <div>
              <strong>{step.title}</strong>
              <small>{step.detail}</small>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function AnswerView({ response, onOpenEvidence, onAskFollowUp, t }) {
  if (!response) {
    return null;
  }

  const { trust, evidence = [], clarifications, missing, stats, retrievalSteps, qaType } = response;
  const level = trust?.level || 'success';

  return (
    <article className="answer-detail-card answer-detail-vertical">
      <div className="answer-copy">
        <div className="answer-headline">
          <div>
            <span className="section-eyebrow">{t('trustedAnswer')}</span>
            <h2>{t('smartAnswer')}</h2>
          </div>
          <div className="answer-tags">
            {qaType && <span className="qa-type-chip">{qaType}</span>}
            <span className={`trust-badge ${level}`}>{trust?.label}</span>
          </div>
        </div>

        {response.question && (
          <p className="asked-question">
            <span>{t('questionLabel')}</span>
            {response.question}
          </p>
        )}

        <div className={`trust-banner ${level}`}>
          <strong>{trust?.label} · {Math.round((trust?.score ?? 0) * 100)}%</strong>
          <span>{trust?.reason}</span>
        </div>

        <p className="answer-paragraph">
          {renderAnswerText(response.answer, evidence, onOpenEvidence)}
        </p>

        {missing?.length > 0 && (
          <section className="missing-block">
            <h3>{t('missingTitle')}</h3>
            <ul>
              {missing.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        )}

        {clarifications?.length > 0 && (
          <section className="clarify-block">
            <h3>{t('clarifyTitle')}</h3>
            <div className="clarify-options">
              {clarifications.map((item) => (
                <button key={item} type="button" onClick={() => onAskFollowUp(item)}>
                  {item}
                </button>
              ))}
            </div>
          </section>
        )}

        <RetrievalStrip steps={retrievalSteps} t={t} />

        <section className="evidence-section">
          <h3>{t('sourceMaterials')}（{evidence.length}）</h3>
          <div className="evidence-grid">
            {evidence.map((item, index) => (
              <EvidenceCard item={item} index={index} key={item.id} onOpen={onOpenEvidence} t={t} />
            ))}
          </div>
        </section>
      </div>

      <aside className="answer-side">
        <ConfidenceGauge trust={trust} t={t} />
        {stats && (
          <dl className="answer-stats">
            <div><dt>{t('sourceCountLabel')}</dt><dd>{stats.sourceCount}</dd></div>
            <div><dt>{t('retrievalTimeLabel')}</dt><dd>{(stats.retrievalTimeMs / 1000).toFixed(1)}s</dd></div>
            <div><dt>{t('confidenceLabel')}</dt><dd>{stats.confidence}</dd></div>
          </dl>
        )}
      </aside>
    </article>
  );
}
