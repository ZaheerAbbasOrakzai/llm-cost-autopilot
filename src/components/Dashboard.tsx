import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingDown, Zap, Target, ArrowUpRight, ArrowDownRight,
  Activity, Clock, Radio, Cpu, HardDrive, Wifi
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { costHistory, modelUsageData, complexityDistribution, routingDecisions } from '../data/mockData';
import HeroScene3D from './three/HeroScene3D';
import ProviderNetwork3D from './three/ProviderNetwork3D';
import { TiltCard, HoloCard } from './ui/Effects';
import { useLiveMetrics, Sparkline } from '../hooks/useLiveMetrics';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const liveMetrics = useLiveMetrics();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* 3D Hero Section */}
      <motion.div variants={item} className="relative overflow-hidden rounded-2xl">
        <HeroScene3D />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-5xl font-bold gradient-text mb-2"
            >
              LLM Cost Autopilot
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-gray-400 text-sm md:text-base"
            >
              Intelligent routing • 54% cost reduction • Real-time optimization
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Live Metrics Bar */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          { label: 'Requests/min', value: liveMetrics.requestsPerMin.value, unit: '', icon: Radio, color: 'text-violet-400', trend: liveMetrics.requestsPerMin.trend, trendColor: '#8b5cf6' },
          { label: 'Avg Latency', value: liveMetrics.avgLatency.value, unit: 'ms', icon: Clock, color: 'text-cyan-400', trend: liveMetrics.avgLatency.trend, trendColor: '#06b6d4' },
          { label: 'Cost/min', value: liveMetrics.costPerMin.value, unit: '$', icon: DollarSign, color: 'text-emerald-400', trend: liveMetrics.costPerMin.trend, trendColor: '#10b981' },
          { label: 'Active Models', value: liveMetrics.activeModels.value, unit: '', icon: Cpu, color: 'text-amber-400', trend: liveMetrics.activeModels.trend, trendColor: '#f59e0b' },
          { label: 'Cache Hit', value: liveMetrics.cacheHitRate.value, unit: '%', icon: HardDrive, color: 'text-pink-400', trend: liveMetrics.cacheHitRate.trend, trendColor: '#ec4899' },
          { label: 'Error Rate', value: liveMetrics.errorRate.value, unit: '%', icon: Wifi, color: 'text-red-400', trend: liveMetrics.errorRate.trend, trendColor: '#ef4444' },
        ].map((metric) => (
          <TiltCard key={metric.label} className="bg-[#12141c] border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
              <span className={`text-[10px] font-medium ${metric.trend.length > 1 && metric.trend[metric.trend.length - 1] > metric.trend[0] ? 'text-emerald-400' : 'text-red-400'}`}>
                {metric.label.includes('Error') || metric.label.includes('Latency') || metric.label.includes('Cost')
                  ? (metric.trend[metric.trend.length - 1] < metric.trend[0] ? '↓' : '↑')
                  : (metric.trend[metric.trend.length - 1] > metric.trend[0] ? '↑' : '↓')
                }
              </span>
            </div>
            <p className="text-lg font-bold">
              {metric.unit === '$' && '$'}
              {metric.value.toLocaleString()}
              {metric.unit && metric.unit !== '$' && metric.unit}
            </p>
            <div className="mt-2 h-8">
              <Sparkline data={metric.trend} color={metric.trendColor} height={32} />
            </div>
          </TiltCard>
        ))}
      </motion.div>

      {/* Main Stats with 3D Tilt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Savings', value: '$12,847', change: '+23.5%', positive: true, icon: DollarSign, color: 'from-emerald-500 to-emerald-400' },
          { label: 'Cost Reduction', value: '54.2%', change: '+5.1%', positive: true, icon: TrendingDown, color: 'from-violet-500 to-violet-400' },
          { label: 'Requests Routed', value: '142.1K', change: '+12.3%', positive: true, icon: Zap, color: 'from-cyan-500 to-cyan-400' },
          { label: 'Avg Latency', value: '187ms', change: '-8.2%', positive: true, icon: Clock, color: 'from-amber-500 to-amber-400' },
        ].map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <TiltCard className="h-full">
              <HoloCard className="h-full">
                <div className="p-5">
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
                </div>
              </HoloCard>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      {/* 3D Provider Network */}
      <motion.div variants={item}>
        <HoloCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-sm">Provider Network Topology</h3>
                <p className="text-xs text-gray-500 mt-0.5">Interactive 3D visualization • Drag to rotate</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-lg">
                <Activity className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-medium text-emerald-400">5 Providers Active</span>
              </div>
            </div>
            <ProviderNetwork3D />
          </div>
        </HoloCard>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Cost Savings Chart */}
        <motion.div variants={item} className="xl:col-span-2">
          <HoloCard>
            <div className="p-6">
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
            </div>
          </HoloCard>
        </motion.div>

        {/* Complexity Distribution */}
        <motion.div variants={item}>
          <HoloCard>
            <div className="p-6">
              <h3 className="font-semibold text-sm mb-1">Request Complexity</h3>
              <p className="text-xs text-gray-500 mb-4">Distribution of classified requests</p>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={complexityDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="percentage"
                    >
                      {complexityDistribution.map((entry, index) => (
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
            </div>
          </HoloCard>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Model Usage */}
        <motion.div variants={item}>
          <HoloCard>
            <div className="p-6">
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
            </div>
          </HoloCard>
        </motion.div>

        {/* Recent Routing Decisions */}
        <motion.div variants={item}>
          <HoloCard>
            <div className="p-6">
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
            </div>
          </HoloCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
