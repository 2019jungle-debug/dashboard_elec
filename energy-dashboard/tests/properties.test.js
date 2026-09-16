// @vitest-environment node
// @vitest-environment node
// @vitest-environment node
import { describe, it } from 'vitest';
import fc from 'fast-check';
import { formatValue } from '../scripts/dashboard.js';
import { calculate } from '../scripts/carbonCalculator.js';

/**
 * 屬性測試 (Property-Based Tests)
 * 使用 fast-check 驗證核心邏輯的普遍性質
 */
describe('屬性測試 (Property-Based Tests)', () => {
  /**
   * Property 1：數值格式化四捨五入
   * Validates: Requirements 1.1, 1.2, 2.1
   */
  it('Property 1: 數值格式化四捨五入', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 10000, noNaN: true }),
        (x) => {
          const result = formatValue(x);
          const expected = Number(x).toFixed(2);
          // 字串相等且末尾有 2 位小數
          return result === expected && /\.\d{2}$/.test(result);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2：缺失值回傳佔位符
   * Validates: Requirements 1.5
   */
  it('Property 2: 缺失值回傳佔位符', () => {
    // null, undefined, NaN 三種輸入都應回傳 "--"
    fc.assert(
      fc.property(
        fc.constantFrom(null, undefined, NaN),
        (val) => formatValue(val) === '--'
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Property 3：碳排計算乘法一致性
   * Validates: Requirements 2.2
   */
  it('Property 3: 碳排計算乘法一致性', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 10000, noNaN: true }),
        (kwh) => {
          const result = calculate(kwh);
          return Math.abs(result - kwh * 0.509) < 0.0001;
        }
      ),
      { numRuns: 100 }
    );
  });
});
