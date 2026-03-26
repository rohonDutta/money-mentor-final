import { CheckCircle2, Sparkles, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCredits } from '../context/CreditContext'
import './Pricing.css'

export default function Pricing() {
  const { isSubscribed, simulateSubscription } = useCredits()
  const navigate = useNavigate()

  return (
    <div className="pricing-page animate-fade-in">
      <div className="pricing-header">
        <h1 className="page-title">
          <Sparkles className="title-icon text-amber" /> Unlock Financial Freedom
        </h1>
        <p className="page-subtitle">
          Get unlimited access to AI-powered personalized financial planning.
        </p>
      </div>

      {isSubscribed ? (
        <div className="glass-card subscribed-banner animate-scale-in">
          <div className="subscribed-icon">
            <CheckCircle2 size={48} className="text-emerald" />
          </div>
          <h2>You are a Premium Member!</h2>
          <p>Thank you for subscribing. You have unlimited access to all AI agents.</p>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="pricing-plans">
          {/* Monthly Plan */}
          <div className="plan-card glass-card">
            <div className="plan-title">Monthly Access</div>
            <div className="plan-price">
              <span className="currency">₹</span><span className="amount">199</span><span className="period">/mo</span>
            </div>
            <p className="plan-description">Perfect for a quick financial checkup.</p>
            <ul className="plan-features">
              <li><CheckCircle2 size={16} /> Unlimited Health Scores</li>
              <li><CheckCircle2 size={16} /> Advanced Tax Optimization</li>
              <li><CheckCircle2 size={16} /> Dynamic FIRE Planning</li>
              <li className="text-slate-400"><X size={16} /> Priority Processing</li>
              <li className="text-slate-400"><X size={16} /> Export to PDF</li>
            </ul>
            <button className="btn btn-secondary mt-auto" onClick={simulateSubscription}>Subscribe Monthly</button>
          </div>

          {/* Yearly Plan (Popular) */}
          <div className="plan-card glass-card plan-popular">
            <div className="popular-badge"><Sparkles size={14} /> Best Value</div>
            <div className="plan-title text-amber">Pro Yearly</div>
            <div className="plan-price">
              <span className="currency">₹</span><span className="amount">1,999</span><span className="period">/yr</span>
            </div>
            <p className="plan-savings">Save ₹389 / year</p>
            <ul className="plan-features">
              <li><CheckCircle2 size={16} /> Everything in Monthly</li>
              <li><CheckCircle2 size={16} className="text-amber" /> Priority AI Processing</li>
              <li><CheckCircle2 size={16} className="text-amber" /> Direct email support</li>
              <li><CheckCircle2 size={16} className="text-amber" /> Export to PDF / Excel</li>
              <li><CheckCircle2 size={16} className="text-amber" /> Early access to new agents</li>
            </ul>
            <button className="btn btn-primary mt-auto" onClick={simulateSubscription}>Upgrade to Pro</button>
          </div>
        </div>
      )}

      <div className="pricing-faq mt-8">
        <p className="text-slate-400 text-sm text-center">
          Payment is simulated for this hackathon demo. No real transactions will occur. <br />
          Mock secured by Razorpay.
        </p>
      </div>
    </div>
  )
}
