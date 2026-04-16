'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { GitBranch, CheckCircle2, AlertTriangle, XCircle, ArrowLeft, Loader2, Component, FileCode2, Lock, ShieldCheck } from 'lucide-react';
import type { ReviewData } from '@/lib/store';

/** Composant pour afficher une barre horizontale de score colorée */
function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 80
      ? 'bg-emerald-500'
      : score >= 50
        ? 'bg-amber-500'
        : 'bg-red-500';
  const textColor =
    score >= 80
      ? 'text-emerald-500'
      : score >= 50
        ? 'text-amber-500'
        : 'text-red-500';

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`font-mono font-bold text-lg ${textColor}`}>
        {score}/100
      </span>
    </div>
  );
}

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchReview = async () => {
      try {
        const response = await fetch(`/api/v1/reviews/${id}`);
        if (!response.ok) {
          const data = await response.json();
          setError(data.error || 'Review introuvable.');
          setLoading(false);
          return;
        }
        const data: ReviewData = await response.json();
        setReview(data);
      } catch {
        setError('Impossible de charger le rapport.');
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  // --- Loading state ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="text-slate-500">Chargement du rapport...</p>
      </div>
    );
  }

  // --- Error state ---
  if (error || !review) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-20 text-center">
        <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Rapport introuvable</h1>
        <p className="text-slate-500 mb-6">{error || 'Ce rapport n\'existe pas ou a expiré.'}</p>
        <Link href="/analyze">
          <Button>Lancer une nouvelle analyse</Button>
        </Link>
      </div>
    );
  }

  // --- Failed state ---
  if (review.status === 'failed') {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-20 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">L&apos;analyse a échoué</h1>
        <p className="text-slate-500 mb-6">{review.error_message}</p>
        <Link href="/analyze">
          <Button>Réessayer</Button>
        </Link>
      </div>
    );
  }

  // --- Processing state ---
  if (review.status !== 'completed' || !review.report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="text-slate-500">Analyse en cours... ({review.status})</p>
      </div>
    );
  }

  const { report } = review;
  
  // Compatibilité avec les anciens rapports
  const archScore = report.architecture?.score || 0;
  const secArchiScore = report.security_archi?.score || (report as any).security?.score || 0;
  const secCodeScore = report.security_code?.score || (report as any).code_quality?.score || 0;

  const globalScore = Math.round((archScore + secArchiScore + secCodeScore) / 3);
  const globalColor =
    globalScore >= 80
      ? 'text-emerald-500'
      : globalScore >= 50
        ? 'text-amber-500'
        : 'text-red-500';

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-28 pb-12">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Retour au Dashboard
        </Link>
      </div>

      <header className="mb-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <GitBranch className="h-6 w-6 text-slate-700 dark:text-slate-300" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {review.repository_url.replace('https://github.com/', '')}
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            Analysé le {new Date(review.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            {' · '}Branche : {review.branch}
            {report.architecture.pattern_detected && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {report.architecture.pattern_detected}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium uppercase tracking-wider text-slate-500">Score de Structure</p>
            <p className={`text-4xl font-black ${globalColor}`}>
              {globalScore}<span className="text-2xl text-slate-400">/100</span>
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Detailed sections */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Architecture Section */}
          <GlassCard className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Component className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Architecture & Structure</h2>
              </div>
            </div>
            <ScoreBar score={archScore} />
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{report.architecture.summary}</p>
            <div className="mt-6 space-y-3">
              {report.architecture.strengths.map((s, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700 dark:text-slate-300">{s}</p>
                </div>
              ))}
              {report.architecture.improvements.map((s, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700 dark:text-slate-300">{s}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Security Architecture Section */}
          <GlassCard className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Sécurité de l&apos;Architecture</h2>
              </div>
            </div>
            <ScoreBar score={secArchiScore} />
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{report.security_archi?.summary || (report as any).security?.summary || "Analyse de sécurité indisponible pour ce format."}</p>
            <div className="mt-6 space-y-3">
              {(report.security_archi?.strengths || (report as any).security?.strengths || []).map((s: string, i: number) => (
                <div key={i} className="flex gap-3 items-start">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700 dark:text-slate-300">{s}</p>
                </div>
              ))}
              {(report.security_archi?.details || (report as any).security?.details || []).map((s: string, i: number) => (
                <div key={i} className="flex gap-3 items-start">
                  <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700 dark:text-slate-300">{s}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Security Implementation Section */}
          <GlassCard className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                  <Lock className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Sécurité du Code (Fichiers)</h2>
              </div>
            </div>
            <ScoreBar score={secCodeScore} />
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{report.security_code?.summary || (report as any).code_quality?.summary || "Analyse détaillée indisponible."}</p>
            {((report.security_code?.details || (report as any).code_quality?.issues || []) as string[]).length > 0 && (
              <div className="mt-6 space-y-3">
                {((report.security_code?.details || (report as any).code_quality?.issues || []) as string[]).map((s, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    {(report.security_code?.issues_found || 0) > 0 || (report as any).code_quality ? (
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    )}
                    <p className="text-sm text-slate-700 dark:text-slate-300">{s}</p>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Column — AI Feedback */}
        <div className="lg:col-span-1">
          <GlassCard elevated className="p-6 sticky top-24 bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/50">
            <h3 className="font-bold text-lg mb-4 text-indigo-900 dark:text-indigo-200">Feedback Général de l&apos;IA</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
              &quot;{report.general_feedback}&quot;
            </p>
            
            {report.architecture.improvements.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Actions Prioritaires</h4>
                <ul className="text-sm space-y-2 text-slate-700 dark:text-slate-300">
                  {report.architecture.improvements.slice(0, 3).map((imp, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" /> {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-8">
              <Link href={`/architect?reviewId=${review.id}`}>
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
