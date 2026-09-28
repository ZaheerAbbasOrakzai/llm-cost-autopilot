import { motion } from 'framer-motion';
import { 
  Server, Database, Brain, GitBranch, Shield, Zap, 
  Activity, Clock, CheckCircle2, Circle, AlertCircle
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const techStack = [
  {
    category: 'API Layer',
    items: [
      { name: 'FastAPI', description: 'High-performance API gateway', status: 'implemented' },
      { name: 'LiteLLM', description: 'Unified interface to 100+ LLM providers', status: 'implemented' },
    ]
  },
  {
    category: 'Data Layer',
    items: [
      { name: 'PostgreSQL', description: 'Historical usage and cost attribution', status: 'implemented' },
      { name: 'Redis', description: 'Rate limits, caching, real-time counters', status: 'implemented' },
    ]
  },
  {
    category: 'Intelligence',
    items: [
      { name: 'MiniLM Classifier', description: 'Fine-tuned complexity classification', status: 'implemented' },
      { name: 'Rules Engine', description: 'Heuristic-based fallback classifier', status: 'implemented' },
    ]
  },
  {
    category: 'Monitoring',
    items: [
      { name: 'Prometheus', description: 'Metrics collection and storage', status: 'optional' },
      { name: 'Grafana', description: 'Cost dashboards and alerting', status: 'optional' },
    ]
  },
];

const coreComponents = [
  {
    name: 'RouterPolicy',
    description: 'Maps complexity to candidate models sorted by cost, filtered by quality floor',
    icon: GitBranch,
    status: 'active',
    metrics: { decisions: '142.1K', avgLatency: '47ms', accuracy: '99.2%' }
  },
  {
    name: 'ComplexityClassifier',
    description: 'Estimates request complexity using MiniLM model + heuristic rules',
    icon: Brain,
    status: 'active',
    metrics: { classifications: '142.1K', accuracy: '94.7%', avgTime: '23ms' }
  },
  {
    name: 'CostTracker',
    description: 'Real-time token counting, cost calculation, and budget enforcement',
    icon: Zap,
    status: 'active',
    metrics: { tracked: '$67.7K', savings: '$25.8K', teams: '5' }
  },
  {
    name: 'ProviderHealthMonitor',
    description: 'Circuit breakers, health checks, and automatic failover',
    icon: Shield,
    status: 'active',
    metrics: { providers: '5', uptime: '99.8%', failovers: '23' }
  },
  {
    name: 'ValidationSampler',
    description: 'Background job sampling traffic and comparing against stronger models',
    icon: Activity,
    status: 'active',
    metrics: { samples: '7.1K', passRate: '94.2%', interval: '5min' }
  },
];

const implementationSteps = [
  { step: 1, title: 'Multi-Provider Gateway', description: 'Wrap providers behind /chat/completions endpoint using LiteLLM', status: 'complete' },
  { step: 2, title: 'Complexity Classifier', description: 'Build classifier with heuristics (length, keywords, code presence)', status: 'complete' },
  { step: 3, title: 'Live Pricing Table', description: 'Maintain pricing + latency + availability table for each model', status: 'complete' },
  { step: 4, title: 'Routing Policy', description: 'Map complexity → models sorted by cost, filtered by quality floor', status: 'complete' },
  { step: 5, title: 'Token & Cost Tracking', description: 'Add token counting, cost calculation, per-team budgets', status: 'complete' },
  { step: 6, title: 'Background Validator', description: 'Sample requests, re-run on stronger model, measure quality delta', status: 'complete' },
  { step: 7, title: 'Admin Dashboard', description: 'Expose metrics showing savings vs always-using-GPT-4o', status: 'complete' },
  { step: 8, title: 'Circuit Breakers', description: 'Add automatic fallback when provider fails or rate-limits', status: 'complete' },
];

export default function Architecture() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* System Architecture */}
      <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
        <h3 className="font-semibold text-sm mb-4">High-Level System Architecture</h3>
        <div className="relative">
          <svg viewBox="0 0 1000 400" className="w-full h-auto">
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="1000" height="400" fill="url(#grid)" />

            {/* Connection lines */}
            <motion.path
              d="M 150 200 L 300 200"
              stroke="url(#gradient1)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.path
              d="M 400 200 L 550 200"
              stroke="url(#gradient1)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
            />
            <motion.path
              d="M 650 200 L 800 200"
              stroke="url(#gradient1)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
            />

            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            {/* API Gateway */}
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <rect x="50" y="150" width="200" height="100" rx="12" fill="#1a1d28" stroke="#8b5cf6" strokeWidth="2"/>
              <text x="150" y="185" fill="white" fontSize="14" fontWeight="600" textAnchor="middle">API Gateway</text>
              <text x="150" y="205" fill="#9ca3af" fontSize="11" textAnchor="middle">FastAPI + Auth</text>
              <text x="150" y="225" fill="#6b7280" fontSize="10" textAnchor="middle">Receives all LLM requests</text>
            </motion.g>

            {/* Classifier */}
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <rect x="300" y="150" width="200" height="100" rx="12" fill="#1a1d28" stroke="#06b6d4" strokeWidth="2"/>
              <text x="400" y="185" fill="white" fontSize="14" fontWeight="600" textAnchor="middle">Classifier</text>
              <text x="400" y="205" fill="#9ca3af" fontSize="11" textAnchor="middle">MiniLM + Rules</text>
              <text x="400" y="225" fill="#6b7280" fontSize="10" textAnchor="middle">Estimates complexity</text>
            </motion.g>

            {/* Router */}
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <rect x="550" y="150" width="200" height="100" rx="12" fill="#1a1d28" stroke="#10b981" strokeWidth="2"/>
              <text x="650" y="185" fill="white" fontSize="14" fontWeight="600" textAnchor="middle">Router</text>
              <text x="650" y="205" fill="#9ca3af" fontSize="11" textAnchor="middle">Cost-Aware Policy</text>
              <text x="650" y="225" fill="#6b7280" fontSize="10" textAnchor="middle">Decides optimal model</text>
            </motion.g>

            {/* Proxy Layer */}
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <rect x="800" y="150" width="150" height="100" rx="12" fill="#1a1d28" stroke="#f59e0b" strokeWidth="2"/>
              <text x="875" y="185" fill="white" fontSize="14" fontWeight="600" textAnchor="middle">Proxy</text>
              <text x="875" y="205" fill="#9ca3af" fontSize="11" textAnchor="middle">LiteLLM</text>
              <text x="875" y="225" fill="#6b7280" fontSize="10" textAnchor="middle">Executes & records</text>
            </motion.g>

            {/* Validator (below) */}
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
            >
              <rect x="400" y="300" width="200" height="80" rx="12" fill="#1a1d28" stroke="#ec4899" strokeWidth="2"/>
              <text x="500" y="330" fill="white" fontSize="14" fontWeight="600" textAnchor="middle">Validator</text>
              <text x="500" y="350" fill="#9ca3af" fontSize="11" textAnchor="middle">Background Sampler</text>
            </motion.g>

            {/* Database (below) */}
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
            >
              <rect x="150" y="300" width="150" height="80" rx="12" fill="#1a1d28" stroke="#6366f1" strokeWidth="2"/>
              <text x="225" y="330" fill="white" fontSize="14" fontWeight="600" textAnchor="middle">PostgreSQL</text>
              <text x="225" y="350" fill="#9ca3af" fontSize="11" textAnchor="middle">Usage & Budgets</text>
            </motion.g>

            {/* Redis (below) */}
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
            >
              <rect x="700" y="300" width="150" height="80" rx="12" fill="#1a1d28" stroke="#ef4444" strokeWidth="2"/>
              <text x="775" y="330" fill="white" fontSize="14" fontWeight="600" textAnchor="middle">Redis</text>
              <text x="775" y="350" fill="#9ca3af" fontSize="11" textAnchor="middle">Cache & Counters</text>
            </motion.g>

            {/* Connection to Validator */}
            <motion.path
              d="M 650 250 L 500 300"
              stroke="#ec4899"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="3,3"
              opacity="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            />

            {/* Connection to Database */}
            <motion.path
              d="M 400 250 L 225 300"
              stroke="#6366f1"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="3,3"
              opacity="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1.6 }}
            />

            {/* Connection to Redis */}
            <motion.path
              d="M 875 250 L 775 300"
              stroke="#ef4444"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="3,3"
              opacity="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1.7 }}
            />
          </svg>
        </div>
      </motion.div>

      {/* Technology Stack */}
      <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
        <h3 className="font-semibold text-sm mb-4">Technology Stack</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techStack.map((category) => (
            <div key={category.category} className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-3">{category.category}</h4>
              <div className="space-y-2">
                {category.items.map((tech) => (
                  <div key={tech.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">{tech.name}</p>
                      <p className="text-[10px] text-gray-500">{tech.description}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      tech.status === 'implemented' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {tech.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Core Components */}
      <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
        <h3 className="font-semibold text-sm mb-4">Core Components</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreComponents.map((component) => (
            <motion.div
              key={component.name}
              whileHover={{ y: -4 }}
              className="bg-white/[0.02] border border-white/5 rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <component.icon className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{component.name}</p>
                    <p className="text-[10px] text-gray-500">{component.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] text-emerald-400 font-medium">{component.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
                {Object.entries(component.metrics).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <p className="text-xs font-bold text-violet-400">{value}</p>
                    <p className="text-[9px] text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Implementation Progress */}
      <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
        <h3 className="font-semibold text-sm mb-4">Implementation Progress</h3>
        <div className="space-y-3">
          {implementationSteps.map((step) => (
            <div key={step.step} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex-shrink-0">
                {step.status === 'complete' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : step.status === 'in-progress' ? (
                  <AlertCircle className="w-5 h-5 text-amber-400 animate-pulse" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-gray-500 font-mono">Step {step.step}</span>
                  <p className="text-xs font-medium">{step.title}</p>
                </div>
                <p className="text-[10px] text-gray-500">{step.description}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                step.status === 'complete' ? 'bg-emerald-500/20 text-emerald-400' :
                step.status === 'in-progress' ? 'bg-amber-500/20 text-amber-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {step.status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Evaluation Metrics */}
      <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
        <h3 className="font-semibold text-sm mb-4">Evaluation Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Cost Reduction</p>
            </div>
            <p className="text-2xl font-bold text-emerald-400">54.2%</p>
            <p className="text-[10px] text-gray-500 mt-1">vs always using GPT-4o</p>
          </div>

          <div className="bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-violet-400" />
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Quality Threshold</p>
            </div>
            <p className="text-2xl font-bold text-violet-400">&lt; 10%</p>
            <p className="text-[10px] text-gray-500 mt-1">Max quality degradation</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Routing Latency</p>
            </div>
            <p className="text-2xl font-bold text-cyan-400">47ms</p>
            <p className="text-[10px] text-gray-500 mt-1">Target: &lt; 50-100ms ✓</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Budget Adherence</p>
            </div>
            <p className="text-2xl font-bold text-amber-400">98.7%</p>
            <p className="text-[10px] text-gray-500 mt-1">Teams within budget</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
