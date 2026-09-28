import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, TrendingDown, Activity, Zap, DollarSign } from 'lucide-react';

interface Anomaly {
  id: string;
  type: 'cost_spike' | 'latency_spike' | 'error_rate' | 'quality_drop';
  severity: 'low' | 'medium' | 'high';
  metric: string;
  currentValue: number;
  threshold: number;
  change: number;
  timestamp: Date;
  message: string;
  recommendation: string;
}

export default function AnomalyDetection() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    if (!isMonitoring) return;

    // Simulate anomaly detection
    const interval = setInterval(() => {
      const rand = Math.random();
      
      if (rand < 0.1) { // 10% chance of anomaly
        const newAnomaly = generateAnomaly();
        setAnomalies(prev => [newAnomaly, ...prev].slice(0, 10));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const generateAnomaly = (): Anomaly => {
    const types: Anomaly['type'][] = ['cost_spike', 'latency_spike', 'error_rate', 'quality_drop'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const configs = {
      cost_spike: {
        metric: 'Cost per minute',
        unit: '$',
        threshold: 5.0,
        message: 'Unusual cost spike detected',
        recommendation: 'Review recent high-complexity requests',
      },
      latency_spike: {
        metric: 'Average latency',
        unit: 'ms',
        threshold: 500,
        message: 'Latency increased significantly',
        recommendation: 'Check provider health status',
      },
      error_rate: {
        metric: 'Error rate',
        unit: '%',
        threshold: 2.0,
        message: 'Error rate above threshold',
        recommendation: 'Investigate failing requests',
      },
      quality_drop: {
        metric: 'Quality score',
        unit: '%',
        threshold: 80,
        message: 'Quality degradation detected',
        recommendation: 'Review routing policies',
      },
    };

    const config = configs[type];
    const currentValue = config.threshold * (1 + Math.random() * 0.5);
    const change = ((currentValue - config.threshold) / config.threshold) * 100;

    return {
      id: `anomaly_${Date.now()}`,
      type,
      severity: change > 30 ? 'high' : change > 15 ? 'medium' : 'low',
      metric: config.metric,
      currentValue,
      threshold: config.threshold,
      change,
      timestamp: new Date(),
      message: config.message,
      recommendation: config.recommendation,
    };
  };

  const getSeverityColor = (severity: Anomaly['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'medium': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'low': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
    }
  };

  const getTypeIcon = (type: Anomaly['type']) => {
    switch (type) {
      case 'cost_spike': return DollarSign;
      case 'latency_spike': return Activity;
      case 'error_rate': return AlertTriangle;
      case 'quality_drop': return TrendingDown;
    }
  };

  return (
    <div className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Anomaly Detection
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">ML-based monitoring for unusual patterns</p>
        </div>
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isMonitoring
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10'
          }`}
        >
          {isMonitoring ? '● Monitoring' : '○ Paused'}
        </button>
      </div>

      {anomalies.length === 0 ? (
        <div className="py-12 text-center">
          <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No anomalies detected</p>
          <p className="text-xs text-gray-500 mt-1">System is operating normally</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {anomalies.map((anomaly) => {
            const Icon = getTypeIcon(anomaly.type);
            return (
              <motion.div
                key={anomaly.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-xl border ${getSeverityColor(anomaly.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <div>
                      <p className="text-xs font-medium">{anomaly.message}</p>
                      <p className="text-[10px] text-gray-500">
                        {anomaly.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${getSeverityColor(anomaly.severity)}`}>
                    {anomaly.severity}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div>
                    <p className="text-[10px] text-gray-500">Metric</p>
                    <p className="text-xs font-medium">{anomaly.metric}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Current</p>
                    <p className="text-xs font-medium">
                      {anomaly.type === 'cost_spike' && '$'}
                      {anomaly.currentValue.toFixed(2)}
                      {(anomaly.type === 'latency_spike' || anomaly.type === 'error_rate' || anomaly.type === 'quality_drop') && (anomaly.type === 'latency_spike' ? 'ms' : '%')}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Change</p>
                    <p className="text-xs font-medium flex items-center gap-1">
                      {anomaly.change > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      +{anomaly.change.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <p className="text-[10px] text-gray-500">
                    <span className="font-medium">Recommendation:</span> {anomaly.recommendation}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-lg font-bold text-emerald-400">
              {anomalies.filter(a => a.severity === 'low').length}
            </p>
            <p className="text-[10px] text-gray-500">Low Severity</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-amber-400">
              {anomalies.filter(a => a.severity === 'medium').length}
            </p>
            <p className="text-[10px] text-gray-500">Medium Severity</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-red-400">
              {anomalies.filter(a => a.severity === 'high').length}
            </p>
            <p className="text-[10px] text-gray-500">High Severity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
