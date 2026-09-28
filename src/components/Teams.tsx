import { motion } from 'framer-motion';
import { 
  Users, DollarSign, TrendingUp, Target, ArrowUpRight, 
  AlertTriangle, CheckCircle2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { teamBudgets } from '../data/mockData';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Teams() {
  const totalBudget = teamBudgets.reduce((a, t) => a + t.monthlyBudget, 0);
  const totalSpent = teamBudgets.reduce((a, t) => a + t.spent, 0);
  const totalSavings = teamBudgets.reduce((a, t) => a + t.savings, 0);
  const totalRequests = teamBudgets.reduce((a, t) => a + t.requests, 0);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Budget', value: `$${(totalBudget / 1000).toFixed(1)}K`, icon: DollarSign, color: 'from-violet-500 to-violet-400', sub: `${teamBudgets.length} teams` },
          { label: 'Total Spent', value: `$${(totalSpent / 1000).toFixed(1)}K`, icon: TrendingUp, color: 'from-cyan-500 to-cyan-400', sub: `${((totalSpent / totalBudget) * 100).toFixed(0)}% utilized` },
          { label: 'Total Savings', value: `$${(totalSavings / 1000).toFixed(1)}K`, icon: ArrowUpRight, color: 'from-emerald-500 to-emerald-400', sub: `${((totalSavings / (totalSpent + totalSavings)) * 100).toFixed(0)}% saved` },
          { label: 'Total Requests', value: `${(totalRequests / 1000).toFixed(0)}K`, icon: Target, color: 'from-amber-500 to-amber-400', sub: 'This month' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={{ y: -2 }}
            className="bg-[#12141c] border border-white/5 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-[10px] text-gray-500 mt-1">{stat.sub}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Team Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {teamBudgets.map((team) => {
          const percentUsed = (team.spent / team.monthlyBudget) * 100;
          const isWarning = percentUsed > 80;
          const trendData = team.trend.map((v, i) => ({ day: i, value: v }));

          return (
            <motion.div
              key={team.id}
              variants={item}
              whileHover={{ y: -4 }}
              className="bg-[#12141c] border border-white/5 rounded-2xl p-5 group"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20 border border-white/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{team.name}</h3>
                    <p className="text-[10px] text-gray-500">{team.requests.toLocaleString()} requests</p>
                  </div>
                </div>
                {isWarning ? (
                  <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 rounded-lg">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span className="text-[10px] font-medium text-amber-400">High</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-lg">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] font-medium text-emerald-400">OK</span>
                  </div>
                )}
              </div>

              {/* Budget Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-400">Budget Usage</span>
                  <span className={`text-xs font-bold ${isWarning ? 'text-amber-400' : 'text-white'}`}>
                    ${team.spent.toLocaleString()} / ${team.monthlyBudget.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentUsed}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full rounded-full ${
                      isWarning ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-violet-500 to-cyan-400'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">{percentUsed.toFixed(1)}% used • ${team.monthlyBudget - team.spent} remaining</p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-white/[0.03] rounded-lg p-2 text-center">
                  <p className="text-xs font-bold text-violet-400">${team.avgCostPerRequest.toFixed(3)}</p>
                  <p className="text-[9px] text-gray-500">Avg/req</p>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-2 text-center">
                  <p className="text-xs font-bold text-emerald-400">${team.savings}</p>
                  <p className="text-[9px] text-gray-500">Saved</p>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-2 text-center">
                  <p className="text-xs font-bold text-cyan-400">{((team.savings / (team.spent + team.savings)) * 100).toFixed(0)}%</p>
                  <p className="text-[9px] text-gray-500">Rate</p>
                </div>
              </div>

              {/* Mini Sparkline */}
              <div className="h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id={`gradient-${team.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isWarning ? '#f59e0b' : '#8b5cf6'} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={isWarning ? '#f59e0b' : '#8b5cf6'} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      contentStyle={{ background: '#1a1d28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
                      formatter={(value: number) => [`$${value}`, 'Spend']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={isWarning ? '#f59e0b' : '#8b5cf6'}
                      fill={`url(#gradient-${team.id})`}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Budget Table */}
      <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
        <h3 className="font-semibold text-sm mb-4">Team Budget Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Team</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Budget</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Spent</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Remaining</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Requests</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Avg Cost</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Savings</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {teamBudgets.map((team) => {
                const percentUsed = (team.spent / team.monthlyBudget) * 100;
                return (
                  <tr key={team.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-400/20 flex items-center justify-center">
                          <Users className="w-3.5 h-3.5 text-violet-400" />
                        </div>
                        <span className="text-xs font-medium">{team.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right text-xs">${team.monthlyBudget.toLocaleString()}</td>
                    <td className="py-3 text-right text-xs font-medium">${team.spent.toLocaleString()}</td>
                    <td className="py-3 text-right text-xs text-gray-400">${(team.monthlyBudget - team.spent).toLocaleString()}</td>
                    <td className="py-3 text-right text-xs">{team.requests.toLocaleString()}</td>
                    <td className="py-3 text-right text-xs">${team.avgCostPerRequest.toFixed(3)}</td>
                    <td className="py-3 text-right text-xs text-emerald-400 font-medium">${team.savings.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${percentUsed > 80 ? 'bg-amber-400' : 'bg-violet-500'}`}
                            style={{ width: `${percentUsed}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-400">{percentUsed.toFixed(0)}%</span>
                      </div>
                    </td>
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
