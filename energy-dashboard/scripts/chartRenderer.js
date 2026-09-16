const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * 建立 SVG 命名空間元素的輔助函式
 * @param {string} tagName
 * @returns {SVGElement}
 */
function createSvgEl(tagName) {
  return document.createElementNS(SVG_NS, tagName);
}

/**
 * 繪製能源使用趨勢折線圖
 * @param {HTMLElement} container - SVG 的父容器元素
 * @param {{ labels: string[], values: number[] }} data - 圖表資料
 * @param {{ width?: number, height?: number, padding?: number }} [options] - 繪圖參數（可省略）
 */
export function render(container, data, options = {}) {
  // 清空容器
  container.innerHTML = '';

  const { values, labels } = data;

  // 資料不足時顯示提示文字
  if (!values || values.length < 7) {
    const p = document.createElement('p');
    p.textContent = '資料不足，無法繪製圖表';
    container.appendChild(p);
    return;
  }

  const width = options.width ?? 600;
  const height = options.height ?? 300;
  const padding = options.padding ?? 40;

  const drawWidth = width - padding * 2;   // 520
  const drawHeight = height - padding * 2; // 220
  const n = values.length; // 7

  const maxValue = Math.max(...values);

  // 建立 SVG 根元素
  const svg = createSvgEl('svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', '能源使用趨勢圖');

  // ── Y 軸 ──
  const yAxis = createSvgEl('line');
  yAxis.setAttribute('x1', padding);
  yAxis.setAttribute('y1', padding);
  yAxis.setAttribute('x2', padding);
  yAxis.setAttribute('y2', padding + drawHeight);
  yAxis.setAttribute('stroke', '#666');
  svg.appendChild(yAxis);

  // Y 軸標籤 "kWh"（旋轉 -90°）
  const yLabel = createSvgEl('text');
  yLabel.setAttribute('x', '10');
  yLabel.setAttribute('y', '155');
  yLabel.setAttribute('transform', 'rotate(-90,10,155)');
  yLabel.textContent = 'kWh';
  svg.appendChild(yLabel);

  // ── X 軸 ──
  const xAxis = createSvgEl('line');
  xAxis.setAttribute('x1', padding);
  xAxis.setAttribute('y1', padding + drawHeight);
  xAxis.setAttribute('x2', padding + drawWidth);
  xAxis.setAttribute('y2', padding + drawHeight);
  xAxis.setAttribute('stroke', '#666');
  svg.appendChild(xAxis);

  // X 軸時段標籤（7 個）
  for (let i = 0; i < n; i++) {
    const x = padding + (i / (n - 1)) * drawWidth;
    const xText = createSvgEl('text');
    xText.setAttribute('x', x);
    xText.setAttribute('y', padding + drawHeight + 20);
    xText.setAttribute('text-anchor', 'middle');
    xText.textContent = labels[i] ?? '';
    svg.appendChild(xText);
  }

  // ── 座標映射 ──
  const points = values.map((value, i) => {
    const x = padding + (i / (n - 1)) * drawWidth;
    // maxValue 為 0 時，所有點落在底部，不崩潰
    const y = maxValue === 0
      ? padding + drawHeight
      : padding + drawHeight - (value / maxValue) * drawHeight;
    return { x, y };
  });

  // ── 折線 <polyline> ──
  const pointsAttr = points.map(p => `${p.x},${p.y}`).join(' ');
  const polyline = createSvgEl('polyline');
  polyline.setAttribute('points', pointsAttr);
  polyline.setAttribute('fill', 'none');
  polyline.setAttribute('stroke', '#3b82f6');
  polyline.setAttribute('stroke-width', '2');
  svg.appendChild(polyline);

  // ── 資料點 <circle>（7 個）──
  for (let i = 0; i < n; i++) {
    const circle = createSvgEl('circle');
    circle.setAttribute('cx', points[i].x);
    circle.setAttribute('cy', points[i].y);
    circle.setAttribute('r', '4');
    circle.setAttribute('fill', '#3b82f6');
    circle.setAttribute('data-index', String(i));
    svg.appendChild(circle);
  }

  container.appendChild(svg);
}
