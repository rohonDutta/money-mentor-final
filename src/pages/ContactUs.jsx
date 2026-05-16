import { Calculator, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import './ContactUs.css'

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || ''
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to send message')

      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError('Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Note: MessageSquare might be missing, so we use Calculator as fallback if needed.
  // But let me check if MessageSquare is in any file.

  return (
    <div className="contact-page animate-fade-in">
      <section className="contact-header animate-fade-in-up">
        <h1 className="hero-title">Get in <span className="text-gradient">Touch</span></h1>
        <p className="text-muted">Have questions about your financial plan? We're here to help.</p>
      </section>

      <div className="contact-grid">
        <div className="contact-info animate-fade-in-up stagger-1">
          <div className="info-card glass-card">
            <div className="info-icon">
              <Calculator size={24} />
            </div>
            <div className="info-details">
              <h4>Email Us</h4>
              <p>support@moneymentor.ai</p>
            </div>
          </div>


          <div className="info-card glass-card">
            <div className="info-icon">
              <TrendingUp size={24} />
            </div>
            <div className="info-details">
              <h4>Follow Our Journey</h4>
              <p>Follow us on GitHub and LinkedIn</p>
            </div>
          </div>
        </div>

        <div className="contact-form-container glass-card animate-fade-in-up stagger-2">
          {error && <div className="badge badge-danger mb-4 w-full">{error}</div>}

          {submitted ? (
            <div className="text-center p-4 animate-scale-in">
              <div className="badge badge-success mb-2">Message Sent!</div>
              <h3>Thank you for reaching out</h3>
              <p className="text-muted">Our AI mentor and team will get back to you shortly.</p>
              <button
                className="btn btn-secondary mt-3"
                onClick={() => setSubmitted(false)}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Subject</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="How can we help?"
                  required
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>Message</label>
                <textarea
                  className="input-field"
                  placeholder="Your message here..."
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <section className="faq-section animate-fade-in-up stagger-3">
        <h2 className="section-heading text-center mt-4 mb-4">
          Frequently Asked <span className="text-gradient">Questions</span>
        </h2>
        <div className="faq-grid">
          <div className="faq-item glass-card">
            <h4>Is MoneyMentor free to use?</h4>
            <p>Yes! Our basic financial assessment tools are free for everyone. We believe financial literacy should be accessible to all Indians.</p>
          </div>
          <div className="faq-item glass-card">
            <h4>How accurate is the AI advice?</h4>
            <p>Our AI is trained on vast amounts of Indian financial data and regulations. However, it should be used for educational purposes and not as a replacement for a certified financial advisor.</p>
          </div>
          <div className="faq-item glass-card">
            <h4>Is my data secure?</h4>
            <p>Absolutely. We use enterprise-grade encryption and never share your personal financial data with third parties without your explicit consent.</p>
          </div>
          <div className="faq-item glass-card">
            <h4>Can I save my results?</h4>
            <p>Yes, by creating an account, you can save your Health Score, Tax analysis, and FIRE roadmaps to track your progress over time.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
