import React, { useState } from 'react';
import { COIN_IMAGE_URLS } from '@/hooks/useLivePrices';

export default function AssetIcon({ asset, size = 44 }) {
  const [imgError, setImgError] = useState(false);
  if (!asset) return null;

  const imageUrl = COIN_IMAGE_URLS[asset.symbol];

  const style = {
    width: size,
    height: size,
    background: `linear-gradient(135deg, ${asset.color || '#888'} 0%, ${asset.color || '#888'}AA 100%)`,
  };

  if (imageUrl && !imgError) {
    return (
      <div
        className="rounded-full overflow-hidden shrink-0 shadow-lg shadow-black/20 ring-1 ring-white/10 bg-white"
        style={{ width: size, height: size }}
      >
        <img
          src={imageUrl}
          alt={asset.symbol}
          width={size}
          height={size}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Fallback: colored circle with letter
  return (
    <div
      className="rounded-full flex items-center justify-center text-white shadow-lg shadow-black/20 ring-1 ring-white/10 shrink-0"
      style={style}
    >
      <span
        className="font-semibold"
        style={{ fontSize: size * 0.44, lineHeight: 1 }}
      >
        {asset.icon_letter || asset.symbol?.[0] || '?'}
      </span>
    </div>
  );
}