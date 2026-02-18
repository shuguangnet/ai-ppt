# AI PPT - 智能演示文稿生成平台

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vue](https://img.shields.io/badge/Vue-3.4+-42B883?style=flat&logo=vuedotjs)](https://vuejs.org/)
[![Node](https://img.shields.io/badge/Node.js-20+-339933?style=flat&logo=nodedotjs)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)

> 输入主题，AI 一键生成专业 PPT。支持在线编辑、主题配图、导出 PPTX

[English](./README.md) · [功能](#-功能特点) · [快速开始](#-快速开始) · [部署](#-部署)

---

## ✨ 特性

| 特性 | 说明 |
|:---|:---|
| 🤖 AI 生成 | 输入主题，AI 流式生成大纲，支持 GLM / Claude / GPT 等 |
| 📝 大纲编辑 | 生成前可预览、编辑、调整页面结构和内容 |
| 🎨 智能配图 | AI 生成图片关键词，自动搜索相关图片 |
| 🎯 5 套主题 | 深色、浅色、绿色、紫色、暖色 |
| 📤 PPTX 导出 | 图片内嵌，兼容 PowerPoint / WPS |
| 📱 响应式 | 桌面端完整编辑器，移动端简化流程 |

---

## 🖥️ 预览

```
┌─────────────────────────────────────────────────────────┐
│  AI PPT                    [选择主题 ▼]  [配置 AI]     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              输入 PPT 主题                              │
│    ┌─────────────────────────────────────────────┐      │
│    │  2026年AI发展趋势                        │      │
│    └─────────────────────────────────────────────┘      │
│                    [生成大纲]                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
         ↓ 流式生成中...                                  │
┌─────────────────────────────────────────────────────────┐
│  大纲预览                                              │
│  ┌─ 1. 封面 ─────────────────────────────────────┐    │
│  │    2026年AI发展趋势                          │    │
│  ├─ 2. 内容 ─────────────────────────────────────┐    │
│  │    • 技术突破  • 应用场景  • 未来展望         │    │
│  ├─ 3. 图片 ─────────────────────────────────────┐    │
│  │    [AI配图]                                   │    │
│  └────────────────────────────────────────────────┘    │
│                    [确认生成 PPT]                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 快速开始

### 环境要求

- Node.js 20+
- pnpm 8+

### 安装

```bash
git clone https://github.com/your-repo/ai-ppt.git
cd ai-ppt
pnpm install
```

### 配置

创建 `packages/server/.env`:

```env
# OpenAI 兼容 API（必填）
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o

# 可选：高质量图片
PEXELS_API_KEY=xxx

# 端口
PORT=3001
```

### 启动

```bash
pnpm dev
```

访问 http://localhost:5173

---

## 📡 API

| 端点 | 方法 | 说明 |
|:---|:---:|:---|
| `/api/ai/generate` | POST | AI 生成 PPT 大纲（SSE 流式） |
| `/api/image/search` | GET | 图片搜索 `?q=关键词` |
| `/api/ppt/export` | POST | 导出 PPTX 文件 |

### AI 生成请求

```bash
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "AI发展趋势",
    "aiConfig": {
      "apiKey": "sk-xxx",
      "baseUrl": "https://api.openai.com/v1",
      "model": "gpt-4o"
    }
  }'
```

---

## 📁 结构

```
ai-ppt/
├── packages/
│   ├── server/              # Express 后端
│   │   └── src/
│   │       ├── routes/     # ai / image / ppt
│   │       └── services/   # 业务逻辑
│   │
│   └── web/                # Vue 前端
│       └── src/
│           ├── views/      # Home / Editor
│           ├── components/ # SlideCanvas / ThemePicker
│           └── stores/    # slides / aiConfig
│
└── pnpm-workspace.yaml
```

---

## 📊 贡献者

```
●── feat: PPT流式响应与图片搜索 (6253256)
│
●─ feat: 自定义AI配置与主题选择 (0ee3b33)
│
●── feat: 初始化项目 (7572846)
```

![Contributors](https://contrib.rocks/image?repo=your-repo/ai-ppt&max=8)

---

## 📄 许可证

MIT © AI PPT Team

---

## 🔗 相关

- [PptxGenJS](https://gitbrent.github.io/pptxgenjs/) - PPT 生成
- [Wikimedia Commons](https://commons.wikimedia.org/) - 免费图片源
- [Pexels](https://www.pexels.com/api/) - 高质量图片 API
