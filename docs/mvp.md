# [Produit] Définition du MVP, Hors Périmètre et Critères de Coupe

Ce document liste, pour la suite Toolbox-IT, le noyau fonctionnel strictement essentiel (MVP) pour prouver sa proposition de valeur, ainsi que les éléments délibérément écartés.

---

## 1. Le Noyau Minimal Livrable (MVP)

Le MVP contient **uniquement** les éléments indispensables pour démontrer la puissance des trois outils de la suite :

### 🏛️ Outil 1 : Analyseur d'Architecture
*   **Scan d'arborescence :** Connexion à l'API GitHub pour extraire la structure des dossiers d'un dépôt public/privé.
*   **Templates de référence :** Comparaison avec 1 ou 2 standards "en dur" (Clean Archi, MVC).
*   **Score Archi :** Feedback visuel sur le respect du squelette projet.

### 🛠️ Outil 2 : Analyseur de Code
*   **Review de Qualité (V1) :** Intégration d'un linter (type ESLint/Prettier) pour identifier les erreurs de syntaxe, de lisibilité et les premières failles de sécurité.
*   **Rapport de Santé :** Liste des "mauvaises pratiques" détectées dans le dépôt.

### 📋 Outil 3 : Assistant IA Architecte
*   **Conception Interactive :** Une interface de type "Chat" où l'IA pose des questions sur la stack (Frontend, Backend, BDD) et les objectifs du projet.
*   **Génération de structure :** L'IA propose 2 à 3 modèles d'architectures pro, sécurisées et adaptées au besoin exprimé.

### 🔐 Socle Commun
*   **Next.js & GitHub OAuth :** Utilisation de NextAuth.js pour l'authentification et l'accès sécurisé aux dépôts.
*   **Tableau de bord central :** Une interface performante sous Next.js (Client Components) pour piloter les analyses.

---

## 2. Éléments Hors Périmètre pour la V1 (Justifications)

Les éléments suivants sont écartés du développement initial pour sécuriser le délai de livraison :

*   **Analyse de masse (Scan de 40 repos d'un coup) :** Trop complexe à gérer techniquement pour une V1 (timeouts/files d'attente).
*   **Éditeur de Templates visuel (UI Builder) :** Le professeur ne peut pas encore créer sa propre grille via l'interface, il utilise les standards Toolbox.
*   **Automatisation CI/CD :** Pas de bot GitHub automatique pour le moment, l'analyse est déclenchée manuellement sur la plateforme.

---

## 3. Les Critères de Coupe (Arbitrages de Secours)

Si le temps manque, voici ce qui sera retiré par ordre de priorité :

1.  **Niveau 1 : Retrait de l'Analyseur de Code.** On se concentre uniquement sur l'Architecture (Review + Conseil IA).
2.  **Niveau 2 : Retrait de l'IA Architecte.** On ne garde que l'Analyseur d'Architecture (Le cœur historique).
3.  **Niveau 3 : Scan public uniquement.** Retrait de l'OAuth GitHub, l'outil ne scanne que des dépôts publics via URL.
