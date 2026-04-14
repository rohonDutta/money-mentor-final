# AI Money Mentor

## AI Money Mentor
**95% of Indians don't have a financial plan.** Financial advisors charge ₹25,000+ per year and serve only HNls. We built an AI-powered personal finance mentor that makes financial planning as accessible as checking WhatsApp.

## 🚀 Vision
MoneyMentor turns confused savers into confident investors by providing professional-grade financial planning for free. It uses a **Multi-Agent AI System** to analyze a user's financial life across multiple dimensions simultaneously.

## ✨ Features

- **Money Health Score**: A 5-minute onboarding flow that gives a comprehensive financial wellness score across 6 dimensions: Emergency Fund, Insurance, Investments, Debt, Tax, and Retirement.
- **Tax Wizard**: Compare Old vs. New tax regimes with real-time calculations. identifies missed deductions (80C, 80D, NPS, HRA) and models savings.
- **FIRE Path Planner**: Build a month-by-month financial roadmap to Financial Independence & Retire Early. Includes SIP recommendations and asset allocation strategies.
- **AI Financial Advisor**: Personalized AI insights powered by **Google Gemini 2.0 Flash**, providing actionable advice for every assessment.

## 🛠️ Tech Stack

- **Frontend**: Vite + React 18, Chart.js (Data Visualization), Lucide React (Icons), Vanilla CSS (Glassmorphism UI).
- **Backend**: Node.js + Express.js.
- **AI Layer**: Google Gemini 2.0 Flash API.
- **Architecture**: Multi-Agent Orchestration (Orchestrator + Specialized Domain Agents).

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-money-mentor
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add your Gemini API Key:
     ```env
     GEMINI_API_KEY=your_api_key_here
     ```

### Running the App
1. Start the backend server:
   ```bash
   npm run server
   ```
2. Start the frontend development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📂 Project Structure
- `/src`: React frontend (Pages, Components, Assets, Styles).
- `/server`: Express backend and AI Agent logic.
  - `/agents`: Multi-agent implementation (Orchestrator, Health, Tax, FIRE).
  - `/utils`: AI integration utilities.

## 📝 License
MIT
