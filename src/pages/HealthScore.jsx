import {
  ArcElement,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip
} from 'chart.js'
import { ArrowLeft, ArrowRight, CheckCircle2, HeartPulse, Loader2, Sparkles } from 'lucide-react'
import { useRef, useState } from 'react'
import { Doughnut, Radar } from 'react-chartjs-2'
import './HealthScore.css'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement)

const questions = [
  {
    category: 'Emergency Fund',
    icon: '🛡️',
    questions: [
      { id: 'monthly_expenses', label: 'What are your monthly expenses (₹)?', type: 'number', placeholder: '50000' },
      { id: 'emergency_fund', label: 'How much do you have in emergency savings (₹)?', type: 'number', placeholder: '300000' },
      { id: 'emergency_access', label: 'Can you access your emergency fund within 24 hours?', type: 'select', options: ['Yes', 'Partially', 'No'] },
    ]
  },
  {
    category: 'Insurance Coverage',
    icon: '🏥',
    questions: [
      { id: 'health_insurance', label: 'Do you have health insurance?', type: 'select', options: ['Yes — Adequate', 'Yes — Basic', 'No'] },
      { id: 'health_cover_amount', label: 'Health insurance cover amount (₹)?', type: 'number', placeholder: '500000' },
      { id: 'life_insurance', label: 'Do you have term life insurance?', type: 'select', options: ['Yes — 10x+ income', 'Yes — Less than 10x', 'No'] },
    ]
  },
  {
    category: 'Investment Diversification',
    icon: '📊',
    questions: [
      { id: 'investment_types', label: 'How many asset classes do you invest in?', type: 'select', options: ['4+ (Equity, Debt, Gold, Real Estate)', '2-3 asset classes', '1 or none'] },
      { id: 'sip_active', label: 'Do you have active SIPs?', type: 'select', options: ['Yes — Multiple', 'Yes — One', 'No'] },
      { id: 'investment_percentage', label: 'What % of income do you invest monthly?', type: 'select', options: ['30%+', '20-30%', '10-20%', 'Less than 10%'] },
    ]
  },
  {
    category: 'Debt Health',
    icon: '💳',
    questions: [
      { id: 'debt_to_income', label: 'What is your EMI to income ratio?', type: 'select', options: ['Less than 20%', '20-40%', '40-60%', 'More than 60%'] },
      { id: 'credit_card_debt', label: 'Do you carry credit card balance month-to-month?', type: 'select', options: ['Never', 'Sometimes', 'Always'] },
      { id: 'loan_types', label: 'What types of loans do you have?', type: 'select', options: ['Only productive (Home/Education)', 'Mix of productive & consumer', 'Mostly consumer loans', 'No loans'] },
    ]
  },
  {
    category: 'Tax Efficiency',
    icon: '🧾',
    questions: [
      { id: 'tax_planning', label: 'Do you plan your taxes proactively?', type: 'select', options: ['Yes — Maximize all deductions', 'Somewhat', 'No — Last-minute only'] },
      { id: 'tax_saving_instruments', label: 'How many tax-saving instruments do you use?', type: 'select', options: ['5+ (80C, 80D, NPS, HRA, etc.)', '2-4', '0-1'] },
      { id: 'regime_comparison', label: 'Have you compared old vs new tax regime?', type: 'select', options: ['Yes — picked optimal', 'No', 'Not sure'] },
    ]
  },
  {
    category: 'Retirement Readiness',
    icon: '🏖️',
    questions: [
      { id: 'retirement_corpus', label: 'Estimated retirement corpus needed (₹)?', type: 'number', placeholder: '30000000' },
      { id: 'retirement_savings', label: 'Current retirement-specific savings (₹)?', type: 'number', placeholder: '500000' },
      { id: 'retirement_plan', label: 'Do you have a formal retirement plan?', type: 'select', options: ['Yes — detailed plan', 'Rough idea', 'No plan'] },
    ]
  },
]

