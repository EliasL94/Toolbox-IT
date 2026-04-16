# Règles de Qualité et Commentaires (Toolbox-IT)

## 🎯 Objectif
Éviter l'accumulation de dette technique générée par le "vibe coding". Les règles suivantes garantissent un socle de lisibilité, de testabilité et de maintenabilité pour l'ensemble du projet.

## 1. Lisibilité et Modélisation (Clean Code)
- **Le nommage documente l'intention** : Les noms de variables, de fonctions et de classes doivent indiquer explicitement "quoi" et "pourquoi" sans nécessiter de commentaire (ex: `extractGithubRepositoryOwnerAndName` plutôt que `parseUrl`).
- **DRY (Don't Repeat Yourself)** : La logique métier complexe ou récurrente ne doit **jamais** être dupliquée. Si un pattern est utilisé deux fois, il doit être extrait.

## 2. Complexité Restreinte (Limites Fixes)
Des seuils sont imposés via ESLint (niveau `warn` en local) pour éviter les god-classes et le "Spaghetti Code" :
- **Taille de fichier** : Un fichier ne doit généralement pas dépasser **350 lignes**. Au-delà, c'est le signe que le principe de responsabilité unique (SRP) n'est pas respecté.
- **Complexité Cyclomatique** : Maximum **10 à 15** branchements (`if`, `switch`, `for`) par fonction.
- **Profondeur d'imbrication** : Maximum **4 sous-blocs** imbriqués de niveau. Si vous avez besoin de plus, extrayez une sous-fonction ou inversez la condition (Early Return).

## 3. Séparation des Responsabilités (Architecture)
Le contournement de l'architecture est interdit :
- Les **Composants (Views)** se limitent au rendu et aux états locaux (UI).
- Les **Routes d'API (Controlleurs)** extraient et valident la donnée.
- Les appels HTTP profonds ou manipulations lourdes de données doivent, à terme, vivre dans des modules **Services / Utils**.

## 4. Politique Stricte sur les Commentaires
Les commentaires ne doivent jamais justifier du mauvais code ("Ne commentez pas un mauvais code, réécrivez-le" - *Clean Code*).

### ❌ INTERDIT : Commentaires décoratifs ou redondants
Les commentaires évidents, mensongers car plus à jour, ou simplement narratifs (qui expliquent *ce que fait* la ligne du dessous) sont strictement proscrits.
```typescript
// Récupère l'utilisateur
const user = await getUser();

// 1. Initialisation
let count = 0;
```

### ✅ OBLIGATOIRE : Documentation contextuelle / "Pourquoi"
Les commentaires sont réservés à la documentation d'API (JSDoc `/** ... */`), aux décisions techniques métier peu intuitives et aux "Edge Cases". 
```typescript
/**
 * Synchronise les modèles LLM.
 * Note: Le fallback vers un 2ème modèle s'effectue silencieusement 
 * car l'API tierce sature aléatoirement le soir (>503).
 */
export async function syncAIModel() { ... }
```
- Tout contournement technique ou exception (*workaround*, `any`, `@ts-ignore`) doit impérativement être accompagné d'un commentaire expliquant la raison temporaire de la désactivation.
