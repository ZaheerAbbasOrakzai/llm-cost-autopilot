# LLM Cost Autopilot

An interactive frontend prototype for exploring LLM cost routing, estimates, and dashboard concepts.

> **Demo only:** this repository contains a React/Vite frontend. Its dashboard, provider status, request waterfall, costs, budgets, and alerts use hard-coded or simulated sample data. It does not connect to LLM providers, route real requests, monitor real infrastructure, persist settings, or enforce budgets. Do not use its estimates for billing or operational decisions.

Provider/model rates in the sample catalog are illustrative historical reference values, not a maintained price feed. Verify current provider pricing before using the cost calculator.

## Features

- Interactive dashboard and routing visualizations populated with sample values
- Example provider catalog, cost calculation helpers, and routing-policy screens
- Simulated request waterfall and playground (no network calls)
- 3D visualizations, charts, command palette, and keyboard navigation
- Lazy-loaded views and visualizations to reduce initial JavaScript

## 📊 Pages

### 1. Dashboard
- 3D hero scene with animated particles
- Simulated metrics bar (requests/min, latency, cost, cache hit rate, error rate)
- 3D provider network topology
- Cost savings charts with sample data
- Complexity distribution analysis
- Model usage breakdown

### 2. Routing
- Simulated routing pipeline visualization
- Complexity classification with confidence scores
- Sample routing decisions table
- Fallback chain management
- Circuit breaker status

### 3. Providers
- Sample provider health and pricing data (OpenAI, Anthropic, Groq, Together, Local)
- Model comparison with quality scores
- Latency and uptime tracking

### 4. Teams & Budgets
- Real budget tracking with sparklines
- Spend attribution by team
- Budget alerts and thresholds
- Cost optimization metrics

### 5. Validation
- Quality validation radar charts
- Delta distribution analysis
- Pass/fail tracking
- LLM-as-judge evaluation scores

### 6. Cost Analysis
- Monthly cost breakdown by complexity tier
- Provider cost distribution
- Cost forecasting with confidence intervals
- ROI metrics and payback period
- Savings source analysis

### 7. API Playground
- Interactive routing test environment
- Real-time pipeline visualization
- Sample requests with actual use cases
- Detailed routing decision output

### 8. Settings
- Routing policy configuration
- System controls (autopilot, validation, circuit breakers)
- Budget enforcement settings
- Provider configuration

## 🏗️ Frontend Architecture

### Data Layer
```
src/
├── types/              # Real TypeScript interfaces
│   └── index.ts       # Frontend data types
├── api/               # Unused API client scaffold; no backend is included
├── data/              # Static sample data, not production telemetry
├── utils/             # Cost-estimation helpers using the sample price table
└── hooks/             # Simulated metrics and request feed
```

### Sample Price Assumptions
These values are examples from an old price snapshot and are not guaranteed current:
- **GPT-4o**: $5/1M input, $15/1M output
- **GPT-4o Mini**: $0.15/1M input, $0.60/1M output
- **Claude 3.5 Sonnet**: $3/1M input, $15/1M output
- **Claude 3 Haiku**: $0.25/1M input, $1.25/1M output
- **Llama 3.1 70B**: $0.59/1M input, $0.79/1M output
- **Mixtral 8x7B**: $0.24/1M input, $0.24/1M output

### Cost Calculation
```typescript
// Estimate using the bundled example price table
const cost = calculateCost('gpt-4o', 1000, 500);
// Returns: { inputCost: 0.005, outputCost: 0.0075, totalCost: 0.0125 }
```

## ⌨️ Keyboard Shortcuts

- `⌘K` / `Ctrl+K` - Command palette
- `⌘/` / `Ctrl+/` - Keyboard shortcuts overlay
- `⌘B` / `Ctrl+B` - Toggle sidebar
- `G + D` - Go to Dashboard
- `G + R` - Go to Routing
- `G + P` - Go to Providers
- `G + T` - Go to Teams
- `G + V` - Go to Validation
- `G + C` - Go to Cost Analysis
- `G + A` - Go to API Playground
- `G + S` - Go to Settings
- `Esc` - Close overlays

## 🎨 Design System

### Colors
- Primary: Violet (#8b5cf6)
- Secondary: Cyan (#06b6d4)
- Success: Emerald (#10b981)
- Warning: Amber (#f59e0b)
- Error: Red (#ef4444)

### Effects
- Glass morphism with backdrop blur
- Holographic borders on hover
- 3D tilt cards with perspective
- Animated gradient text
- Particle systems with physics
- Smooth page transitions

## 📦 Tech Stack

- **React 18** with TypeScript
- **Vite** for blazing fast builds
- **Tailwind CSS 4** for styling
- **Framer Motion** for animations
- **Three.js** + React Three Fiber for 3D
- **Recharts** for data visualization
- **React Query** for data fetching
- **Zustand** for state management
- **Lucide React** for icons

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Environment Variables

```env
VITE_API_URL=http://localhost:8000  # Backend API URL
```

## 📈 Demo Metrics

The dashboard animates simulated values for requests/minute, latency, cost/minute, active models, cache hit rate, and error rate. These numbers do not come from a running service.

## 🎯 Key Features

### Intelligent Routing
- Complexity classification (simple/medium/hard)
- Cost-aware model selection
- Quality threshold enforcement
- Automatic fallback chains
- Circuit breaker protection

### Cost Optimization
- Illustrative cost comparisons
- Sample budget and savings views
- Input-validated cost and ROI helper functions

### Quality Assurance
- Continuous validation sampling
- LLM-as-judge evaluation
- Quality delta monitoring
- Automatic policy adjustment
- Accuracy tracking

### Monitoring & Alerts
- Real-time system health
- Provider status monitoring
- Budget threshold alerts
- Performance degradation detection
- Circuit breaker notifications

## Backend integration status

No backend, authentication flow, database, live pricing feed, WebSocket service, or provider integration is included. `VITE_API_URL` is only a placeholder for a future backend; setting it does not make this frontend connect to one. A production deployment requires a secure server-side provider integration, credentials kept off the client, real telemetry/storage, and verified pricing.

## 📝 License

MIT License

## 🤝 Contributing

Contributions that clearly distinguish working behavior from demo data are welcome.

---

**Built as an LLM cost-optimization UI prototype**
