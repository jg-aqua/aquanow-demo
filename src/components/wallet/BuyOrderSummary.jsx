import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import TopBar from '@/components/wallet/TopBar';
import AssetIcon from '@/components/wallet/AssetIcon';
import { formatUSD } from '@/lib/format';

const FEES = 0.05;

export default function BuyOrderSummary({ asset, amount, receive, onBack }) {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const vat = parseFloat((amount * 0.05).toFixed(2));
  const total = parseFloat((amount - FEES - vat).toFixed(2));

  const rows = [
  { label: 'Quantity', value: `${receive.toFixed(6)} ${asset?.symbol}` },
  { label: 'Price', value: formatUSD(asset?.price_usd || 0) },
  { label: 'Order Type', value: 'Market Buy' },
  { label: 'Amount', value: formatUSD(amount) },
  { label: 'Estimated Fees', value: formatUSD(FEES) },
  { label: 'VAT (5%)', value: formatUSD(vat) },
  { label: 'Total Value', value: formatUSD(total), bold: true }];


  const handleConfirm = () => {
    setSuccess(true);
    setTimeout(() => navigate('/'), 1800);
  };

  if (success) {
    return (
      <div>
        <TopBar title="Order Confirmed" back={false} />
        <div className="px-6 pt-14 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 18 }}
            className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center">
            
            <Check className="w-10 h-10 text-success" strokeWidth={2.5} />
          </motion.div>
          <h2 className="font-serif text-3xl mt-6 tracking-tight">Order placed!</h2>
          <p className="text-muted-foreground text-sm mt-2">
            You bought {receive.toFixed(6)} {asset?.symbol} for {formatUSD(amount)}.
          </p>
        </div>
      </div>);

  }

  return (
    <div>
      <TopBar title="Order Summary" back={true} />
      <div className="px-5 pb-6">
        {asset &&
        <div className="flex items-center gap-3 mb-5">
            <AssetIcon asset={asset} size={40} />
            <div>
              <p className="font-semibold">{asset.name}</p>
              <p className="text-xs text-muted-foreground">{asset.symbol}</p>
            </div>
          </div>
        }

        <div className="rounded-3xl border border-border/70 bg-card divide-y divide-border/60 overflow-hidden">
          {rows.map(({ label, value, bold }) =>
          <div key={label} className="flex items-center justify-between px-5 py-3.5">
              <span className={`text-sm ${bold ? 'font-semibold' : 'text-muted-foreground'}`}>{label}</span>
              <span className={`text-sm tabular-nums ${bold ? 'font-semibold text-primary' : 'font-medium'}`}>{value}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleConfirm}
          className="mt-6 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          
          Confirm Purchase
        </button>

        

        
      </div>
    </div>);

}