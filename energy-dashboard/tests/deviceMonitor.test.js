// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '../scripts/deviceMonitor.js';

describe('deviceMonitor.render()', () => {
  let container;
  beforeEach(() => { container = document.createElement('div'); });

  it('空陣列時顯示「目前無設備資料」', () => {
    render(container, []);
    expect(container.querySelector('p').textContent).toBe('目前無設備資料');
    expect(container.querySelector('.alert-banner')).toBeNull();
  });

  it('無異常設備時不顯示 alert-banner', () => {
    const devices = [
      { id: '1', name: '設備A', status: 'normal' },
      { id: '2', name: '設備B', status: 'offline' },
    ];
    render(container, devices);
    expect(container.querySelector('.alert-banner')).toBeNull();
    expect(container.querySelectorAll('li')).toHaveLength(2);
  });

  it('1 台異常設備時顯示 alert-banner 且包含設備名稱', () => {
    const devices = [
      { id: '1', name: '太陽能逆變器', status: 'abnormal' },
      { id: '2', name: '空調主機', status: 'normal' },
    ];
    render(container, devices);
    const banner = container.querySelector('.alert-banner');
    expect(banner).not.toBeNull();
    expect(banner.textContent).toContain('太陽能逆變器');
  });

  it('多台異常設備時 alert-banner 包含所有異常設備名稱', () => {
    const devices = [
      { id: '1', name: '設備A', status: 'abnormal' },
      { id: '2', name: '設備B', status: 'abnormal' },
      { id: '3', name: '設備C', status: 'normal' },
    ];
    render(container, devices);
    const banner = container.querySelector('.alert-banner');
    expect(banner).not.toBeNull();
    expect(banner.textContent).toContain('設備A');
    expect(banner.textContent).toContain('設備B');
  });

  it('每個設備項目都有對應的 status-dot class', () => {
    const devices = [
      { id: '1', name: 'A', status: 'normal' },
      { id: '2', name: 'B', status: 'abnormal' },
      { id: '3', name: 'C', status: 'offline' },
    ];
    render(container, devices);
    expect(container.querySelector('.status--normal')).not.toBeNull();
    expect(container.querySelector('.status--abnormal')).not.toBeNull();
    expect(container.querySelector('.status--offline')).not.toBeNull();
  });
});
