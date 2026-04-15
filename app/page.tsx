export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-16 md:px-10">
      <section className="glass-card space-y-3">
        <p className="eyebrow">Toolbox-IT / US22</p>
        <h1 className="text-4xl font-bold tracking-[-0.02em] text-slate-950">
          Socle applicatif initial prêt pour le développement collaboratif
        </h1>
        <p className="max-w-3xl text-base leading-7 text-slate-700">
          Cette base Next.js fournit une structure propre, une séparation claire
          frontend/backend et des scripts de contrôle qualité exécutables dès le
          démarrage du projet.
        </p>
      </section>

      <section className="glass-card space-y-4">
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-slate-950">
          Vérification rapide
        </h2>
        <ul className="space-y-2 text-slate-700">
          <li>
            <code className="inline-code">npm run dev</code> lance
            l&apos;application en local.
          </li>
          <li>
            <code className="inline-code">npm run check</code> exécute lint +
            typecheck.
          </li>
          <li>
            Endpoint de santé disponible via{" "}
            <code className="inline-code">/api/v1/health</code>.
          </li>
        </ul>
      </section>

      <section className="glass-card space-y-4">
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-slate-950">
          Séparation des responsabilités
        </h2>
        <ul className="space-y-2 text-slate-700">
          <li>
            <code className="inline-code">app/</code> : UI, layouts, pages et
            routes API.
          </li>
          <li>
            <code className="inline-code">docs/</code> : cadrage produit,
            architecture, contrat API, règles IA.
          </li>
          <li>
            <code className="inline-code">public/</code> : assets statiques.
          </li>
        </ul>
      </section>
    </main>
  );
}
