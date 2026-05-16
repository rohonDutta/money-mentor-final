import { Github, Linkedin, Mail, Sparkles, Twitter } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <Sparkles className="logo-icon" size={24} />
              <span className="logo-text">MoneyMentor</span>
            </div>
            <p className="footer-description">
              AI-powered financial planning for the modern Indian landscape. 
              Making premium wealth management accessible to everyone.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href="#" aria-label="GitHub"><Github size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-group">
            <h3>Platform</h3>
            <ul>
              <li><Link to="/health-score">Health Score</Link></li>
              <li><Link to="/tax-wizard">Tax Wizard</Link></li>
              <li><Link to="/fire-planner">FIRE Planner</Link></li>
              <li><Link to="/guides">Financial Guides</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="footer-links-group">
            <h3>Company</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><a href="mailto:support@moneymentor.ai" className="flex items-center gap-1">
                <Mail size={14} /> Support
              </a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="footer-links-group">
            <h3>Legal</h3>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/disclaimer">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} MoneyMentor AI. All rights reserved.</p>
          <div className="footer-bottom-badges">
            <span className="badge badge-info">Made with ❤️ in India</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
