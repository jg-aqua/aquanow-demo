import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const RANGES = ['1W', '1M', '3M', '1Y'];

function generateData(range) {
  const points = { '1W': 7, '1M': 30, '3M': 90, '1Y': 52 };
  const labels = {
    '1W': (i) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    '1M': (i) => `${i + 1}`,
    '3M': (i) => `W${i + 1}`,
    '1Y': (i) => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i % 12],
  };

  const n = points[range];
  const data = [];
  let value = 14500;
  for (let i = 0; i < n; i++) {
    value += (Math.random() - 0.42) * 600;
    value = Math.max(10000, value);
    data.push({ label: labels[range](i), value: Math.round(value) });
  }
  return data;
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 text-xs text-white">
      <p className="font-semibold">${payload[0].value.toLocaleString()}</p>
      <p className="text-white/50 mt-0.5">{payload[0].payload.label}</p>
    </div>
  );
};

export default function PortfolioChart() {
  const [range, setRange] = useState('1M');
  const data = useMemo(() => generateData(range), [range]);

  const first = data[0]?.value || 0;
  const last = data[data.length - 1]?.value || 0;
  const positive = last >= first;

  return (
    <div className="mt-4">
      <ResponsiveContainer width="100%" height={110}>
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={positive ? '#6ee7b7' : '#f87171'} stopOpacity={0.35} />
              <stop offset="100%" stopColor={positive ? '#6ee7b7' : '#f87171'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" hide />
          <YAxis domain={['auto', 'auto']} hide />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={positive ? '#6ee7b7' : '#f87171'}
            strokeWidth={2}
            fill="url(#portfolioGrad)"
            dot={false}
            activeDot={{ r: 4, fill: positive ? '#6ee7b7' : '#f87171', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Range selector */}
      <div className="flex justify-center gap-2 mt-2">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              range === r
                ? 'bg-white/20 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}