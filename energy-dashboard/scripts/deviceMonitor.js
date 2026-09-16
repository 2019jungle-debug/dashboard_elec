/**
 * 渲染設備清單與異常提醒橫幅
 * @param {HTMLElement} container
 * @param {Array<{id: string, name: string, status: 'normal'|'abnormal'|'offline'}>} devices
 */
export function render(container, devices) {
  container.innerHTML = '';

  if (!devices || devices.length === 0) {
    const p = document.createElement('p');
    p.textContent = '目前無設備資料';
    container.appendChild(p);
    return;
  }

  const abnormalDevices = devices.filter(d => d.status === 'abnormal');

  if (abnormalDevices.length > 0) {
    const banner = document.createElement('div');
    banner.className = 'alert-banner';
    // 列出所有異常設備名稱，總字數控制在 30 字以內
    const names = abnormalDevices.map(d => d.name).join('、');
    banner.textContent = `異常設備：${names}`;
    container.appendChild(banner);
  }

  const list = document.createElement('ul');
  for (const device of devices) {
    const li = document.createElement('li');

    const dot = document.createElement('span');
    dot.className = `status-dot status--${device.status}`;

    const nameSpan = document.createElement('span');
    nameSpan.textContent = device.name;

    li.appendChild(dot);
    li.appendChild(nameSpan);
    list.appendChild(li);
  }
  container.appendChild(list);
}
