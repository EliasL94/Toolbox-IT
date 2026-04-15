import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { GitBranch, CheckCircle2, AlertTriangle, XCircle, ArrowLeft, Download, Component, FileCode2, Lock } from 'lucide-react';

export default function ReviewPage() {
  // Demo data matching our spec
  const score = 85;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 pb-32">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Retour au Dashboard
        </Link>
        <Button variant="ghost" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Exporter (CSV)
        </Button>
      </div>

      <header className="mb-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <GitBranch className="h-6 w-6 text-slate-700 dark:text-slate-300" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              utilisateur / super-projet
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Analysé le 14 Avril 2026 à 14:07</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium uppercase tracking-wider text-slate-500">Score Global</p>
            <p className="text-4xl font-black text-emerald-500">
              {score}<span className="text-2xl text-slate-400">/100</span>
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Detailed themes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Architecture Section */}
          <GlassCard className="p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Component className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Architecture & Structure</h2>
              </div>
              <span className="font-mono font-bold text-lg text-emerald-500">92/100</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">Respect du pattern MVC</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Les dossiers Controllers, Models et Views sont bien isolés. La logique métier n&apos;est pas fuitée.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">Services manquants</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Extraire la logique métier complexe hors des contrôleurs pour la placer dans des `Services` ou `UseCases`.</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Code Section */}
          <GlassCard className="p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                  <FileCode2 className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Qualité du Code</h2>
              </div>
              <span className="font-mono font-bold text-lg text-amber-500">75/100</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">Typage via TypeScript</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Excellente utilisation des interfaces pour définir les entités de base de données.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">God Class détectée</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Le fichier `utils.ts` fait 850 lignes et a de trop multiples responsabilités.</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Security Section */}
          <GlassCard className="p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Sécurité</h2>
              </div>
              <span className="font-mono font-bold text-lg text-emerald-500">100/100</span>
            </div>
            
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">Aucune faille majeure</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Pas de secrets en dur. Les routes sensibles utilisent bien les middlewares.</p>
              </div>
            </div>
          </GlassCard>

        </div>

        {/* Right Column - AI Recommendations */}
        <div className="lg:col-span-1">
          <GlassCard elevated className="p-6 sticky top-24 bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/50">
            <h3 className="font-bold text-lg mb-4 text-indigo-900 dark:text-indigo-200">Feedback Général de l&apos;IA</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
              &quot;Le projet est globalement très structuré. L&apos;effort mis sur le Modèle-Vue-Contrôleur est notable. Cependant, pour un projet de cette taille, continuer à faire grossir les contrôleurs va créer de la dette technique. Je suggère une refactorisation modérée pour extraire la logique.&quot;
            </p>
            
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Actions Prioritaires</h4>
              <ul className="text-sm space-y-2 text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" /> Restructurer `utils.ts`
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" /> Créer le dossier `src/services`
                </li>
              </ul>
            </div>
            
            <div className="mt-8">
              <Link href="/architect">
                <Button className="w-full">
                  Discuter avec l&apos;IA Architecte
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
