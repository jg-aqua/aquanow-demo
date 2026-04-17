import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

import AssetRow from '@/components/wallet/AssetRow';
import { useLivePrices } from '@/hooks/useLivePrices';

const TABS = ['All', 'Gainers', 'Losers'];

export default function Market() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('All');
  const [query, setQuery] = useState('');

  const { data: assets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: () => base44.entities.Asset.list(),
  });

  const { liveprices, isLoading: pricesLoading } = useLivePrices();

  // Merge live prices
  const mergedAssets = assets.map((a) =>
    liveprices[a.symbol]
      ? { ...a, price_usd: liveprices[a.symbol].price_usd, change_24h: liveprices[a.symbol].change_24h }
      : a
  );

  let filtered = mergedAssets.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.symbol.toLowerCase().includes(query.toLowerCase()),
  );
  if (tab === 'Gainers') filtered = filtered.filter((a) => (a.change_24h || 0) > 0).sort((a, b) => b.change_24h - a.change_24h);
  if (tab === 'Losers') filtered = filtered.filter((a) => (a.change_24h || 0) < 0).sort((a, b) => a.change_24h - b.change_24h);

  return (
    <div className="px-5 pt-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Explore</p>
          <h1 className="font-serif text-4xl tracking-tightest mt-1">Market</h1>
        </div>
        {pricesLoading ? (
          <RefreshCw className="w-4 h-4 text-muted-foreground animate-spin mb-1" />
        ) : (
          <span className="text-[10px] text-muted-foreground/60 mb-1.5">Live · 30s</span>
        )}
      </div>

      {/* Search */}
      <div className="mt-5 relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search assets"
          className="w-full h-11 pl-10 pr-4 rounded-2xl bg-secondary border border-border/60 focus:border-primary/60 focus:outline-none text-sm placeholder:text-muted-foreground"
        />
      </div>

      {/* Tabs */}
      <div className="mt-4 flex items-center gap-1 bg-secondary rounded-full p-1 border border-border/70">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="relative flex-1 py-2 text-xs font-medium rounded-full"
          >
            {tab === t && (
              <motion.span
                layoutId="market-pill"
                className="absolute inset-0 rounded-full bg-background shadow"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`relative z-10 ${tab === t ? 'text-foreground' : 'text-muted-foreground'}`}>
              {t}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mt-4 -mx-1">
        {filtered.map((a, i) => (
          <AssetRow
            key={a.id}
            asset={a}
            index={i}
            onClick={() => navigate(`/asset/${a.symbol}`)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground py-10 text-center">No assets found.</p>
        )}
      </div>
    </div>
  );
}