# EcoSphereai-Frontend

> **EcoSphere** — Production-Ready AI Sustainability Tracker & Financial Optimization Engine (Frontend Client)

Built with **React 19**, **Vite**, **Tailwind CSS**, **Recharts**, and **Framer Motion**.

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

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Set your backend API URL (default is `http://localhost:5000/api`):
```env
VITE_API_URL=http://localhost:5000/api
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

## 🌐 Deploy to Vercel / Netlify

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: Your hosted backend endpoint (e.g. `https://your-backend.onrender.com/api`)
