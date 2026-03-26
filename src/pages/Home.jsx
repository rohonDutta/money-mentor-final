import { ArrowRight, Calculator, Flame, HeartPulse, IndianRupee, Quote, Shield, Sparkles, Star, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useReview } from '../context/ReviewContext'
import './Home.css'

const features = [
  {
    icon: HeartPulse,
    title: 'Money Health Score',
    description: 'Get a comprehensive financial wellness score across 6 key dimensions in just 5 minutes.',
    path: '/health-score',
    color: 'emerald',
    stats: '6 Dimensions',
  },
  {
    icon: Calculator,
    title: 'Tax Wizard',
    description: 'Compare old vs new tax regime, find missed deductions, and maximize your tax savings.',
    path: '/tax-wizard',
    color: 'amber',
    stats: 'Save ₹50K+',
  },
  {
    icon: Flame,
    title: 'FIRE Planner',
    description: 'Build a month-by-month financial roadmap to achieve Financial Independence & Retire Early.',
    path: '/fire-planner',
    color: 'rose',
    stats: 'Full Roadmap',
  },
]

const stats = [
  { value: '14 Cr+', label: 'Demat Accounts in India', icon: Users },
  { value: '95%', label: 'Indians Without Financial Plan', icon: TrendingUp },
  { value: '₹25K+', label: 'Yearly Advisor Cost', icon: IndianRupee },
  { value: '100%', label: 'Free AI-Powered Planning', icon: Shield },
]

export default function Home() {
  const { getTopReview } = useReview()
  const topReview = getTopReview()

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero animate-fade-in-up">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>AI-Powered Personal Finance</span>
        </div>
        <h1 className="hero-title">
          Your AI <span className="text-gradient">Money Mentor</span>
        </h1>
        <p className="hero-subtitle">
          Financial planning as accessible as checking WhatsApp. Get personalized insights,
          tax optimization, and a complete roadmap to financial freedom — powered by AI.
        </p>
        <div className="hero-actions">
          <Link to="/health-score" className="btn btn-primary btn-lg">
            Get Started Free
            <ArrowRight size={18} />
          </Link>
          <Link to="/dashboard" className="btn btn-secondary btn-lg">
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section animate-fade-in-up stagger-2">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card glass-card">
              <stat.icon size={22} className="stat-icon" />
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="section-heading animate-fade-in-up stagger-3">
          Everything You Need for <span className="text-gradient">Financial Wellness</span>
        </h2>
        <div className="features-grid">
          {features.map((feature, i) => (
            <Link
              key={i}
              to={feature.path}
              className={`feature-card glass-card animate-fade-in-up stagger-${i + 3}`}
            >
              <div className={`feature-icon-wrap feature-icon-${feature.color}`}>
                <feature.icon size={28} />
              </div>
              <div className="feature-stats-badge">{feature.stats}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className="feature-link">
                Try Now <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works animate-fade-in-up stagger-5">
        <h2 className="section-heading">
          How <span className="text-gradient">MoneyMentor</span> Works
        </h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <h4>Answer Questions</h4>
            <p>Quick 5-minute questionnaire about your finances — income, expenses, investments, and goals.</p>
          </div>
          <div className="step-connector"></div>
          <div className="step-card">
            <div className="step-number">02</div>
            <h4>AI Analysis</h4>
            <p>Our multi-agent AI system analyzes your data across multiple financial dimensions simultaneously.</p>
          </div>
          <div className="step-connector"></div>
          <div className="step-card">
            <div className="step-number">03</div>
            <h4>Get Your Plan</h4>
            <p>Receive personalized scores, tax-saving strategies, and a complete financial roadmap instantly.</p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section animate-fade-in-up stagger-6">
        <h2 className="section-heading">What Our <span className="text-gradient">Users Say</span></h2>
        {topReview ? (
          <div className="review-display-card glass-card">
            <Quote size={40} className="review-quote-icon" />
            <div className="review-stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={i < topReview.rating ? 'currentColor' : 'none'}
                  strokeOpacity={i < topReview.rating ? 0 : 1}
                  style={{ color: i < topReview.rating ? 'var(--accent-amber)' : 'var(--text-muted)' }}
                />
              ))}
            </div>
            <p className="review-text">"{topReview.comment}"</p>
            <div className="review-author">
              <span className="author-name">{topReview.userName}</span>
              <span className="author-meta">Verified User • {topReview.type}</span>
            </div>
          </div>
        ) : (
          <p className="no-reviews-note">No reviews yet. Be the first to share your experience!</p>
        )}
      </section>
    </div>
  )
}
