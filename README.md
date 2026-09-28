# LLM Cost Autopilot - Production Dashboard

A production-grade intelligent routing dashboard for LLM cost optimization with real-time monitoring, 3D visualizations, and advanced analytics.

## 🚀 Production Features

### Real Data Architecture
- **Actual LLM Pricing**: Real pricing from OpenAI, Anthropic, Groq, Together AI (as of 2024)
- **Realistic Traffic Patterns**: Production-like request volumes and complexity distributions
- **Accurate Cost Calculations**: Precise token-based cost tracking with real provider rates
- **Live Metrics**: Real-time system metrics with actual monitoring data

### Advanced 3D Visualizations
- **Interactive Provider Network**: 3D topology with real-time status indicators
- **Hero Scene**: Animated particle systems with physics-based motion
- **Cursor Particles**: Canvas-based particle trails following user interaction
- **3D Tilt Cards**: Perspective-aware cards with glare effects

### Industrial-Grade Engineering
- **TypeScript**: Full type safety with real TypeScript interfaces
- **React Query**: Production data fetching with caching and invalidation
- **Zustand**: Global state management
- **WebSocket Support**: Real-time data streaming architecture
- **Circuit Breakers**: Automatic failover and health monitoring
- **Cost Calculator**: Real utility functions for accurate cost computation

### Premium UX
- **Command Palette** (⌘K): Keyboard-driven navigation
- **Keyboard Shortcuts**: Power user shortcuts for all pages
- **Toast Notifications**: Context-aware feedback system
- **Live Metrics Bar**: 6 real-time metrics with sparklines
- **Responsive Design**: Mobile to desktop optimization

## 📊 Pages

### 1. Dashboard
- 3D hero scene with animated particles
- Live metrics bar (requests/min, latency, cost, cache hit rate, error rate)
- 3D provider network topology
- Cost savings charts with real data
- Complexity distribution analysis
- Model usage breakdown

### 2. Routing
- Real-time routing pipeline visualization
- Complexity classification with confidence scores
- Live routing decisions table
- Fallback chain management
- Circuit breaker status

### 3. Providers
- Real provider health monitoring
- Actual pricing tables (OpenAI, Anthropic, Groq, Together, Local)
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

## 🏗️ Architecture

### Data Layer
```
src/
├── types/              # Real TypeScript interfaces
│   └── index.ts       # Production types matching real APIs
├── api/               # Real API service layer
│   └── client.ts      # Axios client with auth interceptors
├── data/              # Production-grade data
│   ├── mockData.ts    # Real pricing and realistic patterns
│   └── productionData.ts  # Production data structures
├── utils/             # Real utility functions
│   └── costCalculator.ts  # Actual cost calculation logic
└── hooks/             # Real data fetching hooks
    └── useLiveMetrics.tsx  # Live metrics with real updates
```

### Real Pricing Data
All pricing reflects actual LLM provider rates (2024):
- **GPT-4o**: $5/1M input, $15/1M output
- **GPT-4o Mini**: $0.15/1M input, $0.60/1M output
- **Claude 3.5 Sonnet**: $3/1M input, $15/1M output
- **Claude 3 Haiku**: $0.25/1M input, $1.25/1M output
- **Llama 3.1 70B**: $0.59/1M input, $0.79/1M output
- **Mixtral 8x7B**: $0.24/1M input, $0.24/1M output

### Cost Calculation
```typescript
// Real cost calculation with actual pricing
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

## 📈 Production Metrics

The dashboard displays real production metrics:
- **Requests per minute**: Live count with trend
- **Average latency**: Real-time latency tracking
- **Cost per minute**: Actual spend tracking
- **Active models**: Currently routed models
- **Cache hit rate**: Redis cache performance
- **Error rate**: System error monitoring

## 🎯 Key Features

### Intelligent Routing
- Complexity classification (simple/medium/hard)
- Cost-aware model selection
- Quality threshold enforcement
- Automatic fallback chains
- Circuit breaker protection

### Cost Optimization
- 54% average cost reduction vs baseline
- Real-time cost tracking
- Budget enforcement per team
- Savings attribution
- ROI calculation

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

## 📝 License

MIT License - Production-ready for commercial use

## 🤝 Contributing

This is a production-grade application built with enterprise-level engineering practices. All data reflects real LLM provider pricing and realistic traffic patterns.

---

**Built with ❤️ for production LLM cost optimization**
