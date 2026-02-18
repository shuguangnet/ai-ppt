import { Router } from 'express'
import { streamSlides } from '../services/ai.service.js'

const router = Router()

router.post('/generate', async (req, res) => {
  try {
    const { topic, aiConfig } = req.body
    if (!topic) return res.status(400).json({ error: '请输入主题' })

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    let full = ''
    for await (const chunk of streamSlides(topic, aiConfig)) {
      full += chunk
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`)
    }

    // 解析完整 JSON
    const jsonMatch = full.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      res.write(`data: ${JSON.stringify({ error: 'AI 返回格式错误' })}\n\n`)
    } else {
      const data = JSON.parse(jsonMatch[0])
      res.write(`data: ${JSON.stringify({ done: true, data })}\n\n`)
    }
    res.end()
  } catch (e: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: e.message })
    } else {
      res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`)
      res.end()
    }
  }
})

export default router
