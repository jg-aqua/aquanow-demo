import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LineChart, ArrowLeftRight, User } from 'lucide-react';
import { motion } from 'framer-motion';

const items = [
{ to: '/', icon: Home, label: 'Wallet' },
{ to: '/market', icon: LineChart, label: 'Market' },
{ to: '/activity', icon: ArrowLeftRight, label: 'Activity' },
{ to: '/profile', icon: User, label: 'Profile' }];


export default function BottomNav() {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-30 px-4 pb-4 pt-2">
      <motion.nav
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }} className="px-2 py-2 opacity-80 rounded-full glass border border-border/60 flex items-center justify-around shadow-xl shadow-black/30">

        
        {items.map(({ to, icon: Icon, label }) =>
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
          `relative flex flex-col items-center justify-center px-4 py-2 rounded-full transition-colors ${
          isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`

          }>
          
            {({ isActive }) =>
          <>
                {isActive &&
            <motion.span
              layoutId="nav-pill"
              className="absolute inset-0 rounded-full bg-primary/10"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }} />

            }
                <Icon className="w-5 h-5 relative z-10" strokeWidth={2} />
                <span className="text-[10px] mt-0.5 relative z-10 font-medium tracking-wide">
                  {label}
                </span>
              </>
          }
          </NavLink>
        )}
      </motion.nav>
    </div>);

}