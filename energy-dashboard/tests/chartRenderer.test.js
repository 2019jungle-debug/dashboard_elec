// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '../scripts/chartRenderer.js';

describe('chartRenderer.render()', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('資料不足時顯示錯誤提示，且不產生 polyline', () => {
    render(container, { labels: ['a', 'b'], values: [1, 2] }, {});
    expect(container.querySelector('polyline')).toBeNull();
    expect(container.querySelector('p').textContent).toBe('資料不足，無法繪製圖表');
  });

  it('空陣列也顯示錯誤提示', () => {
    render(container, { labels: [], values: [] }, {});
    expect(container.querySelector('p').textContent).toBe('資料不足，無法繪製圖表');
  });

  it('7 筆資料應產生 SVG 與 polyline', () => {
    const values = [38.2, 42.5, 47.3, 39.8, 55.1, 61.4, 47.35];
    const labels = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];
    render(container, { labels, values }, { width: 600, height: 300, padding: 40 });
    expect(container.querySelector('svg')).not.toBeNull();
    expect(container.querySelector('polyline')).not.toBeNull();
  });

  it('第一個資料點 x 座標應為 40（padding）', () => {
    const values = [38.2, 42.5, 47.3, 39.8, 55.1, 61.4, 47.35];
    const labels = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];
    render(container, { labels, values }, { width: 600, height: 300, padding: 40 });
    const circles = container.querySelectorAll('circle[data-index]');
    expect(parseFloat(circles[0].getAttribute('cx'))).toBeCloseTo(40, 1);
  });

  it('最後一個資料點 x 座標應為 560（padding + drawWidth）', () => {
    const values = [38.2, 42.5, 47.3, 39.8, 55.1, 61.4, 47.35];
    const labels = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];
    render(container, { labels, values }, { width: 600, height: 300, padding: 40 });
    const circles = container.querySelectorAll('circle[data-index]');
    expect(parseFloat(circles[6].getAttribute('cx'))).toBeCloseTo(560, 1);
  });

  it('最大值的 y 座標應為 40（padding，即圖表頂部）', () => {
    // values[5] = 61.4 是最大值 → y 應為 40
    const values = [38.2, 42.5, 47.3, 39.8, 55.1, 61.4, 47.35];
    const labels = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];
    render(container, { labels, values }, { width: 600, height: 300, padding: 40 });
    const circles = container.querySelectorAll('circle[data-index]');
    // index 5 的值 61.4 為最大值 → y = 40 + 220 - (61.4/61.4)*220 = 40
    expect(parseFloat(circles[5].getAttribute('cy'))).toBeCloseTo(40, 1);
  });
});
