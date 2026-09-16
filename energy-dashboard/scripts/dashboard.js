import { mockData } from './mockData.js';
import { calculate } from './carbonCalculator.js';
import { render as renderChart } from './chartRenderer.js';
import { render as renderDevices } from './deviceMonitor.js';

/**
 * 將數值格式化為小數點後 2 位的字串
 * @param {number|null|undefined} value
 * @returns {string}
 */
export function formatValue(value) {
  if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
    return '--';
  }
  return Number(value).toFixed(2);
}

/**
 * 初始化儀表板：讀取模擬資料、渲染能源卡片、圖表與設備清單
 */
export function init() {
  // 能源卡片
  const todayEl = document.getElementById('today-kwh');
  const monthEl = document.getElementById('month-kwh');
  const carbonEl = document.getElementById('carbon-emission');

  if (todayEl) todayEl.textContent = formatValue(mockData.energy.todayKwh);
  if (monthEl) monthEl.textContent = formatValue(mockData.energy.monthKwh);

  if (carbonEl) {
    try {
      const carbon = calculate(mockData.energy.todayKwh);
      carbonEl.textContent = formatValue(carbon);
    } catch (e) {
      carbonEl.textContent = '--';
    }
  }

  // 圖表
  const chartContainer = document.querySelector('.chart-container');
  if (chartContainer) renderChart(chartContainer, mockData.chart, { width: 600, height: 300, padding: 40 });

  // 設備監控
  const deviceContainer = document.querySelector('.device-monitor');
  if (deviceContainer) renderDevices(deviceContainer, mockData.devices);
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', init);
}
