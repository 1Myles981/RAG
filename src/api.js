import { getMockData } from './mockData.js';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');

function mockAnswer(question, language) {
  const { mockResponse } = getMockData(language);
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

export async function askQuestion(question, language = 'zh') {
  if (!apiBaseUrl) {
    return delay(mockAnswer(question, language));
  }

  try {
    const data = await fetchJson('/qa', {
      method: 'POST',
      body: JSON.stringify({ question, language })
    });

    return { ...data, question: data.question || question };
  } catch (error) {
    console.warn('QA API unavailable. Falling back to mock data.', error);
    return delay(mockAnswer(question, language), 160);
  }
}

export async function loadDocuments(language = 'zh') {
  if (!apiBaseUrl) {
    return getMockData(language).documents;
  }

  try {
    return await fetchJson(`/documents?language=${language}`);
  } catch (error) {
    console.warn('Documents API unavailable. Falling back to mock data.', error);
    return getMockData(language).documents;
  }
}

export async function loadMetrics(language = 'zh') {
  if (!apiBaseUrl) {
    return getMockData(language).metrics;
  }

  try {
    return await fetchJson(`/metrics?language=${language}`);
  } catch (error) {
    console.warn('Metrics API unavailable. Falling back to mock data.', error);
    return getMockData(language).metrics;
  }
}
