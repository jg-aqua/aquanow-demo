import React, { useEffect } from 'react';

export default function MobileFrame({ children }) {
  useEffect(() => {
    const PHONE_H = 932;
    const PHONE_W = 430;
    const PADDING = 4; // vertical breathing room

    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (vw < 768) return; // mobile — no scale needed
      const scaleH = (vh - PADDING) / PHONE_H;
      const scaleW = (vw - 80) / PHONE_W;
      const scale = Math.min(scaleH, scaleW, 1); // never upscale
      document.documentElement.style.setProperty('--iphone-scale', scale.toString());
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-[#111] flex items-center justify-center py-2">
      {/* iPhone shell */}
      <div
        className="relative hidden md:flex flex-col"
        style={{
          width: 430,
          height: 932,
          transform: 'scale(var(--iphone-scale, 1))',
          transformOrigin: 'center center',
        }}
      >

        {/* Outer chassis */}
        <div
          className="absolute inset-0 rounded-[54px] z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(145deg, #3a3a3c 0%, #1c1c1e 40%, #2c2c2e 70%, #1c1c1e 100%)',
            boxShadow:
              '0 0 0 1.5px #5a5a5c, 0 30px 80px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.12)',
          }}
        />

        {/* Screen bezel */}
        <div
          className="absolute z-10 overflow-hidden"
          style={{
            inset: '10px',
            borderRadius: '46px',
            background: '#000',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        />

        {/* Side buttons — volume */}
        <div className="absolute z-30 pointer-events-none"
          style={{ left: -3, top: 160, width: 3, height: 36, borderRadius: '3px 0 0 3px', background: 'linear-gradient(to right,#4a4a4c,#3a3a3c)' }} />
        <div className="absolute z-30 pointer-events-none"
          style={{ left: -3, top: 210, width: 3, height: 64, borderRadius: '3px 0 0 3px', background: 'linear-gradient(to right,#4a4a4c,#3a3a3c)' }} />
        <div className="absolute z-30 pointer-events-none"
          style={{ left: -3, top: 286, width: 3, height: 64, borderRadius: '3px 0 0 3px', background: 'linear-gradient(to right,#4a4a4c,#3a3a3c)' }} />

        {/* Side button — power */}
        <div className="absolute z-30 pointer-events-none"
          style={{ right: -3, top: 220, width: 3, height: 80, borderRadius: '0 3px 3px 0', background: 'linear-gradient(to left,#4a4a4c,#3a3a3c)' }} />

        {/* Screen content */}
        <div
          className="absolute z-20 overflow-hidden flex flex-col bg-background"
          style={{ inset: '10px', borderRadius: '46px' }}
        >
          {/* Status bar */}
          <div className="flex items-center justify-between px-8 pt-3 pb-1 shrink-0" style={{ height: 50 }}>
            <span className="text-foreground text-[13px] font-semibold">9:41</span>
            <div
              className="absolute left-1/2 -translate-x-1/2 top-3 z-30 rounded-full bg-black"
              style={{ width: 120, height: 34 }}
            >
              {/* Dynamic Island */}
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 ring-1 ring-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-800 ring-1 ring-zinc-700" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Signal */}
              <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" className="text-foreground">
                <rect x="0" y="6" width="3" height="6" rx="0.5" opacity="0.4"/>
                <rect x="4.5" y="4" width="3" height="8" rx="0.5" opacity="0.6"/>
                <rect x="9" y="2" width="3" height="10" rx="0.5" opacity="0.8"/>
                <rect x="13.5" y="0" width="3" height="12" rx="0.5"/>
              </svg>
              {/* Wifi */}
              <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" className="text-foreground">
                <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>
                <path d="M8 6a5.5 5.5 0 0 1 3.9 1.6l1.4-1.4A7.5 7.5 0 0 0 8 4a7.5 7.5 0 0 0-5.3 2.2l1.4 1.4A5.5 5.5 0 0 1 8 6z" opacity="0.7"/>
                <path d="M8 2a9.5 9.5 0 0 1 6.7 2.8l1.4-1.4A11.5 11.5 0 0 0 8 0a11.5 11.5 0 0 0-8.1 3.4l1.4 1.4A9.5 9.5 0 0 1 8 2z" opacity="0.4"/>
              </svg>
              {/* Battery */}
              <div className="flex items-center gap-0.5">
                <div className="w-6 h-3 rounded-[3px] border border-foreground/60 p-px">
                  <div className="h-full w-4/5 rounded-[2px] bg-foreground" />
                </div>
                <div className="w-0.5 h-1.5 rounded-r-sm bg-foreground/60" />
              </div>
            </div>
          </div>

          {/* App content */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>

          {/* Home indicator */}
          <div className="flex justify-center pb-2 pt-1 shrink-0">
            <div className="w-32 h-1 rounded-full bg-foreground/25" />
          </div>
        </div>
      </div>

      {/* Mobile: full screen, no chrome */}
      <div className="flex flex-col w-full h-screen md:hidden bg-background overflow-hidden">
        {children}
      </div>
    </div>
  );
}