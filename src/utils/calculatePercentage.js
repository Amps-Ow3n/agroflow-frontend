// src/utils/calculatePercentage.js
export const calculatePercentage = (value, total, decimals = 1) => {
  if (!total || total === 0) return 0;

  const percent = (value / total) * 100;
  return Number(percent.toFixed(decimals));
};

// Format as string with % symbol
export const formatPercentage = (value, total, decimals = 1) => {
  const percent = calculatePercentage(value, total, decimals);
  return `${percent}%`;
};

// Clamp percentage between 0 and 100 (for UI bars)
export const clampPercentage = (percent) => {
  if (percent < 0) return 0;
  if (percent > 100) return 100;
  return percent;
};
