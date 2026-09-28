import { useState, useEffect, useRef } from 'react';

interface LiveMetric {
  value: number;
  trend: number[];
  change: number;
}

export function useLiveMetrics() {
  const [metrics, setMetrics] = useState({
    requestsPerMin: { value: 142, trend: Array(20).fill(142), change: 0 },
    avgLatency: { value: 187, trend: Array(20).fill(187), change: 0 },
    costPerMin: { value: 2.34, trend: Array(20).fill(2.34), change: 0 },
    activeModels: { value: 13, trend: Array(20).fill(13), change: 0 },
    cacheHitRate: { value: 34.2, trend: Array(20).fill(34.2), change: 0 },
    errorRate: { value: 0.12, trend: Array(20).fill(0.12), change: 0 },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const newMetrics = { ...prev };
        
        const newRpm = Math.max(50, prev.requestsPerMin.value + (Math.random() - 0.5) * 20);
        newMetrics.requestsPerMin = {
          value: Math.round(newRpm),
          trend: [...prev.requestsPerMin.trend.slice(1), Math.round(newRpm)],
          change: ((newRpm - prev.requestsPerMin.trend[0]) / prev.requestsPerMin.trend[0]) * 100,
        };

        const newLatency = Math.max(50, prev.avgLatency.value + (Math.random() - 0.5) * 30);
        newMetrics.avgLatency = {
          value: Math.round(newLatency),
          trend: [...prev.avgLatency.trend.slice(1), Math.round(newLatency)],
          change: ((newLatency - prev.avgLatency.trend[0]) / prev.avgLatency.trend[0]) * 100,
        };

        const newCost = Math.max(0.5, prev.costPerMin.value + (Math.random() - 0.5) * 0.5);
        newMetrics.costPerMin = {
          value: parseFloat(newCost.toFixed(2)),
          trend: [...prev.costPerMin.trend.slice(1), parseFloat(newCost.toFixed(2))],
          change: ((newCost - prev.costPerMin.trend[0]) / prev.costPerMin.trend[0]) * 100,
        };

        const newCache = Math.max(10, Math.min(80, prev.cacheHitRate.value + (Math.random() - 0.5) * 5));
        newMetrics.cacheHitRate = {
          value: parseFloat(newCache.toFixed(1)),
          trend: [...prev.cacheHitRate.trend.slice(1), parseFloat(newCache.toFixed(1))],
          change: ((newCache - prev.cacheHitRate.trend[0]) / prev.cacheHitRate.trend[0]) * 100,
        };

        const newError = Math.max(0, Math.min(5, prev.errorRate.value + (Math.random() - 0.5) * 0.3));
        newMetrics.errorRate = {
          value: parseFloat(newError.toFixed(2)),
          trend: [...prev.errorRate.trend.slice(1), parseFloat(newError.toFixed(2))],
          change: ((newError - prev.errorRate.trend[0]) / prev.errorRate.trend[0]) * 100,
        };

        return newMetrics;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
}

interface RequestEvent {
  id: string;
  timestamp: Date;
  model: string;
  complexity: 'simple' | 'medium' | 'hard';
  tokens: number;
  cost: number;
  latency: number;
}

export function useLiveRequestFeed() {
  const [requests, setRequests] = useState<RequestEvent[]>([]);
  const idCounter = useRef(0);

  const models = [
    { name: 'GPT-4o Mini', complexity: 'simple' as const, costRange: [0.0001, 0.0003] },
    { name: 'Llama 3.1 70B', complexity: 'medium' as const, costRange: [0.0005, 0.002] },
    { name: 'Claude 3 Haiku', complexity: 'simple' as const, costRange: [0.0002, 0.0005] },
    { name: 'Mixtral 8x7B', complexity: 'medium' as const, costRange: [0.0003, 0.001] },
    { name: 'GPT-4o', complexity: 'hard' as const, costRange: [0.01, 0.08] },
    { name: 'Phi-3 Mini', complexity: 'simple' as const, costRange: [0, 0.0001] },
    { name: 'Claude 3.5 Sonnet', complexity: 'hard' as const, costRange: [0.01, 0.06] },
  ];

  useEffect(() => {
    const initial: RequestEvent[] = [];
    for (let i = 0; i < 10; i++) {
      const model = models[Math.floor(Math.random() * models.length)];
      const tokens = Math.floor(Math.random() * 5000) + 100;
      const cost = model.costRange[0] + Math.random() * (model.costRange[1] - model.costRange[0]);
      initial.push({
        id: `req-${idCounter.current++}`,
        timestamp: new Date(Date.now() - (10 - i) * 3000),
        model: model.name,
        complexity: model.complexity,
        tokens,
        cost: parseFloat(cost.toFixed(4)),
        latency: Math.floor(Math.random() * 800) + 50,
      });
    }
    setRequests(initial);

    const interval = setInterval(() => {
      const model = models[Math.floor(Math.random() * models.length)];
      const tokens = Math.floor(Math.random() * 5000) + 100;
      const cost = model.costRange[0] + Math.random() * (model.costRange[1] - model.costRange[0]);
      
      setRequests(prev => [
        {
          id: `req-${idCounter.current++}`,
          timestamp: new Date(),
          model: model.name,
          complexity: model.complexity,
          tokens,
          cost: parseFloat(cost.toFixed(4)),
          latency: Math.floor(Math.random() * 800) + 50,
        },
        ...prev.slice(0, 19),
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return requests;
}

export function Sparkline({ data, color = '#8b5cf6', height = 30 }: { data: number[]; color?: string; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} 100,${height}`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sparkGrad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#sparkGrad-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
