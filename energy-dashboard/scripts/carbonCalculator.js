export const CONVERSION_FACTOR = 0.509;

/**
 * 計算預估碳排放量
 * @param {number} kwh - 用電量（kWh），必須為非負數
 * @returns {number} 碳排放量（kg CO₂）
 * @throws {Error} 若 kwh 為負數則拋出錯誤
 */
export function calculate(kwh) {
  if (kwh < 0) {
    throw new Error('kwh 不得為負數');
  }
  return kwh * CONVERSION_FACTOR;
}
