import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { 
  Shield, Layers, ArrowDownRight, ArrowUpRight,
  CheckCircle2, AlertTriangle, XCircle, RefreshCw,
  CircuitBoard, Workflow, Eye, Activity, Brain,
  GitBranch, Database
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Line } from 'recharts';
import { costHistory } from '../data/mockData';

// Animated counter component
function AnimatedCounter({ value, prefix = '', suffix = '', duration = 2 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${prefix}${v.toFixed(v >= 100 ? 0 : 1)}${suffix}`);
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    const controls = animate(count, value, { duration, ease: 'easeOut' });
    const unsubscribe = rounded.on('change', (v) => setDisplayValue(v));
    return () => { controls.stop(); unsubscribe(); };
  }, [value, duration]);

  return <span>{displayValue}</span>;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Architecture diagram nodes
const archNodes = [
  { id: 'client', label: 'Client Apps', sublabel: 'API Consumers', icon: Layers, x: 50, y: 50, color: 'from-blue-500 to-blue-400', w: 140 },
  { id: 'gateway', label: 'API Gateway', sublabel: 'FastAPI + Auth', icon: Shield, x: 250, y: 50, color: 'from-violet-500 to-violet-400', w: 140 },
  { id: 'classifier', label: 'Classifier', sublabel: 'MiniLM + Rules', icon: Brain, x: 450, y: 20, color: 'from-cyan-500 to-cyan-400', w: 140 },
  { id: 'router', label: 'Router', sublabel: 'Cost-Aware Policy', icon: GitBranch, x: 450, y: 100, color: 'from-emerald-500 to-emerald-400', w: 140 },
  { id: 'proxy', label: 'Proxy Layer', sublabel: 'LiteLLM Unified', icon: Workflow, x: 650, y: 50, color: 'from-amber-500 to-amber-400', w: 140 },
  { id: 'validator', label: 'Validator', sublabel: 'Background Sampler', icon: Eye, x: 450, y: 190, color: 'from-pink-500 to-pink-400', w: 140 },
  { id: 'postgres', label: 'PostgreSQL', sublabel: 'Usage & Budgets', icon: Database, x: 250, y: 190, color: 'from-indigo-500 to-indigo-400', w: 140 },
  { id: 'redis', label: 'Redis', sublabel: 'Cache & Counters', icon: CircuitBoard, x: 650, y: 190, color: 'from-red-500 to-red-400', w: 140 },
];

const archConnections = [
  { from: 'client', to: 'gateway' },
  { from: 'gateway', to: 'classifier' },
  { from: 'gateway', to: 'router' },
  { from: 'classifier', to: 'router' },
  { from: 'router', to: 'proxy' },
  { from: 'proxy', to: 'validator' },
  { from: 'proxy', to: 'redis' },
  { from: 'validator', to: 'postgres' },
  { from: 'router', to: 'postgres' },
];

// Circuit breaker states
const circuitBreakers = [
  { provider: 'OpenAI', state: 'closed', failures: 0, lastFailure: null, threshold: 5 },
  { provider: 'Anthropic', state: 'closed', failures: 0, lastFailure: null, threshold: 5 },
  { provider: 'Groq', state: 'closed', failures: 1, lastFailure: '2h ago', threshold: 5 },
  { provider: 'Together AI', state: 'half-open', failures: 3, lastFailure: '5 min ago', threshold: 5 },
  { provider: 'Local', state: 'closed', failures: 0, lastFailure: null, threshold: 5 },
];

// Fallback chain visualization
const fallbackChains = [
  {
    complexity: 'simple',
    chain: [
      { model: 'Phi-3 Mini', provider: 'Local', latency: '85ms', status: 'active' },
      { model: 'Llama 3.1 8B', provider: 'Groq', latency: '45ms', status: 'standby' },
      { model: 'GPT-4o Mini', provider: 'OpenAI', latency: '340ms', status: 'standby' },
      { model: 'Claude 3 Haiku', provider: 'Anthropic', latency: '290ms', status: 'standby' },
    ]
  },
  {
    complexity: 'medium',
    chain: [
      { model: 'Llama 3.1 70B', provider: 'Groq', latency: '120ms', status: 'active' },
      { model: 'Mixtral 8x7B', provider: 'Groq', latency: '85ms', status: 'standby' },
      { model: 'Qwen 2 72B', provider: 'Together', latency: '350ms', status: 'standby' },
      { model: 'GPT-4o Mini', provider: 'OpenAI', latency: '340ms', status: 'standby' },
    ]
  },
  {
    complexity: 'hard',
    chain: [
      { model: 'GPT-4o', provider: 'OpenAI', latency: '890ms', status: 'active' },
      { model: 'Claude 3.5 Sonnet', provider: 'Anthropic', latency: '780ms', status: 'standby' },
      { model: 'Llama 3.1 405B', provider: 'Together', latency: '1200ms', status: 'standby' },
    ]
  },
];

const beforeAfterData = [
  { month: 'Oct', before: 18500, after: 18500 },
  { month: 'Nov', before: 22000, after: 19800 },
  { month: 'Dec', before: 25000, after: 16200 },
  { month: 'Jan', before: 28000, after: 12847 },
];

export default function Dashboard() {
  const [activeComplexity, setActiveComplexity] = useState('simple');
  const activeChain = fallbackChains.find(c => c.complexity === activeComplexity);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Hero Stats with Animated Counters */}
      <motion.div variants={item} className="relative overflow-hidden bg-gradient-to-br from-violet-500/10 via-[#12141c] to-cyan-500/10 border border-white/5 rounded-2xl p-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">System Active</span>
            <span className="text-[10px] text-gray-500 ml-2">Last updated: just now</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Monthly Savings</p>
              <p className="text-3xl font-bold gradient-text">
                <AnimatedCounter value={12847} prefix="$" />
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-medium">23.5% vs last month</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Cost Reduction</p>
              <p className="text-3xl font-bold">
                <AnimatedCounter value={54.2} suffix="%" />
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-medium">5.1% improvement</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Requests Today</p>
              <p className="text-3xl font-bold">
                <AnimatedCounter value={8420} />
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Activity className="w-3 h-3 text-cyan-400" />
                <span className="text-[10px] text-cyan-400 font-medium">142 req/min avg</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Avg Routing Latency</p>
              <p className="text-3xl font-bold">
                <AnimatedCounter value={47} suffix="ms" />
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowDownRight className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-medium">8.2% faster</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Before/After Cost Chart */}
      <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-sm">Before vs After Autopilot</h3>
            <p className="text-xs text-gray-500 mt-1">Cost comparison: Always GPT-4o vs Intelligent Routing</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-gray-500" />
              <span className="text-[10px] text-gray-400">Before (GPT-4o only)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-gradient-to-r from-violet-500 to-cyan-400" />
              <span className="text-[10px] text-gray-400">After (Autopilot)</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={beforeAfterData}>
            <defs>
              <linearGradient id="afterGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="month" stroke="#4b5563" fontSize={11} />
            <YAxis stroke="#4b5563" fontSize={10} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{ background: '#1a1d28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
              formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name === 'before' ? 'Before' : 'After']}
            />
            <Bar dataKey="before" fill="#374151" radius={[6, 6, 0, 0]} barSize={40} />
            <Area type="monotone" dataKey="after" stroke="#8b5cf6" fill="url(#afterGradient)" strokeWidth={3} />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/5">
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total Before</p>
            <p className="text-lg font-bold text-gray-400">$93,500</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total After</p>
            <p className="text-lg font-bold gradient-text">$67,694</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Saved</p>
            <p className="text-lg font-bold text-emerald-400">$25,806</p>
          </div>
        </div>
      </motion.div>

      {/* Architecture Diagram */}
      <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-sm">System Architecture</h3>
            <p className="text-xs text-gray-500 mt-0.5">High-level data flow and component interaction</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-500/10 rounded-lg">
            <Layers className="w-3 h-3 text-violet-400" />
            <span className="text-[10px] font-medium text-violet-400">8 Components</span>
          </div>
        </div>

        {/* Architecture SVG Diagram */}
        <div className="relative w-full overflow-x-auto">
          <svg viewBox="0 0 840 260" className="w-full min-w-[700px]" style={{ minHeight: 260 }}>
            {/* Connections */}
            {archConnections.map((conn, i) => {
              const from = archNodes.find(n => n.id === conn.from)!;
              const to = archNodes.find(n => n.id === conn.to)!;
              const fromX = from.x + from.w / 2;
              const fromY = from.y + 30;
              const toX = to.x + to.w / 2;
              const toY = to.y + 30;
              return (
                <g key={i}>
                  <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    x1={fromX} y1={fromY} x2={toX} y2={toY}
                    stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="4 4"
                  />
                  <motion.circle
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    r="3" fill="#8b5cf6"
                  >
                    <animateMotion dur="3s" repeatCount="infinite" path={`M${fromX},${fromY} L${toX},${toY}`} />
                  </motion.circle>
                </g>
              );
            })}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* Nodes */}
            {archNodes.map((node, i) => (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <rect
                  x={node.x} y={node.y} width={node.w} height={60}
                  rx="12" fill="#1a1d28" stroke="rgba(255,255,255,0.08)" strokeWidth="1"
                />
                <foreignObject x={node.x + 10} y={node.y + 10} width="30" height="30">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${node.color} flex items-center justify-center`}>
                    {/* @ts-ignore */}
                    <node.icon className="w-4 h-4 text-white" />
                  </div>
                </foreignObject>
                <text x={node.x + 46} y={node.y + 24} fill="white" fontSize="11" fontWeight="600">{node.label}</text>
                <text x={node.x + 46} y={node.y + 42} fill="#6b7280" fontSize="9">{node.sublabel}</text>
              </motion.g>
            ))}
          </svg>
        </div>
      </motion.div>

      {/* Circuit Breakers & Fallback Chains */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Circuit Breakers */}
        <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Circuit Breakers</h3>
              <p className="text-xs text-gray-500 mt-0.5">Provider health & automatic failover</p>
            </div>
            <RefreshCw className="w-4 h-4 text-gray-500 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div className="space-y-3">
            {circuitBreakers.map((cb) => (
              <motion.div
                key={cb.provider}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    cb.state === 'closed' ? 'bg-emerald-500/15' :
                    cb.state === 'half-open' ? 'bg-amber-500/15' : 'bg-red-500/15'
                  }`}>
                    {cb.state === 'closed' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> :
                     cb.state === 'half-open' ? <AlertTriangle className="w-4 h-4 text-amber-400" /> :
                     <XCircle className="w-4 h-4 text-red-400" />}
                  </div>
                  <div>
                    <p className="text-xs font-medium">{cb.provider}</p>
                    <p className="text-[10px] text-gray-500">
                      {cb.state === 'closed' ? 'Healthy' :
                       cb.state === 'half-open' ? 'Testing recovery' : 'Tripped'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                      {Array.from({ length: cb.threshold }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-4 rounded-full ${
                            i < cb.failures ? 'bg-amber-400' : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-500 ml-1">{cb.failures}/{cb.threshold}</span>
                  </div>
                  {cb.lastFailure && (
                    <p className="text-[10px] text-gray-500 mt-0.5">Last: {cb.lastFailure}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Fallback Chains */}
        <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Fallback Chains</h3>
              <p className="text-xs text-gray-500 mt-0.5">Automatic model failover by complexity</p>
            </div>
          </div>

          {/* Complexity Tabs */}
          <div className="flex gap-2 mb-4">
            {['simple', 'medium', 'hard'].map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveComplexity(tier)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                  activeComplexity === tier
                    ? tier === 'simple' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      tier === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          {/* Chain Visualization */}
          <div className="space-y-2">
            {activeChain?.chain.map((step, i) => (
              <motion.div
                key={step.model}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    step.status === 'active' ? 'bg-violet-500/20 text-violet-400 ring-2 ring-violet-500/30' : 'bg-white/5 text-gray-500'
                  }`}>
                    {i + 1}
                  </div>
                  {i < activeChain.chain.length - 1 && (
                    <div className="w-px h-4 bg-white/10 my-1" />
                  )}
                </div>
                <div className="flex-1 flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <div>
                    <p className={`text-xs font-medium ${step.status === 'active' ? 'text-white' : 'text-gray-400'}`}>{step.model}</p>
                    <p className="text-[10px] text-gray-500">{step.provider} • {step.latency}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    step.status === 'active' ? 'bg-violet-500/20 text-violet-400' : 'bg-white/5 text-gray-500'
                  }`}>
                    {step.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Routing Examples */}
      <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-sm">Smart Routing Examples</h3>
            <p className="text-xs text-gray-500 mt-0.5">Cases where cheap models were correctly chosen vs. cases needing stronger models</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Correct cheap model */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">Correctly Routed to Cheap Model</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Request</span>
                <span className="text-gray-200">"Classify sentiment of review"</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Complexity</span>
                <span className="text-emerald-400 font-medium">Simple</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Routed to</span>
                <span className="text-gray-200">Phi-3 Mini (Local)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cost</span>
                <span className="text-emerald-400 font-medium">$0.00 (Free)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">vs GPT-4o cost</span>
                <span className="text-emerald-400 font-medium">$0.00675 saved</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Quality</span>
                <span className="text-gray-200">82% (threshold: 65%)</span>
              </div>
            </div>
          </div>

          {/* Correctly routed to strong model */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-xs font-medium text-red-400">Correctly Routed to Strong Model</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Request</span>
                <span className="text-gray-200">"Analyze code for vulnerabilities"</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Complexity</span>
                <span className="text-red-400 font-medium">Hard</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Routed to</span>
                <span className="text-gray-200">GPT-4o</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cost</span>
                <span className="text-violet-400 font-medium">$0.056</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Quality</span>
                <span className="text-gray-200">96% (threshold: 88%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Why not cheaper?</span>
                <span className="text-gray-200">Code analysis requires high reasoning</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Live Cost Tracking */}
      <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-sm">Real-Time Cost Tracking</h3>
            <p className="text-xs text-gray-500 mt-0.5">Live spend monitoring with budget enforcement</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-medium text-emerald-400">Live</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={costHistory}>
            <defs>
              <linearGradient id="liveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" stroke="#4b5563" fontSize={10} />
            <YAxis stroke="#4b5563" fontSize={10} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{ background: '#1a1d28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
            />
            <Area type="monotone" dataKey="autopilot" stroke="#8b5cf6" fill="url(#liveGradient)" strokeWidth={2} name="Daily Spend" />
            <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Daily Savings" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
