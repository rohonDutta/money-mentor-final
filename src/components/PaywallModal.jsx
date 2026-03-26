import { CheckCircle2, Lock, Sparkles, X } from 'lucide-react'
import { useCredits } from '../context/CreditContext'
import './PaywallModal.css'

export default function PaywallModal() {
  const { showPaywall, setShowPaywall, simulateSubscription } = useCredits()

  if (!showPaywall) return null

  return (
    <div className="paywall-overlay animate-fade-in">
      <div className="paywall-card glass-card animate-scale-in">
        <button className="paywall-close" onClick={() => setShowPaywall(false)}>
          <X size={20} />
        </button>

        <div className="paywall-header">
          <div className="paywall-icon">
            <Lock size={32} />
          </div>
          <h2>You've hit your free limit</h2>
          <p>Upgrade to Premium to get unlimited access to all AI financial agents.</p>
        </div>

        <div className="paywall-plans">
          {/* Monthly Plan */}
          <div className="plan-card glass-card">
            <div className="plan-title">Monthly Access</div>
            <div className="plan-price">
              <span className="currency">₹</span><span className="amount">199</span><span className="period">/mo</span>
            </div>
            <ul className="plan-features">
              <li><CheckCircle2 size={16} /> Unlimited Health Scores</li>
              <li><CheckCircle2 size={16} /> Advanced Tax Optimization</li>
              <li><CheckCircle2 size={16} /> Dynamic FIRE Planning</li>
            </ul>
            <button className="btn btn-secondary" onClick={simulateSubscription}>Subscribe Monthly</button>
          </div>

          {/* Yearly Plan (Popular) */}
          <div className="plan-card glass-card plan-popular">
            <div className="popular-badge"><Sparkles size={14} /> Best Value</div>
            <div className="plan-title">Pro Yearly</div>
            <div className="plan-price">
              <span className="currency">₹</span><span className="amount">1,999</span><span className="period">/yr</span>
            </div>
            <p className="plan-savings">Save ₹389 / year</p>
            <ul className="plan-features">
              <li><CheckCircle2 size={16} /> Everything in Monthly</li>
              <li><CheckCircle2 size={16} /> Priority AI Processing</li>
              <li><CheckCircle2 size={16} /> Export to PDF / Excel</li>
            </ul>
            <button className="btn btn-primary" onClick={simulateSubscription}>Upgrade to Pro</button>
          </div>
        </div>

        <div className="paywall-footer">
          <p>Secured by Razorpay. Cancel anytime.</p>
        </div>
      </div>
    </div>
  )
}
