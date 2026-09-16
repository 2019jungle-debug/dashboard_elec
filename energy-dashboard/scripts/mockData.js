export const mockData = {
  energy: {
    todayKwh: 47.35,
    monthKwh: 1284.60,
  },
  chart: {
    labels: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
    values: [38.2, 42.5, 47.3, 39.8, 55.1, 61.4, 47.35],
  },
  devices: [
    { id: 'dev-001', name: '中央空調主機', status: 'normal'   },
    { id: 'dev-002', name: '太陽能逆變器', status: 'abnormal' },
    { id: 'dev-003', name: '備用發電機',   status: 'offline'  },
    { id: 'dev-004', name: '照明迴路 A',   status: 'normal'   },
  ],
};
