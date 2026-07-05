import React, { useEffect, useRef } from 'react';

function TableSection({ table, hitCell, t }) {
  const hasHit = hitCell && hitCell.sheet === table.sheet;

  return (
    <div className="doc-table-wrap">
      <div className="doc-table-meta">
        <span>工作表：{table.sheet}</span>
        {hasHit && <span className="doc-table-hit">{t('hitCellLabel')}：{hitCell.cell}</span>}
      </div>
      <div className="doc-table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              {table.columns.map((column) => <th key={column}>{column}</th>)}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={row[0]}>
                {row.map((cell, cellIndex) => {
                  const isHit = hasHit && rowIndex === hitCell.row && cellIndex === hitCell.col;
                  return (
                    <td className={isHit ? 'hit-cell' : ''} key={`${row[0]}-${cellIndex}`}>
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SourcePreview({ preview, onClose, t }) {
  const sectionRefs = useRef({});

  useEffect(() => {
    if (!preview) {
      return undefined;
    }

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [preview, onClose]);

  if (!preview?.detail) {
    return null;
  }

  const { detail, hitLocation, hitCell } = preview;
  const location = hitLocation || detail.location || '';
  const repealed = detail.effectiveStatus === '已废止';

  function scrollToSection(item) {
    const matchedSection = detail.fullContent.find((section) => (
      section.heading === item || section.heading.includes(item) || item.includes(section.heading)
    ));
    const target = sectionRefs.current[item] || sectionRefs.current[matchedSection?.heading];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <div
      className="source-preview-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={t('sourcePreview')}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="source-preview">
        <header>
          <div>
            <span className="section-eyebrow">{t('sourcePreview')}</span>
            <h2>{detail.title}</h2>
          </div>
          <button type="button" onClick={onClose}>{t('close')}</button>
        </header>

        <div className="source-preview-meta">
          <span>{detail.type}</span>
          {detail.issuer && <span>{t('issuer')}：{detail.issuer}</span>}
          {detail.docNumber && detail.docNumber !== '—' && <span>{t('docNumber')}：{detail.docNumber}</span>}
          {detail.publishDate && detail.publishDate !== '—' && <span>{t('publishDate')}：{detail.publishDate}</span>}
          {detail.effectiveStatus && (
            <span className={repealed ? 'status-pill repealed' : 'status-pill'}>{detail.effectiveStatus}</span>
          )}
        </div>

        <div className="source-document-viewer">
          <nav className="source-document-outline" aria-label={t('documentOutline')}>
            <h3>{t('documentOutline')}</h3>
            {detail.outline.map((item) => (
              <button
                className={item === location || location.includes(item) ? 'active' : ''}
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
              <span>{location}</span>
            </div>
            {detail.fullContent.map((section) => {
              const isHit = location.includes(section.heading) || section.heading.includes(location);
              return (
                <section
                  className={isHit ? 'document-section hit-section' : 'document-section'}
                  key={section.heading}
                  ref={(element) => { sectionRefs.current[section.heading] = element; }}
                >
                  <h3>{section.heading}</h3>
                  {section.table
                    ? <TableSection table={section.table} hitCell={hitCell} t={t} />
                    : <p>{section.body}</p>}
                </section>
              );
            })}
          </article>
        </div>
      </section>
    </div>
  );
}
