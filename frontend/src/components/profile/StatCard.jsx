const ACCENT = {
  amber:   { bg: 'bg-amber-400/8',   border: 'border-amber-400/15',   icon: 'text-amber-400',    text: 'text-amber-400'    },
  emerald: { bg: 'bg-emerald-400/8', border: 'border-emerald-400/15', icon: 'text-emerald-400',  text: 'text-emerald-400'  },
  rose:    { bg: 'bg-rose-400/8',    border: 'border-rose-400/15',    icon: 'text-rose-400',     text: 'text-rose-400'     },
  blue: {
    bg: 'bg-sky-400/8',
    border: 'border-sky-400/20',
    icon: 'text-sky-300',
    text: 'text-sky-200',
  },
  
  magenta: {
    bg: 'bg-fuchsia-400/8',
    border: 'border-fuchsia-400/20',
    icon: 'text-fuchsia-300',
    text: 'text-fuchsia-200',
  },
  neutral: {
    bg: 'bg-obsidian-800',
    border: 'border-obsidian-600/70',
    icon: 'text-ivory-400/50',
    text: 'text-ivory-200',
  },
};

import React from 'react';
export default function StatCard({ label, value, icon, accent = 'neutral' }) {
  const a = ACCENT[accent] ?? ACCENT.neutral;

  return (
    <div
      className={`
        rounded-xl border
        transition-transform duration-150
        hover:-translate-y-0.5
        ${a.bg}
        ${a.border}
        p-4
        flex
        h-full
        min-w-0
        flex-col
        gap-2.5
      `}
    >
      <div className={`${a.icon} flex-shrink-0`}>
        {React.cloneElement(icon, {
          className: 'h-5 w-5'
        })}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`font-display font-semibold text-sm ${a.text} leading-tight truncate`}
          title={value}
        >
          {value}
        </p>
        <p className="text-xs text-ivory-400/40 font-mono uppercase tracking-wider mt-0.5 truncate">
          {label}
        </p>
      </div>
    </div>
  );
}