function calculateScores(answers) {
  const scores = {}

  // Emergency Fund Score
  const monthsCovered = answers.emergency_fund && answers.monthly_expenses
    ? answers.emergency_fund / Math.max(answers.monthly_expenses, 1) : 0
  let efScore = Math.min(monthsCovered / 6 * 70, 70)
  if (answers.emergency_access === 'Yes') efScore += 30
  else if (answers.emergency_access === 'Partially') efScore += 15
  scores['Emergency Fund'] = Math.round(Math.min(efScore, 100))

  // Insurance Score
  let insScore = 0
  if (answers.health_insurance === 'Yes — Adequate') insScore += 40
  else if (answers.health_insurance === 'Yes — Basic') insScore += 20
  if (answers.health_cover_amount >= 1000000) insScore += 20
  else if (answers.health_cover_amount >= 500000) insScore += 10
  if (answers.life_insurance === 'Yes — 10x+ income') insScore += 40
  else if (answers.life_insurance === 'Yes — Less than 10x') insScore += 20
  scores['Insurance'] = Math.round(Math.min(insScore, 100))

  // Investment Score
  let invScore = 0
  if (answers.investment_types === '4+ (Equity, Debt, Gold, Real Estate)') invScore += 35
  else if (answers.investment_types === '2-3 asset classes') invScore += 20
  if (answers.sip_active === 'Yes — Multiple') invScore += 30
  else if (answers.sip_active === 'Yes — One') invScore += 15
  if (answers.investment_percentage === '30%+') invScore += 35
  else if (answers.investment_percentage === '20-30%') invScore += 25
  else if (answers.investment_percentage === '10-20%') invScore += 15
  else invScore += 5
  scores['Investments'] = Math.round(Math.min(invScore, 100))

  // Debt Score
  let debtScore = 100
  if (answers.debt_to_income === '20-40%') debtScore -= 20
  else if (answers.debt_to_income === '40-60%') debtScore -= 40
  else if (answers.debt_to_income === 'More than 60%') debtScore -= 60
  if (answers.credit_card_debt === 'Sometimes') debtScore -= 15
  else if (answers.credit_card_debt === 'Always') debtScore -= 30
  if (answers.loan_types === 'Mix of productive & consumer') debtScore -= 10
  else if (answers.loan_types === 'Mostly consumer loans') debtScore -= 25
  scores['Debt Health'] = Math.round(Math.max(debtScore, 0))

  // Tax Score
  let taxScore = 0
  if (answers.tax_planning === 'Yes — Maximize all deductions') taxScore += 40
  else if (answers.tax_planning === 'Somewhat') taxScore += 20
  if (answers.tax_saving_instruments === '5+ (80C, 80D, NPS, HRA, etc.)') taxScore += 35
  else if (answers.tax_saving_instruments === '2-4') taxScore += 20
  if (answers.regime_comparison === 'Yes — picked optimal') taxScore += 25
  scores['Tax Efficiency'] = Math.round(Math.min(taxScore, 100))

  // Retirement Score
  let retScore = 0
  const retProgress = answers.retirement_corpus && answers.retirement_savings
    ? (answers.retirement_savings / Math.max(answers.retirement_corpus, 1)) * 100 : 0
  retScore += Math.min(retProgress * 0.7, 50)
  if (answers.retirement_plan === 'Yes — detailed plan') retScore += 50
  else if (answers.retirement_plan === 'Rough idea') retScore += 25
  scores['Retirement'] = Math.round(Math.min(retScore, 100))

  return scores
}

function getOverallGrade(avg) {
  if (avg >= 80) return { grade: 'A', label: 'Excellent', color: 'var(--accent-emerald)' }
  if (avg >= 60) return { grade: 'B', label: 'Good', color: 'var(--accent-blue)' }
  if (avg >= 40) return { grade: 'C', label: 'Needs Work', color: 'var(--accent-amber)' }
  return { grade: 'D', label: 'At Risk', color: 'var(--accent-rose)' }
}

