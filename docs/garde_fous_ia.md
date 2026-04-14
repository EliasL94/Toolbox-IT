# [Antigravity] Garde-fous Qualité et Sécurité des Agents IA

Ce document liste les contrôles stricts et obligatoires qui doivent être validés par les agents IA et l'équipe avant l'intégration (merge) de toute production générée algorithmiquement dans le projet **Toolbox-IT**.

L'objectif est d'empêcher l'accumulation de code fragile ("spaghetti") ou de failles de sécurité, souvent induites par des générations de code hors contexte.

---

## 1. Critères de Qualité et Revue de Code IA
Tout code produit par un agent (Antigravity, Copilot, etc.) ne peut être intégré sans avoir passé les vérifications explicites suivantes :
- **Conformité aux standards (Lint & Type) :** Le code ne doit produire aucun warning linter ni erreur de cast/typage. 
- **Simplicité et Maintenabilité :** Refus des structures alambiquées (deep nesting > 3 niveaux). Le code doit privilégier la lisibilité humaine avant tout.
- **Vérification SonarQube (ou équivalent) :** L'agent doit s'assurer, avant de formuler une Pull Request/Commit, que la logique ne viole aucune règle courante levée par les analyseurs statiques (ex: complexité cyclomatique excessive).

## 2. Garde-fous de Sécurité
Avant de confirmer que sa tâche est terminée, l'agent doit procéder à un "Self-Audit" et confirmer formellement l'absence de :
- **Secrets en dur :** Aucun token, mot de passe, clé d'API ou URI de base de données ne doit apparaître en clair dans le code. Tout doit passer par les variables d'environnement (`.env`).
- **Droits et Privilèges excessifs :** Les opérations modifiant le système ou la base de données ne doivent pas ignorer les middlewares d'authentification et d'autorisation.
- **Dépendances injustifiées :** Interdiction stricte d'ajouter de nouveaux packages npm, composer ou pip sans démonstration prouvant que c'est indispensable ou standard.

## 3. Déclaration de Dette Technique et Risques
L'agent n'est pas infaillible. Par conséquent, il est **obligé de déclarer** formellement (via commentaire PR ou fichier artefact) :
- **Les manques de couverture :** Si l'agent écrit une fonction mais ne l'assortit pas de tests unitaires ou E2E, il doit le signaler par un warning visible.
- **La dette introduite :** S'il a dû utiliser un contournement temporaire ou ignorer une règle stricte pour faire avancer le MVP ("hack"), cela doit être taggué avec `TODO: AI Tech Debt - [Raison]`.
- **Risques de régression :** S'il estime qu'une modification touche un composant critique partagé, l'agent doit demander spécifiquement à la CI ou au Reviewer humain de faire un test croisé sur ce composant.

## 4. Alignement Processus et CI/CD
Ces garde-fous sont nativement pensés pour prolonger les mécanismes de CI et la stratégie Git :
- Ils précèdent et complètent l'analyse statique de code (SonarQube).
- Ils se marient avec la règle Git du projet exigeant des revues humaines et le passage au vert des suites de tests avant le rebase/merge final.
