import OpenAI from 'openai'
import 'dotenv/config'

interface AIConfig {
  apiKey?: string
  baseUrl?: string
  model?: string
}

interface Slide {
  layout: string
  title: string
  subtitle?: string
  bullets?: string[]
  imageKeyword?: string
  imageUrl?: string
  titleStyle?: any
  subtitleStyle?: any
  bulletStyle?: any
}

interface PptData {
  title: string
  theme?: string
  slides: Slide[]
}

const SYSTEM_PROMPT = `你是一个PPT内容生成专家。用户会给你一个主题，你需要生成一个完整的PPT结构。
请严格按照以下JSON格式返回，不要包含任何其他文字：
{
  "title": "PPT标题",
  "slides": [
    {
      "layout": "title",
      "title": "封面标题",
      "subtitle": "副标题",
      "imageKeyword": "english keyword for background image"
    },
    {
      "layout": "content",
      "title": "页面标题",
      "bullets": ["要点1", "要点2", "要点3"],
      "imageKeyword": "english keyword"
    },
    {
      "layout": "image",
      "title": "页面标题",
      "bullets": ["说明文字"],
      "imageKeyword": "english keyword for main image"
    },
    {
      "layout": "section",
      "title": "章节标题",
      "imageKeyword": "english keyword"
    },
    {
      "layout": "thanks",
      "title": "谢谢观看",
      "subtitle": "联系方式"
    }
  ]
}
要求：
- 生成8-12页幻灯片
- 第一页必须是title布局（封面）
- 最后一页必须是thanks布局
- 中间页面使用content、image或section布局
- 每个content页面3-5个要点
- image布局用于需要配图的页面
- 每个slide（除thanks外）都必须包含imageKeyword字段，值为与该页内容相关的英文搜索关键词（1-3个单词），用于搜索配图
- 内容专业、有深度`

function createClient(config?: AIConfig) {
  return new OpenAI({
    apiKey: config?.apiKey || process.env.OPENAI_API_KEY,
    baseURL: config?.baseUrl || process.env.OPENAI_BASE_URL,
  })
}

// 完全重写润色 - 根据用户要求重新生成PPT
const REFINE_SYSTEM_PROMPT = `你是一个PPT内容优化专家。用户会给一个现有的PPT结构和修改要求，你需要根据要求重新生成更完善的内容。

请严格按照以下JSON格式返回，不要包含任何其他文字：
{
  "title": "PPT标题",
  "slides": [
    {
      "layout": "title",
      "title": "封面标题",
      "subtitle": "副标题",
      "imageKeyword": "english keyword"
    },
    {
      "layout": "content",
      "title": "页面标题",
      "bullets": ["要点1", "要点2", "要点3"],
      "imageKeyword": "english keyword"
    },
    {
      "layout": "image",
      "title": "页面标题",
      "bullets": ["说明文字"],
      "imageKeyword": "english keyword"
    },
    {
      "layout": "section",
      "title": "章节标题",
      "imageKeyword": "english keyword"
    },
    {
      "layout": "thanks",
      "title": "谢谢观看",
      "subtitle": "联系方式"
    }
  ]
}

要求：
- 保持PPT的完整结构（封面-内容-结尾）
- 根据用户要求调整内容
- 每个content页面3-5个要点
- 每个slide（除thanks外）都必须包含imageKeyword字段
- 内容专业、有深度`

// 文字润色 - 保持结构，优化文字
const POLISH_SYSTEM_PROMPT = `你是一个文字润色专家。请对用户提供的PPT内容进行专业润色，保持原有结构和布局，只优化文字内容。

请严格按照以下JSON格式返回，不要包含任何其他文字：
{
  "title": "PPT标题（可优化）",
  "slides": [
    {
      "layout": "title",
      "title": "封面标题（优化后）",
      "subtitle": "副标题（优化后）",
      "imageKeyword": "english keyword"
    },
    {
      "layout": "content",
      "title": "页面标题（优化后）",
      "bullets": ["优化后的要点1", "优化后的要点2", "优化后的要点3"],
      "imageKeyword": "english keyword"
    },
    {
      "layout": "image",
      "title": "页面标题（优化后）",
      "bullets": ["优化后的说明文字"],
      "imageKeyword": "english keyword"
    },
    {
      "layout": "section",
      "title": "章节标题（优化后）",
      "imageKeyword": "english keyword"
    },
    {
      "layout": "thanks",
      "title": "谢谢观看（优化后）",
      "subtitle": "联系方式（优化后）"
    }
  ]
}

要求：
- 保持原有的layout和slides数量不变
- 只优化title、subtitle、bullets的文字内容
- 保留原有的imageKeyword
- 提升文字的专业性和表达力`

export async function* streamSlides(topic: string, config?: AIConfig) {
  const client = createClient(config)
  const model = config?.model || process.env.OPENAI_MODEL || 'gpt-4o'

  const stream = await client.chat.completions.create({
    model,
    stream: true,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `请为以下主题生成PPT内容：${topic}` },
    ],
    temperature: 0.7,
  })

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content
    if (delta) yield delta
  }
}

// 流式润色PPT（完全重写）
export async function* streamRefineSlides(pptData: PptData, instruction: string, config?: AIConfig) {
  const client = createClient(config)
  const model = config?.model || process.env.OPENAI_MODEL || 'gpt-4o'

  const currentPptJson = JSON.stringify(pptData, null, 2)

  const stream = await client.chat.completions.create({
    model,
    stream: true,
    messages: [
      { role: 'system', content: REFINE_SYSTEM_PROMPT },
      { role: 'user', content: `现有PPT内容：\n${currentPptJson}\n\n用户的修改要求：${instruction}` },
    ],
    temperature: 0.7,
  })

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content
    if (delta) yield delta
  }
}

// 流式润色PPT（仅文字）
export async function* streamPolishSlides(pptData: PptData, instruction: string, config?: AIConfig) {
  const client = createClient(config)
  const model = config?.model || process.env.OPENAI_MODEL || 'gpt-4o'

  const currentPptJson = JSON.stringify(pptData, null, 2)

  const stream = await client.chat.completions.create({
    model,
    stream: true,
    messages: [
      { role: 'system', content: POLISH_SYSTEM_PROMPT },
      { role: 'user', content: `现有PPT内容：\n${currentPptJson}\n\n润色要求：${instruction}` },
    ],
    temperature: 0.7,
  })

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content
    if (delta) yield delta
  }
}