function getRecommendations(scores) {
  const recs = []
  if (scores['Emergency Fund'] < 60)
    recs.push({ icon: '🛡️', title: 'Build Emergency Fund', desc: 'Aim for 6 months of expenses in a liquid fund or savings account.' })
  if (scores['Insurance'] < 60)
    recs.push({ icon: '🏥', title: 'Improve Insurance Coverage', desc: 'Get adequate health cover (₹10L+) and term life insurance (10x annual income).' })
  if (scores['Investments'] < 60)
    recs.push({ icon: '📊', title: 'Diversify Investments', desc: 'Start SIPs across equity, debt, and gold. Aim to invest 20%+ of income.' })
  if (scores['Debt Health'] < 60)
    recs.push({ icon: '💳', title: 'Reduce Debt Burden', desc: 'Pay off high-interest debt first. Keep EMI-to-income ratio under 40%.' })
  if (scores['Tax Efficiency'] < 60)
    recs.push({ icon: '🧾', title: 'Optimize Tax Planning', desc: 'Use all available deductions: 80C, 80D, NPS, HRA. Compare tax regimes.' })
  if (scores['Retirement'] < 60)
    recs.push({ icon: '🏖️', title: 'Plan for Retirement', desc: 'Create a formal retirement plan. Start NPS and increase SIP amounts yearly.' })
  if (recs.length === 0)
    recs.push({ icon: '🎉', title: 'Great Job!', desc: 'Your finances are in excellent shape. Keep monitoring and rebalancing regularly.' })
  return recs
}

