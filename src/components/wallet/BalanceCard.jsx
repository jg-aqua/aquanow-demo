import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, TrendingUp, TrendingDown, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatUSD, formatPercent } from '@/lib/format';

export default function BalanceCard({ totalValue = 0, change24hUsd = 0, change24hPct = 0 }) {
  const [hidden, setHidden] = useState(false);
  const navigate = useNavigate();
  const positive = change24hUsd >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }} className="pt-6 pr-6 pb-4 pl-6 rounded-3xl relative overflow-hidden border border-border/70"

      style={{
        background:
        'radial-gradient(120% 100% at 0% 0%, hsl(var(--primary) / 0.15) 0%, transparent 55%), linear-gradient(160deg, hsl(var(--card)) 0%, hsl(var(--secondary)) 100%)'
      }}>
      
      {/* decorative orb */}
      <div
        aria-hidden
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-40"
        style={{ background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)' }} />
      

      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
            Total Balance
          </p>
          <p className="text-[10px] text-muted-foreground/70 mt-1">USD · All wallets</p>
        </div>
        <button
          onClick={() => setHidden((v) => !v)}
          className="w-9 h-9 rounded-full border border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          
          {hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="mt-5 relative z-10">
        <div className="flex items-baseline gap-2">
          <h1 className="font-serif text-5xl tracking-tightest leading-none">
            {hidden ? '••••••' : formatUSD(totalValue)}
          </h1>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
            positive ?
            'bg-success/15 text-success' :
            'bg-destructive/15 text-destructive'}`
            }>
            
            {positive ?
            <TrendingUp className="w-3.5 h-3.5" /> :

            <TrendingDown className="w-3.5 h-3.5" />
            }
            {formatPercent(change24hPct)}
          </div>
          <span className="text-xs text-muted-foreground">
            {positive ? '+' : ''}
            {formatUSD(change24hUsd)} · 24h
          </span>
        </div>

        <div className="mt-5 flex gap-3 relative z-10">
          <button
            onClick={() => navigate('/receive')} className="bg-primary/20 text-primary py-6 text-sm font-semibold rounded-3xl flex-1 flex items-center justify-center gap-1.5 h-10 border border-primary/30 hover:bg-primary/30 transition-colors">

            
            <ArrowDownLeft className="w-4 h-4" /> Deposit
          </button>
          <button
            onClick={() => navigate('/send')} className="bg-white/10 text-foreground py-6 text-sm font-semibold rounded-3xl flex-1 flex items-center justify-center gap-1.5 h-10 border border-white/15 hover:bg-white/20 transition-colors">
            
            
            <ArrowUpRight className="w-4 h-4" /> Withdraw
          </button>
        </div>
      </div>
    </motion.div>);

}