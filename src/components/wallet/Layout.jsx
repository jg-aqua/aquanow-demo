import React from 'react';
import { Outlet } from 'react-router-dom';
import MobileFrame from './MobileFrame';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <MobileFrame>
      <div className="flex flex-col h-full">
        <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </MobileFrame>
  );
}