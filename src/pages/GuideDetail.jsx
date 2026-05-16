import { ArrowLeft, Clock, Share2, Tag } from 'lucide-react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import './LegalContent.css' // Reusing legal content styles for typography

const guideContent = {
  'mastering-tax-india': {
    title: 'Mastering the New vs Old Tax Regime in India',
    category: 'Taxation',
    readTime: '8 min read',
    date: 'May 10, 2026',
    content: (
      <>
        <p>Choosing between the Old and New Tax Regime is one of the most critical decisions for Indian taxpayers today. Since the introduction of the New Tax Regime in Budget 2020, and its subsequent making as the "default" regime in Budget 2023, the landscape of Indian taxation has shifted significantly.</p>
        
        <h2>The Core Difference</h2>
        <p>The Old Tax Regime allows for numerous deductions and exemptions (like 80C, 80D, HRA, and LTA) but has higher tax rates. The New Tax Regime offers lower tax rates but removes almost all exemptions, aiming for a simpler, "cleaner" tax structure.</p>

        <h2>Who Benefits from the New Regime?</h2>
        <p>Generally, the New Tax Regime is beneficial for:</p>
        <ul>
          <li>Young professionals who don't have many investments in 80C instruments.</li>
          <li>Individuals who prefer liquidity over long-term locked-in investments.</li>
          <li>Those whose total deductions (80C + 80D + HRA etc.) are less than ₹3.75 Lakhs (for an income of ₹15 Lakhs).</li>
        </ul>

        <h2>Strategic Planning with MoneyMentor</h2>
        <p>Our Tax Wizard tool is designed specifically to solve this dilemma. By inputting your salary and current investments, our AI agent calculates the exact break-even point for your specific income level. This allows you to make a data-driven choice rather than a guess.</p>

        <h2>Conclusion</h2>
        <p>There is no one-size-fits-all answer. As your income grows and your investment profile matures, your "ideal" regime might change. We recommend running your numbers through our Tax Wizard every financial year to stay optimized.</p>
      </>
    )
  }
}

export default function GuideDetail() {
  const { id } = useParams()
  const guide = guideContent[id] || {
    title: 'Coming Soon',
    category: 'Finance',
    readTime: '5 min read',
    date: 'May 2026',
    content: <p>We are currently polishing this high-value guide for you. Check back in a few days!</p>
  }

  return (
    <div className="legal-page animate-fade-in">
      <Link to="/guides" className="btn btn-secondary btn-sm mb-4">
        <ArrowLeft size={16} /> Back to Guides
      </Link>

      <div className="legal-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="badge badge-info">{guide.category}</span>
          <span className="text-muted flex items-center gap-1"><Clock size={14} /> {guide.readTime}</span>
        </div>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>{guide.title}</h1>
        <div className="flex justify-between items-center mt-4">
          <span className="text-muted">Published on {guide.date}</span>
          <button className="btn btn-secondary btn-sm"><Share2 size={16} /> Share</button>
        </div>
      </div>

      <div className="legal-content glass-card animate-fade-in-up">
        {guide.content}
      </div>

      <div className="mt-4 p-4 glass-card text-center">
        <h3>Ready to take action?</h3>
        <p className="text-muted">Use our AI tools to apply these insights to your own finances.</p>
        <div className="flex justify-center gap-2 mt-2">
          <Link to="/tax-wizard" className="btn btn-primary">Try Tax Wizard</Link>
          <Link to="/health-score" className="btn btn-secondary">Check Health Score</Link>
        </div>
      </div>
    </div>
  )
}
