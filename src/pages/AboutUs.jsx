import { Activity, Shield, TrendingUp, Users } from 'lucide-react'
import './AboutUs.css'

export default function AboutUs() {
  return (
    <div className="about-page animate-fade-in">
      <section className="about-hero animate-fade-in-up">
        <div className="badge badge-info mb-2">Our Story</div>
        <h1 className="hero-title">
          Empowering Your <span className="text-gradient">Financial Future</span>
        </h1>
        <p>
          We're on a mission to make premium financial planning accessible,
          transparent, and powered by the latest AI technology.
        </p>
      </section>

      <div className="about-grid">
        <div className="about-card glass-card animate-fade-in-up stagger-1">
          <div className="about-card-icon">
            <Activity size={32} />
          </div>
          <h3>Our Mission</h3>
          <p>
            To bridge the financial literacy gap in India by providing every citizen
            with a personal, AI-powered mentor that understands their unique goals.
          </p>
        </div>

        <div className="about-card glass-card animate-fade-in-up stagger-2">
          <div className="about-card-icon emerald">
            <TrendingUp size={32} />
          </div>
          <h3>Our Vision</h3>
          <p>
            A world where financial independence isn't a privilege for the few,
            but an achievable roadmap for everyone with the right tools.
          </p>
        </div>
      </div>

      <section className="story-section glass-card animate-fade-in-up stagger-3">
        <div className="story-content">
          <h2 className="text-gradient">Designed for Innovation</h2>
          <p>
            MoneyMentor was born out of a desire to simplify the complex world of Indian
            personal finance. From tax optimizations to FIRE planning, we've integrated
            sophisticated multi-agent AI systems to provide insights that traditional
            calculators can't.
          </p>
        </div>
      </section>

      <div className="about-grid" style={{ marginBottom: 0 }}>
        <div className="about-card glass-card animate-fade-in-up stagger-4">
          <div className="about-card-icon">
            <Shield size={32} />
          </div>
          <h3>Trust & Security</h3>
          <p>
            Your financial data is yours. We use enterprise-grade encryption
            and follow privacy-first principles in every line of code.
          </p>
        </div>

        <div className="about-card glass-card animate-fade-in-up stagger-5">
          <div className="about-card-icon emerald">
            <Users size={32} />
          </div>
          <h3>Community Focus</h3>
          <p>
            While we focus on the Indian landscape, we integrate global best
            practices in wealth management and financial planning.
          </p>
        </div>
      </div>
    </div >
  )
}
