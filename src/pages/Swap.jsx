import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowDownUp, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import TopBar from '@/components/wallet/TopBar';
import AssetIcon from '@/components/wallet/AssetIcon';
import { formatUSD, formatAmount } from '@/lib/format';

function AssetPicker({ assets, symbol, setSymbol }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {assets.map((a) => (
        <button
          key={a.id}
          onClick={() => setSymbol(a.symbol)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors shrink-0 ${
            symbol === a.symbol
              ? 'border-primary bg-primary/10'
              : 'border-border/60 hover:bg-secondary'
          }`}
        >
          <AssetIcon asset={a} size={20} />
          <span className="text-xs font-medium">{a.symbol}</span>
        </button>
      ))}
    </div>
  );
}

export default function Swap() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: assets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: () => base44.entities.Asset.list(),
  });
  const { data: holdings = [] } = useQuery({
    queryKey: ['holdings'],
    queryFn: () => base44.entities.Holding.list(),
  });

  const [fromSymbol, setFromSymbol] = useState('ETH');
  const [toSymbol, setToSymbol] = useState('SOL');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  const fromAsset = assets.find((a) => a.symbol === fromSymbol);
  const toAsset = assets.find((a) => a.symbol === toSymbol);
  const fromHolding = holdings.find((h) => h.symbol === fromSymbol);
  const toHolding = holdings.find((h) => h.symbol === toSymbol);

  const receive = useMemo(() => {
    const n = parseFloat(amount);
    if (!fromAsset || !toAsset || isNaN(n)) return 0;
    return (n * fromAsset.price_usd) / toAsset.price_usd;
  }, [amount, fromAsset, toAsset]);

  const balance = fromHolding?.amount || 0;
  const valid =
    fromSymbol !== toSymbol &&
    parseFloat(amount) > 0 &&
    parseFloat(amount) <= balance;

  const flip = () => {
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
    setAmount('');
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const n = parseFloat(amount);
      await base44.entities.Transaction.create({
        type: 'swap',
        symbol: fromSymbol,
        amount: n,
        usd_value: n * fromAsset.price_usd,
        counterparty: `${fromSymbol} → ${toSymbol}`,
        status: 'confirmed',
      });
      if (fromHolding) {
        await base44.entities.Holding.update(fromHolding.id, {
          amount: Math.max(0, balance - n),
        });
      }
      if (toHolding) {
        await base44.entities.Holding.update(toHolding.id, {
          amount: (toHolding.amount || 0) + receive,
        });
      } else {
        await base44.entities.Holding.create({
          symbol: toSymbol,
          amount: receive,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['holdings'] });
      setSuccess(true);
      toast.success('Swap completed');
      setTimeout(() => navigate('/'), 1400);
    },
  });

  if (success) {
    return (
      <div>
        <TopBar title="Swap" />
        <div className="px-6 pt-14 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 18 }}
            className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center"
          >
            <Check className="w-10 h-10 text-success" strokeWidth={2.5} />
          </motion.div>
          <h2 className="font-serif text-3xl mt-6 tracking-tight">Swap completed</h2>
          <p className="text-muted-foreground text-sm mt-2">
            {formatAmount(parseFloat(amount), fromSymbol)} → {formatAmount(receive, toSymbol)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title="Swap" />
      <div className="px-5 pb-6">
        {/* From */}
        <div className="rounded-3xl border border-border/70 bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">From</p>
            <button
              onClick={() => setAmount(String(balance))}
              className="text-xs text-primary font-medium"
            >
              Max · {formatAmount(balance, fromSymbol)}
            </button>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent outline-none font-serif text-5xl tracking-tightest placeholder:text-muted-foreground/40 min-w-0"
            />
            <span className="text-lg text-muted-foreground font-medium">{fromSymbol}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 tabular-nums">
            ≈ {formatUSD((parseFloat(amount) || 0) * (fromAsset?.price_usd || 0))}
          </p>
          <div className="mt-4">
            <AssetPicker assets={assets} symbol={fromSymbol} setSymbol={setFromSymbol} />
          </div>
        </div>

        {/* Flip */}
        <div className="flex justify-center -my-3 relative z-10">
          <button
            onClick={flip}
            className="w-11 h-11 rounded-full bg-background border border-border flex items-center justify-center shadow-lg hover:border-primary/60 transition-colors"
          >
            <ArrowDownUp className="w-4 h-4" />
          </button>
        </div>

        {/* To */}
        <div className="rounded-3xl border border-border/70 bg-card p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">To</p>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="flex-1 font-serif text-5xl tracking-tightest min-w-0 truncate">
              {receive > 0 ? receive.toFixed(receive < 1 ? 6 : 4) : '0.00'}
            </p>
            <span className="text-lg text-muted-foreground font-medium">{toSymbol}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 tabular-nums">
            ≈ {formatUSD(receive * (toAsset?.price_usd || 0))}
          </p>
          <div className="mt-4">
            <AssetPicker assets={assets} symbol={toSymbol} setSymbol={setToSymbol} />
          </div>
        </div>

        {fromAsset && toAsset && (
          <div className="flex items-center justify-between mt-4 px-2 text-xs text-muted-foreground">
            <span>Rate</span>
            <span className="tabular-nums">
              1 {fromSymbol} = {(fromAsset.price_usd / toAsset.price_usd).toFixed(4)} {toSymbol}
            </span>
          </div>
        )}

        <button
          disabled={!valid || mutation.isPending}
          onClick={() => mutation.mutate()}
          className="mt-6 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {mutation.isPending ? 'Swapping…' : 'Review Swap'}
        </button>
      </div>
    </div>
  );
}