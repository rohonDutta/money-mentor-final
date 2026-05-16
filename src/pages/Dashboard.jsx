import { ArrowRight, Calculator, Flame, HeartPulse, LayoutDashboard, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Dashboard.css'

export default function Dashboard() {
  return (
    <div className="dash-page animate-fade-in-up">
      <div className="page-header">
        <h1><LayoutDashboard size={28} /> Dashboard</h1>
        <p>Your unified financial overview — complete the assessments to see your results here.</p>
      </div>

      <div className="dash-welcome glass-card">
        <Sparkles size={32} className="dash-welcome-icon" />
        <h2>Welcome to your Money Mentor</h2>
        <p className="text-muted">
          Complete all three assessments to get a comprehensive view of your financial health.
          Each tool provides AI-powered insights and actionable recommendations.
        </p>
      </div>

      <div className="dash-tools-grid">
        <Link to="/health-score" className="dash-tool-card glass-card">
          <div className="dash-tool-icon dash-icon-emerald">
            <HeartPulse size={28} />
          </div>
          <div className="dash-tool-info">
            <h3>Money Health Score</h3>
            <p>Assess your financial wellness across 6 key dimensions</p>
            <div className="dash-tool-status">
              <span className="badge badge-info">Start Assessment</span>
              <ArrowRight size={16} className="dash-arrow" />
            </div>
          </div>
        </Link>

        <Link to="/tax-wizard" className="dash-tool-card glass-card">
          <div className="dash-tool-icon dash-icon-amber">
            <Calculator size={28} />
          </div>
          <div className="dash-tool-info">
            <h3>Tax Wizard</h3>
            <p>Compare tax regimes and maximize your savings</p>
            <div className="dash-tool-status">
              <span className="badge badge-info">Start Analysis</span>
              <ArrowRight size={16} className="dash-arrow" />
            </div>
          </div>
        </Link>

        <Link to="/fire-planner" className="dash-tool-card glass-card">
          <div className="dash-tool-icon dash-icon-rose">
            <Flame size={28} />
          </div>
          <div className="dash-tool-info">
            <h3>FIRE Planner</h3>
            <p>Build your roadmap to Financial Independence</p>
            <div className="dash-tool-status">
              <span className="badge badge-info">Start Planning</span>
              <ArrowRight size={16} className="dash-arrow" />
            </div>
          </div>
        </Link>
      </div>

      {/* Multi-Agent Info */}
      <div className="dash-agents-section">
        <h3>Powered by Multi-Agent AI</h3>
        <div className="dash-agents-grid">
          <div className="dash-agent glass-card">
            <div className="dash-agent-badge">🧠</div>
            <h4>Orchestrator Agent</h4>
            <p>Routes requests and coordinates specialized agents</p>
          </div>
          <div className="dash-agent glass-card">
            <div className="dash-agent-badge">❤️</div>
            <h4>Health Score Agent</h4>
            <p>Analyzes 6 financial dimensions</p>
          </div>
          <div className="dash-agent glass-card">
            <div className="dash-agent-badge">🧾</div>
            <h4>Tax Analysis Agent</h4>
            <p>Compares regimes & finds deductions</p>
          </div>
          <div className="dash-agent glass-card">
            <div className="dash-agent-badge">🔥</div>
            <h4>FIRE Planning Agent</h4>
            <p>Builds financial roadmaps</p>
          </div>
          <div className="dash-agent glass-card">
            <div className="dash-agent-badge">📈</div>
            <h4>Investment Advisor</h4>
            <p>Recommends investment instruments</p>
          </div>
        </div>
      </div>
    </div>
  )
}
