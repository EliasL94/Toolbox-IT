import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { PlusCircle, FolderGit2, Search } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 pb-32">
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
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm outline-none backdrop-blur-md focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
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
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { id: '1', name: 'api-express-advanced', author: 'groupe-b', score: 85, date: 'Il y a 2h' },
            { id: '2', name: 'react-dashboard', author: 'groupe-a', score: 92, date: 'Hier' },
            { id: '3', name: 'symfony-ecommerce', author: 'groupe-c', score: 64, date: 'Il y a 3 jours', danger: true },
          ].map((project) => (
            <Link key={project.id} href={`/reviews/rev_${project.id}`} className="group">
              <GlassCard className="h-full flex flex-col justify-between p-6 transition-transform hover:-translate-y-1">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                        <FolderGit2 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{project.name}</h3>
                        <p className="text-xs text-slate-500">{project.author}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300">Dernière analyse complète : Structure et Qualité de code revues.</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-xs text-slate-500">{project.date}</span>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium ${project.danger ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                    Score : {project.score}/100
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
          
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
      </section>
    </div>
  );
}
