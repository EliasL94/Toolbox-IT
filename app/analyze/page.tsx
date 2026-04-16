'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { FolderGit2, Play, Loader2, Server, ShieldCheck, Code2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AnalyzePage() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [displayedProgress, setDisplayedProgress] = useState(0);
  const [stepText, setStepText] = useState('');

  // S'il est bloqué sur "Analyse IA" (60%), simuler qu'il avance un peu
  useEffect(() => {
    setDisplayedProgress(progress);
    
    let interval: NodeJS.Timeout;
    if (progress === 60) {
      interval = setInterval(() => {
        setDisplayedProgress((prev) => {
          if (prev < 84) {
            // Avance plus vite jusqu'à 75%, puis plus lentement
            const increment = prev < 75 ? 1 : (Math.random() > 0.5 ? 1 : 0);
            return prev + increment;
          }
          return prev;
        });
      }, 700);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [progress]);

  const router = useRouter();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes('github.com')) {
      setError('Veuillez entrer une URL GitHub valide.');
      return;
    }
    setError('');
    setIsAnalyzing(true);
    setProgress(0);
    setDisplayedProgress(0);
    setStepText('Démarrage...');

    try {
      const response = await fetch('/api/v1/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repository_url: url,
          branch: 'main',
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || 'Une erreur est survenue.');
        setIsAnalyzing(false);
        return;
      }

      if (!response.body) {
        throw new Error('Le flux de réponse est vide.');
      }

      // Lecture du flux de données en continu (NDJSON)
      const processStreamLine = (line: string) => {
        if (!line.trim()) return;
        try {
          const data = JSON.parse(line);
          if (data.error) {
            setError(data.error);
            setIsAnalyzing(false);
            return;
          }
          if (data.step) setStepText(data.step);
          if (data.progress !== undefined) setProgress(data.progress);
          if (data.progress === 100 && data.id) {
            router.push(`/reviews/${data.id}`);
          }
        } catch (err) {
          console.error('Erreur parsing chunk JSON', line, err);
        }
      };

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          processStreamLine(line);
        }
      }

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
          L&apos;IA va scanner l&apos;architecture, auditer le code et vérifier les bonnes pratiques de sécurité étape par étape.
        </p>
      </div>

      <GlassCard elevated className="p-2 sm:p-4 max-w-2xl mx-auto w-full relative z-10 transition-all">
        {!isAnalyzing ? (
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
              disabled={!url}
            >
              <span className="flex items-center gap-2">
                <Play className="h-5 w-5 fill-current" /> Lancer le scan
              </span>
            </Button>
          </form>
        ) : (
          <div className="px-4 py-6 text-center w-full min-h-[140px] flex flex-col justify-center animate-in fade-in zoom-in duration-300">
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2 flex items-center justify-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              {stepText}
            </h3>
            
            <div className="w-full max-w-md mx-auto mt-4 bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner flex shrink-0">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${displayedProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-3 font-mono">{displayedProgress}%</p>
          </div>
        )}
        
        {error && <p className="text-red-500 text-sm mt-3 ml-2 text-center">{error}</p>}
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
