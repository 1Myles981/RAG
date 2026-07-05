# 后端接口对接清单

本文档用于前端与后端对接“合规智证助手 / 可信 RAG 问答”功能。当前前端已有静态演示数据，后端完成以下接口后，前端即可逐步替换 mock 数据。

## 基础约定

- 接口前缀建议：`/api`
- 请求与响应格式：`application/json`
- 文件上传：`multipart/form-data`
- 语言参数：`zh | en | auto`
- 文件状态：`uploaded | parsing | indexed | failed`
- 时间格式建议：ISO 8601，例如 `2026-07-03T19:30:00+08:00`

前端最关键的字段是 `documentId`。问答证据、原文查看、图谱节点点击都需要通过 `documentId` 串起来。

## P0 必接接口

### 1. 问答检索

用于点击“开始检索”后生成可信回答。

```http
POST /api/qa
```

请求：

```json
{
  "question": "商业银行资本充足率监管要求是什么？",
  "language": "zh",
  "topK": 5
}
```

返回：

```json
{
  "question": "商业银行资本充足率监管要求是什么？",
  "answer": "商业银行应持续满足资本充足率监管要求...",
  "trust": {
    "score": 0.92,
    "level": "success",
    "label": "高可信",
    "reason": "命中监管原文和报表说明"
  },
  "evidence": [
    {
      "id": "EV-001",
      "documentId": "DOC-001",
      "title": "商业银行资本管理办法.pdf",
      "source": "监管制度 PDF",
      "section": "第二章 资本充足率监管要求",
      "excerpt": "商业银行应当按照监管规定计算资本充足率...",
      "hitScore": 0.94
    }
  ],
  "retrievalSteps": [
    {
      "title": "解析问题",
      "detail": "识别问题类型、关键词和检索范围"
    }
  ],
  "stats": {
    "sourceCount": 18,
    "retrievalTimeMs": 8800,
    "confidence": "高"
  }
}
```

### 2. 知识库文件列表

用于知识库页面的文件清单。

```http
GET /api/documents?language=zh&page=1&pageSize=4&status=indexed
```

返回：

```json
{
  "total": 18,
  "items": [
    {
      "id": "DOC-001",
      "name": "商业银行资本管理办法.pdf",
      "type": "PDF",
      "sourceType": "监管制度",
      "status": "indexed",
      "chunks": 128,
      "createdAt": "2026-07-01T09:30:00+08:00"
    }
  ]
}
```

### 3. 查看原文档

用于点击“查看完整原文档”或图谱节点后展示文档内容。

```http
GET /api/documents/{documentId}
```

返回：

```json
{
  "id": "DOC-001",
  "title": "商业银行资本管理办法.pdf",
  "type": "监管制度 PDF",
  "location": "第二章 资本充足率监管要求",
  "outline": ["文件概览", "第一章 总则", "第二章 资本充足率监管要求"],
  "fullContent": [
    {
      "heading": "文件概览",
      "body": "本文档用于规范商业银行资本管理..."
    },
    {
      "heading": "第二章 资本充足率监管要求",
      "body": "商业银行应当按照监管规定计算资本充足率..."
    }
  ]
}
```

### 4. 文件上传

用于搜索框左侧的附件上传图标。

```http
POST /api/documents/upload
```

请求类型：`multipart/form-data`

字段：

```txt
file: PDF/DOCX/XLSX
sourceType: regulation | table | guide | process
language: zh | en | auto
```

返回：

```json
{
  "documentId": "DOC-010",
  "status": "parsing",
  "message": "文件已上传，正在解析入库"
}
```

### 5. 文件解析状态

用于上传后轮询解析进度。

```http
GET /api/documents/{documentId}/status
```

返回：

```json
{
  "documentId": "DOC-010",
  "status": "indexed",
  "progress": 100,
  "chunks": 86,
  "error": null
}
```

## P1 建议接口

### 6. 来源文件图谱

用于“来源文件图谱分析”页面的 3D 图谱。

```http
GET /api/graph?questionId=QA-001&language=zh
```

返回：

```json
{
  "nodes": [
    {
      "id": "DOC-001",
      "label": "资本管理办法",
      "type": "PDF",
      "group": "rule",
      "documentId": "DOC-001"
    }
  ],
  "links": [
    {
      "source": "DOC-001",
      "target": "DOC-002",
      "relation": "口径校验"
    }
  ]
}
```

### 7. 历史记录列表

用于左侧菜单里的历史记录。

```http
GET /api/history?language=zh&page=1&pageSize=20
```

返回：

```json
{
  "items": [
    {
      "id": "QA-001",
      "question": "商业银行资本充足率监管要求是什么？",
      "time": "19:30",
      "createdAt": "2026-07-03T19:30:00+08:00"
    }
  ]
}
```

### 8. 历史记录详情

用于点击历史记录后恢复答案。

```http
GET /api/history/{id}
```

返回结构建议与 `POST /api/qa` 保持一致。

### 9. 统计信息

用于答案卡片和图谱侧边栏里的统计信息。

```http
GET /api/metrics?language=zh
```

返回：

```json
{
  "sourceCount": 18,
  "avgRetrievalTime": "8.8 秒",
  "confidence": "高",
  "policyAccuracy": "85%+",
  "tableAccuracy": "80%+",
  "citationHitRate": "90%+",
  "clarificationRate": "80%+"
}
```

## P2 可后做接口

### 10. 语音识别

如果只做浏览器端语音输入，可以先不接后端。若需要稳定兼容手机浏览器，建议后端提供接口。

```http
POST /api/speech/transcribe
```

请求：音频文件或音频二进制流。

返回：

