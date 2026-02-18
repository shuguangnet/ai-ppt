import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import aiRouter from './routes/ai.js'
import pptRouter from './routes/ppt.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.use('/api/ai', aiRouter)
app.use('/api/ppt', pptRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
