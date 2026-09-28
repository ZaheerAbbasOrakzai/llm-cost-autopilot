import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Brain, GitBranch, Zap, Clock, DollarSign, CheckCircle2,
  Copy, RotateCcw, Loader2, Sparkles, Terminal,
  Hash, Code2, FileText
} from 'lucide-react';

interface PlaygroundStep {
  id: string;
  label: string;
  icon: React.ElementType;
  status: 'pending' | 'active' | 'done';
  detail?: string;
  duration?: number;
}

interface PlaygroundResult {
  complexity: string;
  confidence: number;
  routedTo: string;
  provider: string;
  tokens: { input: number; output: number };
  cost: number;
  latency: number;
  qualityScore: number;
  savedVsGPT4o: number;
  reasoning: string;
  alternatives: { model: string; cost: number; quality: number }[];
}

const sampleRequests = [
  { label: 'Sentiment Classification', icon: Hash, text: 'Classify the sentiment of this customer review: "The product arrived quickly and works exactly as described. Very happy with my purchase!"' },
  { label: 'Code Generation', icon: Code2, text: 'Write a Python function that implements binary search on a sorted array. Include type hints and docstring.' },
  { label: 'Translation', icon: FileText, text: 'Translate the following paragraph from English to French: "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet."' },
  { label: 'Security Analysis', icon: Terminal, text: 'Analyze this SQL query for potential injection vulnerabilities: SELECT * FROM users WHERE id = \' + userInput + \' AND active = 1' },
  { label: 'Summarization', icon: FileText, text: 'Summarize the key points from this meeting transcript: We discussed the Q4 roadmap, agreed to prioritize the mobile app redesign, allocated $50K budget for new hires, and set the launch date for March 15th.' },
];

function classifyRequest(text: string): { complexity: string; confidence: number; reasoning: string } {
  const lower = text.toLowerCase();
  const codeKeywords = ['function', 'code', 'sql', 'python', 'javascript', 'implement', 'algorithm', 'debug', 'refactor'];
  const analysisKeywords = ['analyze', 'security', 'vulnerability', 'injection', 'audit', 'review'];
  const simpleKeywords = ['classify', 'sentiment', 'translate', 'summarize', 'extract', 'format'];

  const hasCode = codeKeywords.some(k => lower.includes(k));
  const hasAnalysis = analysisKeywords.some(k => lower.includes(k));
  const hasSimple = simpleKeywords.some(k => lower.includes(k));

  if (hasAnalysis && (hasCode || lower.length > 200)) {
    return { complexity: 'hard', confidence: 0.92, reasoning: 'Security analysis requires deep reasoning and domain expertise. Code + analysis = high complexity.' };
  }
  if (hasCode && lower.length > 150) {
    return { complexity: 'hard', confidence: 0.87, reasoning: 'Complex code generation with detailed requirements needs strong reasoning capabilities.' };
  }
  if (hasCode) {
    return { complexity: 'medium', confidence: 0.84, reasoning: 'Code generation task with clear requirements. Medium complexity - needs coding ability but straightforward.' };
  }
  if (hasSimple || lower.length < 200) {
    return { complexity: 'simple', confidence: 0.95, reasoning: 'Straightforward NLP task with clear input/output. Can be handled by efficient smaller models.' };
  }
  return { complexity: 'medium', confidence: 0.78, reasoning: 'Mixed signals in request. Defaulting to medium complexity for safety.' };
}

