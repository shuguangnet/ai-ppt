import OpenAI from 'openai'
import 'dotenv/config'

interface AIConfig {
  apiKey?: string
  baseUrl?: string
  model?: string
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
