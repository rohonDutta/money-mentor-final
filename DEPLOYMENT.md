# 🚀 Deployment Guide — AI Money Mentor

To make your submission stand out, having a live working link is highly recommended. Here is how to deploy both the Frontend and the Backend.

---

## 🏆 100% FREE & Unified Path (Recommended)
You can deploy both the Frontend and Backend on **Vercel** as a single project!

### Steps for Unified Vercel Deployment:
1.  **Vercel Dashboard**: Click **Add New** > **Project**.
2.  **Connect GitHub**: Select your `ai-money-mentor` repo.
3.  **Configure Project**:
    - **Framework Preset**: `Vite` (It should detect this automatically).
    - **Root Directory**: Leave as `./`.
4.  **Environment Variables**:
    - Add `GEMINI_API_KEY`: `(Your actual Gemini API Key from Google AI Studio)`.
    - *(Note: You don't need `VITE_API_BASE_URL` anymore as they share the same domain!)*
5.  **Click "Deploy"**.

**Your entire app (UI + AI Agents) is now live on a single Vercel link!** 🚀🔥

---

## 2. Deploy the Frontend (React App)
We recommend **Vercel** or **Netlify** for the frontend.

### Using Vercel:
1.  Create a free account on [Vercel.com](https://vercel.com/).
2.  Click **Add New** > **Project**.
3.  Connect your GitHub repository.
4.  **Before clicking Deploy**, find the **Environment Variables** section:
    - Add `VITE_API_BASE_URL`: `(The Backend URL you copied from Step 1)`
5.  **Build Settings**: The defaults for Vite (Build: `npm run build`, Output: `dist`) should work automatically.
6.  Click **Deploy**. You now have a live link!

---

## 3. Update the Frontend Code (If needed)
In your `vite.config.js`, you are currently proxying to `localhost:3001`. For the production link to work perfectly, ensure your API calls in the code (e.g., in `HealthScore.jsx`) use the production URL when available.

**Pro Tip**: The easiest way is to use an environment variable in your React code:
```js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
// Use API_URL in your fetch() calls
```

---

## 4. Final Verification
- [ ] Open your live Vercel link.
- [ ] Try taking a Health Score test.
- [ ] Ensure the AI insights load (this confirms the Frontend is talking to the Backend).

---

## 🏗️ Alternative Hosting Options

If you prefer different platforms, here are the best alternatives:

### For Backend (API):
*   **Railway.app**: Extremely fast setup ($5 free credit). Ideal for Node.js apps.
    *   *Setup*: Connect GitHub > Add Variables > Deploy.
*   **Google Cloud Run**: Professional grade. Best if you want to stay in the Google ecosystem (fitting for a Gemini app).
*   **Fly.io**: Good for low-latency globally, but requires more terminal setup.

### For Frontend (UI):
*   **Netlify**: A direct alternative to Vercel. Works identically (Connect GitHub > Deploy).
*   **Firebase Hosting**: Part of Google's Firebase suite. Very reliable and free for small projects.
*   **GitHub Pages**: Completely free, but requires a small trick for React Router (use `HashRouter` instead of `BrowserRouter` if you hit 404s on page refresh).

**Regardless of the site you choose, remember to always set your `GEMINI_API_KEY` in the platform's "Environment Variables" settings!** �️
