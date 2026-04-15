'use client';

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-red-500 transition-colors cursor-pointer"
    >
      <LogOut className="w-4 h-4" /> Déconnexion
    </button>
  );
}
