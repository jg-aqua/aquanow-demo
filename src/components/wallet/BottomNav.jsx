import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, LineChart, ArrowLeftRight, User } from 'lucide-react';
import { motion } from 'framer-motion';

const items = [
  { to: '/', icon: Home, label: 'Wallet', match: ['/', '/asset', '/send', '/receive', '/swap', '/buy'] },
  { to: '/market', icon: LineChart, label: 'Market', match: ['/market'] },
  { to: '/activity', icon: ArrowLeftRight, label: 'Activity', match: ['/activity'] },
  { to: '/profile', icon: User, label: 'Profile', match: ['/profile'] },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  const isActive = (match) =>
    match.some((p) => p === '/' ? pathname === '/' : pathname.startsWith(p));

  return (
    <div className="px-4 pb-4 pt-2">
      <motion.nav
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className="glass border border-border/60 rounded-full flex items-center justify-around px-2 py-2 shadow-xl shadow-black/30"
      >
        {items.map(({ to, icon: Icon, label, match }) => {
          const active = isActive(match);
          return (
            <NavLink
              key={to}
              to={to}
              className={`relative flex flex-col items-center justify-center px-4 py-2 rounded-full transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-primary/10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5 relative z-10" strokeWidth={2} />
              <span className="text-[10px] mt-0.5 relative z-10 font-medium tracking-wide">
                {label}
              </span>
            </NavLink>
          );
        })}
      </motion.nav>
    </div>
  );
}