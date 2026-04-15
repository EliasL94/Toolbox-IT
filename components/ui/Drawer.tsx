'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileSearch, MessagesSquare } from 'lucide-react';

export function Drawer() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/analyze', label: 'Analyser', icon: FileSearch },
    { href: '/architect', label: 'IA Architecte', icon: MessagesSquare },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-indigo-950/80 p-2 text-slate-100 shadow-[0_20px_60px_rgba(30,27,75,0.4)] backdrop-blur-3xl">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
              isActive
                ? 'bg-white/15 text-white'
                : 'text-indigo-200 hover:bg-white/5 hover:text-white'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline-block">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
