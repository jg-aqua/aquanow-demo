import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Bell, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

import BalanceCard from '@/components/wallet/BalanceCard';
import QuickActions from '@/components/wallet/QuickActions';
import AssetRow from '@/components/wallet/AssetRow';
import TransactionRow from '@/components/wallet/TransactionRow';
import SectionHeader from '@/components/wallet/SectionHeader';

export default function Home() {
  const navigate = useNavigate();

  const { data: assets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: () => base44.entities.Asset.list()
  });
  const { data: holdings = [] } = useQuery({
    queryKey: ['holdings'],
    queryFn: () => base44.entities.Holding.list()
  });
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 4)
  });
  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const assetMap = Object.fromEntries(assets.map((a) => [a.symbol, a]));

  const portfolio = holdings.map((h) => {
    const asset = assetMap[h.symbol];
    if (!asset) return null;
    return {
      ...h,
      asset,
      usdValue: h.amount * asset.price_usd,
      change24hUsd: h.amount * asset.price_usd * (asset.change_24h / 100)
    };
  }).filter(Boolean).sort((a, b) => b.usdValue - a.usdValue);

  const totalValue = portfolio.reduce((s, p) => s + p.usdValue, 0);
  const totalChange = portfolio.reduce((s, p) => s + p.change24hUsd, 0);
  const totalChangePct = totalValue ? totalChange / (totalValue - totalChange) * 100 : 0;

  const firstName = (me?.full_name || 'there').split(' ')[0];

  return (
    <div className="px-5 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          

          
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground hidden">Welcome back</p>
            <p className="text-sm font-semibold">{firstName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/receive')}
            className="w-9 h-9 rounded-full border border-border/70 flex items-center justify-center hover:bg-secondary transition-colors">
            
            <QrCode className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full border border-border/70 flex items-center justify-center hover:bg-secondary transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
          </button>
        </div>
      </motion.div>

      {/* Balance */}
      <div className="mt-5">
        <BalanceCard
          totalValue={totalValue}
          change24hUsd={totalChange}
          change24hPct={totalChangePct} />
        
        <QuickActions />
      </div>

      {/* Holdings */}
      <SectionHeader title="Your Assets" actionLabel="See all" actionTo="/market" />
      <div className="-mx-1">
        {portfolio.length === 0 &&
        <p className="text-sm text-muted-foreground py-6 text-center">
            No assets yet.
          </p>
        }
        {portfolio.map((p, i) =>
        <AssetRow
          key={p.id}
          asset={p.asset}
          holdingAmount={p.amount}
          index={i}
          onClick={() => navigate(`/asset/${p.asset.symbol}`)} />

        )}
      </div>

      {/* Recent Activity */}
      <SectionHeader title="Recent Activity" actionLabel="View all" actionTo="/activity" />
      <div className="divide-y divide-border/60">
        {transactions.length === 0 &&
        <p className="text-sm text-muted-foreground py-6 text-center">No activity yet.</p>
        }
        {transactions.map((tx) =>
        <TransactionRow key={tx.id} tx={tx} />
        )}
      </div>
    </div>);

}