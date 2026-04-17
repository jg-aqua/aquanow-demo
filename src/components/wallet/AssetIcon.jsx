import React from 'react';

export default function AssetIcon({ asset, size = 44 }) {
  if (!asset) return null;
  const style = {
    width: size,
    height: size,
    background: `linear-gradient(135deg, ${asset.color || '#888'} 0%, ${asset.color || '#888'}AA 100%)`,
  };
  return (
    <div
      className="rounded-full flex items-center justify-center text-white shadow-lg shadow-black/20 ring-1 ring-white/10"
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