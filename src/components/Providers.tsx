import { motion } from 'framer-motion';
import { 
  Server, Activity, Clock, DollarSign, AlertTriangle, CheckCircle2, 
  XCircle, TrendingUp, Zap, Shield
} from 'lucide-react';
import { providers } from '../data/mockData';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function StatusBadge({ status }: { status: string }) {
  const config = {
    healthy: { color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 },
    degraded: { color: 'bg-amber-500/15 text-amber-400 border-amber-500/30', icon: AlertTriangle },
    down: { color: 'bg-red-500/15 text-red-400 border-red-500/30', icon: XCircle },
  };
  const { color, icon: Icon } = config[status as keyof typeof config];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${color}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

export default function Providers() {
  const allModels = providers.flatMap(p => p.models.map(m => ({ ...m, providerStatus: p.status })));
  const totalModels = allModels.length;
  const avgLatency = Math.round(providers.reduce((a, p) => a + p.latency, 0) / providers.length);
  const healthyProviders = providers.filter(p => p.status === 'healthy').length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Active Providers', value: `${healthyProviders}/${providers.length}`, icon: Server, color: 'from-violet-500 to-violet-400' },
          { label: 'Total Models', value: totalModels.toString(), icon: Zap, color: 'from-cyan-500 to-cyan-400' },
          { label: 'Avg Latency', value: `${avgLatency}ms`, icon: Clock, color: 'from-amber-500 to-amber-400' },
          { label: 'Avg Uptime', value: '99.7%', icon: Shield, color: 'from-emerald-500 to-emerald-400' },
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
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <motion.div
            key={provider.id}
            variants={item}
            whileHover={{ y: -4 }}
            className="bg-[#12141c] border border-white/5 rounded-2xl overflow-hidden group"
          >
            {/* Provider Header */}
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    provider.status === 'healthy' ? 'bg-emerald-500/15' :
                    provider.status === 'degraded' ? 'bg-amber-500/15' : 'bg-red-500/15'
                  }`}>
                    <Server className={`w-5 h-5 ${
                      provider.status === 'healthy' ? 'text-emerald-400' :
                      provider.status === 'degraded' ? 'text-amber-400' : 'text-red-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{provider.name}</h3>
                    <p className="text-[10px] text-gray-500">{provider.models.length} models available</p>
                  </div>
                </div>
                <StatusBadge status={provider.status} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/[0.03] rounded-lg p-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-[10px] text-gray-500">Latency</span>
                  </div>
                  <p className="text-sm font-bold">{provider.latency}ms</p>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Activity className="w-3 h-3 text-gray-500" />
                    <span className="text-[10px] text-gray-500">Uptime</span>
                  </div>
                  <p className="text-sm font-bold">{provider.uptime}%</p>
                </div>
              </div>
            </div>

            {/* Models List */}
            <div className="p-4 space-y-2">
              {provider.models.map((model) => (
                <div
                  key={model.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium truncate">{model.name}</p>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        model.tier === 'simple' ? 'bg-emerald-500/15 text-emerald-400' :
                        model.tier === 'medium' ? 'bg-amber-500/15 text-amber-400' :
                        'bg-red-500/15 text-red-400'
                      }`}>
                        {model.tier}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <DollarSign className="w-2.5 h-2.5" />
                        ${model.inputCostPer1k}/1k in
                      </span>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {model.latency}ms
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-violet-400" />
                      <span className="text-xs font-bold text-violet-400">{(model.qualityScore * 100).toFixed(0)}</span>
                    </div>
                    <p className="text-[10px] text-gray-500">quality</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full Models Table */}
      <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
        <h3 className="font-semibold text-sm mb-4">All Models - Pricing & Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Model</th>
                <th className="text-left text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Provider</th>
                <th className="text-left text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Tier</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Input $/1k</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Output $/1k</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Latency</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Quality</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Max Tokens</th>
              </tr>
            </thead>
            <tbody>
              {allModels.sort((a, b) => b.qualityScore - a.qualityScore).map((model) => (
                <tr key={model.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 text-xs font-medium">{model.name}</td>
                  <td className="py-3">
                    <span className="text-xs text-gray-400">{model.provider}</span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      model.tier === 'simple' ? 'bg-emerald-500/15 text-emerald-400' :
                      model.tier === 'medium' ? 'bg-amber-500/15 text-amber-400' :
                      'bg-red-500/15 text-red-400'
                    }`}>
                      {model.tier}
                    </span>
                  </td>
                  <td className="py-3 text-right text-xs">
                    {model.inputCostPer1k === 0 ? (
                      <span className="text-emerald-400 font-medium">Free</span>
                    ) : (
                      `$${model.inputCostPer1k}`
                    )}
                  </td>
                  <td className="py-3 text-right text-xs">
                    {model.outputCostPer1k === 0 ? (
                      <span className="text-emerald-400 font-medium">Free</span>
                    ) : (
                      `$${model.outputCostPer1k}`
                    )}
                  </td>
                  <td className="py-3 text-right text-xs text-gray-300">{model.latency}ms</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                          style={{ width: `${model.qualityScore * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-violet-400">{(model.qualityScore * 100).toFixed(0)}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right text-xs text-gray-400">{model.maxTokens.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
