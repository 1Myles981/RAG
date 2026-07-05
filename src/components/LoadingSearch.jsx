import React, { useEffect, useState } from 'react';

export default function LoadingSearch({ response, onDone, t }) {
  const steps = response?.retrievalSteps || [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!response) {
      return undefined;
    }

    if (activeIndex > steps.length) {
      return undefined;
    }

    if (activeIndex === steps.length) {
      const doneTimer = window.setTimeout(onDone, 420);
      return () => window.clearTimeout(doneTimer);
    }

    const timer = window.setTimeout(() => setActiveIndex((value) => value + 1), 420);
    return () => window.clearTimeout(timer);
  }, [response, activeIndex, steps.length, onDone]);

  return (
    <section className="generating-panel">
      <div className="scanner">
        <span />
        <span />
        <span />
      </div>
      <div className="generating-copy">
        <span className="section-eyebrow">{t('searching')}</span>
        <h2>{t('searchingTitle')}</h2>

        <ol className="loading-steps">
          {steps.map((step, index) => {
            const state = index < activeIndex ? 'done' : index === activeIndex ? 'active' : 'pending';
            return (
              <li className={`loading-step ${state}`} key={step.title}>
                <span className="step-dot">{index < activeIndex ? '✓' : index + 1}</span>
                <div>
                  <strong>{step.title}</strong>
                  <small>{step.detail}</small>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
