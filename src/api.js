import {
  buildMockAnswer,
  documentDetails,
  graphExtraDetails,
  knowledgeFiles,
  knowledgeStats,
  evaluationMetrics
} from './mockData.js';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');

function delay(value, ms = 520) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), ms);
  });
}

async function fetchJson(path, options) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

// ---------- 问答 ----------

export async function askQuestion(question, { language = 'zh', topK = 5, mode = 'hybrid' } = {}) {
  if (!apiBaseUrl) {
    return delay(buildMockAnswer(question, { topK, mode }), 900);
  }

  try {
    const data = await fetchJson('/qa', {
      method: 'POST',
      body: JSON.stringify({ question, language, topK, mode })
    });
    return { ...data, question: data.question || question };
  } catch (error) {
    console.warn('QA API unavailable. Falling back to mock data.', error);
    return delay(buildMockAnswer(question, { topK, mode }), 300);
  }
}

// ---------- 知识库 ----------

export async function loadDocuments(language = 'zh') {
  if (!apiBaseUrl) {
    return delay({ stats: knowledgeStats, items: knowledgeFiles }, 200);
  }

  try {
    return await fetchJson(`/documents?language=${language}`);
  } catch (error) {
    console.warn('Documents API unavailable. Falling back to mock data.', error);
    return { stats: knowledgeStats, items: knowledgeFiles };
  }
}

// mock 下没有详情内容的文档，用文件清单信息兜底生成概览页
function buildFallbackDetail(documentId) {
  const file = knowledgeFiles.find((item) => item.id === documentId);

  if (!file) {
    return null;
  }

  return {
    id: file.id,
    title: file.name,
    type: `${file.sourceType} ${file.type}`,
    issuer: '国家金融监督管理总局',
    docNumber: '—',
    publishDate: file.createdAt?.slice(0, 10) || '—',
    effectiveStatus: file.sourceType === '已废止制度' ? '已废止' : '现行有效',
    location: '文件概览',
    outline: ['文件概览'],
    fullContent: [
      {
        heading: '文件概览',
        body: `《${file.name}》已解析入库${file.chunks > 0 ? `（${file.chunks} 个切片）` : ''}，可在问答中作为证据来源被引用。完整原文内容将在接入后端 GET /api/documents/{documentId} 后展示。`
      }
    ]
  };
}

export async function getDocument(documentId) {
  if (!apiBaseUrl) {
    const detail = documentDetails[documentId]
      || graphExtraDetails[documentId]
      || buildFallbackDetail(documentId);
    return delay(detail || null, 160);
  }

  try {
    return await fetchJson(`/documents/${documentId}`);
  } catch (error) {
    console.warn('Document API unavailable. Falling back to mock data.', error);
    return documentDetails[documentId] || graphExtraDetails[documentId] || buildFallbackDetail(documentId);
  }
}

// ---------- 上传（mock：模拟解析进度） ----------

export async function uploadDocument(file) {
  if (!apiBaseUrl) {
    const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
    const typeMap = { PDF: 'PDF', DOC: 'Word', DOCX: 'Word', XLS: 'Excel', XLSX: 'Excel' };
    return delay({
      documentId: `DOC-U${Date.now()}`,
      name: file.name,
      type: typeMap[ext] || ext,
      status: 'parsing',
      message: '文件已上传，正在解析入库'
    }, 420);
  }

  const form = new FormData();
  form.append('file', file);

  const response = await fetch(`${apiBaseUrl}/documents/upload`, { method: 'POST', body: form });
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }
  return response.json();
}

// ---------- 指标 ----------

export async function loadMetrics(language = 'zh') {
  if (!apiBaseUrl) {
    return delay(evaluationMetrics, 160);
  }

  try {
    return await fetchJson(`/metrics?language=${language}`);
  } catch (error) {
    console.warn('Metrics API unavailable. Falling back to mock data.', error);
    return evaluationMetrics;
  }
}
