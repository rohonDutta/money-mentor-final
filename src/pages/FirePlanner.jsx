import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from 'chart.js'
import { ArrowRight, Calendar, Flame, Loader2, Sparkles, Target, TrendingUp, Wallet } from 'lucide-react'
import { useState } from 'react'
import { Doughnut, Line } from 'react-chartjs-2'
import { useCredits } from '../context/CreditContext'
import { useReview } from '../context/ReviewContext'
import './FirePlanner.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement)

function calculateFirePlan(data) {
  const { age, retireAge, monthlyIncome, monthlyExpenses, currentSavings, riskProfile } = data
  const yearsToRetire = Math.max(retireAge - age, 1)
  const annualExpenses = monthlyExpenses * 12
  const inflationRate = 0.06
  const futureAnnualExpenses = annualExpenses * Math.pow(1 + inflationRate, yearsToRetire)
  const fireNumber = futureAnnualExpenses * 25
  const monthlySavings = monthlyIncome - monthlyExpenses

  const returnRates = { Conservative: 0.08, Moderate: 0.10, Aggressive: 0.12 }
  const returnRate = returnRates[riskProfile] || 0.10
  const monthlyReturn = returnRate / 12

  // Future value of current savings
  const fvCurrentSavings = currentSavings * Math.pow(1 + returnRate, yearsToRetire)

  // Required monthly SIP to reach FIRE number
  const targetAfterCurrentSavings = Math.max(fireNumber - fvCurrentSavings, 0)
  const months = yearsToRetire * 12
  let requiredSIP = 0
  if (monthlyReturn > 0 && months > 0) {
    requiredSIP = (targetAfterCurrentSavings * monthlyReturn) / (Math.pow(1 + monthlyReturn, months) - 1)
  }

  // Projection data (yearly)
  const projection = []
  let corpus = currentSavings
  for (let year = 0; year <= yearsToRetire; year++) {
    projection.push({ year: age + year, corpus: Math.round(corpus) })
    corpus = corpus * (1 + returnRate) + requiredSIP * 12
  }

  // Asset allocation
  const allocations = {
    Conservative: { equity: 30, debt: 50, gold: 10, cash: 10 },
    Moderate: { equity: 50, debt: 30, gold: 10, cash: 10 },
    Aggressive: { equity: 70, debt: 15, gold: 10, cash: 5 },
  }

  // SIP breakdown by goal
  const sipBreakdown = [
    { name: 'Equity Mutual Funds', amount: Math.round(requiredSIP * (allocations[riskProfile]?.equity || 50) / 100), type: 'equity' },
    { name: 'Debt Funds / PPF', amount: Math.round(requiredSIP * (allocations[riskProfile]?.debt || 30) / 100), type: 'debt' },
    { name: 'Gold ETF / SGBs', amount: Math.round(requiredSIP * (allocations[riskProfile]?.gold || 10) / 100), type: 'gold' },
    { name: 'Emergency / Liquid', amount: Math.round(requiredSIP * (allocations[riskProfile]?.cash || 10) / 100), type: 'cash' },
  ]

  // Milestones
  const milestones = []
  let ms = currentSavings
  for (let y = 1; y <= yearsToRetire; y++) {
    ms = ms * (1 + returnRate) + requiredSIP * 12
    if (ms >= fireNumber * 0.25 && !milestones.find(m => m.label === '25% FIRE')) {
      milestones.push({ year: y, age: age + y, label: '25% FIRE', amount: Math.round(ms) })
    }
    if (ms >= fireNumber * 0.5 && !milestones.find(m => m.label === '50% FIRE')) {
      milestones.push({ year: y, age: age + y, label: '50% FIRE', amount: Math.round(ms) })
    }
    if (ms >= fireNumber * 0.75 && !milestones.find(m => m.label === '75% FIRE')) {
      milestones.push({ year: y, age: age + y, label: '75% FIRE', amount: Math.round(ms) })
    }
  }
  milestones.push({ year: yearsToRetire, age: retireAge, label: '🔥 FIRE!', amount: Math.round(fireNumber) })

  return {
    fireNumber: Math.round(fireNumber),
    requiredSIP: Math.round(requiredSIP),
    monthlySavings: Math.round(monthlySavings),
    fvCurrentSavings: Math.round(fvCurrentSavings),
    yearsToRetire,
    returnRate,
    projection,
    allocation: allocations[riskProfile] || allocations.Moderate,
    sipBreakdown,
    milestones,
    gap: Math.round(requiredSIP - monthlySavings),
  }
}

