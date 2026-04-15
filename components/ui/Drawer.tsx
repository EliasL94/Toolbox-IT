'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileSearch, MessagesSquare } from 'lucide-react';

export function Drawer() {
  const pathname = usePathname();

  // On ne s'affiche pas sur la page d'accueil car elle a déjà son propre header marketing
  if (pathname === '/') return null;

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/analyze', label: 'Analyser', icon: FileSearch },
    { href: '/architect', label: 'IA Architecte', icon: MessagesSquare },
  ];

  return (
    <nav className="fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-indigo-950/80 p-2 text-slate-100 shadow-[0_10px_40px_rgba(30,27,75,0.3)] backdrop-blur-3xl">
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
      
      <div className="w-px h-6 bg-white/20 mx-1"></div>
      
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="group flex flex-col sm:flex-row items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-300 cursor-pointer"
      >
        <span className="hidden sm:inline-block">Quitter</span>
      </button>
    </nav>
  );
}
