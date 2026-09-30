# EcoSphereai-Frontend

> **EcoSphere** — Production-Ready AI Sustainability Tracker & Financial Optimization Engine (Frontend Client)

Built with **React 19**, **Vite**, **Tailwind CSS**, **Recharts**, and **Framer Motion**.

---

## 🌐 Live Deployed Application

- **Live Frontend**: [https://eco-sphereai-frontend.vercel.app](https://eco-sphereai-frontend.vercel.app)
- **Direct Login**: [https://eco-sphereai-frontend.vercel.app/login](https://eco-sphereai-frontend.vercel.app/login)
- **Connected Backend API**: [https://ecosphereai-backend-2.onrender.com/api](https://ecosphereai-backend-2.onrender.com/api)
- **Backend Health Check**: [https://ecosphereai-backend-2.onrender.com/api/health](https://ecosphereai-backend-2.onrender.com/api/health)

---

## 🌟 Key Features

- 📊 **Dynamic Sustainability Dashboard**: Real-time EcoScore gauge, carbon footprint counters, weekly breakdown, and environmental badges.
- 🚗 **Multi-Modal Activity Tracking**: Log commute distances across car, bike, bus, metro, train, shared transit, and walking with avoided emission metrics.
- ⚡ **Home Energy Tracking**: Monitor electricity usage (kWh), AC & fan hours, solar generation, and calculate your renewable energy offset %.
- 🥗 **Diet & Food Impact**: Track vegan, vegetarian, mixed, and meat-heavy meals with local & organic sourcing tags.
- ♻️ **Waste Management**: Record plastic, recycled, compost, paper, and e-waste, complete with net carbon offset calculators.
- 💰 **Financial Optimization Engine**: Uncover practical, INR (₹) monthly & annual savings by adopting greener alternatives.
- 🎯 **Target Goals & Milestones**: Custom reduction goals, visual progress bars, and celebration confetti upon goal completion.
- 🤖 **Interactive AI Sustainability Advisor**: Context-aware ecological tips, customized weekly challenges, and live chat assistant.
- 🏆 **Gamification & Badges**: 5 mastery tiers, streak tracking, and unlockable achievement milestones.
- 📈 **Exportable Reports & Analytics**: Daily, weekly, monthly, and annual carbon audit reports with CSV download and print support.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Default configuration points to your deployed Render backend:
```env
VITE_API_URL=https://ecosphereai-backend-2.onrender.com/api
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.

---

## 🌐 Deployment Configuration (Vercel)

- **Framework Preset**: Vite
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://ecosphereai-backend-2.onrender.com/api`
  - `VITE_SUPABASE_URL`: `https://ebqetmupbnaxmhpyjkjt.supabase.co`
  - `VITE_SUPABASE_ANON_KEY`: `sb_publishable_PpsKYcOirYy68ioEwzv0pw_Stf4Wokx`
- **SPA Routing**: Handled via `vercel.json` rewrites to `/index.html`.
