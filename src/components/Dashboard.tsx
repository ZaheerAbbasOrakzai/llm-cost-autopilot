import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingDown, Zap, Target, ArrowUpRight, ArrowDownRight,
  Activity, Clock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { costHistory, modelUsageData, complexityDistribution, routingDecisions } from '../data/mockData';

const stats = [
  { label: 'Total Savings', value: '$12,847', change: '+23.5%', positive: true, icon: DollarSign, color: 'from-emerald-500 to-emerald-400' },
  { label: 'Cost Reduction', value: '54.2%', change: '+5.1%', positive: true, icon: TrendingDown, color: 'from-violet-500 to-violet-400' },
  { label: 'Requests Routed', value: '142.1K', change: '+12.3%', positive: true, icon: Zap, color: 'from-cyan-500 to-cyan-400' },
  { label: 'Avg Latency', value: '187ms', change: '-8.2%', positive: true, icon: Clock, color: 'from-amber-500 to-amber-400' },
];

const pieData = [
  { name: 'Simple', value: 52, color: '#10b981' },
  { name: 'Medium', value: 31, color: '#f59e0b' },
  { name: 'Hard', value: 17, color: '#ef4444' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative overflow-hidden bg-[#12141c] border border-white/5 rounded-2xl p-5 group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.positive ? (
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-400" />
                  )}
                  <span className={`text-xs font-medium ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Cost Savings Chart */}
        <motion.div variants={item} className="xl:col-span-2 bg-[#12141c] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-sm">Cost Savings Over Time</h3>
              <p className="text-xs text-gray-500 mt-1">Autopilot vs Baseline (always GPT-4o)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                <span className="text-[10px] text-gray-400">Autopilot</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                <span className="text-[10px] text-gray-400">Baseline</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={costHistory}>
              <defs>
                <linearGradient id="autopilotGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6b7280" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" stroke="#4b5563" fontSize={10} />
              <YAxis stroke="#4b5563" fontSize={10} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ background: '#1a1d28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Area type="monotone" dataKey="baseline" stroke="#6b7280" fill="url(#baselineGradient)" strokeWidth={2} />
              <Area type="monotone" dataKey="autopilot" stroke="#8b5cf6" fill="url(#autopilotGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Complexity Distribution */}
        <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
          <h3 className="font-semibold text-sm mb-1">Request Complexity</h3>
          <p className="text-xs text-gray-500 mb-4">Distribution of classified requests</p>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1a1d28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {complexityDistribution.map((tier) => (
              <div key={tier.tier} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                  <span className="text-xs text-gray-300">{tier.tier}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium">{tier.percentage}%</span>
                  <span className="text-[10px] text-gray-500 ml-2">({(tier.count / 1000).toFixed(1)}K)</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Model Usage */}
        <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
          <h3 className="font-semibold text-sm mb-1">Model Usage Distribution</h3>
          <p className="text-xs text-gray-500 mb-4">Requests routed to each model this month</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={modelUsageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
              <XAxis type="number" stroke="#4b5563" fontSize={10} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
              <YAxis dataKey="name" type="category" stroke="#4b5563" fontSize={10} width={100} />
              <Tooltip
                contentStyle={{ background: '#1a1d28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value: number) => [`${(value/1000).toFixed(1)}K requests`, 'Requests']}
              />
              <Bar dataKey="requests" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Routing Decisions */}
        <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Recent Routing Decisions</h3>
              <p className="text-xs text-gray-500 mt-0.5">Latest model selection decisions</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-lg">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-medium text-emerald-400">Live</span>
            </div>
          </div>
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2">
            {routingDecisions.slice(0, 6).map((decision) => (
              <div key={decision.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                  decision.complexity === 'simple' ? 'bg-emerald-500/20 text-emerald-400' :
                  decision.complexity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {decision.complexity[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{decision.requestPreview}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">→ {decision.routedTo} • {decision.tokens} tokens</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-emerald-400">${decision.cost.toFixed(4)}</p>
                  {decision.saved > 0 && (
                    <p className="text-[10px] text-gray-500">saved ${decision.saved.toFixed(4)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
