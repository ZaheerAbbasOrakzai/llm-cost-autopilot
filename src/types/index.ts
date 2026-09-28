// Real TypeScript types matching actual LLM provider APIs and database schemas

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'viewer';
  teamId: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface Team {
  id: string;
  name: string;
  monthlyBudget: number;
  currentSpend: number;
  requestCount: number;
  memberCount: number;
  createdAt: string;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  teamId: string;
  permissions: string[];
  rateLimit: number;
  createdAt: string;
  lastUsedAt: string | null;
  isActive: boolean;
}

// Real LLM Provider Types
export interface LLMProvider {
  id: string;
  name: 'openai' | 'anthropic' | 'groq' | 'together' | 'local';
  displayName: string;
  baseUrl: string;
  apiKey: string;
  isActive: boolean;
  healthStatus: 'healthy' | 'degraded' | 'down';
  latency: number;
  uptime: number;
  models: LLMModel[];
  rateLimits: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
}

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  inputCostPer1k: number;
  outputCostPer1k: number;
  contextWindow: number;
  maxOutputTokens: number;
  latency: number;
  qualityScore: number;
  tier: 'simple' | 'medium' | 'hard';
  capabilities: string[];
}

// Real API Request/Response Types
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  id: string;
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  metadata?: {
    teamId: string;
    userId: string;
    apiKeyId: string;
    complexity?: 'simple' | 'medium' | 'hard';
    routedFrom?: string;
  };
}

export interface LLMResponse {
  id: string;
  model: string;
  choices: {
    message: ChatMessage;
    finishReason: 'stop' | 'length' | 'content_filter';
    index: number;
  }[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost: number;
  latency: number;
  timestamp: string;
}

export interface RoutingDecision {
  id: string;
  requestId: string;
  timestamp: string;
  inputPreview: string;
  complexity: 'simple' | 'medium' | 'hard';
  confidence: number;
  selectedModel: string;
  selectedProvider: string;
  alternativeModels: {
    model: string;
    provider: string;
    estimatedCost: number;
    estimatedQuality: number;
  }[];
  reasoning: string;
  tokens: {
    input: number;
    output: number;
  };
  cost: number;
  latency: number;
  qualityScore: number;
  savedVsBaseline: number;
}

export interface ValidationResult {
  id: string;
  requestId: string;
  timestamp: string;
  originalModel: string;
  validationModel: string;
  originalScore: number;
  validationScore: number;
  delta: number;
  passed: boolean;
  costDelta: number;
  reasoning: string;
}

export interface CostBreakdown {
  date: string;
  teamId: string;
  teamName: string;
  totalCost: number;
  inputTokens: number;
  outputTokens: number;
  requestCount: number;
  avgCostPerRequest: number;
  savingsVsBaseline: number;
  byModel: {
    model: string;
    provider: string;
    cost: number;
    requests: number;
    tokens: number;
  }[];
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  metadata?: Record<string, any>;
}

export interface SystemMetrics {
  requestsPerMinute: number;
  avgLatency: number;
  errorRate: number;
  cacheHitRate: number;
  activeModels: number;
  totalCostPerMinute: number;
}

export interface CircuitBreakerState {
  provider: string;
  state: 'closed' | 'open' | 'half-open';
  failureCount: number;
  lastFailureAt: string | null;
  successCount: number;
  threshold: number;
  timeout: number;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  metadata?: Record<string, any>;
}

export interface RoutingPolicy {
  id: string;
  name: string;
  complexity: 'simple' | 'medium' | 'hard';
  minQuality: number;
  maxCostPer1k: number;
  maxLatency: number;
  preferredModels: string[];
  fallbackModels: string[];
  isActive: boolean;
}

export interface BudgetAlert {
  id: string;
  teamId: string;
  threshold: number;
  currentSpend: number;
  monthlyBudget: number;
  percentage: number;
  triggeredAt: string;
}
