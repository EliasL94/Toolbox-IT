# Toolbox-IT

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

## Test du parcours principal

Un test d'integration du flux principal est disponible :

```bash
npm run test
```

Le test `__tests__/main-user-journey.test.tsx` couvre le parcours etudiant
principal :

- saisie URL GitHub
- demarrage de l'analyse
- transitions de progression
- affichage du resultat final

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
