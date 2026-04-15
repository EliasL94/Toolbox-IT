import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevated?: boolean;
}

export function GlassCard({
  children,
  className,
  elevated = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/10 backdrop-blur-2xl transition-all duration-300',
        elevated
          ? 'bg-white/70 shadow-[0_30px_80px_rgba(15,23,42,0.08)] dark:bg-slate-800/60 dark:border-slate-700/50'
          : 'bg-white/40 shadow-[0_15px_40px_rgba(15,23,42,0.04)] dark:bg-slate-900/40 dark:border-slate-800/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
