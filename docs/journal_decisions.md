# Journal des Décisions Structurantes (ADR) - Toolbox-IT

Ce document trace les choix majeurs d'architecture, de produit, de sécurité et de déploiement réalisés lors du projet. Il permet de justifier les arbitrages en soutenance et d'assurer la transparence des choix techniques.

---

## 🏛️ ADR 001 : Pivot de Vanilla Web vers Next.js (App Router)

**Date :** 15/04/2026
**Domaine :** Architecture / Produit
**Statut :** Accepté (Remplace la décision initiale "Vanilla Web")

**Contexte :** 
Initialement, le projet visait une approche 100% statique (Vanilla JS). Cependant, l'intégration de fonctionnalités complexes comme l'authentification (session), la gestion des clés API secrètes (GitHub, Gemini) et le besoin d'un moteur de templates robuste a rendu l'approche Vanilla trop coûteuse en maintenance (manipulation manuelle du DOM, absence de typage fort).

**Options envisagées :**
1. *Vanilla Web (natif)* : Trop complexe pour la gestion sécurisée des secrets et de l'état.
2. *Vite (Single Page Application)* : Bonne DX, mais nécessite toujours un backend séparé pour sécuriser les appels API (Proxy).
3. *Next.js (App Router)* : Framework Fullstack unifié, support natif du Server-side Rendering (SSR) et des API Routes.

**Choix retenu :** 
**Next.js 14+ / 15 (App Router)**. Ce choix permet de centraliser la logique métier et la sécurité dans un seul framework, tout en bénéficiant de l'écosystème React et TypeScript.

**Compromis / Conséquence acceptée :** 
Nécessite une étape de compilation (Build) et un environnement d'exécution Node.js (ou container), contrairement à une simple page HTML statique.

---

## 💾 ADR 002 : Persistance via Prisma ORM & SQLite

**Date :** 15/04/2026
**Domaine :** Architecture / Données
**Statut :** Accepté

**Contexte :** 
Le projet doit stocker les rapports d'analyse, l'historique des revues et les comptes utilisateurs. Nous avons besoin d'un système de données structuré sans pour autant complexifier l'installation pour de nouveaux développeurs ou des déploiements MVP.

**Options envisagées :**
1. *Fichiers JSON locaux* : Difficile à requêter et non sécurisé.
2. *PostgreSQL / MySQL* : Robuste, mais nécessite le déploiement d'un serveur de base de données tiers.
3. *SQLite via Prisma* : Base de données embarquée (fichier unique) avec une interface TypeScript typer-safe (Prisma).

**Choix retenu :** 
**SQLite avec l'ORM Prisma**. Ce couple offre une excellente sécurité de typage ("no any") et une portabilité maximale : la base est un simple fichier dans le dossier `prisma/`.

**Compromis / Conséquence acceptée :** 
SQLite n'est pas adapté aux fortes écritures concurrentes en production massive. Un pivot vers PostgreSQL sera nécessaire si l'application dépasse le stade de MVP/Outil interne.

---

## 🚀 ADR 003 : Déploiement via Docker (Mode Standalone)

**Date :** 16/04/2026
**Domaine :** Déploiement / DevOps
**Statut :** Accepté

**Contexte :** 
Pour garantir que l'application fonctionne de manière identique sur toutes les machines (dev, test, production), nous avons besoin d'une solution d'isolation. L'utilisation d'un backend Next.js empêche l'hébergement simple sur GitHub Pages.

**Options envisagées :**
1. *Hébergement Cloud brut (VPS + npm start)* : Risque de disparité d'environnements (versions Node, librairies OS).
2. *Docker standard* : Facile, mais l'image peut être lourde (> 1GB).
3. *Docker Multi-stage + Next.js Standalone* : Optimisation maximale de la taille de l'image en ne gardant que l'essentiel pour le runtime.

**Choix retenu :** 
**Docker avec un build multi-étapes et sortie standalone**. Cela réduit la taille de l'image de ~80% et facilite le déploiement sur n'importe quel service de containers (Docker Desktop, Cloud Run, etc.).

**Compromis / Conséquence acceptée :** 
Complexité accrue du `Dockerfile` (copie manuelle des assets statiques et des dossiers d'output).

---

## 🔧 ADR 004 : Automatisation du cycle de vie de la base de données

**Date :** 16/04/2026
**Domaine :** Architecture / DevOps
**Statut :** Accepté

**Contexte :** 
Dans un environnement Docker, la base de données SQLite est persistée via un volume. Il faut s'assurer que le schéma de la base est toujours à jour par rapport au code lors du démarrage du conteneur, sans intervention manuelle de l'utilisateur.

**Options envisagées :**
1. *Script d'installation manuel* : Erreur humaine possible, répétitif.
2. *Migrations Prisma (migrate deploy)* : Trop rigide pour un MVP en phase de prototypage rapide.
3. *Prisma db push au démarrage* : Synchronise le schéma immédiatement au boot du conteneur.

**Choix retenu :** 
**Utilisation de `prisma db push` dans le script d'entrypoint du Dockerfile.** C'est la solution la plus agile pour un MVP tout en garantissant que le conteneur est "prêt à l'emploi" dès qu'il est "Up".

---

## 🔒 ADR 005 : Sécurisation des clés API via Backend Proxy

**Date :** 16/04/2026
**Domaine :** Sécurité
**Statut :** Accepté

**Contexte :** 
L'application utilise des clés sensibles (Gemini, GitHub). Ces clés ne doivent jamais être visibles par l'utilisateur final dans le code client (navigateur).

**Options envisagées :**
1. *Appel direct depuis le front* : Risque majeur de vol de clés via l'onglet "Network".
2. *Variables d'environnement Next.js publiques (`NEXT_PUBLIC_`)* : Équivalent à une exposition publique.
3. *Server-Side Proxy (API Routes)* : Le client interroge le backend du projet, qui lui-même injecte la clé et interroge l'IA/GitHub.

**Choix retenu :** 
**Architecture Proxy Backend strict**. Toutes les requêtes sensibles transitent par des routes API Next.js. Seule l'authentification `NextAuth` permet d'y accéder.

---
*Dernière mise à jour par l'IA (Antigravity) - 16/04/2026*
