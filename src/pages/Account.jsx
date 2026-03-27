import { AlertCircle, Check, CreditCard, Lock, Mail, Phone, Send, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCredits } from '../context/CreditContext'
import './Account.css'

export default function Account() {
  const { user, isAuthenticated, login, signup, logout, updateProfile, sendVerificationEmail, verifyEmail } = useAuth()
  const { isSubscribed } = useCredits()
  const [activeTab, setActiveTab] = useState('login') // 'login' or 'signup'
  const [showVerification, setShowVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = login(loginForm.email, loginForm.password)
    setLoading(false)

    if (!result.success) {
      setError(result.error)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const result = signup(signupForm)

    if (result.success) {
      // Trigger verification email automatically
      const verifyResult = await sendVerificationEmail()
      setLoading(false)
      if (verifyResult.success) {
        setIsSigningUp(true)
        setSuccess('Account created! Verification code sent to your email.')
      } else {
        setError('Account created, but failed to send verification email. You can verify from your profile.')
      }
    } else {
      setLoading(false)
      setError(result.error)
    }
  }

  const handleSendVerification = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    const result = await sendVerificationEmail()
    setLoading(false)

    if (result.success) {
      setShowVerification(true)
      setSuccess('Verification code sent to your email! (Use code: 123456 for demo)')
    }
  }

  const handleVerifyEmail = () => {
    const result = verifyEmail(verificationCode)
    if (result.success) {
      setSuccess('Email verified successfully! Welcome aboard.')
      setShowVerification(false)
      setIsSigningUp(false) // Exit signup flow
      setVerificationCode('')
    } else {
      setError(result.error)
    }
  }

  const handleUpdateProfile = (e) => {
    e.preventDefault()
    updateProfile(profileForm)
    setEditMode(false)
    setSuccess('Profile updated successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

  // Not authenticated or in verification flow - show login/signup/verify
  if (!isAuthenticated || isSigningUp) {
    return (
      <div className="account-page animate-fade-in-up">
        <div className="account-container">
          <div className="account-header">
            <h1>Welcome to MoneyMentor</h1>
            <p className="text-muted">Sign in to access your personalized financial dashboard</p>
          </div>

          <div className="auth-card glass-card">
            <div className="auth-tabs">
              <button
                className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('login')
                  setIsSigningUp(false)
                }}
                disabled={isSigningUp}
              >
                Login
              </button>
              <button
                className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => setActiveTab('signup')}
                disabled={isSigningUp}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="alert alert-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <Check size={16} />
                <span>{success}</span>
              </div>
            )}

            {activeTab === 'login' ? (
              <form className="auth-form" onSubmit={handleLogin}>
                <div className="input-group">
                  <label>Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      className="input-field"
                      placeholder="you@example.com"
                      required
                      value={loginForm.email}
                      onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      className="input-field"
                      placeholder="••••••••"
                      required
                      value={loginForm.password}
                      onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <p className="auth-hint">
                  Don't have an account? <button type="button" className="link-btn" onClick={() => setActiveTab('signup')}>Sign up</button>
                </p>
              </form>
            ) : isSigningUp ? (
              <div className="verification-form">
                <h3 className="mb-4 text-center">Verify Your Email</h3>
                <p className="text-muted text-center mb-6">
                  Check your inbox for a 6-digit code. (Use <strong>123456</strong> for demo)
                </p>
                <div className="input-group">
                  <label>Verification Code</label>
                  <input
                    type="text"
                    className="input-field text-center text-2xl tracking-[1em]"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                  />
                </div>
                <button
                  className="btn btn-primary w-full mt-4"
                  onClick={handleVerifyEmail}
                  disabled={verificationCode.length !== 6}
                >
                  Complete Registration
                </button>
                <button
                  type="button"
                  className="btn btn-secondary w-full mt-3"
                  onClick={() => setIsSigningUp(false)}
                >
                  Back to Signup
                </button>
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleSignup}>
                <div className="input-group">
                  <label>Full Name</label>
                  <div className="input-with-icon">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="John Doe"
                      required
                      value={signupForm.name}
                      onChange={e => setSignupForm({ ...signupForm, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      className="input-field"
                      placeholder="you@example.com"
                      required
                      value={signupForm.email}
                      onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Phone Number</label>
                  <div className="input-with-icon">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="+91 98765 43210"
                      required
                      value={signupForm.phone}
                      onChange={e => setSignupForm({ ...signupForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      className="input-field"
                      placeholder="••••••••"
                      required
                      value={signupForm.password}
                      onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Confirm Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      className="input-field"
                      placeholder="••••••••"
                      required
                      value={signupForm.confirmPassword}
                      onChange={e => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>

                <p className="auth-hint">
                  Already have an account? <button type="button" className="link-btn" onClick={() => setActiveTab('login')}>Sign in</button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Authenticated - show profile
  return (
    <div className="account-page animate-fade-in-up">
      <div className="account-container">
        <div className="account-header">
          <div>
            <h1>My Account</h1>
            <p className="text-muted">Manage your profile and subscription</p>
          </div>
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>

        {success && (
          <div className="alert alert-success">
            <Check size={16} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="account-grid">
          {/* Profile Information */}
          <div className="account-card glass-card">
            <div className="card-header">
              <h3>Profile Information</h3>
              {!editMode && (
                <button className="btn btn-sm btn-secondary" onClick={() => setEditMode(true)}>
                  Edit
                </button>
              )}
            </div>

            {editMode ? (
              <form className="profile-form" onSubmit={handleUpdateProfile}>
                <div className="input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={profileForm.name}
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    className="input-field"
                    value={profileForm.phone}
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="detail-item">
                  <User size={18} className="detail-icon" />
                  <div>
                    <span className="detail-label">Name</span>
                    <span className="detail-value">{user.name}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <Mail size={18} className="detail-icon" />
                  <div>
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{user.email}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <Phone size={18} className="detail-icon" />
                  <div>
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{user.phone}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Email Verification */}
          <div className="account-card glass-card">
            <div className="card-header">
              <h3>Email Verification</h3>
              {user.emailVerified && (
                <span className="badge badge-success">Verified</span>
              )}
            </div>

            {user.emailVerified ? (
              <div className="verification-status">
                <div className="verification-icon verified">
                  <Check size={32} />
                </div>
                <p className="text-center">Your email has been verified</p>
              </div>
            ) : (
              <div className="verification-content">
                <p className="text-muted mb-3">
                  Please verify your email to unlock all features and receive important updates.
                </p>

                {!showVerification ? (
                  <button
                    className="btn btn-primary w-full"
                    onClick={handleSendVerification}
                    disabled={loading}
                  >
                    <Send size={16} />
                    {loading ? 'Sending...' : 'Send Verification Code'}
                  </button>
                ) : (
                  <div className="verification-form">
                    <div className="input-group">
                      <label>Enter Verification Code</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="123456"
                        value={verificationCode}
                        onChange={e => setVerificationCode(e.target.value)}
                        maxLength={6}
                      />
                    </div>
                    <div className="form-actions">
                      <button
                        className="btn btn-primary"
                        onClick={handleVerifyEmail}
                        disabled={verificationCode.length !== 6}
                      >
                        Verify Email
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowVerification(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Subscription & Payment */}
          <div className="account-card glass-card full-width">
            <div className="card-header">
              <h3>Subscription & Billing</h3>
              {isSubscribed && (
                <span className="badge badge-success">Pro Member</span>
              )}
            </div>

            {isSubscribed ? (
              <div className="subscription-details">
                <div className="subscription-info">
                  <CreditCard size={32} className="subscription-icon" />
                  <div>
                    <h4>Pro Yearly Plan</h4>
                    <p className="text-muted">₹1,999/year - Renews on {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>

                <div className="payment-method">
                  <h4>Payment Method</h4>
                  <div className="payment-card">
                    <CreditCard size={20} />
                    <span>•••• •••• •••• 4242</span>
                    <span className="badge badge-info">Default</span>
                  </div>
                </div>

                <div className="subscription-features">
                  <h4>Active Benefits</h4>
                  <ul>
                    <li><Check size={16} className="text-emerald" /> Unlimited Health Score analyses</li>
                    <li><Check size={16} className="text-emerald" /> Advanced Tax Optimization</li>
                    <li><Check size={16} className="text-emerald" /> Dynamic FIRE Planning</li>
                    <li><Check size={16} className="text-emerald" /> Priority AI Processing</li>
                    <li><Check size={16} className="text-emerald" /> Export to PDF/Excel</li>
                    <li><Check size={16} className="text-emerald" /> Direct email support</li>
                  </ul>
                </div>

                <div className="subscription-actions">
                  <button className="btn btn-secondary">Update Payment Method</button>
                  <button className="btn btn-outline">Cancel Subscription</button>
                </div>
              </div>
            ) : (
              <div className="no-subscription">
                <p className="text-muted mb-3">You're currently on the free plan with 5 credits.</p>
                <button className="btn btn-primary" onClick={() => window.location.href = '/pricing'}>
                  Upgrade to Pro
                </button>
              </div>
            )}
          </div>

          {/* Account Details */}
          <div className="account-card glass-card full-width">
            <div className="card-header">
              <h3>Account Details</h3>
            </div>

            <div className="account-metadata">
              <div className="metadata-item">
                <span className="metadata-label">Account ID</span>
                <span className="metadata-value">{user.id}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Member Since</span>
                <span className="metadata-value">{new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Account Status</span>
                <span className="badge badge-success">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
