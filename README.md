# AI PPT - 智能演示文稿生成平台

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vue-3.4+-42B883?style=flat-square&logo=vuedotjs" alt="Vue">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=nodedotjs" alt="Node">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
</p>

<p align="center">
  <a href="https://github.com/your-repo/ai-ppt">English</a> •
  <a href="#功能特点">功能</a> •
  <a href="#技术栈">技术栈</a> •
  <a href="#快速开始">开始</a> •
  <a href="#项目结构">结构</a>
</p>

---

## ✨ 功能特点

### 🤖 AI 智能生成
- 输入主题，AI 自动生成专业演示文稿大纲
- **流式响应** - 实时展示生成进度，无需等待
- 大纲预览与编辑 - 生成前可调整页面结构、内容和布局
- 支持自定义 AI 模型（OpenAI / Claude / GLM 等 OpenAI 兼容接口）

### 🎨 主题与视觉
- 5 套精美主题：**深色、浅色、绿色、紫色、暖色**
- **智能配图** - AI 为每页生成相关图片关键词，自动搜索配图
- 支持 Pexels API（高质量）或 Wikimedia Commons（免费）图片源

### 📝 在线编辑器
- 左侧：幻灯片缩略图列表（拖拽排序、增删）
- 中间：实时预览画布
- 右侧：属性面板（文字、布局、图片）

### 📤 导出功能
- 一键导出 **PPTX** 文件
- 图片内嵌到 PPT 中，兼容 PowerPoint / WPS

### 📱 响应式设计
- 完美支持桌面端和移动端
- 移动端简化操作流程：AI 生成 → 预览 → 导出

---

## 🛠 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Vue 3 + TypeScript + Vite + TailwindCSS |
| 后端 | Node.js + Express + TypeScript |
| AI | OpenAI 兼容 API（支持 GLM、Claude 等） |
| 图片 | Pexels API / Wikimedia Commons |
| PPT 生成 | PptxGenJS |
| 状态管理 | Pinia |

---

## 🚀 快速开始

### 前置要求

- Node.js 20+
- pnpm 8+

### 安装

```bash
# 克隆项目
git clone https://github.com/your-repo/ai-ppt.git
cd ai-ppt

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 配置环境变量

在 `packages/server/.env` 中配置：

```env
# OpenAI 兼容接口（必填）
OPENAI_API_KEY=your_api_key
OPENAI_BASE_URL=https://api.openai.com/v1  # 或其他兼容 API
OPENAI_MODEL=gpt-4o

# 可选：Pexels 图片 API（获取高质量图片）
PEXELS_API_KEY=your_pexels_key

# 服务器端口
PORT=3001
```

### 启动

```bash
# 同时启动前端和后端
pnpm dev

# 分别启动
pnpm dev:web    # 前端 http://localhost:5173
pnpm dev:server # 后端 http://localhost:3001
```

---

## 📁 项目结构

```
ai-ppt/
├── packages/
│   ├── server/                 # Express 后端
│   │   ├── src/
│   │   │   ├── routes/        # API 路由
│   │   │   │   ├── ai.ts      # AI 生成
│   │   │   │   ├── image.ts   # 图片搜索
│   │   │   │   └── ppt.ts     # PPT 导出
│   │   │   └── services/      # 业务逻辑
│   │   │       ├── ai.service.ts
│   │   │       ├── image.service.ts
│   │   │       └── ppt.service.ts
│   │   └── .env
│   │
│   └── web/                    # Vue 前端
│       ├── src/
│       │   ├── api/            # API 调用
│       │   ├── components/    # 组件
│       │   ├── stores/        # Pinia 状态
│       │   ├── types/         # TypeScript 类型
│       │   └── views/          # 页面视图
│       └── package.json
│
├── package.json                # Monorepo 根配置
├── pnpm-workspace.yaml
└── README.md
```

---

## 📊 Git 提交历史

```
     ●── feat: 实现PPT生成流式响应与图片搜索功能 (6253256)
     │
     ●─ feat: 支持自定义AI配置、主题选择和图片幻灯片布局 (0ee3b33)
     │
     ●── feat: 初始化 AI PPT 生成器项目 (7572846)
```

**贡献者 (GitHub Stats)**

![Contributors](https://contrib.rocks/image?repo=your-repo/ai-ppt&max=8)
![GitHub stars](https://img.shields.io/github/stars/your-repo/ai-ppt?style=flat)
![GitHub forks](https://img.shields.io/github/forks/your-repo/ai-ppt?style=flat)

---

## 🔧 扩展开发

### 添加新的主题

在 `packages/server/src/services/ppt.service.ts` 的 `THEMES` 对象中添加：

```typescript
const THEMES = {
  // ... existing themes
  custom: { bg: 'FF5722', primary: 'FFC107', text: 'FFFFFF', muted: 'CCCCCC' },
}
```

### 添加新的布局类型

1. 在 `Slide` 类型中添加布局名称
2. 在 `SlideCanvas.vue` 添加对应的模板
3. 在 `ppt.service.ts` 的 switch 语句中添加渲染逻辑

---

## 📄 许可证

MIT License - 欢迎贡献和改进！

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

