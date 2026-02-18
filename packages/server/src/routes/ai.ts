import { Router } from 'express'
import { generateSlides } from '../services/ai.service.js'

const router = Router()

router.post('/generate', async (req, res) => {
  try {
    const { topic, aiConfig } = req.body
    if (!topic) return res.status(400).json({ error: '请输入主题' })
    const data = await generateSlides(topic, aiConfig)
    res.json(data)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

export default router
