import { Coins, Sparkles } from 'lucide-react'
import { useCredits } from '../context/CreditContext'
import './CreditBadge.css'

export default function CreditBadge() {
  const { credits, isSubscribed } = useCredits()

  return (
    <div className="credit-badge glass-card">
      {isSubscribed ? (
        <>
          <Sparkles size={16} className="text-amber animate-pulse" />
          <span className="badge-text pro-text">Pro Plan</span>
        </>
      ) : (
        <>
          <Coins size={16} className={credits > 0 ? "text-amber" : "text-rose"} />
          <span className="badge-text">
            {credits} {credits === 1 ? 'Credit' : 'Credits'} Left
          </span>
          <div className="mini-progress">
            <div
              className="mini-progress-fill"
              style={{
                width: `${(credits / 5) * 100}%`,
                background: credits > 1 ? 'var(--accent-emerald)' : 'var(--accent-rose)'
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
