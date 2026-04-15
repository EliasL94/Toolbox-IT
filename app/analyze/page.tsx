'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { FolderGit2, Play, Loader2, Server, ShieldCheck, Code2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AnalyzePage() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes('github.com')) {
      setError('Veuillez entrer une URL GitHub valide.');
      return;
    }
    setError('');
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/v1/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repository_url: url,
          branch: 'main',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue.');
        setIsAnalyzing(false);
        return;
      }

      // Rediriger vers la page de résultats avec le vrai ID
      router.push(`/reviews/${data.id}`);
    } catch {
      setError('Impossible de contacter le serveur. Vérifiez votre connexion.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-20 pb-32 flex flex-col min-h-[80vh] justify-center">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 mb-6">
          <FolderGit2 className="h-8 w-8" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4">
          Analysez un dépôt GitHub
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          L&apos;IA va scanner l&apos;architecture, auditer le code et vérifier les bonnes pratiques de sécurité en quelques secondes.
        </p>
      </div>

      <GlassCard elevated className="p-2 sm:p-4 max-w-2xl mx-auto w-full relative z-10">
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isAnalyzing}
            placeholder="https://github.com/utilisateur/projet" 
            className="flex-1 rounded-xl px-4 py-4 sm:py-3 text-base bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow disabled:opacity-50"
          />
          <Button 
            type="submit" 
            size="lg" 
            className="sm:w-auto w-full"
            disabled={isAnalyzing || !url}
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> Analyse en cours...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Play className="h-5 w-5 fill-current" /> Lancer le scan
              </span>
            )}
          </Button>
        </form>
        {error && <p className="text-red-500 text-sm mt-3 ml-2">{error}</p>}
      </GlassCard>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto w-full mt-16 opacity-70">
        <div className="flex flex-col items-center text-center gap-2">
          <Server className="h-6 w-6 text-slate-400" />
          <h3 className="font-medium text-slate-700 dark:text-slate-300">Patterns Architecturaux</h3>
          <p className="text-sm text-slate-500">Vérification MVC, Clean Arch...</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <Code2 className="h-6 w-6 text-slate-400" />
          <h3 className="font-medium text-slate-700 dark:text-slate-300">Qualité du Code</h3>
          <p className="text-sm text-slate-500">Complexité, dettes techniques</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <ShieldCheck className="h-6 w-6 text-slate-400" />
          <h3 className="font-medium text-slate-700 dark:text-slate-300">Audit de Sécurité</h3>
          <p className="text-sm text-slate-500">Détection de failles / secrets</p>
        </div>
      </div>
    </div>
  );
}