```json
{
  "text": "商业银行资本充足率监管要求是什么？",
  "language": "zh"
}
```

### 11. 翻译

当前中英文切换可以先由前端静态完成。若答案、证据、原文都要真实翻译，需要后端提供翻译能力。

```http
POST /api/translate
```

请求：

```json
{
  "text": "商业银行应持续满足资本充足率监管要求...",
  "sourceLanguage": "zh",
  "targetLanguage": "en"
}
```

返回：

```json
{
  "translatedText": "Commercial banks should continuously meet capital adequacy regulatory requirements..."
}
```

### 12. 删除文件

```http
DELETE /api/documents/{documentId}
```

返回：

```json
{
  "success": true
}
```

### 13. 重新入库

```http
POST /api/documents/{documentId}/reindex
```

返回：

```json
{
  "documentId": "DOC-001",
  "status": "parsing",
  "message": "已开始重新解析"
}
```

## 英文资料支持要求

如果资料库里有英文文件，后端需要支持：

- 文件语言检测：中文、英文、混合文本。
- 英文 PDF/Word/Excel 解析。
- 英文 chunk 切分。
- 英文 embedding。
- 跨语言检索：中文问题能检索英文资料，英文问题也能检索中文资料。
- 证据返回原文：即使页面语言切换，证据最好保留原文，并可额外返回翻译字段。

建议证据结构增加：

```json
{
  "excerpt": "Original evidence text...",
  "excerptTranslation": "证据中文翻译...",
  "originalLanguage": "en"
}
```

## 前端接入顺序建议

1. 先接 `POST /api/qa`，让问答结果变成真实检索结果。
2. 再接 `GET /api/documents` 和 `GET /api/documents/{documentId}`，打通知识库和原文查看。
3. 再接 `POST /api/documents/upload` 和状态轮询。
4. 最后接图谱、历史记录、统计信息、语音和翻译。

---

## 契约更新（2026-07-05，前端数据驱动改造后）

前端已完成数据驱动改造，以下字段为新增/调整项。当前均有 mock 兜底，后端可增量实现。

### `POST /api/qa` 响应扩展

```json
{
  "question": "...",
  "qaType": "制度事实 | 表格取数 | 版本对比 | 拒答澄清",
  "answer": "答案正文，引用位置内联 [1][2] 标记，前端解析为可点击引用",
  "trust": {
    "score": 0.92,
    "level": "success | warning | error",
    "label": "高可信 | 版本提示 | 拒答 / 澄清",
    "reason": "置信度判定理由"
  },
  "evidence": [
    {
      "id": "EV-001",
      "documentId": "DOC-001",
      "title": "商业银行资本管理办法.pdf",
      "source": "监管制度 PDF",
      "section": "第二章 资本充足率监管要求",
      "excerpt": "...",
      "hitScore": 0.94,
      "issuer": "国家金融监督管理总局",
      "docNumber": "总局令 2023 年第 4 号",
      "publishDate": "2023-11-01",
      "effectiveStatus": "现行有效 | 已废止",
      "cellRef": {
        "sheet": "资本充足率汇总",
        "cell": "C8",
        "row": 6,
        "col": 2
      }
    }
  ],
  "missing": ["拒答时：缺失依据列表（可选）"],
  "clarifications": ["拒答时：澄清问题列表，前端渲染为可点击追问（可选）"],
  "retrievalSteps": [{ "title": "解析问题", "detail": "..." }],
  "stats": { "sourceCount": 18, "retrievalTimeMs": 2400, "confidence": "高 | 中 | 不足" }
}
```

要点：

- `answer` 里的 `[n]` 与 `evidence[n-1]` 一一对应，请保证编号连续。
- 拒答/澄清也走同一结构：`trust.level = "error"`，附 `missing` 和 `clarifications`。
- `cellRef` 仅表格取数类证据需要：`row`/`col` 是表格数据的 0 起始行列索引（用于前端高亮），`cell` 是 Excel 坐标（用于展示）。
- `effectiveStatus` 用于版本时效标签，命中已废止文件必须标注，前端会红色高亮提示。

### `GET /api/documents` 响应扩展

顶层增加 `stats`，前端知识库页顶部统计卡使用：

```json
{
  "stats": { "total": 218, "regulation": 100, "table": 100, "corpus": 18 },
  "items": [
    {
      "id": "DOC-001",
      "name": "...",
      "type": "PDF | Word | Excel",
      "sourceType": "监管制度 | 统计报表 | 报表说明 | 业务流程 | 已废止制度",
      "status": "indexed | parsing | pending | failed",
      "chunks": 128,
      "createdAt": "2026-07-01 09:30"
    }
  ]
}
```

### `GET /api/documents/{documentId}` 响应扩展

- 增加元数据：`issuer`、`docNumber`、`publishDate`、`effectiveStatus`。
- `fullContent` 的段落支持两种形态：文本段 `{ "heading", "body" }`；表格段 `{ "heading", "table": { "sheet", "columns": [...], "rows": [[...]] } }`。前端会把表格段渲染成真实表格，并按问答证据的 `cellRef` 高亮命中单元格。

### `GET /api/metrics` 响应调整

改为数组，含目标值与当前值：

```json
[
  { "label": "制度事实准确率", "target": "≥85%", "value": "87.4%" },
  { "label": "表格取数准确率", "target": "≥80%", "value": "83.1%" },
  { "label": "证据引用命中率", "target": "≥90%", "value": "91.3%" },
  { "label": "拒答 / 澄清率", "target": "≥80%", "value": "82.6%" },
  { "label": "关键数字错误率", "target": "≤5%", "value": "3.2%" }
]
```
