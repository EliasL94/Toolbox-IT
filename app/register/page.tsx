'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Cpu, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur lors de la création du compte.');
        setIsLoading(false);
        return;
      }

      // Connexion automatique après inscription réussie
      const loginRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (loginRes?.error) {
        setError("Compte créé mais erreur de connexion automatique.");
        setIsLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Impossible de contacter le serveur.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[20%] right-[20%] w-[500px] h-[500px] rounded-full bg-violet-500/20 blur-[120px]"></div>
        <div className="absolute bottom-[20%] left-[20%] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-violet-600 text-white mb-4 shadow-lg shadow-violet-600/30">
            <Cpu className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Créer un compte</h1>
          <p className="text-slate-600 dark:text-slate-400">Rejoignez Toolbox-IT et auditez vos projets pro.</p>
        </div>

        <GlassCard className="p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle top border gradient */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-xl flex items-center gap-2 border border-red-200 dark:border-red-900/50">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-200 block">Nom complet</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                placeholder="Ex: Jean Dupont"
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-colors disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-200 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="votre@email.com"
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-colors disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-200 block">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Au moins 6 caractères"
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-colors disabled:opacity-50"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full group !bg-violet-600 hover:!bg-violet-700">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Inscription...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Créer mon compte <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors">
              Se connecter
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
