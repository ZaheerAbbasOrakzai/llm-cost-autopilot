import { motion } from 'framer-motion';
import { 
  ShieldCheck, ShieldAlert, CheckCircle2, XCircle, ArrowRight,
  TrendingUp, TrendingDown, Activity, Eye, BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { validationResults } from '../data/mockData';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const qualityMetrics = [
  { metric: 'Accuracy', value: 94, fullMark: 100 },
  { metric: 'Coherence', value: 91, fullMark: 100 },
  { metric: 'Relevance', value: 96, fullMark: 100 },
  { metric: 'Completeness', value: 88, fullMark: 100 },
  { metric: 'Safety', value: 99, fullMark: 100 },
  { metric: 'Consistency', value: 92, fullMark: 100 },
];

export default function Validation() {
  const passedCount = validationResults.filter(r => r.passed).length;
  const failedCount = validationResults.filter(r => !r.passed).length;
  const avgDelta = validationResults.reduce((a, r) => a + r.delta, 0) / validationResults.length;
  const passRate = (passedCount / validationResults.length) * 100;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Validation Pass Rate', value: `${passRate.toFixed(1)}%`, icon: ShieldCheck, color: 'from-emerald-500 to-emerald-400', sub: `${passedCount}/${validationResults.length} passed` },
          { label: 'Avg Quality Delta', value: `${(avgDelta * 100).toFixed(1)}%`, icon: Activity, color: 'from-violet-500 to-violet-400', sub: 'vs stronger model' },
          { label: 'Failed Validations', value: failedCount.toString(), icon: ShieldAlert, color: 'from-red-500 to-red-400', sub: 'Requires review' },
          { label: 'Cost Saved via Routing', value: '$2.4K', icon: TrendingUp, color: 'from-cyan-500 to-cyan-400', sub: 'Without quality loss' },
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Quality Radar */}
        <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Quality Metrics</h3>
              <p className="text-xs text-gray-500 mt-0.5">LLM-as-judge evaluation scores</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-lg">
              <Eye className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-medium text-emerald-400">All Passing</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={qualityMetrics}>
              <PolarGrid stroke="#1f2937" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <Radar
                name="Quality"
                dataKey="value"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{ background: '#1a1d28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Delta Distribution */}
        <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Quality Delta Distribution</h3>
              <p className="text-xs text-gray-500 mt-0.5">Difference between routed model and validator</p>
            </div>
            <div className="flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[10px] text-gray-400">Last 24h</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={validationResults}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="id" stroke="#4b5563" fontSize={10} label={{ value: 'Validation Sample', position: 'bottom', fill: '#6b7280', fontSize: 10 }} />
              <YAxis stroke="#4b5563" fontSize={10} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
              <Tooltip
                contentStyle={{ background: '#1a1d28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value: number) => [`Δ ${(value * 100).toFixed(1)}%`, 'Quality Delta']}
              />
              <Bar
                dataKey="delta"
                radius={[6, 6, 0, 0]}
                barSize={32}
                fill="#8b5cf6"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Validation Results Table */}
      <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-sm">Validation Results</h3>
            <p className="text-xs text-gray-500 mt-0.5">Periodic re-evaluation of routing decisions</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500">Threshold: Δ ≤ 10%</span>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-[10px] text-gray-500">Validator: GPT-4o / Claude 3.5</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Request</th>
                <th className="text-left text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Routed Model</th>
                <th className="text-center text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">→</th>
                <th className="text-left text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Validator</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Original</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Validated</th>
                <th className="text-right text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Delta</th>
                <th className="text-center text-[10px] text-gray-500 font-medium uppercase tracking-wider pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {validationResults.map((result) => (
                <motion.tr
                  key={result.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3">
                    <p className="text-xs text-gray-300 truncate max-w-[180px]">{result.requestPreview}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{result.timestamp.toLocaleTimeString()}</p>
                  </td>
                  <td className="py-3">
                    <span className="text-xs font-medium text-violet-400">{result.originalModel}</span>
                  </td>
                  <td className="py-3 text-center">
                    <ArrowRight className="w-3 h-3 text-gray-600 mx-auto" />
                  </td>
                  <td className="py-3">
                    <span className="text-xs font-medium text-cyan-400">{result.validationModel}</span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-xs">{(result.originalScore * 100).toFixed(0)}%</span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-xs">{(result.validationScore * 100).toFixed(0)}%</span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {result.delta > 0.1 ? (
                        <TrendingUp className="w-3 h-3 text-red-400" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-emerald-400" />
                      )}
                      <span className={`text-xs font-medium ${result.delta > 0.1 ? 'text-red-400' : 'text-emerald-400'}`}>
                        +{(result.delta * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    {result.passed ? (
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-lg">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] font-medium text-emerald-400">Pass</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 rounded-lg">
                        <XCircle className="w-3 h-3 text-red-400" />
                        <span className="text-[10px] font-medium text-red-400">Fail</span>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Validation Config */}
      <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
        <h3 className="font-semibold text-sm mb-4">Validation Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Sample Rate</p>
            <p className="text-xl font-bold text-violet-400">5%</p>
            <p className="text-[10px] text-gray-500 mt-1">of all requests validated</p>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Quality Threshold</p>
            <p className="text-xl font-bold text-emerald-400">Δ ≤ 10%</p>
            <p className="text-[10px] text-gray-500 mt-1">max acceptable degradation</p>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Validator Models</p>
            <p className="text-xl font-bold text-cyan-400">2</p>
            <p className="text-[10px] text-gray-500 mt-1">GPT-4o, Claude 3.5 Sonnet</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
