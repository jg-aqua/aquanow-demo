import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Repeat2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { formatAmount, formatUSD, shortAddress } from '@/lib/format';

const typeMeta = {
  send: { icon: ArrowUpRight, label: 'Sent', color: 'text-destructive', sign: '-' },
  receive: { icon: ArrowDownLeft, label: 'Received', color: 'text-success', sign: '+' },
  swap: { icon: Repeat2, label: 'Swap', color: 'text-primary', sign: '' },
};

export default function TransactionRow({ tx }) {
  const meta = typeMeta[tx.type] || typeMeta.send;
  const Icon = meta.icon;
  const isPending = tx.status === 'pending';

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-11 h-11 rounded-full bg-secondary border border-border/70 flex items-center justify-center shrink-0">
        <Icon className={`w-4 h-4 ${meta.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium">{meta.label} {tx.symbol}</p>
          {isPending && (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
              <Clock className="w-3 h-3" /> Pending
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {tx.counterparty ? shortAddress(tx.counterparty, 8, 6) : '—'}
          {tx.created_date && ` · ${format(new Date(tx.created_date), 'MMM d, HH:mm')}`}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className={`font-semibold tabular-nums ${meta.color}`}>
          {meta.sign}{formatAmount(tx.amount, tx.symbol)}
        </p>
        <p className="text-xs text-muted-foreground tabular-nums">
          {formatUSD(tx.usd_value || 0)}
        </p>
      </div>
    </div>
  );
}