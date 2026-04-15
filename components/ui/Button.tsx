import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40':
              variant === 'primary',
            'bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-slate-100 hover:bg-white/70 dark:hover:bg-slate-800/70':
              variant === 'secondary',
            'hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300':
              variant === 'ghost',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-5 py-2.5 text-base': size === 'md',
            'px-8 py-3.5 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
