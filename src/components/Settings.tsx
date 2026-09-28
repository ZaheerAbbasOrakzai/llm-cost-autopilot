import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, SlidersHorizontal, DollarSign, Clock, 
  Save, RefreshCw, AlertTriangle, CheckCircle2,
  Zap, Eye, Globe
} from 'lucide-react';
import { routingPolicyRules } from '../data/mockData';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description: string;
}

function ToggleSwitch({ enabled, onToggle, label, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
      <div>
        <p className="text-xs font-medium">{label}</p>
        <p className="text-[10px] text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          enabled ? 'bg-violet-500' : 'bg-white/10'
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [toggles, setToggles] = useState({
    autopilot: true,
    validation: true,
    circuitBreakers: true,
    budgetAlerts: true,
    costCaching: true,
    requestLogging: true,
    autoFallback: true,
    qualityGate: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleSetting = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Configuration</h3>
          <p className="text-xs text-gray-500 mt-0.5">Manage routing policies, budgets, and system settings</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
            saved
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-gradient-to-r from-violet-500 to-cyan-400 text-white shadow-lg shadow-violet-500/20'
          }`}
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </motion.button>
      </motion.div>

      {/* System Toggles */}
      <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-violet-400" />
          <h3 className="font-semibold text-sm">System Controls</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ToggleSwitch
            enabled={toggles.autopilot}
            onToggle={() => toggleSetting('autopilot')}
            label="Autopilot Mode"
            description="Enable intelligent model routing"
          />
          <ToggleSwitch
            enabled={toggles.validation}
            onToggle={() => toggleSetting('validation')}
            label="Quality Validation"
            description="Periodically re-evaluate routing decisions"
          />
          <ToggleSwitch
            enabled={toggles.circuitBreakers}
            onToggle={() => toggleSetting('circuitBreakers')}
            label="Circuit Breakers"
            description="Auto-failover on provider errors"
          />
          <ToggleSwitch
            enabled={toggles.budgetAlerts}
            onToggle={() => toggleSetting('budgetAlerts')}
            label="Budget Alerts"
            description="Notify when teams approach limits"
          />
          <ToggleSwitch
            enabled={toggles.costCaching}
            onToggle={() => toggleSetting('costCaching')}
            label="Response Caching"
            description="Cache identical requests in Redis"
          />
          <ToggleSwitch
            enabled={toggles.requestLogging}
            onToggle={() => toggleSetting('requestLogging')}
            label="Request Logging"
            description="Log all routing decisions to PostgreSQL"
          />
          <ToggleSwitch
            enabled={toggles.autoFallback}
            onToggle={() => toggleSetting('autoFallback')}
            label="Auto Fallback"
            description="Automatically try next model on failure"
          />
          <ToggleSwitch
            enabled={toggles.qualityGate}
            onToggle={() => toggleSetting('qualityGate')}
            label="Quality Gate"
            description="Block routing below quality threshold"
          />
        </div>
      </motion.div>

      {/* Routing Policy Configuration */}
      <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-violet-400" />
            <h3 className="font-semibold text-sm">Routing Policy Rules</h3>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <RefreshCw className="w-3 h-3" />
            Reset Defaults
          </button>
        </div>

        <div className="space-y-4">
          {routingPolicyRules.map((rule, idx) => (
            <div
              key={rule.complexity}
              className={`p-4 rounded-xl border ${
                rule.complexity === 'simple' ? 'bg-emerald-500/5 border-emerald-500/20' :
                rule.complexity === 'medium' ? 'bg-amber-500/5 border-amber-500/20' :
                'bg-red-500/5 border-red-500/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                    rule.complexity === 'simple' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                    rule.complexity === 'medium' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                    'bg-red-500/15 text-red-400 border-red-500/30'
                  }`}>
                    {rule.complexity}
                  </span>
                  <span className="text-[10px] text-gray-500">Complexity Tier</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Min Quality Score</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue={rule.minQuality * 100}
                      className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-violet-500"
                    />
                    <span className="text-xs font-medium w-8 text-right">{(rule.minQuality * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Max Cost / 1k tokens</label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3 h-3 text-gray-500" />
                    <input
                      type="text"
                      defaultValue={rule.maxCostPer1k}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Max Latency</label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <input
                      type="text"
                      defaultValue={rule.complexity === 'simple' ? '500ms' : rule.complexity === 'medium' ? '1000ms' : '3000ms'}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 block">Preferred Models (drag to reorder)</label>
                <div className="flex flex-wrap gap-1.5">
                  {rule.preferredModels.map((model, i) => (
                    <div
                      key={model}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] text-gray-300 cursor-grab hover:border-violet-500/30 transition-colors"
                    >
                      <span className="text-gray-500 font-mono">{i + 1}.</span>
                      {model}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Validation Settings */}
      <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-4 h-4 text-violet-400" />
          <h3 className="font-semibold text-sm">Validation Configuration</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 block">Sample Rate</label>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
              <input type="text" defaultValue="5" className="flex-1 bg-transparent text-xs text-white focus:outline-none" />
              <span className="text-xs text-gray-500">%</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 block">Quality Threshold (Δ max)</label>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
              <input type="text" defaultValue="10" className="flex-1 bg-transparent text-xs text-white focus:outline-none" />
              <span className="text-xs text-gray-500">%</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 block">Validator Model</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 appearance-none">
              <option>GPT-4o</option>
              <option>Claude 3.5 Sonnet</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 block">Validation Interval</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 appearance-none">
              <option>Every 5 minutes</option>
              <option>Every 15 minutes</option>
              <option>Every hour</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Budget & Alert Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4 text-violet-400" />
            <h3 className="font-semibold text-sm">Budget Enforcement</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 block">Alert at % of budget</label>
              <div className="flex items-center gap-3">
                {[50, 75, 85, 95].map((pct) => (
                  <label key={pct} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked={pct >= 75} className="w-3.5 h-3.5 rounded accent-violet-500" />
                    <span className="text-xs text-gray-300">{pct}%</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 block">Action on overage</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 appearance-none">
                <option>Warn & continue</option>
                <option>Throttle to cheap models only</option>
                <option>Block all requests</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 block">Notification channels</label>
              <div className="flex gap-2">
                {['Slack', 'Email', 'PagerDuty', 'Webhook'].map((ch) => (
                  <span key={ch} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-gray-300 cursor-pointer hover:border-violet-500/30 transition-colors">
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-violet-400" />
            <h3 className="font-semibold text-sm">Provider Configuration</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 block">Default Timeout</label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                <Clock className="w-3 h-3 text-gray-500" />
                <input type="text" defaultValue="30000" className="flex-1 bg-transparent text-xs text-white focus:outline-none" />
                <span className="text-xs text-gray-500">ms</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 block">Max Retries</label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                <RefreshCw className="w-3 h-3 text-gray-500" />
                <input type="text" defaultValue="3" className="flex-1 bg-transparent text-xs text-white focus:outline-none" />
                <span className="text-xs text-gray-500">attempts</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 block">Rate Limit Buffer</label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                <Zap className="w-3 h-3 text-gray-500" />
                <input type="text" defaultValue="80" className="flex-1 bg-transparent text-xs text-white focus:outline-none" />
                <span className="text-xs text-gray-500">% of provider limit</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Danger Zone */}
      <motion.div variants={item} className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h3 className="font-semibold text-sm text-red-400">Danger Zone</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div>
              <p className="text-xs font-medium">Reset All Routing Policies</p>
              <p className="text-[10px] text-gray-500">Revert to default model assignments</p>
            </div>
            <button className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-[10px] font-medium text-red-400 hover:bg-red-500/20 transition-colors">
              Reset
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div>
              <p className="text-xs font-medium">Clear All Cached Responses</p>
              <p className="text-[10px] text-gray-500">Flush Redis cache immediately</p>
            </div>
            <button className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-[10px] font-medium text-red-400 hover:bg-red-500/20 transition-colors">
              Clear
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
