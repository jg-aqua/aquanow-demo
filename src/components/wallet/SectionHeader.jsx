import React from 'react';
import { Link } from 'react-router-dom';

export default function SectionHeader({ title, actionLabel, actionTo, right }) {
  return (
    <div className="flex items-baseline justify-between mb-2 mt-6">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      {actionLabel && actionTo ? (
        <Link to={actionTo} className="text-xs text-muted-foreground hover:text-primary transition-colors">
          {actionLabel}
        </Link>
      ) : (
        right
      )}
    </div>
  );
}