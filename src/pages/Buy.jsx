import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { CreditCard, Sparkles } from 'lucide-react';

import TopBar from '@/components/wallet/TopBar';
import AssetIcon from '@/components/wallet/AssetIcon';
import { formatUSD } from '@/lib/format';
import { useLivePrices } from '@/hooks/useLivePrices';

const PRESETS = [50, 100, 250, 500];

export default function Buy() {
  const [amount, setAmount] = useState(100);
  const [symbol, setSymbol] = useState('BTC');

  const { data: assets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: () => base44.entities.Asset.list()
  });

  const { liveprices } = useLivePrices();
  const mergedAssets = assets.map((a) =>
  liveprices[a.symbol] ?
  { ...a, price_usd: liveprices[a.symbol].price_usd } :
  a
  );

  const asset = mergedAssets.find((a) => a.symbol === symbol);
  const receive = asset ? amount / asset.price_usd : 0;

  return (
    <div>
      <TopBar title="Buy" />
      <div className="px-5 pb-6">
        <div className="rounded-3xl border border-border/70 bg-card p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground text-center">
            You pay
          </p>
          <div className="mt-2 flex items-baseline justify-center gap-1">
            <span className="font-serif text-2xl text-muted-foreground">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="bg-transparent outline-none font-serif text-6xl tracking-tightest text-center w-44" />
            
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            ≈ {receive.toFixed(6)} {symbol}
          </p>

          <div className="grid grid-cols-4 gap-2 mt-6">
            {PRESETS.map((p) =>
            <button
              key={p}
              onClick={() => setAmount(p)}
              className={`py-2 rounded-full text-sm font-medium border transition-colors ${
              amount === p ?
              'border-primary bg-primary/10' :
              'border-border/60 hover:bg-secondary'}`
              }>
              
                {formatUSD(p, { maximumFractionDigits: 0 })}
              </button>
            )}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 px-1">
            You receive
          </p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {mergedAssets.map((a) =>
            <button
              key={a.id}
              onClick={() => setSymbol(a.symbol)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors shrink-0 ${
              symbol === a.symbol ?
              'border-primary bg-primary/10' :
              'border-border/60 hover:bg-secondary'}`
              }>
              
                <AssetIcon asset={a} size={22} />
                <span className="text-sm font-medium">{a.symbol}</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border/70 bg-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Visa · 4242</p>
            <p className="text-xs text-muted-foreground">Default payment method</p>
          </div>
          <button className="text-xs text-primary font-medium">Change</button>
        </div>

        <button className="mt-6 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
           Buy {symbol}
        </button>

        

        
      </div>
    </div>);

}