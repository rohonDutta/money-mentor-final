import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js'
import { ArrowRight, Calculator, CheckCircle2, IndianRupee, Loader2, PiggyBank, Sparkles, TrendingDown } from 'lucide-react'
import { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import './TaxWizard.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const deductionsList = [
  { id: '80c', label: 'Section 80C (PPF, ELSS, LIC, etc.)', max: 150000 },
  { id: '80d_self', label: 'Section 80D — Health Insurance (Self)', max: 25000 },
  { id: '80d_parents', label: 'Section 80D — Health Insurance (Parents)', max: 50000 },
  { id: 'nps', label: 'Section 80CCD(1B) — NPS', max: 50000 },
  { id: 'hra', label: 'HRA Exemption', max: 0 },
  { id: 'home_loan', label: 'Section 24 — Home Loan Interest', max: 200000 },
  { id: 'education_loan', label: 'Section 80E — Education Loan Interest', max: 0 },
  { id: 'donation', label: 'Section 80G — Donations', max: 0 },
  { id: 'standard', label: 'Standard Deduction', max: 75000, locked: true },
]

function calculateOldRegimeTax(income, deductions) {
  const totalDeductions = Object.values(deductions).reduce((a, b) => a + (Number(b) || 0), 0) + 75000 // std deduction
  const taxableIncome = Math.max(income - totalDeductions, 0)

  let tax = 0
  if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.30
  if (taxableIncome > 500000) tax += Math.min(taxableIncome - 500000, 500000) * 0.20
  if (taxableIncome > 250000) tax += Math.min(taxableIncome - 250000, 250000) * 0.05

  // Rebate u/s 87A
  if (taxableIncome <= 500000) tax = 0

  const cess = tax * 0.04
  return { taxableIncome, tax, cess, total: tax + cess, deductions: totalDeductions }
}

function calculateNewRegimeTax(income) {
  const stdDeduction = 75000
  const taxableIncome = Math.max(income - stdDeduction, 0)

  let tax = 0
  const slabs = [
    { limit: 400000, rate: 0 },
    { limit: 400000, rate: 0.05 },
    { limit: 400000, rate: 0.10 },
    { limit: 400000, rate: 0.15 },
    { limit: 400000, rate: 0.20 },
    { limit: 400000, rate: 0.25 },
    { limit: Infinity, rate: 0.30 },
  ]

  let remaining = taxableIncome
  for (const slab of slabs) {
    if (remaining <= 0) break
    const taxable = Math.min(remaining, slab.limit)
    tax += taxable * slab.rate
    remaining -= taxable
  }

  // Rebate u/s 87A for new regime (income up to 12L)
  if (taxableIncome <= 1200000) tax = 0

  const cess = tax * 0.04
  return { taxableIncome, tax, cess, total: tax + cess, deductions: stdDeduction }
}

function findMissedDeductions(claimed) {
  const missed = []
  if (!claimed['80c'] || claimed['80c'] < 150000) missed.push({ section: '80C', tip: 'Invest in ELSS, PPF, or life insurance to claim up to ₹1.5L deduction.', potential: 150000 - (claimed['80c'] || 0) })
  if (!claimed['80d_self']) missed.push({ section: '80D (Self)', tip: 'Get health insurance — claim up to ₹25K for self & family.', potential: 25000 })
  if (!claimed['80d_parents']) missed.push({ section: '80D (Parents)', tip: 'Pay for parents\' health insurance — claim up to ₹50K (senior citizens).', potential: 50000 })
  if (!claimed['nps']) missed.push({ section: 'NPS 80CCD(1B)', tip: 'Invest in NPS for an additional ₹50K deduction over 80C limit.', potential: 50000 })
  if (!claimed['home_loan']) missed.push({ section: 'Section 24', tip: 'Home loan interest up to ₹2L is deductible under old regime.', potential: 200000 })
  return missed
}

