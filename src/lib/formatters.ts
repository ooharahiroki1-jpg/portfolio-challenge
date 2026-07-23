export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0
  }).format(Math.round(value));

export const formatCompactCurrency = (value: number) => {
  if (Math.abs(value) >= 10_000) {
    return `${Math.round(value / 10_000).toLocaleString('ja-JP')}万円`;
  }
  return formatCurrency(value);
};

export const formatPercent = (value: number, digits = 1) =>
  `${value >= 0 ? '+' : ''}${value.toFixed(digits)}%`;

export const formatNumber = (value: number) =>
  Math.round(value).toLocaleString('ja-JP');

export const getChangeClass = (value: number) => {
  if (value > 0) return 'text-rise-500';
  if (value < 0) return 'text-fall-500';
  return 'text-slate-200';
};
