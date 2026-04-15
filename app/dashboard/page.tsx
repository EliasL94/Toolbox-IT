'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { PlusCircle, FolderGit2, Search, Loader2, Trash2 } from 'lucide-react';
import type { ReviewData } from '@/lib/store';

export default function DashboardPage() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/v1/reviews');
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error("Erreur de chargement des analyses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Empêche le clic sur la card
    if (!confirm("Voulez-vous vraiment supprimer cette analyse ?")) return;

    try {
      const res = await fetch(`/api/v1/reviews/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau.");
    }
  };

  const filteredReviews = reviews.filter((review) =>
    review.repository_url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-28 pb-12">
      <header className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Gérez et analysez les projets de votre promotion.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher un projet..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm outline-none backdrop-blur-md focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
            />
          </div>
          <Link href="/analyze">
            <Button size="md" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Nouveau Scan</span>
            </Button>
          </Link>
        </div>
      </header>

      <section className="mb-10">
        <h2 className="mb-6 text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <FolderGit2 className="h-5 w-5 text-blue-500" />
          Projets Récemment Analysés
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredReviews.map((project) => {
              // Récupération de données globales
              let score = 0;
              let danger = false;
              let dateStr = "Date inconnue";

              if (project.completed_at) {
                dateStr = new Date(project.completed_at).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                });
              } else {
                dateStr = new Date(project.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                });
              }

              if (project.report) {
                 score = Math.round((project.report.architecture.score + project.report.code_quality.score + project.report.security.score) / 3);
                 danger = score < 50;
              }

              return (
                <Link key={project.id} href={`/reviews/${project.id}`} className="group">
                  <GlassCard className="h-full flex flex-col justify-between p-6 transition-transform hover:-translate-y-1 relative overflow-hidden">
                    {/* Indicateur de status */}
                    {project.status !== "completed" && project.status !== "failed" && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>
                    )}
                    {project.status === "failed" && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                    )}
                    {project.status === "completed" && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                    )}

                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                            <FolderGit2 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{project.repository_url.replace('https://github.com/', '')}</h3>
                            <p className="text-xs text-slate-500 uppercase">{project.status}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDelete(e, project.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Supprimer l'analyse"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                        {project.status === "completed" 
                          ? project.report?.architecture.summary 
                          : project.status === "failed" 
                            ? project.error_message 
                            : "Analyse en cours..."}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                      <span className="text-xs text-slate-500">{dateStr}</span>
                      {project.status === "completed" && (
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium ${danger ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                          Score : {score}/100
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </Link>
              );
            })}
            
            <Link href="/analyze" className="group">
              <GlassCard className="h-full min-h-[200px] flex flex-col items-center justify-center p-6 border-dashed border-2 hover:border-blue-500/50 bg-transparent dark:bg-transparent">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 mb-3 group-hover:scale-110 transition-transform">
                  <PlusCircle className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-700 dark:text-slate-300">Analyser un nouveau projet</h3>
                <p className="text-sm text-slate-500 mt-1 text-center">Collez l&apos;URL GitHub pour lancer le processus.</p>
              </GlassCard>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