export default function TaxWizard() {
  const [step, setStep] = useState('input') // input, loading, results
  const [salary, setSalary] = useState({ gross: '', basic: '', hra_received: '', rent_paid: '', metro: 'Yes' })
  const [deductions, setDeductions] = useState({})
  const [results, setResults] = useState(null)
  const [aiInsights, setAiInsights] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDeductionChange = (id, value) => {
    setDeductions(prev => ({ ...prev, [id]: Number(value) || 0 }))
  }

  const handleCalculate = () => {
    const grossIncome = Number(salary.gross) || 0
    if (grossIncome <= 0) return

    setStep('loading')
    setLoading(true)

    const oldRegime = calculateOldRegimeTax(grossIncome, deductions)
    const newRegime = calculateNewRegimeTax(grossIncome)
    const savings = Math.abs(oldRegime.total - newRegime.total)
    const recommended = oldRegime.total <= newRegime.total ? 'Old Regime' : 'New Regime'
    const missed = findMissedDeductions(deductions)

    const res = { oldRegime, newRegime, savings, recommended, missed, grossIncome }
    setResults(res)

    // Try AI insights
    fetch('/api/tax-wizard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salary, deductions, results: res }),
    })
      .then(r => r.json())
      .then(data => {
        setAiInsights(data.insights || '')
        setStep('results')
        setLoading(false)
      })
      .catch(() => {
        setStep('results')
        setLoading(false)
      })
  }

  const formatCurrency = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

  if (step === 'loading') {
    return (
      <div className="tw-page">
        <div className="tw-loading animate-fade-in">
          <Loader2 size={48} className="spin-icon" />
          <h2>Computing Tax Analysis...</h2>
          <p className="text-muted">Comparing regimes and finding savings opportunities</p>
        </div>
      </div>
    )
  }

  if (step === 'results' && results) {
    const { oldRegime, newRegime, savings, recommended, missed, grossIncome } = results

    const barData = {
      labels: ['Old Regime', 'New Regime'],
      datasets: [
        {
          label: 'Tax Payable',
          data: [oldRegime.total, newRegime.total],
          backgroundColor: ['rgba(245, 158, 11, 0.6)', 'rgba(59, 130, 246, 0.6)'],
          borderColor: ['rgba(245, 158, 11, 1)', 'rgba(59, 130, 246, 1)'],
          borderWidth: 2,
          borderRadius: 8,
        }
      ]
    }

    const barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => formatCurrency(ctx.raw) } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { weight: '600' } } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', callback: (v) => '₹' + (v / 1000) + 'K' } }
      }
    }

    return (
      <div className="tw-page animate-fade-in-up">
        <div className="page-header">
          <h1>Tax Analysis Results</h1>
          <p>Gross Income: {formatCurrency(grossIncome)}</p>
        </div>

        {/* Recommendation Banner */}
        <div className={`tw-recommendation glass-card ${recommended === 'New Regime' ? 'tw-rec-new' : 'tw-rec-old'}`}>
          <CheckCircle2 size={24} />
          <div>
            <h3>Recommended: {recommended}</h3>
            <p>You save {formatCurrency(savings)} by choosing the {recommended.toLowerCase()}</p>
          </div>
        </div>

        {/* Comparison */}
        <div className="tw-comparison">
          <div className="tw-regime-card glass-card">
            <h3 className="tw-old-label">Old Regime</h3>
            <div className="tw-tax-amount">{formatCurrency(oldRegime.total)}</div>
            <div className="tw-tax-detail">
              <div><span>Taxable Income</span><span>{formatCurrency(oldRegime.taxableIncome)}</span></div>
              <div><span>Tax</span><span>{formatCurrency(oldRegime.tax)}</span></div>
              <div><span>Cess (4%)</span><span>{formatCurrency(oldRegime.cess)}</span></div>
              <div><span>Deductions</span><span>{formatCurrency(oldRegime.deductions)}</span></div>
            </div>
          </div>

          <div className="tw-vs">VS</div>

          <div className="tw-regime-card glass-card">
            <h3 className="tw-new-label">New Regime</h3>
            <div className="tw-tax-amount">{formatCurrency(newRegime.total)}</div>
            <div className="tw-tax-detail">
              <div><span>Taxable Income</span><span>{formatCurrency(newRegime.taxableIncome)}</span></div>
              <div><span>Tax</span><span>{formatCurrency(newRegime.tax)}</span></div>
              <div><span>Cess (4%)</span><span>{formatCurrency(newRegime.cess)}</span></div>
              <div><span>Deductions</span><span>{formatCurrency(newRegime.deductions)}</span></div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="tw-chart-card glass-card">
          <h3>Tax Comparison</h3>
          <div className="tw-chart-wrap">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Missed Deductions */}
        {missed.length > 0 && (
          <div className="tw-missed animate-fade-in-up stagger-3">
            <h3><TrendingDown size={20} /> Missed Deduction Opportunities</h3>
            <div className="tw-missed-grid">
              {missed.map((m, i) => (
                <div key={i} className="tw-missed-card glass-card">
                  <div className="tw-missed-header">
                    <span className="badge badge-warning">{m.section}</span>
                    <span className="tw-missed-potential">Potential: {formatCurrency(m.potential)}</span>
                  </div>
                  <p>{m.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Insights */}
        {aiInsights && (
          <div className="tw-ai-section animate-fade-in-up stagger-4">
            <h3><Sparkles size={20} /> AI Tax Advisor</h3>
            <div className="tw-ai-card glass-card">
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
    <div className="tw-page animate-fade-in-up">
      <div className="page-header">
        <h1><Calculator size={28} className="text-gradient-icon" /> Tax Wizard</h1>
        <p>Compare old vs new tax regime, find missed deductions, and maximize your tax savings.</p>
      </div>

      <div className="tw-form-grid">
        {/* Salary Section */}
        <div className="tw-section glass-card">
          <h3><IndianRupee size={20} /> Salary Details</h3>
          <div className="tw-form-fields">
            <div className="input-group">
              <label>Gross Annual Income (₹)</label>
              <input type="number" className="input-field" placeholder="1200000"
                value={salary.gross} onChange={e => setSalary(p => ({ ...p, gross: e.target.value }))} />
            </div>
            <div className="input-group">
              <label>Basic Salary (Annual) (₹)</label>
              <input type="number" className="input-field" placeholder="600000"
                value={salary.basic} onChange={e => setSalary(p => ({ ...p, basic: e.target.value }))} />
            </div>
            <div className="tw-form-row">
              <div className="input-group">
                <label>HRA Received (Annual) (₹)</label>
                <input type="number" className="input-field" placeholder="240000"
                  value={salary.hra_received} onChange={e => setSalary(p => ({ ...p, hra_received: e.target.value }))} />
              </div>
              <div className="input-group">
                <label>Rent Paid (Annual) (₹)</label>
                <input type="number" className="input-field" placeholder="180000"
                  value={salary.rent_paid} onChange={e => setSalary(p => ({ ...p, rent_paid: e.target.value }))} />
              </div>
            </div>
            <div className="input-group">
              <label>Metro City?</label>
              <select className="input-field" value={salary.metro}
                onChange={e => setSalary(p => ({ ...p, metro: e.target.value }))}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </div>

        {/* Deductions Section */}
        <div className="tw-section glass-card">
          <h3><PiggyBank size={20} /> Deductions Claimed</h3>
          <div className="tw-form-fields">
            {deductionsList.map(d => (
              <div key={d.id} className="input-group">
                <label>
                  {d.label}
                  {d.max > 0 && <span className="tw-max-badge">Max: ₹{d.max.toLocaleString('en-IN')}</span>}
                </label>
                {d.locked ? (
                  <input type="number" className="input-field" value={75000} disabled />
                ) : (
                  <input type="number" className="input-field" placeholder="0"
                    value={deductions[d.id] || ''}
                    onChange={e => handleDeductionChange(d.id, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="btn btn-primary btn-lg tw-calc-btn" onClick={handleCalculate}
        disabled={!salary.gross}>
        Calculate & Compare <ArrowRight size={18} />
      </button>
    </div>
  )
}
