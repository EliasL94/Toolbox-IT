import { test, expect } from '@playwright/test';

/** Session fictive injectée dans chaque test pour bypasser NextAuth */
const MOCK_SESSION = {
  user: { id: 'test-user-1', name: 'Test User', email: 'test@example.com' },
  expires: '2099-01-01T00:00:00.000Z',
};

/**
 * Injecte un mock de session NextAuth et un mock de la liste des reviews.
 * À appeler en début de chaque test pour éviter la redirection vers /login.
 */
async function mockAuthAndReviews(page: Parameters<typeof test>[1] extends (args: { page: infer P }) => unknown ? P : never) {
  await page.route('**/api/auth/session', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SESSION) })
  );
  await page.route('**/api/v1/reviews', async (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    }
    return route.continue();
  });
}

// ─── Cas nominal : parcours d'analyse complet ───────────────────────────────

test('Lancer une analyse complète avec succès', async ({ page }) => {
  await mockAuthAndReviews(page);

  await page.route('**/api/v1/reviews', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(JSON.stringify({ step: 'Vérification mock...', progress: 30 }) + '\n'));
        controller.enqueue(encoder.encode(JSON.stringify({ step: 'Analyse terminée.', progress: 100, id: 'mock_rev_123' }) + '\n'));
        controller.close();
      },
    });
    return route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'application/x-ndjson' },
      body: stream as unknown as string,
    });
  });

  await page.goto('/analyze');
  await page.waitForSelector('input[placeholder*="github"]', { timeout: 10000 });
  await page.fill('input[placeholder*="github"]', 'https://github.com/facebook/react');
  await page.click('button:has-text("Lancer le scan")');
  await page.waitForURL('**/reviews/mock_rev_123', { timeout: 15000 });
});

// ─── Parcours complet avec affichage du rapport ──────────────────────────────

test("Parcours d'Analyse complet avec affichage de rapport", async ({ page }) => {
  await mockAuthAndReviews(page);

  await page.route('**/api/v1/reviews', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(JSON.stringify({ step: 'Traitement', progress: 50 }) + '\n'));
        controller.enqueue(encoder.encode(JSON.stringify({ step: 'Terminé', progress: 100, id: 'mock_e2e_1' }) + '\n'));
        controller.close();
      },
    });
    return route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'application/x-ndjson' },
      body: stream as unknown as string,
    });
  });

  await page.route('**/api/v1/reviews/mock_e2e_1', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'mock_e2e_1',
        status: 'completed',
        repository_url: 'https://github.com/facebook/react',
        branch: 'main',
        created_at: new Date().toISOString(),
        report: {
          architecture: { score: 95, pattern_detected: 'Mock Pattern', summary: 'Super architecture', strengths: [], improvements: [] },
          code_quality: { score: 90, summary: 'Bon code', strengths: [], issues: [] },
          security: { score: 100, summary: 'Secure', issues_found: 0, details: [] },
          general_feedback: 'Test passé avec succès',
        },
      }),
    })
  );

  await page.goto('/analyze');
  await page.waitForSelector('input[placeholder*="github"]', { timeout: 10000 });
  await page.fill('input[placeholder*="github"]', 'https://github.com/facebook/react');
  await page.click('button:has-text("Lancer le scan")');
  await page.waitForURL('**/reviews/mock_e2e_1', { timeout: 15000 });

  await expect(page.locator('text=Mock Pattern')).toBeVisible();
});

// ─── Cas d'échec : l'API retourne une erreur ────────────────────────────────

test("Affiche une erreur si l'API refuse l'analyse", async ({ page }) => {
  await mockAuthAndReviews(page);

  await page.route('**/api/v1/reviews', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    return route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Mon erreur de mock' }),
    });
  });

  await page.goto('/analyze');
  await page.waitForSelector('input', { timeout: 10000 });
  await page.fill('input', 'https://github.com/mauvais/repo');
  await page.click('button:has-text("Lancer le scan")');

  await expect(page.locator('text=Mon erreur de mock')).toBeVisible({ timeout: 10000 });
});
