import React, { useMemo, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import { motion } from 'framer-motion';

const RANGES = ['1D', '1W', '1M', '1Y', 'ALL'];

// Generate synthetic extended data around a sparkline so the chart feels rich
const expand = (sparkline = [], range = '1D') => {
  if (!sparkline.length) return [];
  const multipliers = { '1D': 1, '1W': 1.6, '1M': 2.4, '1Y': 3.2, ALL: 4 };
  const volatility = { '1D': 0.003, '1W': 0.012, '1M': 0.03, '1Y': 0.08, ALL: 0.14 };
  const len = Math.max(40, Math.round(sparkline.length * multipliers[range]));
  const base = sparkline[sparkline.length - 1];
  const out = [];
  let v = base;
  for (let i = 0; i < len; i++) {
    const drift = (Math.sin(i / 6 + range.length) * volatility[range]) * base;
    const noise = (Math.random() - 0.5) * volatility[range] * base * 0.6;
    v = Math.max(0.0001, base + drift + noise - (len - i) * (volatility[range] * base * 0.01));
    out.push({ i, v });
  }
  out.push({ i: len, v: base });
  return out;
};

export default function PriceChart({ asset }) {
  const [range, setRange] = useState('1D');
  const data = useMemo(() => expand(asset?.sparkline || [], range), [asset, range]);
  const positive = (asset?.change_24h || 0) >= 0;
  const color = positive ? 'hsl(152 60% 50%)' : 'hsl(0 70% 55%)';

  return (
    <div className="w-full">
      <div className="h-52 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={['dataMin', 'dataMax']} />
            <Tooltip
              cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeDasharray: '3 3' }}
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 12,
                fontSize: 12,
              }}
              formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Price']}
              labelFormatter={() => ''}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={2}
              fill="url(#priceGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center gap-1 bg-secondary rounded-full p-1 border border-border/70">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className="relative flex-1 py-1.5 text-xs font-medium rounded-full transition-colors"
          >
            {range === r && (
              <motion.span
                layoutId="range-pill"
                className="absolute inset-0 rounded-full bg-background shadow"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`relative z-10 ${range === r ? 'text-foreground' : 'text-muted-foreground'}`}>
              {r}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}