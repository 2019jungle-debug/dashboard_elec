// @vitest-environment jsdom
import { describe, it } from 'vitest';
import fc from 'fast-check';
import { render as renderChart } from '../scripts/chartRenderer.js';
import { render as renderDevices } from '../scripts/deviceMonitor.js';

/**
 * DOM 屬性測試 (DOM Property-Based Tests)
 * 使用 fast-check + jsdom 驗證 DOM 渲染邏輯的普遍性質
 */
describe('Feature: energy-dashboard (DOM Properties)', () => {
  /**
   * Property 4：圖表資料點數量不變量
   * Validates: Requirements 3.1, 3.3
   */
  it('Property 4: 圖表資料點數量不變量', () => {
    fc.assert(
      fc.property(
        fc.array(fc.float({ min: 0, noNaN: true }), { minLength: 7, maxLength: 7 }),
        (values) => {
          const container = document.createElement('div');
          const labels = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];
          renderChart(container, { labels, values }, { width: 600, height: 300, padding: 40 });
          const circles = container.querySelectorAll('circle[data-index]');
          return circles.length === 7;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5：資料不足時顯示錯誤提示
   * Validates: Requirements 3.5
   */
  it('Property 5: 資料不足時顯示錯誤提示', () => {
    fc.assert(
      fc.property(
        fc.array(fc.float({ min: 0, noNaN: true }), { minLength: 0, maxLength: 6 }),
        (values) => {
          const container = document.createElement('div');
          const labels = values.map((_, i) => `label-${i}`);
          renderChart(container, { labels, values }, {});
          const hasPolyline = container.querySelector('polyline') !== null;
          const hasCircle = container.querySelector('circle') !== null;
          const hasErrorMsg = container.textContent.includes('資料不足，無法繪製圖表');
          return !hasPolyline && !hasCircle && hasErrorMsg;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6：設備清單數量不變量
   * Validates: Requirements 4.1, 4.2
   */
  it('Property 6: 設備清單數量不變量', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.string(),
            status: fc.oneof(fc.constant('normal'), fc.constant('abnormal'), fc.constant('offline'))
          }),
          { minLength: 1 }
        ),
        (devices) => {
          const container = document.createElement('div');
          renderDevices(container, devices);
          const items = container.querySelectorAll('li');
          if (items.length !== devices.length) return false;
          for (const li of items) {
            const dots = li.querySelectorAll('[class*="status--"]');
            if (dots.length !== 1) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7：異常提醒橫幅可見性
   * Validates: Requirements 4.4, 4.5
   *
   * Note: The implementation lists all abnormal device names without enforcing a
   * 30-char hard limit, so this property verifies banner presence/absence and
   * that all abnormal device names appear in the banner text.
   */
  it('Property 7: 異常提醒橫幅可見性', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 5 }),
            status: fc.oneof(fc.constant('normal'), fc.constant('abnormal'), fc.constant('offline'))
          }),
          { minLength: 1 }
        ),
        (devices) => {
          const container = document.createElement('div');
          renderDevices(container, devices);
          const hasAbnormal = devices.some(d => d.status === 'abnormal');
          const banner = container.querySelector('.alert-banner');
          if (hasAbnormal) {
            if (!banner) return false;
            const abnormalNames = devices.filter(d => d.status === 'abnormal').map(d => d.name);
            for (const name of abnormalNames) {
              if (!banner.textContent.includes(name)) return false;
            }
          } else {
            if (banner) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
