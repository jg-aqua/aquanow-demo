// Static demo data — always the same on every page load

export const STATIC_ASSETS = [
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    price_usd: 67342.18,
    change_24h: 2.34,
    color: '#F7931A',
    icon_letter: 'B',
    sparkline: [64000, 64800, 63900, 65100, 66200, 65800, 67342],
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    price_usd: 3512.44,
    change_24h: 1.87,
    color: '#627EEA',
    icon_letter: 'E',
    sparkline: [3300, 3380, 3290, 3450, 3510, 3480, 3512],
  },
  {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    price_usd: 178.92,
    change_24h: -0.94,
    color: '#9945FF',
    icon_letter: 'S',
    sparkline: [185, 182, 179, 181, 176, 178, 178.92],
  },
  {
    id: 'xrp',
    symbol: 'XRP',
    name: 'XRP',
    price_usd: 0.5231,
    change_24h: 1.14,
    color: '#346AA9',
    icon_letter: 'X',
    sparkline: [0.50, 0.51, 0.505, 0.518, 0.520, 0.521, 0.5231],
  },
  {
    id: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    price_usd: 1.00,
    change_24h: 0.01,
    color: '#2775CA',
    icon_letter: 'U',
    sparkline: [1, 1, 1, 1, 1, 1, 1],
  },
];

export const STATIC_HOLDINGS = [
  { id: 'h-btc', symbol: 'BTC', amount: 0.4821, wallet_address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf5a' },
  { id: 'h-eth', symbol: 'ETH', amount: 4.213, wallet_address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' },
  { id: 'h-sol', symbol: 'SOL', amount: 32.75, wallet_address: 'So11111111111111111111111111111111111111112' },
  { id: 'h-usdc', symbol: 'USDC', amount: 1250.00, wallet_address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
];

const d = (daysAgo, h = 12, m = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(h, m, 0, 0);
  return date.toISOString();
};

export const STATIC_TRANSACTIONS = [
  { id: 'tx1', type: 'receive', symbol: 'BTC', amount: 0.1, usd_value: 6734.22, counterparty: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5', status: 'confirmed', created_date: d(0, 9, 15) },
  { id: 'tx2', type: 'send', symbol: 'ETH', amount: 0.5, usd_value: 1756.22, counterparty: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', status: 'confirmed', created_date: d(1, 14, 30) },
  { id: 'tx3', type: 'swap', symbol: 'SOL', amount: 10, usd_value: 1789.20, counterparty: 'Swap: SOL → USDC', status: 'confirmed', created_date: d(2, 11, 0) },
  { id: 'tx4', type: 'receive', symbol: 'USDC', amount: 500, usd_value: 500.00, counterparty: '0x28C6c06298d514Db089934071355E5743bf21d60', status: 'confirmed', created_date: d(3, 16, 45) },
  { id: 'tx5', type: 'send', symbol: 'BTC', amount: 0.05, usd_value: 3367.11, counterparty: '1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF', status: 'confirmed', created_date: d(5, 10, 0) },
  { id: 'tx6', type: 'receive', symbol: 'ETH', amount: 1.2, usd_value: 4214.93, counterparty: '0x4e83362442b8d1bec281594CEA3050c8EB01311C', status: 'confirmed', created_date: d(7, 8, 20) },
  { id: 'tx7', type: 'swap', symbol: 'XRP', amount: 500, usd_value: 261.55, counterparty: 'Swap: XRP → ETH', status: 'confirmed', created_date: d(10, 13, 10) },
];