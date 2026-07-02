import { documents as mockDocuments, metrics as mockMetrics, mockResponse } from './mockData.js';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');

function mockAnswer(question) {
  return { ...mockResponse, question };
}

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

export async function askQuestion(question) {
  if (!apiBaseUrl) {
    return delay(mockAnswer(question));
  }

  try {
    const data = await fetchJson('/qa', {
      method: 'POST',
      body: JSON.stringify({ question })
    });

    return { ...data, question: data.question || question };
  } catch (error) {
    console.warn('问答接口不可用，已回退到模拟数据。', error);
    return delay(mockAnswer(question), 160);
  }
}

export async function loadDocuments() {
  if (!apiBaseUrl) {
    return mockDocuments;
  }

  try {
    return await fetchJson('/documents');
  } catch (error) {
    console.warn('知识库接口不可用，已回退到模拟数据。', error);
    return mockDocuments;
  }
}

export async function loadMetrics() {
  if (!apiBaseUrl) {
    return mockMetrics;
  }

  try {
    return await fetchJson('/metrics');
  } catch (error) {
    console.warn('指标接口不可用，已回退到模拟数据。', error);
    return mockMetrics;
  }
}
