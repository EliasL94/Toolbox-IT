import Link from "next/link";

export default function Home() {
  return (
    <>
      <header className="site-header">
        <nav className="site-nav">
          <p className="text-sm font-semibold tracking-[-0.01em]">Toolbox-IT</p>
          <div className="nav-links">
            <a href="#probleme">Probleme</a>
            <a href="#solution">Solution</a>
            <a href="#parcours">Parcours</a>
          </div>
          <Link href="/dashboard" className="btn-primary">
            Ouvrir l&apos;application
          </Link>
        </nav>
      </header>

      <main className="container-page flex flex-col gap-6">
        <section className="hero-grid">
          <article className="glass-card space-y-4">
            <p className="eyebrow">The Digital Ether</p>
            <h1 className="text-4xl font-bold tracking-[-0.02em] text-slate-950 dark:text-slate-100">
              La suite intelligente pour reviewer les projets Github et coacher
              l&apos;architecture.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-700 dark:text-slate-300">
              Toolbox-IT automatise les analyses architecture/code, fournit des
              feedbacks actionnables et accompagne les etudiants avec un
              assistant IA Architecte.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/analyze" className="btn-primary">
                Analyser un depot
              </Link>
              <Link href="/reviews/rev_demo_001" className="btn-secondary">
                Voir un rapport type
              </Link>
            </div>
          </article>

          <article className="glass-card space-y-4">
            <p className="eyebrow">Vue d&apos;ensemble</p>
            <div className="kpi-grid">
              <div className="rounded-2xl bg-white/45 p-4 dark:bg-slate-900/40">
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  3
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Outils complementaires
                </p>
              </div>
              <div className="rounded-2xl bg-white/45 p-4 dark:bg-slate-900/40">
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  +70%
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Temps de correction gagne
                </p>
              </div>
              <div className="rounded-2xl bg-white/45 p-4 dark:bg-slate-900/40">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
                  24/7
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Feedback continu
                </p>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Cible: professeurs correcteurs, etudiants et responsables
              pedagogiques. Le MVP privilegie l&apos;analyse unitaire de depot et
              les standards predefinis (MVC/Clean Architecture).
            </p>
          </article>
        </section>

        <section id="probleme" className="glass-card space-y-4">
          <p className="eyebrow">Probleme</p>
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-slate-950 dark:text-slate-100">
            Corriger vite, objectivement, et sans perdre le feedback pedagogique
          </h2>
          <div className="tool-grid">
            <article className="rounded-3xl bg-white/50 p-5 dark:bg-slate-900/35">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Charge de correction
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Cloner et auditer a la main des dizaines de repos prend trop de
                temps.
              </p>
            </article>
            <article className="rounded-3xl bg-white/50 p-5 dark:bg-slate-900/35">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Heterogeneite d&apos;evaluation
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Les standards architecture ne sont pas appliques uniformement.
              </p>
            </article>
            <article className="rounded-3xl bg-white/50 p-5 dark:bg-slate-900/35">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Feedback trop tardif
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Les etudiants decouvrent souvent les erreurs de structure au
                rendu final.
              </p>
            </article>
          </div>
        </section>

        <section id="solution" className="glass-card space-y-4">
          <p className="eyebrow">Solution</p>
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-slate-950 dark:text-slate-100">
            Une plateforme, trois outils
          </h2>
          <div className="tool-grid">
            <article className="rounded-3xl bg-white/50 p-5 dark:bg-slate-900/35">
              <h3 className="text-xl font-semibold">Analyseur d&apos;architecture</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Compare la structure du depot aux templates MVC/Clean et calcule
                un score.
              </p>
            </article>
            <article className="rounded-3xl bg-white/50 p-5 dark:bg-slate-900/35">
              <h3 className="text-xl font-semibold">Analyseur de code</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Detecte mauvaises pratiques et signaux de securite pour une revue
                plus fiable.
              </p>
            </article>
            <article className="rounded-3xl bg-white/50 p-5 dark:bg-slate-900/35">
              <h3 className="text-xl font-semibold">IA Architecte</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Discussion guidee qui propose des architectures pro selon stack,
                objectifs et contraintes.
              </p>
            </article>
          </div>
        </section>

        <section id="parcours" className="glass-card space-y-4">
          <p className="eyebrow">Parcours principal</p>
          <div className="steps-grid">
            <article className="rounded-3xl bg-white/50 p-5 dark:bg-slate-900/35">
              <p className="text-sm font-semibold uppercase tracking-[0.05em] text-blue-700 dark:text-blue-300">
                Etape 1
              </p>
              <h3 className="mt-2 text-xl font-semibold">Importer un depot</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Saisie URL Github + branche, validation, puis lancement
                d&apos;analyse.
              </p>
            </article>
            <article className="rounded-3xl bg-white/50 p-5 dark:bg-slate-900/35">
              <p className="text-sm font-semibold uppercase tracking-[0.05em] text-blue-700 dark:text-blue-300">
                Etape 2
              </p>
              <h3 className="mt-2 text-xl font-semibold">Suivre le traitement</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Statuts pending/processing et progression jusqu&apos;au rapport.
              </p>
            </article>
            <article className="rounded-3xl bg-white/50 p-5 dark:bg-slate-900/35">
              <p className="text-sm font-semibold uppercase tracking-[0.05em] text-blue-700 dark:text-blue-300">
                Etape 3
              </p>
              <h3 className="mt-2 text-xl font-semibold">Exploiter le rapport</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Scores architecture/securite + recommandations prioritaires.
              </p>
            </article>
          </div>
        </section>
      </main>

      <aside className="drawer" aria-label="IT Toolbox Drawer">
        <div className="drawer-list text-sm">
          <span className="font-semibold">IT-Toolbox Drawer</span>
          <Link href="/dashboard" className="rounded-xl bg-white/10 px-3 py-2">
            Dashboard
          </Link>
          <Link href="/analyze" className="rounded-xl bg-white/10 px-3 py-2">
            Analyse
          </Link>
          <Link
            href="/reviews/rev_demo_001"
            className="rounded-xl bg-white/10 px-3 py-2"
          >
            Resultats
          </Link>
        </div>
      </aside>
    </>
  );
}
