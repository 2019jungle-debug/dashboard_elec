import { describe, it, expect } from 'vitest';
import { formatValue } from '../scripts/dashboard.js';

describe('formatValue()', () => {
  it('整數 47 應回傳 "47.00"', () => {
    expect(formatValue(47)).toBe('47.00');
  });

  it('浮點數 47.3 應回傳 "47.30"', () => {
    expect(formatValue(47.3)).toBe('47.30');
  });

  it('零值 0 應回傳 "0.00"', () => {
    expect(formatValue(0)).toBe('0.00');
  });

  it('null 應回傳 "--"', () => {
    expect(formatValue(null)).toBe('--');
  });

  it('undefined 應回傳 "--"', () => {
    expect(formatValue(undefined)).toBe('--');
  });

  it('NaN 應回傳 "--"', () => {
    expect(formatValue(NaN)).toBe('--');
  });
});
