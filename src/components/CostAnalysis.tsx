import { motion } from 'framer-motion';
import {
  DollarSign, TrendingDown, TrendingUp, Calendar, Target,
  PieChart as PieIcon, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Monthly cost breakdown by model tier
const monthlyBreakdown = [
  { month: 'Aug', simple: 1200, medium: 3400, hard: 8900, total: 13500 },
  { month: 'Sep', simple: 1100, medium: 3200, hard: 9200, total: 13500 },
  { month: 'Oct', simple: 980, medium: 2900, hard: 8800, total: 12680 },
  { month: 'Nov', simple: 850, medium: 2600, hard: 8500, total: 11950 },
  { month: 'Dec', simple: 720, medium: 2300, hard: 8200, total: 11220 },
  { month: 'Jan', simple: 580, medium: 2100, hard: 7800, total: 10480 },
];

// Cost by provider
const providerCosts = [
  { name: 'OpenAI', value: 4200, color: '#10b981' },
  { name: 'Anthropic', value: 2800, color: '#8b5cf6' },
  { name: 'Groq', value: 1900, color: '#06b6d4' },
  { name: 'Together', value: 1200, color: '#f59e0b' },
  { name: 'Local', value: 0, color: '#6b7280' },
];

// Forecast data
const forecastData = [
  { month: 'Feb', actual: 10480, forecast: null, lower: null, upper: null },
  { month: 'Mar', actual: null, forecast: 9800, lower: 8900, upper: 10700 },
  { month: 'Apr', actual: null, forecast: 9200, lower: 8100, upper: 10300 },
  { month: 'May', actual: null, forecast: 8700, lower: 7400, upper: 10000 },
  { month: 'Jun', actual: null, forecast: 8200, lower: 6800, upper: 9600 },
  { month: 'Jul', actual: null, forecast: 7800, lower: 6200, upper: 9400 },
];

// Savings by optimization type
const savingsBreakdown = [
  { type: 'Model Downgrade', savings: 5200, percentage: 42 },
  { type: 'Local Models', savings: 3100, percentage: 25 },
  { type: 'Caching', savings: 2400, percentage: 19 },
  { type: 'Batch Processing', savings: 1200, percentage: 10 },
  { type: 'Token Optimization', savings: 500, percentage: 4 },
];

// ROI metrics
const roiMetrics = [
  { label: 'Monthly Savings', value: '$12,847', change: '+23.5%', positive: true, icon: DollarSign },
  { label: 'Cost per Request', value: '$0.074', change: '-18.2%', positive: true, icon: TrendingDown },
  { label: 'ROI Multiple', value: '4.2x', change: '+0.8x', positive: true, icon: TrendingUp },
  { label: 'Payback Period', value: '2.3 mo', change: '-0.5 mo', positive: true, icon: Target },
];

export default function CostAnalysis() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* ROI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {roiMetrics.map((metric) => (
          <motion.div
            key={metric.label}
            variants={item}
            whileHover={{ y: -4 }}
            className="bg-[#12141c] border border-white/5 rounded-2xl p-5 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">{metric.label}</p>
                <p className="text-2xl font-bold mt-2">{metric.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {metric.positive ? (
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-400" />
                  )}
                  <span className={`text-xs font-medium ${metric.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {metric.change}
                  </span>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center">
                <metric.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cost Breakdown Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Cost by Tier */}
        <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Monthly Cost by Complexity Tier</h3>
              <p className="text-xs text-gray-500 mt-0.5">Stacked breakdown showing optimization impact</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-gray-400">Simple</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-[10px] text-gray-400">Medium</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-[10px] text-gray-400">Hard</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" stroke="#4b5563" fontSize={10} />
              <YAxis stroke="#4b5563" fontSize={10} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: '#1a1d28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Bar dataKey="simple" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="medium" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
              <Bar dataKey="hard" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Cost by Provider */}
        <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Cost Distribution by Provider</h3>
              <p className="text-xs text-gray-500 mt-0.5">Where your LLM budget is allocated</p>
            </div>
            <PieIcon className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={240}>
              <PieChart>
                <Pie
                  data={providerCosts.filter(p => p.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {providerCosts.filter(p => p.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1a1d28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Cost']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {providerCosts.map((provider) => (
                <div key={provider.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: provider.color }} />
                    <span className="text-xs text-gray-300">{provider.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium">
                      {provider.value === 0 ? 'Free' : `$${provider.value.toLocaleString()}`}
                    </span>
                    <span className="text-[10px] text-gray-500 ml-2">
                      {((provider.value / providerCosts.reduce((a, p) => a + p.value, 0)) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Forecast & Savings Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Cost Forecast */}
        <motion.div variants={item} className="xl:col-span-2 bg-[#12141c] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Cost Forecast</h3>
              <p className="text-xs text-gray-500 mt-0.5">Predicted spend based on current trends (95% confidence)</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                <span className="text-[10px] text-gray-400">Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-[10px] text-gray-400">Forecast</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" stroke="#4b5563" fontSize={10} />
              <YAxis stroke="#4b5563" fontSize={10} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: '#1a1d28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value: number) => [`$${value?.toLocaleString() || 'N/A'}`, '']}
              />
              <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confidenceGradient)" />
              <Area type="monotone" dataKey="lower" stroke="none" fill="#0a0b0f" />
              <Area type="monotone" dataKey="actual" stroke="#8b5cf6" fill="none" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
              <Area type="monotone" dataKey="forecast" stroke="#06b6d4" fill="url(#forecastGradient)" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Savings Breakdown */}
        <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Savings Sources</h3>
              <p className="text-xs text-gray-500 mt-0.5">Where cost reductions come from</p>
            </div>
            <Activity className="w-4 h-4 text-gray-500" />
          </div>
          <div className="space-y-4">
            {savingsBreakdown.map((item) => (
              <div key={item.type}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-300">{item.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-emerald-400">${item.savings.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-500">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Total Monthly Savings</span>
              <span className="text-lg font-bold gradient-text">$12,400</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Cost Table */}
      <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-sm">Detailed Cost Analysis</h3>
            <p className="text-xs text-gray-500 mt-0.5">Month-over-month comparison with optimization metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-400">Last 6 months</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Month</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Simple</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Medium</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Hard</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Total</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">MoM Change</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Savings</th>
              </tr>
            </thead>
            <tbody>
              {monthlyBreakdown.map((row, i) => {
                const prevTotal = i > 0 ? monthlyBreakdown[i - 1].total : row.total;
                const change = ((row.total - prevTotal) / prevTotal) * 100;
                const savings = 13500 - row.total;
                return (
                  <tr key={row.month} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 text-xs font-medium">{row.month}</td>
                    <td className="py-3 text-right text-xs text-emerald-400">${row.simple.toLocaleString()}</td>
                    <td className="py-3 text-right text-xs text-amber-400">${row.medium.toLocaleString()}</td>
                    <td className="py-3 text-right text-xs text-red-400">${row.hard.toLocaleString()}</td>
                    <td className="py-3 text-right text-xs font-bold">${row.total.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {change < 0 ? (
                          <ArrowDownRight className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3 text-red-400" />
                        )}
                        <span className={`text-xs font-medium ${change < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {change.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-right text-xs text-emerald-400 font-medium">${savings.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
