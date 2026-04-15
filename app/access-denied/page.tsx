import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <main className="container-page">
      <section className="glass-card space-y-3 text-center">
        <p className="eyebrow">Erreur d&apos;acces</p>
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-slate-950 dark:text-slate-100">
          Acces refuse
        </h1>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          Ton role actuel ne permet pas d&apos;acceder a cette ressource. Contacte
          un administrateur ou reviens au dashboard.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/dashboard" className="btn-primary">
            Dashboard
          </Link>
          <Link href="/" className="btn-secondary">
            Landing
          </Link>
        </div>
      </section>
    </main>
  );
}
