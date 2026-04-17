import React, { useState } from 'react';
import { format } from 'date-fns';
import { STATIC_TRANSACTIONS } from '@/lib/staticData';
import { motion } from 'framer-motion';

import TransactionRow from '@/components/wallet/TransactionRow';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'send', label: 'Sent' },
  { key: 'receive', label: 'Received' },
  { key: 'swap', label: 'Swaps' },
];

export default function Activity() {
  const [filter, setFilter] = useState('all');

  const transactions = STATIC_TRANSACTIONS;

  const filtered = filter === 'all' ? transactions : transactions.filter((t) => t.type === filter);

  // Group by date
  const groups = filtered.reduce((acc, tx) => {
    const d = tx.created_date ? format(new Date(tx.created_date), 'MMMM d, yyyy') : 'Recent';
    (acc[d] ||= []).push(tx);
    return acc;
  }, {});

  return (
    <div className="px-5 pt-8">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">History</p>
      <h1 className="font-serif text-4xl tracking-tightest mt-1">Activity</h1>

      <div className="mt-5 flex items-center gap-1 bg-secondary rounded-full p-1 border border-border/70">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="relative flex-1 py-2 text-xs font-medium rounded-full"
          >
            {filter === f.key && (
              <motion.span
                layoutId="activity-pill"
                className="absolute inset-0 rounded-full bg-background shadow"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`relative z-10 ${filter === f.key ? 'text-foreground' : 'text-muted-foreground'}`}>
              {f.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        {Object.keys(groups).length === 0 && (
          <p className="text-sm text-muted-foreground py-10 text-center">
            No transactions found.
          </p>
        )}
        {Object.entries(groups).map(([date, txs]) => (
          <div key={date} className="mb-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1">
              {date}
            </p>
            <div className="divide-y divide-border/60">
              {txs.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}