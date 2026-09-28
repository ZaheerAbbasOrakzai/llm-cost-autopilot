import { motion } from 'framer-motion';
import { 
  ArrowRight, Brain, Zap, Shield, Clock, ChevronRight, 
  GitBranch, Filter, SlidersHorizontal
} from 'lucide-react';
import { routingDecisions, routingPolicyRules, complexityDistribution } from '../data/mockData';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function ComplexityBadge({ tier }: { tier: string }) {
  const colors = {
    simple: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    hard: 'bg-red-500/15 text-red-400 border-red-500/30',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${colors[tier as keyof typeof colors]}`}>
      {tier}
    </span>
  );
}

export default function Routing() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Routing Flow Visualization */}
      <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
        <h3 className="font-semibold text-sm mb-4">Routing Pipeline</h3>
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-0">
          {[
            { icon: Brain, label: 'Request In', desc: 'API Gateway', color: 'from-blue-500 to-blue-400' },
            { icon: Filter, label: 'Classifier', desc: 'Complexity Analysis', color: 'from-violet-500 to-violet-400' },
            { icon: GitBranch, label: 'Router', desc: 'Model Selection', color: 'from-cyan-500 to-cyan-400' },
            { icon: Zap, label: 'Provider', desc: 'LLM Execution', color: 'from-amber-500 to-amber-400' },
            { icon: Shield, label: 'Validator', desc: 'Quality Check', color: 'from-emerald-500 to-emerald-400' },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-3 md:gap-0 w-full md:w-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex-1 md:flex-none flex flex-col items-center text-center"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-2`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-medium">{step.label}</p>
                <p className="text-[10px] text-gray-500">{step.desc}</p>
              </motion.div>
              {i < 4 && (
                <div className="hidden md:flex items-center px-3">
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Routing Policy Rules */}
      <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-sm">Routing Policy Rules</h3>
            <p className="text-xs text-gray-500 mt-0.5">How complexity maps to model selection</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <SlidersHorizontal className="w-3 h-3" />
            Configure
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {routingPolicyRules.map((rule) => (
            <motion.div
              key={rule.complexity}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-xl border ${
                rule.complexity === 'simple' ? 'bg-emerald-500/5 border-emerald-500/20' :
                rule.complexity === 'medium' ? 'bg-amber-500/5 border-amber-500/20' :
                'bg-red-500/5 border-red-500/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <ComplexityBadge tier={rule.complexity} />
                <span className="text-[10px] text-gray-500">Quality ≥ {rule.minQuality}</span>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500">Max cost/1k tokens</span>
                  <span className="text-gray-300 font-medium">${rule.maxCostPer1k}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-1.5">Preferred models:</p>
                <div className="flex flex-wrap gap-1">
                  {rule.preferredModels.map((model) => (
                    <span key={model} className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-gray-400">
                      {model}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Complexity Distribution + Live Decisions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Complexity Stats */}
        <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
          <h3 className="font-semibold text-sm mb-4">Complexity Breakdown</h3>
          <div className="space-y-4">
            {complexityDistribution.map((tier) => (
              <div key={tier.tier}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-300">{tier.tier}</span>
                  <span className="text-xs font-medium">{tier.count.toLocaleString()} requests</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${tier.percentage}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: tier.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <h4 className="text-xs font-medium text-gray-400 mb-3">Routing Metrics</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.03] rounded-lg p-3">
                <p className="text-lg font-bold text-violet-400">47ms</p>
                <p className="text-[10px] text-gray-500">Avg routing time</p>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-3">
                <p className="text-lg font-bold text-emerald-400">99.2%</p>
                <p className="text-[10px] text-gray-500">Policy adherence</p>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-3">
                <p className="text-lg font-bold text-cyan-400">2.1%</p>
                <p className="text-[10px] text-gray-500">Fallback rate</p>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-3">
                <p className="text-lg font-bold text-amber-400">156</p>
                <p className="text-[10px] text-gray-500">Circuit breaks</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Routing Decisions Table */}
        <motion.div variants={item} className="xl:col-span-2 bg-[#12141c] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Live Routing Decisions</h3>
              <p className="text-xs text-gray-500 mt-0.5">Real-time model selection log</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-medium text-emerald-400">Streaming</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3 pr-4">Request</th>
                  <th className="text-left text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3 pr-4">Complexity</th>
                  <th className="text-left text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3 pr-4">Routed To</th>
                  <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3 pr-4">Tokens</th>
                  <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3 pr-4">Cost</th>
                  <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Saved</th>
                </tr>
              </thead>
              <tbody>
                {routingDecisions.map((decision) => (
                  <motion.tr
                    key={decision.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <p className="text-xs text-gray-300 truncate max-w-[200px]">{decision.requestPreview}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{decision.latency}ms latency</p>
                    </td>
                    <td className="py-3 pr-4">
                      <ComplexityBadge tier={decision.complexity} />
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1.5">
                        <ArrowRight className="w-3 h-3 text-gray-600" />
                        <span className="text-xs font-medium">{decision.routedTo}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <span className="text-xs text-gray-300">{decision.tokens.toLocaleString()}</span>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <span className="text-xs font-medium text-violet-400">${decision.cost.toFixed(4)}</span>
                    </td>
                    <td className="py-3 text-right">
                      {decision.saved > 0 ? (
                        <span className="text-xs font-medium text-emerald-400">${decision.saved.toFixed(4)}</span>
                      ) : (
                        <span className="text-xs text-gray-600">—</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
