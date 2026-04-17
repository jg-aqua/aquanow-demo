import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

// Map our symbols to CoinGecko IDs
const SYMBOL_TO_CG_ID = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  USDC: 'usd-coin',
  XRP: 'ripple',
  ADA: 'cardano',
  LINK: 'chainlink',
  AVAX: 'avalanche-2',
  DOGE: 'dogecoin',
};

// CoinGecko coin image URLs (official logos, high quality)
export const COIN_IMAGE_URLS = {
  BTC: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  SOL: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
  USDC: 'https://assets.coingecko.com/coins/images/6319/large/usdc.png',
  XRP: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
  ADA: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
  LINK: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
  AVAX: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
  DOGE: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
};

async function fetchLivePrices(symbols) {
  const ids = symbols
    .map((s) => SYMBOL_TO_CG_ID[s])
    .filter(Boolean)
    .join(',');

  if (!ids) return {};

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('CoinGecko fetch failed');
  const data = await res.json();

  // Invert back to symbol-keyed map
  const result = {};
  for (const [sym, cgId] of Object.entries(SYMBOL_TO_CG_ID)) {
    if (data[cgId]) {
      result[sym] = {
        price_usd: data[cgId].usd,
        change_24h: data[cgId].usd_24h_change ?? 0,
      };
    }
  }
  return result;
}

/**
 * Returns live price + 24h change for all known symbols.
 * Refetches every 30 seconds automatically.
 */
export function useLivePrices(symbols = Object.keys(SYMBOL_TO_CG_ID)) {
  const { data = {}, isLoading, error } = useQuery({
    queryKey: ['live-prices', symbols.join(',')],
    queryFn: () => fetchLivePrices(symbols),
    refetchInterval: 30_000,   // 30 s
    staleTime: 20_000,
    retry: 2,
  });

  return { liveprices: data, isLoading, error };
}