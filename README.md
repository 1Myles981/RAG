# 可信 RAG 前端原型

这是 Topic 03 的前端起步版本。后端接口未完成前，页面先通过 `src/api.js` 回退到 `src/mockData.js` 里的假数据跑通主链路。

## 当前范围

- 可信问答：问题输入、答案展示、可信标签、证据列表、原文抽屉、检索过程
- 知识库：文档解析状态列表
- 评估指标：证据命中率、表格查询准确率、拒答正确率、平均响应时间

## 建议后端响应结构

配置 `VITE_API_BASE_URL` 后，前端会优先请求：

- `POST /qa`：请求体为 `{ "question": "..." }`
- `GET /documents`
- `GET /metrics`

任一接口不可用时，会自动回退到本地模拟数据。

```json
{
  "question": "商业银行资本充足率监管要求是什么？",
  "keywords": ["商业银行", "资本充足率", "监管要求", "资本净额"],
  "trust": {
    "label": "高可信",
    "level": "success",
    "score": 0.92,
    "reason": "命中 3 条监管原文，证据均来自正式制度文件。"
  },
  "answer": "回答正文",
  "evidence": [
    {
      "id": "EV-001",
      "title": "文件名",
      "source": "监管制度 PDF",
      "section": "章节或表格位置",
      "hitScore": 0.94,
      "excerpt": "证据摘要",
      "originalText": "可追溯原文"
    }
  ],
  "retrievalSteps": [
    {
      "title": "召回候选段落",
      "detail": "从制度、报表、流程文档中召回片段。"
    }
  ]
}
```

## 本地运行

```bash
npm install
npm run dev
```
