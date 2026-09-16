// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { init, formatValue } from '../scripts/dashboard.js';
import { mockData } from '../scripts/mockData.js';
import { render as renderChart } from '../scripts/chartRenderer.js';
import { render as renderDevices } from '../scripts/deviceMonitor.js';

function setupDOM() {
  document.body.innerHTML = `
    <main class="dashboard-grid">
      <section class="energy-cards">
        <article class="energy-card">
          <span id="today-kwh">--</span>
        </article>
        <article class="energy-card">
          <span id="month-kwh">--</span>
        </article>
        <article class="energy-card">
          <span id="carbon-emission">--</span>
        </article>
      </section>
      <div class="device-monitor"></div>
      <div class="chart-container"></div>
    </main>
  `;
}

describe('Integration: 頁面完整渲染', () => {
  beforeEach(() => {
    setupDOM();
    init();
  });

  it('今日用電量顯示非空字串', () => {
    const el = document.getElementById('today-kwh');
    expect(el.textContent).not.toBe('');
    expect(el.textContent).not.toBe('--');
  });

  it('本月累計用電量顯示非空字串', () => {
    const el = document.getElementById('month-kwh');
    expect(el.textContent).not.toBe('');
  });

  it('預估碳排放量顯示非空字串', () => {
    const el = document.getElementById('carbon-emission');
    expect(el.textContent).not.toBe('');
  });

  it('SVG 存在於 .chart-container', () => {
    const svg = document.querySelector('.chart-container svg');
    expect(svg).not.toBeNull();
  });

  it('設備清單數量等於 mockData.devices 長度', () => {
    const items = document.querySelectorAll('.device-monitor li');
    expect(items.length).toBe(mockData.devices.length);
  });

  it('.alert-banner 存在且包含「太陽能逆變器」', () => {
    const banner = document.querySelector('.device-monitor .alert-banner');
    expect(banner).not.toBeNull();
    expect(banner.textContent).toContain('太陽能逆變器');
  });
});

describe('Integration: 缺失資料與空陣列邊界測試', () => {
  // 保存原始值，測試後還原
  let originalTodayKwh;
  let originalChartValues;
  let originalDevices;

  beforeEach(() => {
    originalTodayKwh = mockData.energy.todayKwh;
    originalChartValues = mockData.chart.values;
    originalDevices = mockData.devices;
    setupDOM();
  });

  afterEach(() => {
    mockData.energy.todayKwh = originalTodayKwh;
    mockData.chart.values = originalChartValues;
    mockData.devices = originalDevices;
  });

  it('todayKwh = null 時顯示 "--"', () => {
    // 直接測試 formatValue 純函式
    expect(formatValue(null)).toBe('--');

    // 同時驗證寫入 DOM 後顯示正確
    const el = document.getElementById('today-kwh');
    el.textContent = formatValue(null);
    expect(el.textContent).toBe('--');
  });

  it('chart.values 長度小於 7 時顯示「資料不足，無法繪製圖表」', () => {
    const container = document.querySelector('.chart-container');
    renderChart(container, { labels: ['週一', '週二'], values: [10, 20] }, {});
    expect(container.textContent).toContain('資料不足，無法繪製圖表');
    expect(container.querySelector('svg')).toBeNull();
  });

  it('devices = [] 時顯示「目前無設備資料」且無 .alert-banner', () => {
    const container = document.querySelector('.device-monitor');
    renderDevices(container, []);
    expect(container.textContent).toContain('目前無設備資料');
    expect(container.querySelector('.alert-banner')).toBeNull();
  });
});
