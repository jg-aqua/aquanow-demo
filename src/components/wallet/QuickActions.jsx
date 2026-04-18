import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, Repeat2, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const actions = [
{ label: 'Send', icon: ArrowUpRight, to: '/send' },
/*{ label: 'Receive', icon: ArrowDownLeft, to: '/receive' },*/
{ label: 'Swap', icon: Repeat2, to: '/swap' },
{ label: 'Buy', icon: CreditCard, to: '/buy' }];


export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center gap-3 mt-5">
      {actions.map(({ label, icon: Icon, to }, i) =>
      <motion.button
        key={label}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 + i * 0.05, duration: 0.4 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => navigate(to)} className="flex flex-col items-center gap-2 group">

        
          <span className="w-14 h-14 rounded-2xl bg-secondary border border-border/70 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
            <Icon className="w-5 h-5 text-primary" strokeWidth={2} />
          </span>
          <span className="text-[11px] font-medium text-foreground/80">{label}</span>
        </motion.button>
      )}
    </div>);

}