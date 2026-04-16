# Trame de Présentation Canva : Soutenance Toolbox-IT (Vibe Coding)

Cette trame est structurée diapositive par diapositive pour votre Canva. Chaque slide intègre les messages clés à passer à l'oral, ainsi que les "preuves" concrètes issues de la base de code pour démontrer la crédibilité professionnalisante.

---

## 🛑 Slide 1 : Titre & Vision Produit
**Titre suggéré :** Toolbox-IT : L'Industrialisation de l'Évaluation Architecturale
**Message à l'oral :**
Notre projet ne se résume pas à faire des requêtes à une IA. C'est un produit pensé pour un véritable besoin métier (l'évaluation asynchrone des étudiants) avec une véritable architecture logicielle.
**Preuves à afficher ou mentionner :**
- `docs/cadrage.md` et `docs/produit.md` (Prouve que le besoin a été documenté et défini avant la ligne de code).
- La Story Map / Backlog (US40 en cours de réalisation montre l'approche Agile entreprise).

---

## 🏗️ Slide 2 : Architecture & Choix Techniques Assumés
**Titre suggéré :** Une Architecture Solide et Justifiée
**Message à l'oral :**
Nous avons écarté l'approche "Vanilla/Bricolage" pour structurer l'application sur Next.js, offrant rendu serveur (SSR) et API intégrée. Chaque décision clé est tracée afin de ne pas subir la dette technique.
**Preuves à afficher ou mentionner :**
- `docs/journal_decisions.md` (ADR 001 : Pivot vers Next.js, ADR 002 : Choix de Prisma & SQLite).
- `docs/architecture.md` (Les diagrammes métier qui formalisent les couches du système).

---

## 🔒 Slide 3 : Sécurité, Contrats & Gouvernance IA
**Titre suggéré :** Sécurité by-design & Gestion de l'IA
**Message à l'oral :**
L'IA n'est pas appelée n'importe comment. Nous avons défini des garde-fous stricts. Les clés sensibles (Gemini, GitHub) ne sont jamais exposées au client, et l'accès est verrouillé par une gestion de session sécurisée.
**Preuves à afficher ou mentionner :**
- Middleware d'Architecture : `proxy.ts` et `NextAuth` (Interdiction stricte des appels API sans token).
- `docs/garde_fous_ia.md` : Illustration de la gouvernance IA et du flux NDJSON (streaming contrôlé et typé, pas d'exécution de code aveugle par l'IA).

---

## ✨ Slide 4 : Qualité de Code & Standards Usine Logicielle
**Titre suggéré :** Une exigence qualité de niveau industriel
**Message à l'oral :**
Le code généré ou écrit a été soumis à des contraintes fortes. L'utilisation stricte de TypeScript ("No Any") et l'analyse continue empêchent la complexité cyclomatique de s'effondrer sous le poids des features.
**Preuves à afficher ou mentionner :**
- Commandes locales : `npm run check` (TypeScript) et configuration stricte `eslint.config.mjs`.
- Intégration *SonarQube* détaillée dans `README.md` et stratégie de clean code sur les gros composants React.
- `docs/qualite_dev.md` (Le référentiel qualité).

---

## ⚙️ Slide 5 : Usine Automatisée (CI/CD) & Tests E2E
**Titre suggéré :** Pas de livraison sans validation
**Message à l'oral :**
Toute modification du code traverse un pipeline de validation avant le merge. Nous validons les parcours critiques avec des tests de bout en bout simulant un vrai utilisateur.
**Preuves à afficher ou mentionner :**
- Le fichier : `.github/workflows/ci.yml` (Les workers GitHub Actions buildent, testent le type, et lancent linting / DB).
- Script de test : `e2e/analyze.spec.ts` (Playwright valide les endpoints publics et le blocage 401 Unauthorized sans flakiness).

---

## 🐋 Slide 6 : Posture DevOps & Conteneurisation
**Titre suggéré :** Prêt pour un déploiement agnostique
**Message à l'oral :**
L'application est "packagée" et isolée pour fonctionner identiquement de l'ordinateur du développeur jusqu'au serveur de production, avec automatisation de la base de données.
**Preuves à afficher ou mentionner :**
- Fichier `Dockerfile` en mode optimisé "Standalone" (ADR 003).
- Fichier `docker-compose.yml` pour le démarrage d'un MVP en 1 clic.
- Automatisation : `prisma db push` au boot du conteneur (ADR 004).

---

## 👥 Slide 7 : Git & Collaboration Équipe
**Titre suggéré :** Une collaboration structurée
**Message à l'oral :**
Même épaulés par des agents IA, nous respectons les flux de travail Git de l'industrie pour tracer la valeur ajoutée par chaque commit.
**Preuves à afficher ou mentionner :**
- `docs/convention_commits.md` (Commits sémantiques `feat:`, `fix:`, `docs:`...).
- `docs/strategie_git.md` (Flux de développement en branche `dev` protégée vers `main`).

---

## ⚠️ Slide 8 : Transparence et Limites (Lucidité Étudiante vs Industrie)
**Titre suggéré :** Limites et Next Steps (Scalabilité)
**Message à l'oral :**
Bien que ce livrable respecte les process pros, nous avons conscience des écarts avec un produit *Enterprise* massif. Un audit honnête montre nos pistes d'amélioration pour passer de MVP à un vrai SaaS.
**Preuves et éléments à mentionner (issus du README) :**
- Base de données : *SQLite est utilisé pour la portabilité MVP ; un switch vers PostgreSQL (via refonte du schema Prisma) sera requis pour la forte concurrence en écriture.*
- Stockage de fichiers : *L'extraction de gros dépôts GitHub n'est pas scalable à l'infini en local, il faudrait une file d'attente (Redis / queues) pour l'analyse asynchrone dense.*
- IA : *La dépendance aux quotas de l'API Gemini et le coût d'inférence à grande échelle.*

---

*💡 Astuce pour Canva : Prenez des captures d'écran de morceaux de code pour chaque slide (un bout du fichier `.github/workflows/ci.yml` pour la slide 5, les ADRs numérotés pour la slide 2). Cela donnera l'effet "preuve indiscutable" demandé par le Critère d'Acceptation.*
