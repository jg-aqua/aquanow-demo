import React from 'react';
import { Outlet } from 'react-router-dom';
import MobileFrame from './MobileFrame';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <MobileFrame>
      <div className="relative h-full">
        <main className="h-full overflow-y-auto no-scrollbar pb-28">
          <Outlet />
        </main>
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <BottomNav />
        </div>
      </div>
    </MobileFrame>
  );
}