import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, DollarSign, Zap, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface RequestTrace {
  id: string;
  timestamp: number;
  input: string;
  complexity: 'simple' | 'medium' | 'hard';
  model: string;
  status: 'pending' | 'classifying' | 'routing' | 'executing' | 'complete' | 'error';
  tokens: { input: number; output: number };
  cost: number;
  latency: number;
  qualityScore: number;
}

export default function RequestWaterfall() {
  const [requests, setRequests] = useState<RequestTrace[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newRequest: RequestTrace = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        input: getRandomInput(),
        complexity: getRandomComplexity(),
        model: getRandomModel(),
        status: 'pending',
        tokens: { input: Math.floor(Math.random() * 2000) + 100, output: Math.floor(Math.random() * 1000) + 50 },
        cost: Math.random() * 0.05,
        latency: Math.floor(Math.random() * 800) + 100,
        qualityScore: 0.7 + Math.random() * 0.3,
      };

      setRequests(prev => [newRequest, ...prev].slice(0, 20));

      // Simulate request progression
      setTimeout(() => updateRequestStatus(newRequest.id, 'classifying'), 200);
      setTimeout(() => updateRequestStatus(newRequest.id, 'routing'), 400);
      setTimeout(() => updateRequestStatus(newRequest.id, 'executing'), 600);
      setTimeout(() => updateRequestStatus(newRequest.id, 'complete'), 600 + newRequest.latency);
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  const updateRequestStatus = (id: string, status: RequestTrace['status']) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const getStatusIcon = (status: RequestTrace['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-3 h-3 text-gray-400" />;
      case 'classifying': return <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />;
      case 'routing': return <Loader2 className="w-3 h-3 text-violet-400 animate-spin" />;
      case 'executing': return <Zap className="w-3 h-3 text-amber-400 animate-pulse" />;
      case 'complete': return <CheckCircle2 className="w-3 h-3 text-emerald-400" />;
      case 'error': return <XCircle className="w-3 h-3 text-red-400" />;
    }
  };

  const getStatusColor = (status: RequestTrace['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-500/10 border-gray-500/20';
      case 'classifying': return 'bg-cyan-500/10 border-cyan-500/20';
      case 'routing': return 'bg-violet-500/10 border-violet-500/20';
      case 'executing': return 'bg-amber-500/10 border-amber-500/20';
      case 'complete': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'error': return 'bg-red-500/10 border-red-500/20';
    }
  };

  return (
    <div className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-violet-400" />
            Simulated Request Waterfall
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Illustrative requests; this demo does not call an LLM provider</p>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isLive
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10'
          }`}
        >
          {isLive ? '● Simulation on' : '○ Paused'}
        </button>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        <AnimatePresence>
          {requests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`p-3 rounded-xl border ${getStatusColor(request.status)} transition-all`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(request.status)}
                  <span className="text-xs font-mono text-gray-400">{request.id.slice(0, 16)}...</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-gray-500">
                  <span>{request.tokens.input + request.tokens.output} tokens</span>
                  <span className="text-emerald-400">${request.cost.toFixed(4)}</span>
                  <span>{request.latency}ms</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                  request.complexity === 'simple' ? 'bg-emerald-500/20 text-emerald-400' :
                  request.complexity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {request.complexity}
                </span>
                <span className="text-xs text-gray-300">{request.model}</span>
                <span className="text-[10px] text-gray-500">• {(request.qualityScore * 100).toFixed(0)}% quality</span>
              </div>

              <p className="text-[10px] text-gray-500 truncate">{request.input}</p>

              {/* Progress bar */}
              <div className="mt-2 flex gap-1">
                {['classifying', 'routing', 'executing', 'complete'].map((stage, i) => {
                  const stages = ['pending', 'classifying', 'routing', 'executing', 'complete'];
                  const currentIndex = stages.indexOf(request.status);
                  const isActive = i <= currentIndex;
                  return (
                    <div
                      key={stage}
                      className={`flex-1 h-1 rounded-full transition-all ${
                        isActive ? 'bg-violet-500' : 'bg-white/5'
                      }`}
                    />
                  );
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function getRandomInput(): string {
  const inputs = [
    'Translate this paragraph to Spanish: "The quick brown fox..."',
    'Analyze this code for security vulnerabilities...',
    'Summarize this meeting transcript into key points...',
    'Generate a regex pattern for email validation...',
    'Write API documentation for this endpoint...',
    'Classify the sentiment of this customer review...',
    'Refactor this function for better performance...',
    'Create a SQL query to join these tables...',
  ];
  return inputs[Math.floor(Math.random() * inputs.length)];
}

function getRandomComplexity(): 'simple' | 'medium' | 'hard' {
  const rand = Math.random();
  if (rand < 0.52) return 'simple';
  if (rand < 0.83) return 'medium';
  return 'hard';
}

function getRandomModel(): string {
  const models = [
    'GPT-4o Mini', 'Llama 3.1 70B', 'Claude 3 Haiku',
    'Mixtral 8x7B', 'GPT-4o', 'Phi-3 Mini', 'Claude 3.5 Sonnet'
  ];
  return models[Math.floor(Math.random() * models.length)];
}
