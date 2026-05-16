import React from 'react'
import './LegalContent.css'

export default function PrivacyPolicy() {
  return (
    <div className="legal-page animate-fade-in">
      <div className="legal-header animate-fade-in-up">
        <h1 className="text-gradient">Privacy Policy</h1>
        <p className="text-muted">Last updated: May 16, 2026</p>
      </div>

      <div className="legal-content glass-card animate-fade-in-up stagger-1">
        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to MoneyMentor ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our AI-powered financial planning tools.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when you use our tools, such as the Health Score assessment, Tax Wizard, or FIRE Planner. This information may include:
          </p>
          <ul>
            <li>Financial information (income, expenses, investments, debts)</li>
            <li>Demographic information (age, employment status)</li>
            <li>Contact information (email address, if you choose to create an account)</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide and maintain our AI-powered financial planning services.</li>
            <li>Generate personalized financial insights and recommendations.</li>
            <li>Improve our AI models and overall user experience.</li>
            <li>Communicate with you regarding updates or support requests.</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect the security of any personal information we process. However, please remember that no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
          </p>
        </section>

        <section>
          <h2>5. Third-Party Services</h2>
          <p>
            We may use third-party services, such as Google AdSense, to serve advertisements. These third parties may use cookies and web beacons to collect information about your activities on this and other websites to provide you with targeted advertising.
          </p>
        </section>

        <section>
          <h2>6. Your Privacy Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your data.
          </p>
        </section>

        <section>
          <h2>7. Contact Us</h2>
          <p>
            If you have questions or comments about this policy, you may contact us through our Contact Us page.
          </p>
        </section>
      </div>
    </div>
  )
}
