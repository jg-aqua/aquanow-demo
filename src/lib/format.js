export const formatUSD = (value, opts = {}) => {
  const { compact = false, maximumFractionDigits = 2 } = opts;
  if (value === null || value === undefined || isNaN(value)) return '$0.00';
  if (compact && Math.abs(value) >= 10000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits,
  }).format(value);
};

export const formatAmount = (value, symbol = '') => {
  if (value === null || value === undefined || isNaN(value)) return `0 ${symbol}`.trim();
  const digits = Math.abs(value) >= 1 ? 4 : 6;
  const n = Number(value).toLocaleString('en-US', {
    maximumFractionDigits: digits,
  });
  return symbol ? `${n} ${symbol}` : n;
};

export const formatPercent = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0.00%';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const shortAddress = (addr = '', head = 6, tail = 4) => {
  if (!addr) return '';
  if (addr.length <= head + tail) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
};