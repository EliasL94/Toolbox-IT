# Justification des Choix Techniques - Toolbox-IT

Ce document expose les critères de sélection et les raisons ayant conduit au choix de **Next.js** comme socle technologique de la plateforme Toolbox-IT, conformément aux besoins du MVP et aux standards professionnels actuels.

## 🎯 Critères de Sélection

Pour ce projet, trois critères majeurs ont été retenus :
1. **Productivité et Écosystème (DX)** : Utiliser un framework moderne permet de bénéficier de composants réutilisables, d'un routage intégré et d'une gestion d'état simplifiée.
2. **Performances et SEO (Core Web Vitals)** : Next.js offre un rendu hybride (Static Generation & Server-side Rendering) optimal pour un outil de documentation et de rapports.
3. **Fullstack par défaut** : La capacité de Next.js à gérer à la fois le Frontend et les API Routes (Backend asynchrones) simplifie l'architecture globale.

## ⚖️ Analyse Comparative

Nous avons comparé trois directions d'architecture pour le MVP :

| Architecture | Avantages | Inconvénients | Verdict |
| :--- | :--- | :--- | :--- |
| **Next.js (Choix retenu)** | SSR/SSG natif, API routes intégrées, typage fort avec TypeScript. | Nécessite un environnement Node.js pour le build/exécution. | **Retenu** (Performance et évolutivité). |
| **Vanilla Web** | Chargement ultra-rapide, zéro dépendance. | Gestion d'état complexe, pas de backend intégré, duplication de code UI. | **Écarté** (Trop limité pour l'évolution IA). |
| **Framework UI Seul (React Vite)** | Très flexible, léger. | Nécessite un backend séparé pour sécuriser les clés d'API IA. | **Écarté** (Complexité de déploiement multi-services). |

## 💡 Justification de la Stack "Next.js & Server Components"

Le choix de **Next.js 14+ (App Router)** est justifié par :
- **Sécurité des clés d'API** : Les *Server Components* et les *API Routes* permettent de requêter GitHub et les moteurs d'IA sans jamais exposer les clés secrètes côté client.
- **Typage Strict (TypeScript)** : Indispensable pour manipuler des structures d'arborescence complexes (AST) et des contrats d'API sans erreurs.
- **Design System Efficient** : Utilisation de **Tailwind CSS** pour garantir une UI premium, responsive et rapide à produire.
- **Hébergement Vercel** : Déploiement en "Zero Config" avec support natif des fonctions serverless pour le traitement lourd de l'IA.

## 🛡️ Impacts sur la Qualité, Sécurité et CI/CD

### Qualité & Testabilité
L'utilisation de TypeScript réduit drastiquement les bugs de production. Nous utilisons **Jest** et **React Testing Library** pour valider la logique des analyseurs d'architecture.

### Sécurité
Toute la logique sensible (Appels OpenAI/Gemini, GitHub OAuth) est encapsulée dans des *Server Actions* ou des *API Routes* protégées. Le stockage des sessions utilisateur est géré de manière sécurisée (NextAuth.js ou solution équivalente).

### CI/CD (Intégration Continue)
Le flux CI/CD est automatisé via GitHub Actions :
1. Type-checking (`tsc`) et Linting (`eslint`).
2. Build de production pour détecter les erreurs de rendu.
3. Déploiement automatique en environnement de Preview (Vercel) à chaque Pull Request.

---
*Document mis à jour par l'Architecte Logiciel le 14/04/2026*
