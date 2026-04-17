import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowUpRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import TopBar from '@/components/wallet/TopBar';
import AssetIcon from '@/components/wallet/AssetIcon';
import { formatUSD, formatAmount } from '@/lib/format';

export default function Send() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const params = new URLSearchParams(location.search);
  const initialSymbol = params.get('symbol') || 'BTC';

  const { data: assets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: () => base44.entities.Asset.list(),
  });
  const { data: holdings = [] } = useQuery({
    queryKey: ['holdings'],
    queryFn: () => base44.entities.Holding.list(),
  });

  const [symbol, setSymbol] = useState(initialSymbol);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  const asset = assets.find((a) => a.symbol === symbol);
  const holding = holdings.find((h) => h.symbol === symbol);
  const balance = holding?.amount || 0;

  const usdValue = useMemo(() => {
    const n = parseFloat(amount);
    if (!asset || isNaN(n)) return 0;
    return n * asset.price_usd;
  }, [amount, asset]);

  const valid =
    address.length > 6 &&
    parseFloat(amount) > 0 &&
    parseFloat(amount) <= balance;

  const mutation = useMutation({
    mutationFn: async () => {
      const n = parseFloat(amount);
      await base44.entities.Transaction.create({
        type: 'send',
        symbol,
        amount: n,
        usd_value: n * asset.price_usd,
        counterparty: address,
        status: 'confirmed',
      });
      if (holding) {
        await base44.entities.Holding.update(holding.id, {
          amount: Math.max(0, balance - n),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['holdings'] });
      setSuccess(true);
      toast.success(`${amount} ${symbol} sent`);
      setTimeout(() => navigate('/'), 1400);
    },
  });

  if (success) {
    return (
      <div>
        <TopBar title="Sent" />
        <div className="px-6 pt-14 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 18 }}
            className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center"
          >
            <Check className="w-10 h-10 text-success" strokeWidth={2.5} />
          </motion.div>
          <h2 className="font-serif text-3xl mt-6 tracking-tight">Transaction sent</h2>
          <p className="text-muted-foreground text-sm mt-2">
            {formatAmount(parseFloat(amount), symbol)} was sent successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title="Send" />

      <div className="px-5 pb-6">
        {/* Asset selector */}
        <div className="rounded-3xl border border-border/70 bg-card p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Asset</p>
          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {assets.map((a) => (
              <button
                key={a.id}
                onClick={() => setSymbol(a.symbol)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors shrink-0 ${
                  symbol === a.symbol
                    ? 'border-primary bg-primary/10'
                    : 'border-border/60 hover:bg-secondary'
                }`}
              >
                <AssetIcon asset={a} size={24} />
                <span className="text-sm font-medium">{a.symbol}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="rounded-3xl border border-border/70 bg-card p-5 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Amount</p>
            <button
              onClick={() => setAmount(String(balance))}
              className="text-xs text-primary font-medium"
            >
              Max · {formatAmount(balance, symbol)}
            </button>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent outline-none font-serif text-5xl tracking-tightest placeholder:text-muted-foreground/40"
            />
            <span className="text-lg text-muted-foreground font-medium">{symbol}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 tabular-nums">
            ≈ {formatUSD(usdValue)}
          </p>
        </div>

        {/* Address */}
        <div className="rounded-3xl border border-border/70 bg-card p-5 mt-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recipient</p>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Paste wallet address"
            className="mt-2 w-full bg-transparent outline-none text-sm font-mono placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Fee estimate */}
        <div className="flex items-center justify-between mt-4 px-2 text-xs text-muted-foreground">
          <span>Network fee</span>
          <span className="tabular-nums">≈ $0.42</span>
        </div>

        <button
          disabled={!valid || mutation.isPending}
          onClick={() => mutation.mutate()}
          className="mt-6 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {mutation.isPending ? 'Sending…' : (<>Send {symbol} <ArrowUpRight className="w-4 h-4" /></>)}
        </button>
      </div>
    </div>
  );
}