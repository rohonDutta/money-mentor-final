import { Activity, Calculator, Flame, Home, LayoutDashboard, Sparkles } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import './Sidebar.css'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/health-score', icon: Activity, label: 'Health Score' },
  { path: '/tax-wizard', icon: Calculator, label: 'Tax Wizard' },
  { path: '/fire-planner', icon: Flame, label: 'FIRE Planner' },
  { path: '/pricing', icon: Sparkles, label: 'Upgrade Pro' },
  { path: '/about', icon: Activity, label: 'About Us' },
  { path: '/contact', icon: Calculator, label: 'Contact Us' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Sparkles size={28} className="logo-icon" />
          <div>
            <h2 className="logo-title">MoneyMentor</h2>
            <span className="logo-subtitle">AI-Powered Finance</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {/* Footer content removed */}
      </div>
    </aside>
  )
}
