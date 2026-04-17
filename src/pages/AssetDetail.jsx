import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

import TopBar from '@/components/wallet/TopBar';
import AssetIcon from '@/components/wallet/AssetIcon';
import PriceChart from '@/components/wallet/PriceChart';
import TransactionRow from '@/components/wallet/TransactionRow';
import { formatUSD, formatAmount, formatPercent } from '@/lib/format';
import { STATIC_ASSETS, STATIC_HOLDINGS, STATIC_TRANSACTIONS } from '@/lib/staticData';

export default function AssetDetail() {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const assets = STATIC_ASSETS;
  const holdings = STATIC_HOLDINGS;
  const transactions = STATIC_TRANSACTIONS.filter((t) => t.symbol === symbol);

  const asset = assets.find((a) => a.symbol === symbol);
  const holding = holdings.find((h) => h.symbol === symbol);

  if (!asset) {
    return (
      <div>
        <TopBar title="Asset" />
        <div className="p-6 text-sm text-muted-foreground">Asset not found.</div>
      </div>
    );
  }

  const positive = (asset.change_24h || 0) >= 0;
  const holdingValue = holding ? holding.amount * asset.price_usd : 0;

  return (
    <div>
      <TopBar
        title={asset.name}
        right={
          <button className="w-9 h-9 rounded-full border border-border/70 flex items-center justify-center hover:bg-secondary transition-colors">
            <Star className="w-4 h-4 text-muted-foreground" />
          </button>
        }
      />

      <div className="px-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mt-2"
        >
          <AssetIcon asset={asset} size={56} />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-[0.18em]">
              {asset.symbol}
            </p>
            <h1 className="font-serif text-4xl tracking-tightest leading-none mt-1">
              {formatUSD(asset.price_usd, { maximumFractionDigits: asset.price_usd < 1 ? 4 : 2 })}
            </h1>
            <div
              className={`inline-flex items-center gap-1 text-xs font-medium mt-2 px-2 py-1 rounded-full ${
                positive ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'
              }`}
            >
              {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {formatPercent(asset.change_24h || 0)} today
            </div>
          </div>
        </motion.div>

        <div className="mt-6">
          <PriceChart asset={asset} />
        </div>

        {/* Holdings */}
        <div className="mt-6 rounded-3xl border border-border/70 p-5 bg-card">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your Holdings</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="font-serif text-2xl tracking-tight">{formatUSD(holdingValue)}</p>
            <p className="text-sm text-muted-foreground tabular-nums">
              {formatAmount(holding?.amount || 0, asset.symbol)}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-5">
            <button
              onClick={() => navigate(`/send?symbol=${asset.symbol}`)}
              className="py-3 rounded-2xl bg-secondary border border-border/60 text-sm font-medium hover:bg-primary/10 hover:border-primary/40 transition-colors"
            >
              Send
            </button>
            <button
              onClick={() => navigate(`/receive?symbol=${asset.symbol}`)}
              className="py-3 rounded-2xl bg-secondary border border-border/60 text-sm font-medium hover:bg-primary/10 hover:border-primary/40 transition-colors"
            >
              Receive
            </button>
            <button
              onClick={() => navigate('/swap')}
              className="py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Swap
            </button>
          </div>
        </div>

        {/* History */}
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">History</p>
          <div className="divide-y divide-border/60">
            {transactions.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No transactions yet for {asset.symbol}.
              </p>
            )}
            {transactions.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}