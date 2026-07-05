import React, { useMemo, useRef, useState } from 'react';

const PAGE_SIZE = 6;

export default function KnowledgeBase({ docs, uploads, onUpload, onOpenDocument, t }) {
  const [filter, setFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const fileInputRef = useRef(null);

  const stats = docs?.stats;
  const items = useMemo(() => {
    const merged = [...(uploads || []), ...(docs?.items || [])];
    return merged.filter((file) => {
      const matchType = filter === 'all' || file.sourceType === filter;
      const matchKeyword = !keyword.trim() || file.name.toLowerCase().includes(keyword.trim().toLowerCase());
      return matchType && matchKeyword;
    });
  }, [docs, uploads, filter, keyword]);

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const visibleItems = items.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const sourceTypes = useMemo(() => {
    const types = new Set((docs?.items || []).map((file) => file.sourceType));
    return ['all', ...types];
  }, [docs]);

  function changeFilter(next) {
    setFilter(next);
    setPage(0);
  }

  return (
    <div className="kb-view">
      {stats && (
        <div className="kb-stats">
          <article><strong>{stats.total}</strong><span>{t('statTotal')}</span></article>
          <article><strong>{stats.regulation}</strong><span>{t('statRegulation')}</span></article>
          <article><strong>{stats.table}</strong><span>{t('statTable')}</span></article>
          <article><strong>{stats.corpus}</strong><span>{t('statCorpus')}</span></article>
        </div>
      )}

      <section className="file-list-panel">
        <div className="file-list-header">
          <div>
            <span className="section-eyebrow">{t('fileList')}</span>
            <h3>{t('connectedFiles')}</h3>
          </div>
          <div className="kb-actions">
            <input
              className="kb-search"
              value={keyword}
              placeholder={t('searchFiles')}
              onChange={(event) => { setKeyword(event.target.value); setPage(0); }}
            />
            <button className="kb-upload-button" type="button" onClick={() => fileInputRef.current?.click()}>
              ⇪ {t('uploadFile')}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  onUpload(file);
                }
                event.target.value = '';
              }}
            />
          </div>
        </div>

        <div className="kb-filters" role="tablist">
          {sourceTypes.map((type) => (
            <button
              className={filter === type ? 'kb-filter active' : 'kb-filter'}
              key={type}
              type="button"
              onClick={() => changeFilter(type)}
            >
              {type === 'all' ? t('filterAll') : (t('sourceType')[type] || type)}
            </button>
          ))}
          <span className="kb-count">{items.length} {t('fileCount')} · {t('uploadHint')}</span>
        </div>

        <div className="file-list-scroll kb-list" aria-label={t('fileList')}>
          {visibleItems.map((file) => (
            <article
              className={file.progress != null && file.status === 'parsing' ? 'file-list-item uploading' : 'file-list-item'}
              key={file.id || file.name}
            >
              <div className="file-main">
                <button
                  className="file-name"
                  type="button"
                  onClick={() => onOpenDocument(file.id)}
                  title={t('viewOriginal')}
                >
                  {file.name}
                </button>
                <p>
                  {t('sourceType')[file.sourceType] || file.sourceType}
                  {file.chunks > 0 && ` · ${file.chunks} ${t('chunksUnit')}`}
                  {file.createdAt && ` · ${file.createdAt}`}
                </p>
                {file.progress != null && file.status === 'parsing' && (
                  <div className="upload-progress">
                    <div className="upload-progress-bar" style={{ width: `${file.progress}%` }} />
                  </div>
                )}
              </div>
              <span>{file.type}</span>
              <em className={`file-status ${file.status}`}>{t('fileStatus')[file.status] || file.status}</em>
            </article>
          ))}
        </div>

        <div className="file-list-pagination">
          <button type="button" onClick={() => setPage(safePage - 1)} disabled={safePage === 0} aria-label={t('previousPage')}>
            ‹
          </button>
          <span>{safePage + 1} / {pageCount}</span>
          <button type="button" onClick={() => setPage(safePage + 1)} disabled={safePage >= pageCount - 1} aria-label={t('nextPage')}>
            ›
          </button>
        </div>
      </section>
    </div>
  );
}
