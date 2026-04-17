import React from 'react';

/**
 * Centers the app as a mobile-style canvas on desktop,
 * full-screen on actual mobile devices.
 */
export default function MobileFrame({ children }) {
  return (
    <div className="min-h-screen bg-background flex items-stretch justify-center md:py-10">
      <div className="relative w-full md:max-w-[430px] md:min-h-[900px] md:rounded-[2.5rem] md:border md:border-border md:shadow-2xl md:shadow-black/40 md:overflow-hidden bg-background">
        {children}
      </div>
    </div>
  );
}