function routeRequest(complexity: string): PlaygroundResult {
  if (complexity === 'simple') {
    return {
      complexity: 'simple',
      confidence: 0.95,
      routedTo: 'Phi-3 Mini',
      provider: 'Local',
      tokens: { input: 85, output: 32 },
      cost: 0.0000,
      latency: 68,
      qualityScore: 0.89,
      savedVsGPT4o: 0.0018,
      reasoning: 'Simple classification task routed to local model. Quality exceeds 65% threshold at zero cost.',
      alternatives: [
        { model: 'Llama 3.1 8B', cost: 0.00001, quality: 0.85 },
        { model: 'GPT-4o Mini', cost: 0.00018, quality: 0.91 },
        { model: 'Claude 3 Haiku', cost: 0.00022, quality: 0.88 },
      ]
    };
  }
  if (complexity === 'medium') {
    return {
      complexity: 'medium',
      confidence: 0.84,
      routedTo: 'Llama 3.1 70B',
      provider: 'Groq',
      tokens: { input: 420, output: 890 },
      cost: 0.00095,
      latency: 145,
      qualityScore: 0.91,
      savedVsGPT4o: 0.0192,
      reasoning: 'Medium complexity code task. Groq Llama 3.1 70B offers excellent code quality at 1/20th the cost of GPT-4o.',
      alternatives: [
        { model: 'Mixtral 8x7B', cost: 0.00031, quality: 0.84 },
        { model: 'Qwen 2 72B', cost: 0.00086, quality: 0.88 },
        { model: 'GPT-4o Mini', cost: 0.0012, quality: 0.82 },
      ]
    };
  }
  return {
    complexity: 'hard',
    confidence: 0.92,
    routedTo: 'GPT-4o',
    provider: 'OpenAI',
    tokens: { input: 1850, output: 2400 },
    cost: 0.0453,
    latency: 890,
    qualityScore: 0.96,
    savedVsGPT4o: 0,
    reasoning: 'Complex analysis task requiring deep reasoning. GPT-4o selected as primary - quality threshold 88% requires top-tier model.',
    alternatives: [
      { model: 'Claude 3.5 Sonnet', cost: 0.0425, quality: 0.95 },
      { model: 'Llama 3.1 405B', cost: 0.0213, quality: 0.91 },
    ]
  };
}

