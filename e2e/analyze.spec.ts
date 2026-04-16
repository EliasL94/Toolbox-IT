import { test, expect } from '@playwright/test';

/**
 * Tests E2E - Toolbox-IT
 *
 * Stratégie : Les routes /analyze, /dashboard, /architect sont protégées par
 * un middleware NextAuth (JWT signé). Pour éviter la complexité de simuler un
 * cookie JWT en CI, les tests couvrent :
 *   1. Les pages publiques (/, /login, /register) accessibles sans session.
 *   2. L'API /api/v1/reviews via requêtes HTTP directes (401 attendu sans auth).
 *   3. Le comportement de redirection du middleware.
 */

// ─── Pages publiques ─────────────────────────────────────────────────────────

test("La page d'accueil se charge correctement", async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Toolbox/i);
  // La page doit contenir au moins un titre principal
  await expect(page.locator('h1').first()).toBeVisible();
});

test('La page de connexion affiche le formulaire', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

test('La page d\'inscription affiche le formulaire', async ({ page }) => {
  await page.goto('/register');
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

// ─── Redirection middleware ───────────────────────────────────────────────────

test('Les routes protégées redirigent vers /login sans session', async ({ page }) => {
  const response = await page.goto('/analyze');
  // Après redirection, on doit être sur /login
  expect(page.url()).toContain('/login');
  // La page doit avoir répondu avec un 200 (la page login elle-même)
  expect(response?.status()).toBe(200);
});

// ─── API — vérification des règles d'autorisation ────────────────────────────

test("L'API /api/v1/reviews retourne 401 sans authentification", async ({ request }) => {
  const response = await request.get('/api/v1/reviews');
  expect(response.status()).toBe(401);
});

test("L'API POST /api/v1/reviews retourne 401 sans authentification", async ({ request }) => {
  const response = await request.post('/api/v1/reviews', {
    data: { repository_url: 'https://github.com/facebook/react', branch: 'main' },
  });
  expect(response.status()).toBe(401);
});
