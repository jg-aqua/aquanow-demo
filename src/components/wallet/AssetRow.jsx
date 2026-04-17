import React from 'react';
import { motion } from 'framer-motion';
import AssetIcon from './AssetIcon';
import Sparkline from './Sparkline';
import { formatUSD, formatAmount, formatPercent } from '@/lib/format';

export default function AssetRow({ asset, holdingAmount = null, onClick, index = 0 }) {
  const positive = (asset.change_24h || 0) >= 0;
  const usdValue = holdingAmount != null ? holdingAmount * asset.price_usd : null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/60 transition-colors text-left"
    >
      <AssetIcon asset={asset} size={42} />

      <div className="flex-1 min-w-0">
        <p className="font-semibold leading-tight">{asset.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {holdingAmount != null
            ? formatAmount(holdingAmount, asset.symbol)
            : formatUSD(asset.price_usd, { maximumFractionDigits: asset.price_usd < 1 ? 4 : 2 })}
        </p>
      </div>

      <div className="hidden sm:block">
        <Sparkline
          points={asset.sparkline || []}
          color={positive ? 'hsl(152 60% 50%)' : 'hsl(0 70% 55%)'}
          width={64}
          height={24}
        />
      </div>

      <div className="text-right min-w-[84px]">
        <p className="font-semibold tabular-nums">
          {usdValue != null ? formatUSD(usdValue) : formatUSD(asset.price_usd)}
        </p>
        <p
          className={`text-xs mt-0.5 tabular-nums ${
            positive ? 'text-success' : 'text-destructive'
          }`}
        >
          {formatPercent(asset.change_24h || 0)}
        </p>
      </div>
    </motion.button>
  );
}