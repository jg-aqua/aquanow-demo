import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import AssetRow from '@/components/wallet/AssetRow';
import { motion } from 'framer-motion';
import { STATIC_ASSETS } from '@/lib/staticData';

const TABS = ['All', 'Gainers', 'Losers'];

export default function Market() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('All');
  const [query, setQuery] = useState('');

  const assets = STATIC_ASSETS;

  let filtered = assets.filter(
    (a) =>
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.symbol.toLowerCase().includes(query.toLowerCase())
  );
  if (tab === 'Gainers') filtered = filtered.filter((a) => (a.change_24h || 0) > 0).sort((a, b) => b.change_24h - a.change_24h);
  if (tab === 'Losers') filtered = filtered.filter((a) => (a.change_24h || 0) < 0).sort((a, b) => a.change_24h - b.change_24h);

  return (
    <div className="px-5 pt-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Explore</p>
        <h1 className="font-serif text-4xl tracking-tightest mt-1">Market</h1>
      </div>

      {/* Search */}
      <div className="mt-5 relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search assets"
          className="w-full h-11 pl-10 pr-4 rounded-2xl bg-secondary border border-border/60 focus:border-primary/60 focus:outline-none text-sm placeholder:text-muted-foreground" />
        
      </div>

      {/* Tabs */}
      


















      

      {/* List */}
      <div className="mt-4 -mx-1">
        {filtered.map((a, i) =>
        <AssetRow
          key={a.id}
          asset={a}
          index={i}
          onClick={() => navigate(`/asset/${a.symbol}`)} />

        )}
        {filtered.length === 0 &&
        <p className="text-sm text-muted-foreground py-10 text-center">No assets found.</p>
        }
      </div>
    </div>);

}