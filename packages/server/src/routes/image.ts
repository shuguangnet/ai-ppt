import { Router } from 'express'
import { searchImage } from '../services/image.service.js'

const router = Router()

router.get('/search', async (req, res) => {
  try {
    const q = req.query.q as string
    if (!q) return res.status(400).json({ error: 'missing q' })
    const url = await searchImage(q)
    res.json({ url })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

export default router