export default function FirePlanner() {
  const [step, setStep] = useState('input')
  const [form, setForm] = useState({
    age: '', retireAge: '', monthlyIncome: '', monthlyExpenses: '',
    currentSavings: '', riskProfile: 'Moderate'
  })
  const [results, setResults] = useState(null)
  const [aiInsights, setAiInsights] = useState('')
  const [loading, setLoading] = useState(false)
  const { useCredit } = useCredits()
  const { triggerReview } = useReview()

  const updateForm = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleCalculate = () => {
    const data = {
      age: Number(form.age) || 25,
      retireAge: Number(form.retireAge) || 50,
      monthlyIncome: Number(form.monthlyIncome) || 0,
      monthlyExpenses: Number(form.monthlyExpenses) || 0,
      currentSavings: Number(form.currentSavings) || 0,
      riskProfile: form.riskProfile || 'Moderate',
    }
    if (data.monthlyIncome <= 0) return

    // Check credits before processing
    if (!useCredit()) return;

    setStep('loading')
    setLoading(true)
    const plan = calculateFirePlan(data)
    setResults(plan)

    const apiUrl = import.meta.env.VITE_API_BASE_URL || ''
    fetch(`${apiUrl}/api/fire-planner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, plan }),
    })
      .then(r => r.json())
      .then(d => {
        setAiInsights(d.insights || '')
        setStep('results')
        setLoading(false)
        triggerReview('FIRE Planner')
      })
      .catch(() => {
        setStep('results')
        setLoading(false)
        triggerReview('FIRE Planner')
      })
  }

  const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN')
  const fmtCr = (n) => {
    if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2) + ' Cr'
    if (n >= 100000) return '₹' + (n / 100000).toFixed(2) + ' L'
    return fmt(n)
  }

  if (step === 'loading') {
    return (
      <div className="fire-page">
        <div className="fire-loading animate-fade-in">
          <Loader2 size={48} className="spin-icon" />
          <h2>Building Your Financial Roadmap...</h2>
          <p className="text-muted">Calculating FIRE number, SIP plans, and asset allocation</p>
        </div>
      </div>
    )
  }

  if (step === 'results' && results) {
    const { fireNumber, requiredSIP, projection, allocation, sipBreakdown, milestones, yearsToRetire, gap } = results

    const lineData = {
      labels: projection.map(p => `Age ${p.year}`),
      datasets: [{
        label: 'Projected Corpus',
        data: projection.map(p => p.corpus),
        borderColor: 'rgba(244, 63, 94, 0.9)',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(244, 63, 94, 1)',
      }, {
        label: 'FIRE Target',
        data: projection.map(() => fireNumber),
        borderColor: 'rgba(16, 185, 129, 0.5)',
        borderDash: [8, 4],
        pointRadius: 0,
        fill: false,
      }]
    }

    const lineOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#94a3b8', font: { size: 12 } } },
        tooltip: { callbacks: { label: (ctx) => ctx.dataset.label + ': ' + fmtCr(ctx.raw) } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#64748b', maxTicksLimit: 10 } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', callback: (v) => fmtCr(v) } }
      }
    }

    const doughnutData = {
      labels: ['Equity', 'Debt', 'Gold', 'Cash'],
      datasets: [{
        data: [allocation.equity, allocation.debt, allocation.gold, allocation.cash],
        backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(139, 92, 246, 0.7)'],
        borderWidth: 0,
      }]
    }

    const doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 16, font: { size: 12 } } }
      }
    }

    return (
      <div className="fire-page animate-fade-in-up">
        <div className="page-header">
          <h1>🔥 Your FIRE Roadmap</h1>
          <p>Financial Independence, Retire Early — your complete plan</p>
        </div>

        {/* Key Metrics */}
        <div className="fire-metrics">
          <div className="fire-metric-card glass-card animate-scale-in">
            <Target size={24} className="fire-metric-icon fire-icon-rose" />
            <div className="fire-metric-value">{fmtCr(fireNumber)}</div>
            <div className="fire-metric-label">FIRE Number</div>
          </div>
          <div className="fire-metric-card glass-card animate-scale-in stagger-1">
            <Wallet size={24} className="fire-metric-icon fire-icon-blue" />
            <div className="fire-metric-value">{fmt(requiredSIP)}</div>
            <div className="fire-metric-label">Required Monthly SIP</div>
          </div>
          <div className="fire-metric-card glass-card animate-scale-in stagger-2">
            <Calendar size={24} className="fire-metric-icon fire-icon-emerald" />
            <div className="fire-metric-value">{yearsToRetire} years</div>
            <div className="fire-metric-label">Time to FIRE</div>
          </div>
          <div className="fire-metric-card glass-card animate-scale-in stagger-3">
            <TrendingUp size={24} className="fire-metric-icon fire-icon-amber" />
            <div className="fire-metric-value" style={{ color: gap > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
              {gap > 0 ? `${fmt(gap)} short` : 'On track!'}
            </div>
            <div className="fire-metric-label">Monthly Gap</div>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="fire-chart glass-card animate-fade-in-up stagger-3">
          <h3>Corpus Growth Projection</h3>
          <div className="fire-chart-wrap">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        {/* Allocation + SIP Breakdown */}
        <div className="fire-bottom-grid">
          <div className="fire-allocation glass-card animate-fade-in-up stagger-4">
            <h3>Recommended Asset Allocation</h3>
            <div className="fire-alloc-chart">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>

          <div className="fire-sip-breakdown glass-card animate-fade-in-up stagger-4">
            <h3>Monthly SIP Breakdown</h3>
            <div className="fire-sip-list">
              {sipBreakdown.map((s, i) => (
                <div key={i} className="fire-sip-item">
                  <div className={`fire-sip-dot fire-dot-${s.type}`}></div>
                  <div className="fire-sip-info">
                    <span className="fire-sip-name">{s.name}</span>
                    <span className="fire-sip-amount">{fmt(s.amount)}/mo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="fire-milestones animate-fade-in-up stagger-5">
          <h3>Key Milestones</h3>
          <div className="fire-timeline">
            {milestones.map((m, i) => (
              <div key={i} className="fire-milestone-item">
                <div className="fire-ms-dot"></div>
                <div className="fire-ms-content glass-card">
                  <div className="fire-ms-label">{m.label}</div>
                  <div className="fire-ms-detail">Age {m.age} • {fmtCr(m.amount)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        {aiInsights && (
          <div className="fire-ai animate-fade-in-up stagger-5">
            <h3><Sparkles size={20} /> AI Financial Advisor</h3>
            <div className="fire-ai-card glass-card">
              <p>{aiInsights}</p>
            </div>
          </div>
        )}

        <button className="btn btn-secondary mt-3" onClick={() => { setStep('input'); setResults(null) }}>
          Recalculate
        </button>
      </div>
    )
  }

  // Input form
  return (
    <div className="fire-page animate-fade-in-up">
      <div className="page-header">
        <h1><Flame size={28} className="fire-title-icon" /> FIRE Planner</h1>
        <p>Build a month-by-month roadmap to Financial Independence & Retire Early.</p>
      </div>

      <div className="fire-form glass-card">
        <div className="fire-form-grid">
          <div className="input-group">
            <label>Your Current Age</label>
            <input type="number" className="input-field" placeholder="25"
              value={form.age} onChange={e => updateForm('age', e.target.value)} />
          </div>
          <div className="input-group">
            <label>Target Retirement Age</label>
            <input type="number" className="input-field" placeholder="50"
              value={form.retireAge} onChange={e => updateForm('retireAge', e.target.value)} />
          </div>
          <div className="input-group">
            <label>Monthly Income (₹)</label>
            <input type="number" className="input-field" placeholder="100000"
              value={form.monthlyIncome} onChange={e => updateForm('monthlyIncome', e.target.value)} />
          </div>
          <div className="input-group">
            <label>Monthly Expenses (₹)</label>
            <input type="number" className="input-field" placeholder="50000"
              value={form.monthlyExpenses} onChange={e => updateForm('monthlyExpenses', e.target.value)} />
          </div>
          <div className="input-group">
            <label>Current Savings / Investments (₹)</label>
            <input type="number" className="input-field" placeholder="500000"
              value={form.currentSavings} onChange={e => updateForm('currentSavings', e.target.value)} />
          </div>
          <div className="input-group">
            <label>Risk Profile</label>
            <select className="input-field" value={form.riskProfile}
              onChange={e => updateForm('riskProfile', e.target.value)}>
              <option value="Conservative">Conservative (8% returns)</option>
              <option value="Moderate">Moderate (10% returns)</option>
              <option value="Aggressive">Aggressive (12% returns)</option>
            </select>
          </div>
        </div>

        <button className="btn btn-primary btn-lg fire-calc-btn" onClick={handleCalculate}
          disabled={!form.monthlyIncome}>
          Generate FIRE Roadmap <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
