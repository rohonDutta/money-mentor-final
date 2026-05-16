import { ArrowRight, Calendar, Sparkles } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import './Guides.css'

const guides = [
  {
    id: 'mastering-tax-india',
    title: 'Mastering the New vs Old Tax Regime in India',
    excerpt: 'A comprehensive guide to understanding the differences between the tax regimes and how to choose the right one for your income level.',
    category: 'Taxation',
    readTime: '8 min read',
    date: 'May 10, 2026',
    color: 'amber'
  },
  {
    id: 'fire-movement-guide',
    title: 'The Ultimate Guide to FIRE for Indian Professionals',
    excerpt: 'Financial Independence, Retire Early (FIRE) is gaining momentum in India. Learn the strategies, calculators, and mindsets needed.',
    category: 'Planning',
    readTime: '12 min read',
    date: 'May 12, 2026',
    color: 'rose'
  },
  {
    id: 'mutual-funds-basics',
    title: 'Mutual Funds 101: Building Your First Portfolio',
    excerpt: 'New to investing? This guide breaks down mutual funds, SIPs, and how to start your wealth creation journey with confidence.',
    category: 'Investing',
    readTime: '10 min read',
    date: 'May 14, 2026',
    color: 'emerald'
  },
  {
    id: 'emergency-fund-importance',
    title: 'Why an Emergency Fund is Your Financial Foundation',
    excerpt: 'Before you invest a single rupee, you need a safety net. Here is how to build an emergency fund that works for your lifestyle.',
    category: 'Basics',
    readTime: '6 min read',
    date: 'May 15, 2026',
    color: 'blue'
  }
]

export default function Guides() {
  return (
    <div className="guides-page animate-fade-in">
      <section className="guides-hero animate-fade-in-up">
        <div className="badge badge-info mb-2">Knowledge Base</div>
        <h1 className="hero-title">
          Financial <span className="text-gradient">Guides & Insights</span>
        </h1>
        <p className="hero-subtitle">
          Expert articles designed to help you navigate the complex world of Indian personal finance. 
          Unique, high-quality content updated weekly.
        </p>
      </section>

      <div className="guides-grid">
        {guides.map((guide, i) => (
          <Link 
            key={guide.id} 
            to={`/guides/${guide.id}`}
            className={`guide-card glass-card animate-fade-in-up stagger-${i + 1}`}
          >
            <div className={`guide-category category-${guide.color}`}>
              <Sparkles size={14} />
              {guide.category}
            </div>
            <h3>{guide.title}</h3>
            <p>{guide.excerpt}</p>
            <div className="guide-meta">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {guide.readTime}
              </span>
              <span>{guide.date}</span>
            </div>
            <div className="guide-footer">
              Read Full Article <ArrowRight size={16} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
