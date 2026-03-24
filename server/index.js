import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { getAuditLog, orchestrate } from './agents/orchestrator.js'
import { initGemini } from './utils/gemini.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json({ limit: '1mb' }))

// Initialize Gemini
initGemini(process.env.GEMINI_API_KEY)

// ── API Routes ──

// Health Score Analysis
app.post('/api/health-score', async (req, res) => {
  try {
    const { answers, scores } = req.body
    if (!answers || !scores) {
      return res.status(400).json({ error: 'Missing answers or scores' })
    }
    const result = await orchestrate('health-score', { answers, scores })
    res.json(result)
  } catch (err) {
    console.error('Health Score error:', err)
    res.status(500).json({ error: 'Analysis failed', insights: '' })
  }
})

// Tax Wizard Analysis
app.post('/api/tax-wizard', async (req, res) => {
  try {
    const { salary, deductions, results } = req.body
    if (!results) {
      return res.status(400).json({ error: 'Missing tax results' })
    }
    const result = await orchestrate('tax-wizard', { salary, deductions, results })
    res.json(result)
  } catch (err) {
    console.error('Tax Wizard error:', err)
    res.status(500).json({ error: 'Analysis failed', insights: '' })
  }
})

// FIRE Planner
app.post('/api/fire-planner', async (req, res) => {
  try {
    const { plan, ...data } = req.body
    if (!plan) {
      return res.status(400).json({ error: 'Missing FIRE plan data' })
    }
    const result = await orchestrate('fire-planner', { ...data, plan })
    res.json(result)
  } catch (err) {
    console.error('FIRE Planner error:', err)
    res.status(500).json({ error: 'Planning failed', insights: '' })
  }
})

// Audit Log
app.get('/api/audit-log', (req, res) => {
  res.json({ log: getAuditLog() })
})

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Export for Vercel
export default app;

// Start server (only if not running as a serverless function)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════╗
    ║    🤖 AI Money Mentor — Backend Server   ║
    ║    Running on http://localhost:${PORT}      ║
    ║    Gemini AI: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '⚠️  Not configured'}       ║
    ╚══════════════════════════════════════════╝
    `)
  })
}
