import { Router } from 'express'
import { generatePptx } from '../services/ppt.service.js'

const router = Router()

router.post('/export', async (req, res) => {
  try {
    const data = req.body
    if (!data?.slides?.length) return res.status(400).json({ error: '无幻灯片数据' })
    const buffer = await generatePptx(data)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation')
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(data.title || 'presentation')}.pptx"`)
    res.send(buffer)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

export default router
