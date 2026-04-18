import React, { useState } from 'react';
import { TrendingDown } from 'lucide-react';

import TopBar from '@/components/wallet/TopBar';
import AssetIcon from '@/components/wallet/AssetIcon';
import { formatUSD, formatAmount } from '@/lib/format';
import { STATIC_ASSETS, STATIC_HOLDINGS } from '@/lib/staticData';

const PRESETS = [10, 25, 50, 100];

export default function Sell() {
  const [usdAmount, setUsdAmount] = useState(100);
  const [symbol, setSymbol] = useState('BTC');

  const assets = STATIC_ASSETS;
  const holdings = STATIC_HOLDINGS;

  const asset = assets.find((a) => a.symbol === symbol);
  const holding = holdings.find((h) => h.symbol === symbol);
  const balance = holding?.amount || 0;
  const balanceUsd = asset ? balance * asset.price_usd : 0;

  const cryptoAmount = asset ? usdAmount / asset.price_usd : 0;
  const exceedsBalance = cryptoAmount > balance;

  return (
    <div>
      <TopBar title="Sell" />
      <div className="px-5 pb-6">
        {/* USD amount input */}
        <div className="rounded-3xl border border-border/70 bg-card p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground text-center">
            You sell
          </p>
          <div className="mt-2 flex items-baseline justify-center gap-1">
            <span className="font-serif text-2xl text-muted-foreground">$</span>
            <input
              type="number"
              value={usdAmount}
              onChange={(e) => setUsdAmount(parseFloat(e.target.value) || 0)}
              className="bg-transparent outline-none font-serif text-6xl tracking-tightest text-center w-44"
            />
          </div>
          <p className={`text-xs text-center mt-2 ${exceedsBalance ? 'text-destructive' : 'text-muted-foreground'}`}>
            ≈ {cryptoAmount.toFixed(6)} {symbol}
            {exceedsBalance && ' · Exceeds balance'}
          </p>

          <div className="grid grid-cols-4 gap-2 mt-6">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setUsdAmount(p)}
                className={`py-2 rounded-full text-sm font-medium border transition-colors ${
                  usdAmount === p
                    ? 'border-primary bg-primary/10'
                    : 'border-border/60 hover:bg-secondary'
                }`}
              >
                {formatUSD(p, { maximumFractionDigits: 0 })}
              </button>
            ))}
          </div>
        </div>

        {/* Asset selector */}
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 px-1">
            Asset to sell
          </p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {assets.map((a) => {
              const h = holdings.find((ho) => ho.symbol === a.symbol);
              if (!h) return null;
              return (
                <button
                  key={a.id}
                  onClick={() => setSymbol(a.symbol)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors shrink-0 ${
                    symbol === a.symbol
                      ? 'border-primary bg-primary/10'
                      : 'border-border/60 hover:bg-secondary'
                  }`}
                >
                  <AssetIcon asset={a} size={22} />
                  <span className="text-sm font-medium">{a.symbol}</span>
                </button>
              );
            })}
          </div>
          {asset && (
            <p className="text-xs text-muted-foreground mt-2 px-1">
              Balance: {formatAmount(balance, symbol)} · {formatUSD(balanceUsd)}
            </p>
          )}
        </div>

        {/* Payout info */}
        <div className="mt-6 rounded-2xl border border-border/70 bg-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Bank Account · 4242</p>
            <p className="text-xs text-muted-foreground">Default payout method</p>
          </div>
          <button className="text-xs text-primary font-medium">Change</button>
        </div>

        <button
          disabled={exceedsBalance || usdAmount <= 0}
          className="mt-6 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Sell {symbol}
        </button>

        <p className="text-[11px] text-muted-foreground text-center mt-3 leading-relaxed">
          Demo only — no real transactions are processed.
        </p>
      </div>
    </div>
  );
}