// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { calculate, CONVERSION_FACTOR } from '../scripts/carbonCalculator.js';

describe('calculate()', () => {
  it('0 kWh 應回傳 0', () => {
    expect(calculate(0)).toBe(0);
  });

  it('正整數 100 kWh 應回傳 50.9', () => {
    expect(calculate(100)).toBeCloseTo(100 * CONVERSION_FACTOR, 5);
  });

  it('浮點數 47.35 kWh 應回傳約 24.10', () => {
    expect(calculate(47.35)).toBeCloseTo(47.35 * CONVERSION_FACTOR, 4);
  });

  it('負數輸入應拋出 Error', () => {
    expect(() => calculate(-1)).toThrow(Error);
    expect(() => calculate(-0.001)).toThrow('kwh 不得為負數');
  });
});
