import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, jest } from "@jest/globals";
import Home from "@/app/page";

function createJsonResponse(payload: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  } as Response;
}

describe("Main user journey", () => {
  it("runs end-to-end flow from repository URL to final result", async () => {
    const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;

    fetchMock
      .mockResolvedValueOnce(
        createJsonResponse(
          {
            id: "rev_test123",
            status: "pending",
            repository_url: "https://github.com/vercel/next.js",
            created_at: "2026-04-15T10:00:00Z",
            links: {
              status_url: "/api/v1/reviews/rev_test123",
            },
          },
          202,
        ),
      )
      .mockResolvedValueOnce(
        createJsonResponse(
          {
            id: "rev_test123",
            status: "processing",
            progress: 45,
            message: "Analyse de la structure des dossiers en cours...",
          },
          200,
        ),
      )
      .mockResolvedValueOnce(
        createJsonResponse(
          {
            id: "rev_test123",
            status: "completed",
            repository_url: "https://github.com/vercel/next.js",
            completed_at: "2026-04-15T10:00:30Z",
            report: {
              architecture: {
                score: 85,
                summary: "Architecture claire et bien structuree (modele MVC).",
                improvements: [
                  "Extraire la logique metier des controleurs.",
                  "Ajouter des interfaces pour reduire le couplage.",
                ],
              },
              security: {
                score: 92,
                issues_found: 0,
              },
              general_feedback:
                "Tres bon projet, pensez a centraliser les variables d'environnement.",
            },
          },
          200,
        ),
      );

    global.fetch = fetchMock as unknown as typeof fetch;

    render(<Home />);

    fireEvent.change(screen.getByLabelText("URL du repository GitHub"), {
      target: { value: "https://github.com/vercel/next.js" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Analyser ce dépôt" }));

    await waitFor(
      () => {
        expect(screen.getByText("Résultat de l'analyse")).toBeTruthy();
      },
      { timeout: 4000 },
    );

    expect(screen.getByText("85/100")).toBeTruthy();
    expect(screen.getByText("92/100")).toBeTruthy();
    expect(screen.getByText("Analyse terminée.")).toBeTruthy();
  });
});
