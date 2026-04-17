import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Shield, Bell, HelpCircle, FileText, LogOut, ChevronRight, Wallet,
} from 'lucide-react';

const rows = [
  { icon: Wallet, label: 'My Wallets', hint: '5 connected' },
  { icon: Shield, label: 'Security', hint: 'Face ID · 2FA' },
  { icon: Bell, label: 'Notifications' },
  { icon: FileText, label: 'Transaction Reports' },
  { icon: HelpCircle, label: 'Help & Support' },
];

export default function Profile() {
  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  return (
    <div className="px-5 pt-8 pb-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Account</p>
      <h1 className="font-serif text-4xl tracking-tightest mt-1">Profile</h1>

      <div className="mt-6 rounded-3xl border border-border/70 bg-card p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-primary-foreground text-xl font-semibold">
          {(me?.full_name || 'U')[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{me?.full_name || 'Wallet User'}</p>
          <p className="text-xs text-muted-foreground truncate">{me?.email}</p>
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-border/70 bg-card overflow-hidden divide-y divide-border/60">
        {rows.map(({ icon: Icon, label, hint }) => (
          <button
            key={label}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-secondary/60 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{label}</p>
              {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      <button
        onClick={() => base44.auth.logout()}
        className="mt-4 w-full h-12 rounded-2xl border border-border/70 flex items-center justify-center gap-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
      >
        <LogOut className="w-4 h-4" /> Log out
      </button>

      <p className="text-[11px] text-muted-foreground text-center mt-6">
        Lumen Wallet · v1.0
      </p>
    </div>
  );
}