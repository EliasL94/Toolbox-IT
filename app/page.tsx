import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAllReviews } from "@/lib/store";
import { SignOutButton } from "@/components/ui/SignOutButton";
import { 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Bot, 
  SearchCode, 
  GitBranch, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Cpu
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // Remplacer getAllReviews() par la version spécifique à l'utilisateur s'il est connecté
  // Mais sur la page d'accueil on pourrait vouloir montrer des stats globales ?
  // Pour isoler vraiment, si on veut des stats globales, on ne passe pas de userId.
  const allReviewsData = await getAllReviews();
  const reviews = allReviewsData.filter(r => r.status === 'completed' && r.report);
  
  const totalAnalyses = reviews.length;
  const totalProjects = new Set(reviews.map(r => r.repository_url)).size;
  
  type LegacyReport = {
    security?: { score?: number };
    code_quality?: { score?: number };
  };

  let averageScore: string | number = "-";
  if (reviews.length > 0) {
    const sum = reviews.reduce((acc, r) => {
      const sArch = r.report!.architecture?.score || 0;
      const legacy = r.report! as LegacyReport;
      const sSecA = r.report!.security_archi?.score || legacy.security?.score || 0;
      const sSecC = r.report!.security_code?.score || legacy.code_quality?.score || 0;
      const avg = (sArch + sSecA + sSecC) / 3;
      return acc + avg;
    }, 0);
    averageScore = Math.round(sum / reviews.length);
  }

  return (
    <>
      <header className="fixed top-0 w-full z-40 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-600 text-white">
              <Cpu className="h-5 w-5" />
            </div>
            <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Toolbox-IT</p>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#probleme" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Le Problème</a>
            <a href="#solution" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Notre Solution</a>
            <a href="#parcours" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Comment ça marche</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {session ? (
              <>
                <SignOutButton />
                <Link href="/dashboard" className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95">
                  Aller au Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Connexion
                </Link>
                <Link href="/register" className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95">
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex flex-col pt-24 pb-20">
        {/* HERO SECTION */}
        <section className="container mx-auto px-4 sm:px-6 pt-12 pb-20 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 max-w-4xl mx-auto leading-tight">
            Coachez vos architectures <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">
              propulsé par l&apos;IA
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Automatisez la revue de code, évaluez l&apos;architecture et la sécurité des dépôts Git en temps réel. Oubliez les tâches répétitives, passez à l&apos;ère de l&apos;IA.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/analyze" className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2 group">
              Lancer un Scan <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#solution" className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center hover:scale-105">
              Découvrir
            </Link>
          </div>
        </section>

        {/* DYNAMIC KPI SECTION */}
        <section className="container mx-auto px-4 sm:px-6 mb-24">
          <div className="backdrop-blur-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl shadow-slate-200/50 dark:shadow-black/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
              
              <div className="flex flex-col items-center md:items-start pt-6 md:pt-0 md:pl-8 text-center md:text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="text-slate-500 font-medium tracking-wide text-sm uppercase">Analyses effectuees</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-black text-slate-900 dark:text-white">{totalAnalyses}</p>
                  <span className="text-sm text-emerald-500 font-medium">rapport(s) généré(s)</span>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-start pt-6 md:pt-0 md:pl-8 text-center md:text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <h3 className="text-slate-500 font-medium tracking-wide text-sm uppercase">Depots audités</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-black text-slate-900 dark:text-white">{totalProjects}</p>
                  <span className="text-sm text-emerald-500 font-medium">projet(s) unique(s)</span>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-start pt-6 md:pt-0 md:pl-8 text-center md:text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-slate-500 font-medium tracking-wide text-sm uppercase">Score global moyen</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-black text-slate-900 dark:text-white">{averageScore}</p>
                  {averageScore !== "-" && <span className="text-2xl font-bold text-slate-400">/100</span>}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* PROBLEME SECTION */}
        <section id="probleme" className="container mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase mb-3">Le Problème</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white max-w-2xl mx-auto">
              La correction manuelle d&apos;architecture est inefficace.
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <Clock className="w-10 h-10 text-rose-500 mb-5" />
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Charge chronophage</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cloner, installer, configurer et lire des dizaines de repos pour chaque groupe prend des heures au lieu de minutes.</p>
            </div>
            <div className="bg-white dark:bg-slate-900/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <Layers className="w-10 h-10 text-amber-500 mb-5" />
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Hétérogénéité</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Chaque examinateur a ses propres biais sur l&apos;architecture (MVC, Hexagonale). L&apos;IA offre une objectivité radicale.</p>
            </div>
            <div className="bg-white dark:bg-slate-900/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <ShieldCheck className="w-10 h-10 text-red-500 mb-5" />
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Oublis de sécurité</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Les clés exposées et les injections SQL passent souvent entre les mailles du filet d&apos;une relecture rapide.</p>
            </div>
          </div>
        </section>

        {/* SOLUTION SECTION */}
        <section id="solution" className="container mx-auto px-4 sm:px-6 py-16">
          <div className="bg-slate-900 dark:bg-slate-950 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
            {/* Glow effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full bg-indigo-500/10 blur-[100px]"></div>
              <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] rounded-full bg-violet-500/10 blur-[100px]"></div>
            </div>

            <div className="relative z-10 text-center mb-16">
              <h2 className="text-sm font-bold tracking-widest text-indigo-400 uppercase mb-3">Notre Solution</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white max-w-2xl mx-auto">
                La puissance des LLMs au service de la pédagogie.
              </h3>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-colors">
                <SearchCode className="w-10 h-10 text-blue-400 mb-5" />
                <h4 className="text-xl font-bold text-white mb-3">Scanner d&apos;Architecture</h4>
                <p className="text-slate-300 leading-relaxed">Détection des patterns MVC, Clean Architecture, et calcul d&apos;un score rigoureux basé sur l&apos;arborescence du projet.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-colors">
                <ShieldCheck className="w-10 h-10 text-emerald-400 mb-5" />
                <h4 className="text-xl font-bold text-white mb-3">Audit de Sécurité</h4>
                <p className="text-slate-300 leading-relaxed">Recherche active des secrets exposés, clés d&apos;API en dur, et configuration des environnements.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-colors">
                <Bot className="w-10 h-10 text-violet-400 mb-5" />
                <h4 className="text-xl font-bold text-white mb-3">IA Architecte Autonome</h4>
                <p className="text-slate-300 leading-relaxed">Un assistant conversationnel Gemini qui prend le contexte de l&apos;analyse pour discuter des améliorations possibles.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PARCOURS SECTION */}
        <section id="parcours" className="container mx-auto px-4 sm:px-6 py-16 mb-10">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase mb-3">Comment ça marche</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white max-w-2xl mx-auto">
              Trois étapes simples pour auditer votre code.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Ligne connectrice décorative (invisible sur mobile) */}
            <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-200 via-violet-300 to-emerald-200 dark:from-indigo-800 dark:via-violet-800 dark:to-emerald-800 -z-10"></div>

            {/* Etape 1 */}
            <div className="relative group text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 dark:bg-slate-900 border-2 border-white dark:border-indigo-900 ring-4 ring-indigo-50 dark:ring-slate-900 flex items-center justify-center text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-6 shadow-xl shadow-indigo-500/10 group-hover:-translate-y-2 transition-transform duration-300">
                1
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Importer un dépôt</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">Collez l&apos;URL GitHub du projet. Notre pipeline sécurisé récupère textuellement l&apos;intégralité de l&apos;architecture.</p>
            </div>

            {/* Etape 2 */}
            <div className="relative group text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-[2rem] bg-violet-50 dark:bg-slate-900 border-2 border-white dark:border-violet-900 ring-4 ring-violet-50 dark:ring-slate-900 flex items-center justify-center text-3xl font-black text-violet-600 dark:text-violet-400 mb-6 shadow-xl shadow-violet-500/10 group-hover:-translate-y-2 transition-transform duration-300">
                2
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">L&apos;IA Analyse</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">Gemini inspecte rigoureusement vos patterns MVC, détecte la dette technique et lève les failles de sécurité.</p>
            </div>

            {/* Etape 3 */}
            <div className="relative group text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-[2rem] bg-emerald-50 dark:bg-slate-900 border-2 border-white dark:border-emerald-900 ring-4 ring-emerald-50 dark:ring-slate-900 flex items-center justify-center text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-6 shadow-xl shadow-emerald-500/10 group-hover:-translate-y-2 transition-transform duration-300">
                3
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Exploiter & Itérer</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">Visualisez vos scores globaux et entrez en discussion avec l&apos;IA Architecte pour refactoriser intelligemment.</p>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
