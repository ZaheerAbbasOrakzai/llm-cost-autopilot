import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  calculateCost,
  calculateMonthlyProjection,
  calculateROI,
  calculateSavings,
} from './costCalculator';

describe('calculateCost', () => {
  it('calculates input and output costs from per-million-token pricing', () => {
    expect(calculateCost('gpt-4o', 1000, 500)).toMatchObject({
      inputCost: 0.005,
      outputCost: 0.0075,
      totalCost: 0.0125,
      totalTokens: 1500,
    });
  });

  it('rejects unknown model pricing instead of reporting a false zero cost', () => {
    expect(() => calculateCost('not-a-model', 100, 50)).toThrow(RangeError);
  });

  it.each([-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects invalid token count %s',
    (tokens) => {
      expect(() => calculateCost('gpt-4o', tokens, 1)).toThrow(RangeError);
    },
  );
});

describe('cost projections', () => {
  it('projects a daily cost for a positive integer number of days', () => {
    expect(calculateMonthlyProjection(12, 31)).toBe(372);
  });

  it('rejects invalid projection inputs', () => {
    expect(() => calculateMonthlyProjection(-1)).toThrow(RangeError);
    expect(() => calculateMonthlyProjection(1, 0)).toThrow(RangeError);
    expect(() => calculateSavings(Number.NaN, 'gpt-4o', 1, 1)).toThrow(RangeError);
  });
});

describe('calculateROI', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('calculates payback and clamps month-end dates to the final day', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-31T12:00:00Z'));

    const result = calculateROI(100, 100);

    expect(result.paybackMonths).toBe(1);
    expect(result.breakEvenDate.toISOString()).toBe('2024-02-29T12:00:00.000Z');
  });

  it('rejects inputs that make ROI undefined', () => {
    expect(() => calculateROI(0, 10)).toThrow(RangeError);
    expect(() => calculateROI(100, 0)).toThrow(RangeError);
  });
});
