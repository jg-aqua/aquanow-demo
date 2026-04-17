import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Copy, Share2, Check } from 'lucide-react';
import { toast } from 'sonner';

import TopBar from '@/components/wallet/TopBar';
import AssetIcon from '@/components/wallet/AssetIcon';

// Tiny decorative "QR" using CSS — deterministic pattern from address
function FauxQR({ seed = '' }) {
  const size = 21;
  const cells = [];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      h = (h * 1664525 + 1013904223) >>> 0;
      const on = (h & 0xff) > 128;
      const corner =
        (r < 7 && c < 7) || (r < 7 && c > size - 8) || (r > size - 8 && c < 7);
      cells.push({ r, c, on: corner ? true : on, corner });
    }
  }
  return (
    <div
      className="grid rounded-2xl p-4 bg-white"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gap: 2,
        width: 220,
        height: 220,
      }}
    >
      {cells.map(({ r, c, on }) => (
        <div
          key={`${r}-${c}`}
          className="rounded-[2px]"
          style={{ background: on ? '#0b0d12' : 'transparent' }}
        />
      ))}
    </div>
  );
}

export default function Receive() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialSymbol = params.get('symbol') || 'BTC';
  const [symbol, setSymbol] = useState(initialSymbol);
  const [copied, setCopied] = useState(false);

  const { data: assets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: () => base44.entities.Asset.list(),
  });
  const { data: holdings = [] } = useQuery({
    queryKey: ['holdings'],
    queryFn: () => base44.entities.Holding.list(),
  });

  const asset = assets.find((a) => a.symbol === symbol);
  const holding = holdings.find((h) => h.symbol === symbol);
  const address = holding?.wallet_address || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';

  const copy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success('Address copied');
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <TopBar title="Receive" />

      <div className="px-5 pb-8">
        {/* asset chooser */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {assets.map((a) => (
            <button
              key={a.id}
              onClick={() => setSymbol(a.symbol)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors shrink-0 ${
                symbol === a.symbol
                  ? 'border-primary bg-primary/10'
                  : 'border-border/60 hover:bg-secondary'
              }`}
            >
              <AssetIcon asset={a} size={22} />
              <span className="text-sm font-medium">{a.symbol}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-border/70 bg-card p-6 flex flex-col items-center">
          <div className="flex items-center gap-2">
            {asset && <AssetIcon asset={asset} size={28} />}
            <p className="text-sm font-semibold">
              Your {asset?.name} address
            </p>
          </div>

          <div className="mt-6">
            <FauxQR seed={address} />
          </div>

          <p className="mt-5 text-xs text-muted-foreground uppercase tracking-[0.2em]">
            Wallet address
          </p>
          <p className="mt-2 font-mono text-sm text-center break-all max-w-xs">
            {address}
          </p>

          <div className="grid grid-cols-2 gap-3 w-full mt-6">
            <button
              onClick={copy}
              className="h-12 rounded-2xl bg-secondary border border-border/70 font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ text: address }).catch(() => {});
                } else {
                  copy();
                }
              }}
              className="h-12 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
          Only send {asset?.symbol} to this address. Sending any other asset may result in permanent loss.
        </p>
      </div>
    </div>
  );
}