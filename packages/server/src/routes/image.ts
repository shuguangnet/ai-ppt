import { Router } from 'express'
import { searchImage } from '../services/image.service.js'

const router = Router()

router.get('/search', async (req, res) => {
  try {
    const q = req.query.q as string
    const apiKey = req.query.apiKey as string
    const provider = req.query.provider as 'pexels' | 'unsplash' | undefined
    if (!q) return res.status(400).json({ error: 'missing q' })
    const config = apiKey ? { apiKey, provider } : undefined
    const url = await searchImage(q, config)
    res.json({ url })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

export default router
