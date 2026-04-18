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
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }} className="pt-6 pr-6 pb-6 pl-6 rounded-3xl relative overflow-hidden border border-white/10"

      style={{
        background:
        'radial-gradient(120% 100% at 0% 0%, rgba(99,120,255,0.25) 0%, transparent 55%), linear-gradient(160deg, #1a1f35 0%, #0f1221 100%)'
      }}>
      
      {/* decorative orb */}
      <div
        aria-hidden
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle, #6378ff 0%, transparent 70%)' }} />
      

      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50 font-medium">TOTAL value

          </p>
          
        </div>
        <button
          onClick={() => setHidden((v) => !v)}
          className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          
          {hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="mt-5 relative z-10">
        <div className="flex items-baseline gap-2">
          <h1 className="font-serif text-5xl tracking-tightest leading-none text-white">
            {hidden ? '••••••' : formatUSD(totalValue)}
          </h1>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
            positive ?
            'bg-emerald-500/20 text-emerald-400' :
            'bg-red-500/20 text-red-400'}`
            }>
            
            {positive ?
            <TrendingUp className="w-3.5 h-3.5" /> :

            <TrendingDown className="w-3.5 h-3.5" />
            }
            {formatPercent(change24hPct)}
          </div>
          <span className="text-xs text-white/40">
            {positive ? '+' : ''}
            {formatUSD(change24hUsd)} · 24h
          </span>
        </div>

        <div className="mt-5 flex gap-3 relative z-10">
          




          
          




          
        </div>
      </div>
    </motion.div>);

}