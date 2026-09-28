// Real cost calculation utilities based on actual LLM provider pricing (as of 2024)

export interface CostCalculation {
  inputCost: number;
  outputCost: number;
  totalCost: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

import { addMonths } from 'date-fns';

// Example price assumptions per 1M tokens; verify provider rates before use.
export const MODEL_PRICING = {
  'gpt-4o': { input: 5.0, output: 15.0 }, // $5/1M input, $15/1M output
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-4-turbo': { input: 10.0, output: 30.0 },
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
  'claude-3.5-sonnet': { input: 3.0, output: 15.0 },
  'claude-3-opus': { input: 15.0, output: 75.0 },
  'claude-3-haiku': { input: 0.25, output: 1.25 },
  'claude-3-sonnet': { input: 3.0, output: 15.0 },
  'llama-3.1-405b': { input: 5.0, output: 5.0 },
  'llama-3.1-70b': { input: 0.59, output: 0.79 },
  'llama-3.1-8b': { input: 0.05, output: 0.08 },
  'mixtral-8x7b': { input: 0.24, output: 0.24 },
  'qwen-2-72b': { input: 0.90, output: 0.90 },
  'phi-3-mini': { input: 0, output: 0 }, // Local model
  'mistral-7b': { input: 0, output: 0 }, // Local model
} as const;

export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): CostCalculation {
  validateTokenCount('inputTokens', inputTokens);
  validateTokenCount('outputTokens', outputTokens);

  const pricing = MODEL_PRICING[model as keyof typeof MODEL_PRICING];
  
  if (!pricing) {
    throw new RangeError(`Unknown model pricing: ${model}`);
  }

  // Pricing is per 1M tokens, convert to per token
  const inputCost = (inputTokens * pricing.input) / 1_000_000;
  const outputCost = (outputTokens * pricing.output) / 1_000_000;

  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
  };
}

export function formatCost(cost: number): string {
  if (cost === 0) return '$0.00';
  if (cost < 0.001) return `$${cost.toFixed(6)}`;
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  if (cost < 1) return `$${cost.toFixed(3)}`;
  return `$${cost.toFixed(2)}`;
}

export function calculateSavings(
  actualCost: number,
  baselineModel: string,
  inputTokens: number,
  outputTokens: number
): number {
  if (!Number.isFinite(actualCost) || actualCost < 0) {
    throw new RangeError('actualCost must be a finite, non-negative number');
  }

  const baselineCost = calculateCost(baselineModel, inputTokens, outputTokens);
  return baselineCost.totalCost - actualCost;
}

export function calculateMonthlyProjection(dailyCost: number, daysInMonth: number = 30): number {
  if (!Number.isFinite(dailyCost) || dailyCost < 0) {
    throw new RangeError('dailyCost must be a finite, non-negative number');
  }
  if (!Number.isInteger(daysInMonth) || daysInMonth <= 0) {
    throw new RangeError('daysInMonth must be a positive integer');
  }

  return dailyCost * daysInMonth;
}

export function calculateROI(initialInvestment: number, monthlySavings: number): {
  paybackMonths: number;
  annualROI: number;
  breakEvenDate: Date;
} {
  if (!Number.isFinite(initialInvestment) || initialInvestment <= 0) {
    throw new RangeError('initialInvestment must be a finite, positive number');
  }
  if (!Number.isFinite(monthlySavings) || monthlySavings <= 0) {
    throw new RangeError('monthlySavings must be a finite, positive number');
  }

  const paybackMonths = initialInvestment / monthlySavings;
  const annualSavings = monthlySavings * 12;
  const annualROI = ((annualSavings - initialInvestment) / initialInvestment) * 100;
  
  const breakEvenDate = addMonths(new Date(), Math.ceil(paybackMonths));

  return {
    paybackMonths,
    annualROI,
    breakEvenDate,
  };
}

function validateTokenCount(name: string, value: number): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative integer`);
  }
}
