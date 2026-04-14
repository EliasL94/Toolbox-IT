# Justification des Choix Techniques - Toolbox-IT

Ce document expose les critères de sélection et les raisons ayant conduit aux choix technologiques de la plateforme Toolbox-IT, conformément aux besoins du MVP et du contexte pédagogique.

## 🎯 Critères de Sélection

Pour ce projet, trois critères majeurs ont été retenus :
1. **Rapidité d'Apprentissage (Onboarding)** : Le projet doit pouvoir être repris par des étudiants ou des agents IA sans barrière technique complexe (build steps, outils de build lourds).
2. **Déploiement Simplifié** : La solution doit pouvoir être hébergée instantanément sur n'importe quel service statique (GitHub Pages, Vercel, Netlify) sans configuration serveur.
3. **Maintenabilité (Modularité)** : Le code doit rester lisible et découpé en responsabilités claires, même sans framework.

## ⚖️ Analyse Comparative

Nous avons comparé trois directions d'architecture pour le MVP :

| Architecture | Avantages | Inconvénients | Verdict |
| :--- | :--- | :--- | :--- |
| **Vanilla Web (Choix retenu)** | Chargement ultra-rapide, zéro dépendance, facile à auditer. | Gestion d'état à faire à la main sur des vues complexes. | **Retenu** (Cible le MVP et la légèreté). |
| **Framework UI (React/Vue)** | Composants réutilisables, grand écosystème. | Courbe d'apprentissage, tooling (npm/build) pouvant ralentir le démarrage. | **Écarté** (Trop lourd pour la phase de cadrage/MVP). |
| **Backend-Heavy (Laravel/PHP)** | Sécurité native, gestion de base de données robuste. | Nécessite un serveur actif, déploiement plus coûteux et complexe. | **Écarté** (L'application peut tourner 100% côté client via APIs). |

## 💡 Justification de la Stack "Vanilla & API-First"

Le choix de **HTML/CSS/JS natif** couplé à des **APIs Externes** (GitHub & IA) est justifié par :
- **Servir le besoin avant la technique** : Notre besoin est d'analyser des fichiers et de générer du texte. Une application client-side suffit largement pour appeler l'API GitHub et afficher un score.
- **Portabilité** : Le projet "vit" dans le navigateur, éliminant les problèmes de compatibilité système (Windows vs Mac vs Linux) pour les futurs contributeurs.
- **Transparence** : Pour un outil de "Review d'Architecture", il est primordial de montrer l'exemple avec un code source pur, compréhensible par tous les profils d'étudiants.

## 🛡️ Impacts sur la Qualité, Sécurité et CI/CD

### Qualité & Testabilité
L'absence de framework force une rigueur dans l'organisation des fichiers (Clean Code). La testabilité est assurée par une logique métier (Scanner) séparée de l'UI (DOM), permettant des tests unitaires en JS pur.

### Sécurité
Le choix "Client-Side" implique que les secrets (clés d'API) ne doivent pas être exposés. Pour le déploiement pro, un proxy minimaliste (Serverless Functions) sera ajouté pour masquer les clés, garantissant la sécurité des interactions IA.

### CI/CD (Intégration Continue)
Le flux CI/CD est extrêmement léger :
1. Linting CSS/JS automatique.
2. Validation des fichiers Markdown (Docs).
3. Déploiement automatique sur GitHub Pages à chaque commit sur `main`.

---
*Document validé par l'Architecte Logiciel le 14/04/2026*
