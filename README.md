# Toolbox-IT : Documentation Projet, Installation & Exploitation

Bienvenue dans **Toolbox-IT**, une suite d'outils intelligente conçue pour automatiser l'évaluation et accompagner les étudiants dans la maîtrise des standards d'architecture logicielle et de qualité de code.

---

## 📖 1. Vision & Périmètre (Produit)

- **Le Problème** : L'évaluation de l'architecture des projets informatiques étudiants est chronophage, manuelle et parfois subjective. Les apprenants manquent souvent de retours rapides pendant le développement.
- **La Solution** : Toolbox-IT automatise ce processus. L'application scanne des dépôts GitHub, analyse l'architecture, la qualité de code, et propose même une interface de "Coaching" (l'Architecte IA) pour guider l'étudiant dans ses choix technologiques.
- **Cible** : Professeurs/Correcteurs automatisant leurs validations, Étudiants cherchant des retours itératifs, Responsables Pédagogiques voulant standardiser l'évaluation.

## 🏗 2. Architecture & Choix Techniques

Le socle repose sur des technologies web modernes et robustes :
- **Framework** : Next.js 14+ (App Router)
- **Langage** : TypeScript strict
- **Styling UI** : Tailwind CSS (interface orientée Glassmorphism/Dark Mode)
- **Backend & BDD** : Prisma ORM couplé à une base SQLite embarquée.
- **Authentification** : NextAuth.js (Protège les routes d'analyse et de coaching)
- **Moteur IA** : Google Gemini API (Modèle Flash/Pro), utilisé notamment avec des flux streaming NDJSON pour afficher les retours en temps réel.

---

## 🚀 3. Guide d'Installation (Lancement Local)

Le projet peut être exécuté très simplement via **Docker** (recommandé pour une mise en route rapide) ou via l'environnement **Node.js** classique pour le développement natif.

### 3.1 Prérequis
- **Docker & Docker Compose** (pour l'option 1)
- **Node.js** (LTS recommandé, >= 18.x) et **npm/yarn** (pour l'option 2)
- **Git**

### 3.2 Variables d'Environnement
Dupliquez le fichier d'exemple pour créer votre configuration locale :
```bash
cp .env.example .env
```
Éditez le fichier `.env` pour renseigner **obligatoirement** :
- `GITHUB_TOKEN` : Token personnel GitHub (scope `repo`) pour éviter les limites de requêtes lors du clonage/scan.
- `GEMINI_API_KEY` : Clé API Google Studio pour faire fonctionner l'IA.
- `NEXTAUTH_SECRET` : Chaîne longue et aléatoire chiffrant les sessions (ex: lancez `openssl rand -base64 32` dans votre terminal).

### 3.3 Option A : Lancement via Docker (Recommandé)

Le projet intègre un `Dockerfile` optimisé (Next.js standalone) et un `docker-compose.yml`.

```bash
# 1. Construire et lancer le conteneur en arrière-plan
docker-compose up -d --build

# 2. Arrêter le conteneur l'application
docker-compose down
```
*Note : La migration de base de données s'exécute automatiquement au démarrage du conteneur. Les données SQLite sont persistées via le volume `sqlite_data`.*

### 3.4 Option B : Lancement Natif (Node.js)

```bash
# 1. Installez les paquets (dépendances)
npm install

# 2. Initialisez la base de données SQLite (crée le schéma Prisma localement)
npx prisma db push

# 3. Lancez le serveur de développement
npm run dev
```

L'application est à présent disponible sur [http://localhost:3000](http://localhost:3000) (quelle que soit l'option choisie).

---

## 🛠 4. Exploitation & Maintenance

### 4.1 Démarrage / Arrêt & Journaux
- **Mode Développement** : Le serveur tourne en foreground (`npm run dev`). L'arrêt se fait via `CTRL+C`. Les erreurs détaillées sont dans la console locale et le navigateur.
- **Mode Production minimal** :
  ```bash
  npm run build
  npm start
  ```
- **Configuration** : Tout le paramétrage passe par les variables du `.env`.
- **Journaux (Logs)** : L'application loggue les actions critiques dans la sortie standard. Les rejets d'authentification NextAuth ou les erreurs Gemini y apparaissent directement.

### 4.2 Limites et Dettes Connues
- **SQLite en production** : La base de données incluse `dev.db` est performante pour de petites instances / MVP. Pour un déploiement massif comportant beaucoup d'écritures concurrentes, il faudra modifier le `schema.prisma` pour cibler PostgreSQL.
- **Stockage de code local** : L'analyseur clone ou extrait potentiellement de la donnée. Le backend nettoie sa mémoire, mais la supervision du poids du dossier cible est à envisager en exploitation longue.

### 4.3 Contrôle Qualité & Qualimétrie (Développeurs)
Avant chaque commit, il est vital de valider la santé stricte du code :
```bash
npm run check
```

*Ce script déclenche :*
- Le **vérificateur de types TypeScript**, pour s'assurer que la manipulation des objets complexes (comme les retours JSON de Prisma) est strictement respectée sans jamais utiliser le typage `any`.
- Le **linter ESLint**, configuré de façon draconienne pour punir la complexité cyclomatique et encourager l'atomisation en sous-composants dédiés (réalisé récemment sur les pages principales `dashboard` et `reviews`).

#### Analyse Statique via SonarQube
Outre nos exécutions ESLint locales, le projet est conçu pour s'intégrer avec **SonarQube**. SonarQube analyse la dette technique structurelle :
- Suivi de la fiabilité et décrue des *Code Smells*.
- Résolution proactive des *Security Hotspots*.
- Couverture conditionnelle et maintien de *Quality Gates* draconiennes.

*Les travaux massifs de nettoyage et de refonte des composants React (réduction drastique de profondeur) ont été réalisés pour conformer les Pull Requests aux plus hauts standards SonarQube.*

---

## 🔗 5. Contrats API & Sécurité

### 5.1 Sécurité & Middleware
- Le projet impose une **authentification stricte** via `NextAuth`. Les URL sensibles (`/analyze`, `/architect`, `/dashboard`) sont protégées par le middleware `proxy.ts`. 
- Si l'utilisateur n'est pas connecté, il est renvoyé avec un code HTTP `401` ou une redirection vers `/login`.
- Transparence : Toutes les requêtes vers l'API Gemini depuis le front-end transitent obligatoirement par un backend (les `/api/v1/reviews/route.ts`). La clé secrète n'expose jamais le navigateur.

### 5.2 API interne (Endpoint métier)
- `POST /api/v1/reviews` : Déclenche l'analyse d'un dépôt GitHub. 
  - **Retour** : Flux NDJSON (`application/x-ndjson`). L'IA renvoie son analyse morceau par morceau (streaming).

---

## 🧪 6. Plateforme de Tests (E2E)

Nous garantissons la non-régression via des tests d'intégration complets avec **Playwright**.

```bash
# Installation initiale des navigateurs Playwright
npx playwright install --with-deps chromium

# Exécution de bout en bout
npx playwright test
```
*Note sur l'E2E* : Dans notre suite Playwright (`e2e/analyze.spec.ts`), pour contourner la complexité du mock des JWT signés NextAuth en CI, nous testons les parcours publics et l'étanchéité des requêtes API (`401 Unauthorized`), validant ainsi purement le comportement sans flaky tests.

---

## 📦 7. Livraison (CI/CD)

Le projet utilise **GitHub Actions** (`.github/workflows/ci.yml`).
À chaque *Push* sur la branche `dev` ou vers la `main`, un workflow "Qualité Automatisée" s'exécute :
1. Clone du dépôt.
2. Installation des modules (`npm ci`).
3. Audit statique : TypeScript (`tsc`) et Linter ESLint.
4. Construction base de données : `npx prisma db push`.
5. Exécution de `Playwright` sur un environnement headless pour valider les comportements vitaux.
(Toute erreur bloque la pull request).

---
*Fin du document projet. Pour d'autres éléments précis de gouvernance (Prompt engineering, Architecture conceptuelle isolée), référez-vous au dossier `/docs`.*
