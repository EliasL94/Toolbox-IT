/* eslint-disable react/no-unescaped-entities */
"use client";

import { FormEvent, useMemo, useState } from "react";

type CreateReviewResponse = {
  id: string;
  status: string;
  repository_url: string;
  created_at: string;
  links: {
    status_url: string;
  };
};

type ReviewProgressResponse = {
  id: string;
  status: "pending" | "processing";
  progress: number;
  message: string;
};

type ReviewCompletedResponse = {
  id: string;
  status: "completed";
  repository_url: string;
  completed_at: string;
  report: {
    architecture: {
      score: number;
      summary: string;
      improvements: string[];
    };
    security: {
      score: number;
      issues_found: number;
    };
    general_feedback: string;
  };
};

function isValidGithubUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === "github.com" &&
      /^\/[^/]+\/[^/]+\/?$/.test(parsed.pathname)
    );
  } catch {
    return false;
  }
}

const WAIT_BETWEEN_POLLS_MS = 500;

export default function Home() {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [result, setResult] = useState<ReviewCompletedResponse | null>(null);

  const canSubmit = useMemo(
    () => !isSubmitting && repositoryUrl.trim().length > 0,
    [isSubmitting, repositoryUrl],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setMessage(null);
    setResult(null);
    setProgress(0);
    setReviewId(null);

    const trimmedUrl = repositoryUrl.trim();
    const trimmedBranch = branch.trim() || "main";

    if (!isValidGithubUrl(trimmedUrl)) {
      setError("Veuillez saisir une URL GitHub valide (https://github.com/{owner}/{repo}).");
      return;
    }

    setIsSubmitting(true);

    try {
      const createResponse = await fetch("/api/v1/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repository_url: trimmedUrl,
          branch: trimmedBranch,
        }),
      });

      if (!createResponse.ok) {
        const payload = (await createResponse.json()) as { error?: string };
        throw new Error(payload.error ?? "Impossible de démarrer l'analyse.");
      }

      const created = (await createResponse.json()) as CreateReviewResponse;
      setReviewId(created.id);
      setMessage("Analyse démarrée. Vérification de la structure en cours...");

      let shouldContinue = true;

      while (shouldContinue) {
        await new Promise((resolve) => {
          setTimeout(resolve, WAIT_BETWEEN_POLLS_MS);
        });

        const statusResponse = await fetch(created.links.status_url, {
          method: "GET",
        });

        if (!statusResponse.ok && statusResponse.status !== 503) {
          const payload = (await statusResponse.json()) as { error?: string };
          throw new Error(payload.error ?? "Erreur pendant la récupération du statut.");
        }

        const payload = (await statusResponse.json()) as
          | ReviewProgressResponse
          | ReviewCompletedResponse
          | { status: "failed"; error_message?: string };

        if (payload.status === "completed") {
          setProgress(100);
          setMessage("Analyse terminée.");
          setResult(payload);
          shouldContinue = false;
          continue;
        }

        if (payload.status === "failed") {
          throw new Error(payload.error_message ?? "Analyse échouée.");
        }

        setProgress(payload.progress);
        setMessage(payload.message);
      }
    } catch (submissionError) {
      const fallbackMessage = "Une erreur est survenue pendant le parcours d'analyse.";
      const nextError =
        submissionError instanceof Error ? submissionError.message : fallbackMessage;
      setError(nextError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-16 md:px-10">
      <section className="glass-card space-y-3">
        <p className="eyebrow">Toolbox-IT / US23</p>
        <h1 className="text-4xl font-bold tracking-[-0.02em] text-slate-950">
          Parcours principal étudiant : analyse d'un dépôt GitHub de bout en bout
        </h1>
        <p className="max-w-3xl text-base leading-7 text-slate-700">
          Entrez l'URL d'un repository puis lancez l'analyse. L'interface gère la
          validation, les transitions d'état et l'affichage du rapport final.
        </p>
      </section>

      <section className="glass-card space-y-4">
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-slate-950">Lancer une analyse</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="repository-url">
              URL du repository GitHub
            </label>
            <input
              id="repository-url"
              name="repository-url"
              type="url"
              value={repositoryUrl}
              onChange={(event) => setRepositoryUrl(event.target.value)}
              placeholder="https://github.com/owner/repository"
              className="w-full rounded-xl border border-white/20 bg-white/70 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="branch">
              Branche (optionnel)
            </label>
            <input
              id="branch"
              name="branch"
              type="text"
              value={branch}
              onChange={(event) => setBranch(event.target.value)}
              placeholder="main"
              className="w-full rounded-xl border border-white/20 bg-white/70 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Analyse en cours..." : "Analyser ce dépôt"}
          </button>
        </form>
      </section>

      {error ? (
        <section className="glass-card space-y-2">
          <h2 className="text-xl font-bold tracking-[-0.02em] text-red-700">Erreur</h2>
          <p className="text-slate-700">{error}</p>
        </section>
      ) : null}

      {message ? (
        <section className="glass-card space-y-3">
          <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-950">Progression</h2>
          <p className="text-slate-700">{message}</p>
          <p className="text-sm text-slate-600">Review ID : {reviewId ?? "initialisation..."}</p>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm font-medium text-slate-700">{progress}%</p>
        </section>
      ) : null}

      {result ? (
        <section className="glass-card space-y-4">
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-slate-950">
            Résultat de l'analyse
          </h2>
          <p className="text-slate-700">
            Dépôt analysé : <code className="inline-code">{result.repository_url}</code>
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-white/60 p-4">
              <p className="text-sm text-slate-600">Score architecture</p>
              <p className="text-3xl font-bold text-slate-900">{result.report.architecture.score}/100</p>
              <p className="mt-2 text-slate-700">{result.report.architecture.summary}</p>
            </div>
            <div className="rounded-xl bg-white/60 p-4">
              <p className="text-sm text-slate-600">Score sécurité</p>
              <p className="text-3xl font-bold text-slate-900">{result.report.security.score}/100</p>
              <p className="mt-2 text-slate-700">
                Issues trouvées : {result.report.security.issues_found}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-slate-900">Améliorations recommandées</p>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              {result.report.architecture.improvements.map((improvement) => (
                <li key={improvement}>{improvement}</li>
              ))}
            </ul>
          </div>

          <p className="text-slate-700">{result.report.general_feedback}</p>
        </section>
      ) : null}
    </main>
  );
}
