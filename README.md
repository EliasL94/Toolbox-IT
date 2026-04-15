# Toolbox-IT

Suite d'outils intelligente pour reviewer l'architecture et la qualité de code des projets pédagogiques (GitHub). Basée sur Next.js 14+ (App Router), TypeScript, et Tailwind CSS.

## Démarrage rapide

```bash
# Lancer le serveur de développement
npm run dev

# Vérifier les types et le linting
npm run check

# Lancer la suite de tests
npm test
```
Socle applicatif du projet Toolbox-IT, base de travail collaborative pour les
outils d'analyse d'architecture et de qualite de code.

## Prerequis

- Node.js LTS
- npm

## Demarrage local

```bash
npm install
npm run dev
```

Application disponible sur [http://localhost:3000](http://localhost:3000).

## Controle qualite

Un premier controle de qualite est disponible des l'initialisation :

```bash
npm run check
```

Ce script execute :

- `npm run lint` (verification ESLint)
- `npm run typecheck` (verification TypeScript stricte)

## Structure initiale

```text
.
|-- app/
|   |-- api/v1/health/route.ts
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- docs/
|-- public/
|-- eslint.config.mjs
|-- next.config.ts
|-- package.json
`-- tsconfig.json
```

## Conventions minimales de separation des responsabilites

- `app/` : interface utilisateur et routes applicatives (UI + API Next.js)
- `app/api/v1/*` : endpoints backend exposes cote serveur
- `docs/` : exigences produit, architecture cible, regles de gouvernance IA
- `public/` : assets statiques servis tels quels

## Endpoint de verification

- `GET /api/v1/health` : verification rapide de disponibilite du socle backend
