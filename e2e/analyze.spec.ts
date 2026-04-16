import { test, expect } from '@playwright/test';

// Cas Nominal : Le parcours d'Analyse complet
test('Lancer une analyse complète avec succès', async ({ page }) => {
  // Intercepter l'appel à l'API /api/v1/reviews pour simuler le NDJSON stream sans appeler GitHub/Gemini
  await page.route('/api/v1/reviews', async (route) => {
    // Si c'est une requête POST (demande d'analyse)
    if (route.request().method() === 'POST') {
      const encoder = new TextEncoder();
      
      const stream = new ReadableStream({
        async start(controller) {
          function sendObj(obj: any) {
             controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n'));
          }

          sendObj({ step: "Verification du mock API...", progress: 30 });
          // Simuler un court délai de traitement
          await new Promise(r => setTimeout(r, 500));
          
          sendObj({ step: "Analyse terminée.", progress: 100, id: "mock_rev_123" });
          controller.close();
        }
      });
      
      return route.fulfill({
        status: 200,
        headers: { 'Content-Type': 'application/x-ndjson' },
        body: stream as any,
      });
    }
    // Pour un éventuel GET, on passe
    return route.continue();
  });

  // On lance le test en accédant à la page Analyze
  await page.goto('/analyze');

  // L'utilisateur remplit le formulaire
  await page.fill('input[placeholder="https://github.com/utilisateur/projet"]', 'https://github.com/facebook/react');
  
  // Il clique sur le bouton pour analyser
  await page.click('button:has-text("Lancer le scan")');

  // Notre mock répond presque immédiatement, le flux NDJSON envoie 100% -> Redirection locale
  // On doit s'assurer que ça navigue bien vers /reviews/mock_rev_123
  await page.waitForURL('**/reviews/mock_rev_123*');
  
  // Sur la page d'erreur 404 (puisque mock_rev_123 n'existe pas en DB locale pour un appel Server Components)
  // le front va faire un fetch direct à /api/v1/reviews/mock_rev_123 dans le useEffect() car on est en React client
  // Mockons également cet appel de rapport.
});

// Refaisons le test mieux structuré en interceptant aussi la lecture du rapport.
test('Parcours d\'Analyse complet avec affichage de rapport', async ({ page }) => {
  // 1. Mock du flux NDJSON d'analyse
  await page.route('**/api/v1/reviews', async (route) => {
    if (route.request().method() === 'POST') {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          controller.enqueue(encoder.encode(JSON.stringify({ step: "Traitement", progress: 50 }) + '\n'));
          setTimeout(() => {
            controller.enqueue(encoder.encode(JSON.stringify({ step: "Terminé", progress: 100, id: "mock_e2e_1" }) + '\n'));
            controller.close();
          }, 300);
        }
      });
      return route.fulfill({ status: 200, headers: { 'Content-Type': 'application/x-ndjson' }, body: stream as any });
    }
    return route.continue();
  });

  // 2. Mock de la requête API fetch du frontend vers /api/v1/reviews/mock_e2e_1
  await page.route('**/api/v1/reviews/mock_e2e_1', async (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: "mock_e2e_1",
        status: "completed",
        repository_url: "https://github.com/facebook/react",
        branch: "main",
        created_at: new Date().toISOString(),
        report: {
          architecture: { score: 95, pattern_detected: "Mock Pattern", summary: "Super architecture", strengths: [], improvements: [] },
          code_quality: { score: 90, summary: "Bon code", strengths: [], issues: [] },
          security: { score: 100, summary: "Secure", issues_found: 0, details: [] },
          general_feedback: "Test passé avec succès"
        }
      })
    });
  });

  // Action
  await page.goto('/analyze');
  await page.fill('input[placeholder*="github"]', 'https://github.com/facebook/react');
  const btn = page.locator('button', { hasText: 'Lancer le scan' });
  await btn.click();

  // Vérification: l'application navigue sur /reviews/mock_e2e_1
  await page.waitForURL('**/reviews/mock_e2e_1');

  // Vérification: Le rapport s'affiche avec le score (qui sera affiché sous forme 95)
  await expect(page.locator('text=Mock Pattern')).toBeVisible();
  await expect(page.locator('h1 >> text=facebook/react')).toBeVisible();
});

// Cas d'échec : L'URL Github est invalide (400 server)
test('Affiche une erreur si l\'API refuse l\'analyse', async ({ page }) => {
  await page.route('**/api/v1/reviews', async (route) => {
    if (route.request().method() === 'POST') {
       return route.fulfill({ status: 400, body: JSON.stringify({ error: "Mon erreur de mock" }) });
    }
  });

  await page.goto('/analyze');
  await page.fill('input', 'https://github.com/mauvais/repo');
  await page.click('button:has-text("Lancer le scan")');

  // La jauge s'arrête (ou l'animation est annulée) et le message d'erreur rouge apparait
  await expect(page.locator('text=Mon erreur de mock')).toBeVisible();
});
