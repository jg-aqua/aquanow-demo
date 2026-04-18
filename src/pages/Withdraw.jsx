import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import TopBar from '@/components/wallet/TopBar';
import { formatUSD } from '@/lib/format';

const PRESETS = [100, 250, 500, 1000];

const ACCOUNTS = {
  current: { label: 'Current Account', balance: 5000.00, color: '#6378ff' },
  investment: { label: 'Investment Account', balance: 12450.75, color: '#22c55e' },
};

export default function Withdraw() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(250);
  const [success, setSuccess] = useState(false);

  const exceedsBalance = amount > ACCOUNTS.current.balance;
  const invalid = amount <= 0 || exceedsBalance;

  const handleConfirm = () => {
    setSuccess(true);
    setTimeout(() => navigate('/'), 1800);
  };

  if (success) {
    return (
      <div>
        <TopBar title="Transfer Complete" back={false} />
        <div className="px-6 pt-14 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 18 }}
            className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center"
          >
            <Check className="w-10 h-10 text-success" strokeWidth={2.5} />
          </motion.div>
          <h2 className="font-serif text-3xl mt-6 tracking-tight">Transfer sent!</h2>
          <p className="text-muted-foreground text-sm mt-2">
            {formatUSD(amount)} moved to your Investment Account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title="Withdraw" />
      <div className="px-5 pb-6 space-y-4">

        {/* Amount input */}
        <div className="rounded-3xl border border-border/70 bg-card p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground text-center">
            Amount
          </p>
          <div className="mt-2 flex items-baseline justify-center gap-1">
            <span className="font-serif text-2xl text-muted-foreground">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="bg-transparent outline-none font-serif text-6xl tracking-tightest text-center w-44"
            />
          </div>
          {exceedsBalance && (
            <p className="text-xs text-destructive text-center mt-1">Exceeds available balance</p>
          )}

          <div className="grid grid-cols-4 gap-2 mt-6">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setAmount(p)}
                className={`py-2 rounded-full text-sm font-medium border transition-colors ${
                  amount === p
                    ? 'border-primary bg-primary/10'
                    : 'border-border/60 hover:bg-secondary'
                }`}
              >
                {formatUSD(p, { maximumFractionDigits: 0 })}
              </button>
            ))}
          </div>
        </div>

        {/* Transfer route — Timeline Rail */}
        <div className="rounded-3xl border border-border/70 bg-card px-5 py-6">
          <div className="relative flex gap-5">
            {/* Rail column */}
            <div className="flex flex-col items-center shrink-0" style={{ width: 16 }}>
              <div className="w-4 h-4 rounded-full shrink-0 mt-1" style={{ background: '#3b82f6' }} />
              <div className="w-px grow" style={{ background: '#3b82f6' }} />
              <div className="w-4 h-4 rounded-full shrink-0 mb-1" style={{ background: '#3b82f6' }} />
            </div>

            {/* Content column */}
            <div className="flex-1 flex flex-col">
              {/* From */}
              <div className="pb-5">
                <p className="text-sm text-muted-foreground mb-1">From ↓</p>
                <p className="text-base font-bold text-foreground leading-tight">{ACCOUNTS.current.label}</p>
                <p className="text-sm text-muted-foreground mt-1">Available: {formatUSD(ACCOUNTS.current.balance)}</p>
              </div>

              <div className="border-t border-border/40 mb-5" />

              {/* To */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">To</p>
                <p className="text-base font-bold text-foreground leading-tight">{ACCOUNTS.investment.label}</p>
                <p className="text-sm text-muted-foreground mt-1">Balance: {formatUSD(ACCOUNTS.investment.balance)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary row */}
        <div className="rounded-3xl border border-border/70 bg-card divide-y divide-border/60 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-sm text-muted-foreground">Transfer Amount</span>
            <span className="text-sm font-medium tabular-nums">{formatUSD(amount)}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-sm text-muted-foreground">Fee</span>
            <span className="text-sm font-medium tabular-nums text-success">Free</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-sm font-semibold">You receive</span>
            <span className="text-sm font-semibold text-primary tabular-nums">{formatUSD(amount)}</span>
          </div>
        </div>

        <button
          disabled={invalid}
          onClick={handleConfirm}
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Transfer Funds
        </button>

        <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
          Demo only — no real transactions are processed.
        </p>
      </div>
    </div>
  );
}