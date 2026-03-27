import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import CreditBadge from './components/CreditBadge'
import PaywallModal from './components/PaywallModal'
import ReviewModal from './components/ReviewModal'
import Sidebar from './components/Sidebar'
import { AuthProvider } from './context/AuthContext'
import { CreditProvider } from './context/CreditContext'
import { ReviewProvider } from './context/ReviewContext'
import AboutUs from './pages/AboutUs'
import Account from './pages/Account'
import ContactUs from './pages/ContactUs'
import Dashboard from './pages/Dashboard'
import FirePlanner from './pages/FirePlanner'
import HealthScore from './pages/HealthScore'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import TaxWizard from './pages/TaxWizard'

function App() {
  return (
    <AuthProvider>
      <CreditProvider>
        <ReviewProvider>
          <Router>
            <div className="app-layout" style={{ position: 'relative' }}>
              <Sidebar />
              <CreditBadge />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/health-score" element={<HealthScore />} />
                  <Route path="/tax-wizard" element={<TaxWizard />} />
                  <Route path="/fire-planner" element={<FirePlanner />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/account" element={<Account />} />
                </Routes>
              </main>
              <PaywallModal />
              <ReviewModal />
            </div>
          </Router>
        </ReviewProvider>
      </CreditProvider>
    </AuthProvider>
  )
}

export default App
