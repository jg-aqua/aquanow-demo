import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function TopBar({ title, back = true, right = null }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-5 pt-6 pb-3">
      <div className="w-9">
        {back && (
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full border border-border/70 flex items-center justify-center text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>
      <h1 className="text-sm font-semibold tracking-wide">{title}</h1>
      <div className="w-9 flex justify-end">{right}</div>
    </div>
  );
}