export default function Playground() {
  const [input, setInput] = useState(sampleRequests[0].text);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<PlaygroundResult | null>(null);
  const [steps, setSteps] = useState<PlaygroundStep[]>([]);
  const [copied, setCopied] = useState(false);

  const runPipeline = async () => {
    setIsRunning(true);
    setResult(null);

    const initialSteps: PlaygroundStep[] = [
      { id: 'receive', label: 'Request Received', icon: Terminal, status: 'pending' },
      { id: 'classify', label: 'Complexity Classification', icon: Brain, status: 'pending' },
      { id: 'route', label: 'Model Selection', icon: GitBranch, status: 'pending' },
      { id: 'execute', label: 'LLM Execution', icon: Zap, status: 'pending' },
      { id: 'record', label: 'Cost Recorded', icon: DollarSign, status: 'pending' },
    ];
    setSteps(initialSteps);

    // Step 1: Receive
    await delay(400);
    setSteps(prev => prev.map(s => s.id === 'receive' ? { ...s, status: 'active' } : s));
    await delay(600);
    setSteps(prev => prev.map(s => s.id === 'receive' ? { ...s, status: 'done', detail: '47ms', duration: 47 } : s));

    // Step 2: Classify
    setSteps(prev => prev.map(s => s.id === 'classify' ? { ...s, status: 'active' } : s));
    await delay(800);
    const classification = classifyRequest(input);
    setSteps(prev => prev.map(s => s.id === 'classify' ? {
      ...s, status: 'done',
      detail: `${classification.complexity} (${(classification.confidence * 100).toFixed(0)}%)`,
      duration: 23
    } : s));

    // Step 3: Route
    setSteps(prev => prev.map(s => s.id === 'route' ? { ...s, status: 'active' } : s));
    await delay(600);
    const routingResult = routeRequest(classification.complexity);
    setSteps(prev => prev.map(s => s.id === 'route' ? {
      ...s, status: 'done',
      detail: `${routingResult.routedTo} via ${routingResult.provider}`,
      duration: 12
    } : s));

    // Step 4: Execute
    setSteps(prev => prev.map(s => s.id === 'execute' ? { ...s, status: 'active' } : s));
    await delay(routingResult.latency > 500 ? 1200 : 600);
    setSteps(prev => prev.map(s => s.id === 'execute' ? {
      ...s, status: 'done',
      detail: `${routingResult.tokens.input + routingResult.tokens.output} tokens`,
      duration: routingResult.latency
    } : s));

    // Step 5: Record
    setSteps(prev => prev.map(s => s.id === 'record' ? { ...s, status: 'active' } : s));
    await delay(300);
    setSteps(prev => prev.map(s => s.id === 'record' ? {
      ...s, status: 'done',
      detail: `$${routingResult.cost.toFixed(4)}`,
      duration: 5
    } : s));

    setResult(routingResult);
    setIsRunning(false);
  };

  const handleCopy = () => {
    if (!result) return;
    const text = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <h3 className="text-lg font-semibold">API Playground</h3>
          </div>
          <p className="text-xs text-gray-500">Test routing decisions interactively — see how the autopilot classifies and routes your requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="xl:col-span-2 bg-[#12141c] border border-white/5 rounded-2xl p-5 flex flex-col"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Request Input</h4>
            <button
              onClick={() => { setInput(''); setResult(null); setSteps([]); }}
              className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Clear
            </button>
          </div>

          {/* Sample Requests */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {sampleRequests.map((req) => (
              <button
                key={req.label}
                onClick={() => setInput(req.text)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] text-gray-400 hover:text-white hover:border-violet-500/30 transition-all"
              >
                <req.icon className="w-3 h-3" />
                {req.label}
              </button>
            ))}
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your LLM request here..."
            className="flex-1 min-h-[180px] bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 resize-none font-mono"
          />

          <div className="flex items-center justify-between mt-3">
            <div className="text-[10px] text-gray-500">
              {input.length} characters • ~{Math.ceil(input.length / 4)} tokens estimated
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={runPipeline}
              disabled={isRunning || !input.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-xl text-xs font-medium text-white shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isRunning ? 'Processing...' : 'Run Pipeline'}
            </motion.button>
          </div>
        </motion.div>

        {/* Pipeline Steps */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="xl:col-span-3 bg-[#12141c] border border-white/5 rounded-2xl p-5"
        >
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Routing Pipeline</h4>

          {steps.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <Terminal className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-sm text-gray-400">Submit a request to see the routing pipeline</p>
              <p className="text-xs text-gray-600 mt-1">Each step will animate in real-time</p>
            </div>
          ) : (
            <div className="space-y-2">
              {steps.map((step, i) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                    step.status === 'active' ? 'bg-violet-500/10 border-violet-500/30' :
                    step.status === 'done' ? 'bg-emerald-500/5 border-emerald-500/20' :
                    'bg-white/[0.02] border-white/5'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    step.status === 'active' ? 'bg-violet-500/20' :
                    step.status === 'done' ? 'bg-emerald-500/20' : 'bg-white/5'
                  }`}>
                    {step.status === 'active' ? (
                      <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                    ) : step.status === 'done' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <step.icon className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-medium ${
                        step.status === 'active' ? 'text-violet-300' :
                        step.status === 'done' ? 'text-white' : 'text-gray-500'
                      }`}>{step.label}</p>
                      {step.duration && (
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {step.duration}ms
                        </span>
                      )}
                    </div>
                    {step.detail && (
                      <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{step.detail}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Result Card */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mt-4 bg-gradient-to-br from-violet-500/10 to-cyan-500/5 border border-violet-500/20 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    <span className="text-xs font-semibold">Routing Decision</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg text-[10px] text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? 'Copied!' : 'Copy JSON'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  <div className="bg-white/[0.05] rounded-lg p-2.5">
                    <p className="text-[10px] text-gray-500">Model</p>
                    <p className="text-xs font-bold text-white mt-0.5">{result.routedTo}</p>
                    <p className="text-[10px] text-gray-500">{result.provider}</p>
                  </div>
                  <div className="bg-white/[0.05] rounded-lg p-2.5">
                    <p className="text-[10px] text-gray-500">Cost</p>
                    <p className="text-xs font-bold text-violet-400 mt-0.5">${result.cost.toFixed(4)}</p>
                    {result.savedVsGPT4o > 0 && (
                      <p className="text-[10px] text-emerald-400">saved ${result.savedVsGPT4o.toFixed(4)}</p>
                    )}
                  </div>
                  <div className="bg-white/[0.05] rounded-lg p-2.5">
                    <p className="text-[10px] text-gray-500">Latency</p>
                    <p className="text-xs font-bold text-cyan-400 mt-0.5">{result.latency}ms</p>
                  </div>
                  <div className="bg-white/[0.05] rounded-lg p-2.5">
                    <p className="text-[10px] text-gray-500">Quality</p>
                    <p className="text-xs font-bold text-emerald-400 mt-0.5">{(result.qualityScore * 100).toFixed(0)}%</p>
                  </div>
                </div>

                <div className="bg-white/[0.03] rounded-lg p-3 mb-3">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Routing Reasoning</p>
                  <p className="text-xs text-gray-300">{result.reasoning}</p>
                </div>

                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Alternative Models Considered</p>
                  <div className="space-y-1.5">
                    {result.alternatives.map((alt) => (
                      <div key={alt.model} className="flex items-center justify-between px-3 py-2 bg-white/[0.03] rounded-lg">
                        <span className="text-xs text-gray-300">{alt.model}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-gray-500">${alt.cost.toFixed(4)}</span>
                          <span className="text-[10px] text-violet-400">{(alt.quality * 100).toFixed(0)}% quality</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
