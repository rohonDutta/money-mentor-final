import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import nodemailer from 'nodemailer'
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

// Configure Nodemailer with more explicit settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true, // Show debug output
  logger: true // Log information in console
})

// Verify Transporter on Start
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Nodemailer Setup Error!')
    console.error('Error Code:', error.code)
    console.error('Full Error:', error.message)
    console.log('💡 TIP: Double check your EMAIL_USER and EMAIL_PASS (16-character App Password).')
  } else {
    console.log('✅ Nodemailer is READY and CONNECTED to your Gmail!')
    console.log('📬 Ready to deliver emails to:', process.env.CONTACT_EMAIL)
  }
})

// Contact Form Submission
app.post('/api/contact', async (req, res) => {
  console.log('📩 Incoming contact request from:', req.body.email)
  try {
    const { name, email, subject, message } = req.body

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Missing EMAIL_USER or EMAIL_PASS in .env')
    }

    // Send Real Email
    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact: ${subject}`,
      text: `From: ${name} (${email})\nSubject: ${subject}\n\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
          <h2 style="color: #2563eb;">New Message from AI Money Mentor</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('📧 Message sent successfully! MessageID:', info.messageId)
    res.json({ success: true, message: 'Message delivered to your email' })

  } catch (err) {
    console.error('❌ Nodemailer Error During Send:', err.message)
    res.status(500).json({ error: 'Failed to deliver email. Check server console for errors.' })
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