export default function HealthScore() {
  const [step, setStep] = useState(0) // 0 = intro, 1-6 = questions, 7 = loading, 8 = results
  const [answers, setAnswers] = useState({})
  const [scores, setScores] = useState(null)
  const [aiInsights, setAiInsights] = useState('')
  const [loading, setLoading] = useState(false)
  const formRef = useRef(null)

  const totalSteps = questions.length
  const currentCategory = step > 0 && step <= totalSteps ? questions[step - 1] : null

  const handleAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Calculate scores
      setStep(totalSteps + 1) // loading
      setLoading(true)
      const computed = calculateScores(answers)
      setScores(computed)

      // Try to get AI insights
      fetch('/api/health-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, scores: computed }),
      })
        .then(res => res.json())
        .then(data => {
          setAiInsights(data.insights || '')
          setStep(totalSteps + 2)
          setLoading(false)
        })
        .catch(() => {
          setStep(totalSteps + 2)
          setLoading(false)
        })
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  // Intro screen
  if (step === 0) {
    return (
      <div className="hs-page animate-fade-in-up">
        <div className="hs-intro glass-card">
          <div className="hs-intro-icon">
            <HeartPulse size={48} />
          </div>
          <h1>Money Health Score</h1>
          <p className="hs-intro-desc">
            Get a comprehensive financial wellness assessment across 6 key dimensions.
            Answer a few questions and receive your personalized score with AI-powered recommendations.
          </p>
          <div className="hs-dimensions">
            {questions.map((q, i) => (
              <div key={i} className="hs-dim-chip">
                <span>{q.icon}</span>
                <span>{q.category}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => setStep(1)}>
            Start Assessment <ArrowRight size={18} />
          </button>
          <p className="hs-time-note">⏱️ Takes about 5 minutes</p>
        </div>
      </div>
    )
  }

  // Loading screen
  if (step === totalSteps + 1 && loading) {
    return (
      <div className="hs-page">
        <div className="hs-loading animate-fade-in">
          <Loader2 size={48} className="spin-icon" />
          <h2>Analyzing Your Finances...</h2>
          <p className="text-muted">Our AI agents are evaluating your financial health across all 6 dimensions</p>
          <div className="hs-loading-steps">
            <div className="loading-step active">
              <Sparkles size={16} />
              <span>Processing answers</span>
            </div>
            <div className="loading-step">
              <Sparkles size={16} />
              <span>Computing dimension scores</span>
            </div>
            <div className="loading-step">
              <Sparkles size={16} />
              <span>Generating AI recommendations</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Results screen
  if (step === totalSteps + 2 && scores) {
    const scoreValues = Object.values(scores)
    const avg = Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
    const grade = getOverallGrade(avg)
    const recommendations = getRecommendations(scores)

    const radarData = {
      labels: Object.keys(scores),
      datasets: [{
        label: 'Your Score',
        data: scoreValues,
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        borderColor: 'rgba(59, 130, 246, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointRadius: 5,
      }]
    }

    const radarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { stepSize: 20, color: '#64748b', backdropColor: 'transparent', font: { size: 10 } },
          grid: { color: 'rgba(255,255,255,0.06)' },
          angleLines: { color: 'rgba(255,255,255,0.06)' },
          pointLabels: { color: '#94a3b8', font: { size: 12, weight: '600' } },
        }
      },
      plugins: { legend: { display: false } }
    }

    const doughnutData = {
      labels: ['Score', 'Remaining'],
      datasets: [{
        data: [avg, 100 - avg],
        backgroundColor: [grade.color, 'rgba(255,255,255,0.04)'],
        borderWidth: 0,
        cutout: '80%',
      }]
    }

    const doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } }
    }

    return (
      <div className="hs-page animate-fade-in-up">
        <div className="hs-results-header">
          <h1>Your Money Health Score</h1>
          <p className="text-muted">Comprehensive analysis across 6 financial dimensions</p>
        </div>

        <div className="hs-results-top">
          <div className="hs-overall glass-card animate-scale-in">
            <div className="hs-doughnut-wrap">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div className="hs-score-overlay">
                <span className="hs-score-number" style={{ color: grade.color }}>{avg}</span>
                <span className="hs-score-label">/ 100</span>
              </div>
            </div>
            <div className="hs-grade" style={{ color: grade.color }}>
              Grade {grade.grade} — {grade.label}
            </div>
          </div>

          <div className="hs-radar glass-card animate-scale-in stagger-2">
            <h3>Dimension Breakdown</h3>
            <div className="hs-radar-chart">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>
        </div>

        <div className="hs-dimensions-detail animate-fade-in-up stagger-3">
          <h3>Detailed Scores</h3>
          <div className="hs-dim-grid">
            {Object.entries(scores).map(([name, score], i) => {
              const cat = questions[i]
              return (
                <div key={name} className="hs-dim-card glass-card">
                  <div className="hs-dim-header">
                    <span className="hs-dim-emoji">{cat.icon}</span>
                    <span className="hs-dim-name">{name}</span>
                    <span className={`badge ${score >= 60 ? 'badge-success' : score >= 40 ? 'badge-warning' : 'badge-danger'}`}>
                      {score}/100
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{
                      width: `${score}%`,
                      background: score >= 60 ? 'var(--accent-emerald)' : score >= 40 ? 'var(--accent-amber)' : 'var(--accent-rose)'
                    }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="hs-recommendations animate-fade-in-up stagger-4">
          <h3><Sparkles size={20} /> AI Recommendations</h3>
          {aiInsights && (
            <div className="hs-ai-insights glass-card">
              <p>{aiInsights}</p>
            </div>
          )}
          <div className="hs-rec-grid">
            {recommendations.map((rec, i) => (
              <div key={i} className="hs-rec-card glass-card">
                <span className="hs-rec-icon">{rec.icon}</span>
                <div>
                  <h4>{rec.title}</h4>
                  <p>{rec.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-secondary mt-3" onClick={() => { setStep(0); setScores(null); setAnswers({}) }}>
          Retake Assessment
        </button>
      </div>
    )
  }

  // Question form
  return (
    <div className="hs-page animate-fade-in">
      <div className="hs-progress-section">
        <div className="hs-progress-info">
          <span>Step {step} of {totalSteps}</span>
          <span>{currentCategory?.category}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
        </div>
      </div>

      <div className="hs-form-card glass-card animate-slide-in" key={step} ref={formRef}>
        <div className="hs-cat-header">
          <span className="hs-cat-emoji">{currentCategory?.icon}</span>
          <h2>{currentCategory?.category}</h2>
        </div>

        <div className="hs-questions">
          {currentCategory?.questions.map((q) => (
            <div key={q.id} className="input-group">
              <label htmlFor={q.id}>{q.label}</label>
              {q.type === 'number' ? (
                <input
                  id={q.id}
                  type="number"
                  className="input-field"
                  placeholder={q.placeholder}
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswer(q.id, Number(e.target.value))}
                />
              ) : (
                <select
                  id={q.id}
                  className="input-field"
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                >
                  <option value="">Select...</option>
                  {q.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>

        <div className="hs-form-actions">
          <button className="btn btn-secondary" onClick={handleBack} disabled={step <= 1}>
            <ArrowLeft size={16} /> Back
          </button>
          <button className="btn btn-primary" onClick={handleNext}>
            {step === totalSteps ? (
              <>Calculate Score <CheckCircle2 size={16} /></>
            ) : (
              <>Next <ArrowRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
