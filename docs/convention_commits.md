# Convention de Commits et Bonnes Pratiques - Toolbox-IT

Ce document définit les standards attendus pour la rédaction des messages de commit du projet. L'objectif est d'assurer une traçabilité claire, de faciliter les revues de code et de simplifier la génération de notes de version (changelog).

## 📏 Règles Fondamentales

Afin de maintenir un historique propre et facile à lire, chaque développeur de l'équipe s'engage à respecter les principes suivants :

1. **Un commit = Un sujet** : Chaque ajout de fonctionnalité (feature) ou correction de bug (bugfix) doit faire l'objet d'au moins un commit dédié.
2. **Atomicité** : Un commit ne doit **jamais** mélanger volontairement plusieurs sujets sans lien (ex: éviter de corriger un bug métier tout en formatant un fichier CSS sans rapport).
3. **Justification des tests** : Tout commit apportant une modification logique ou une nouvelle fonctionnalité au code doit inclure des tests, ou à défaut, **une justification de leur absence** explicite dans le corps du message de commit.

---

## 🏷️ Format Standard (Conventional Commits)

Nous utilisons une convention inspirée des [*Conventional Commits*](https://www.conventionalcommits.org/). La structure attendue est la suivante :

```text
<type>[scope optionnel]: <description courte respectant l'impératif>

[corps de texte optionnel avec détails et justifications (ex: absence de tests)]

[footer optionnel pour la fermeture de tickets, ex: Closes #123]
```

### 💡 Types et Préfixes Autorisés

| Préfixe | Usage | Exemple de Sujet |
| :--- | :--- | :--- |
| **`feat`** | Ajout d'une nouvelle fonctionnalité. | `feat: ajout de l'analyse IA via l'API GitHub` |
| **`fix`** | Correction d'un bug. | `fix: gestion du timeout lors de l'appel API` |
| **`docs`** | Création ou mise à jour de la documentation locale. | `docs: création du journal des décisions (ADR)` |
| **`style`** | Modifications purement visuelles (CSS, formatage, espaces). | `style: centrage de la section des outils` |
| **`refactor`** | Modification du code qui n'ajoute ni fonctionnalité ni ne corrige un bug. | `refactor: découpage du fichier principal en modules` |
| **`test`** | Ajout ou modification des tests. | `test: ajout des tests unitaires pour le validateur` |
| **`chore`** | Tâches de maintenance, mise à jour des dépendances, builds. | `chore: mise à jour du script de déploiement` |

---

## ✅ Exemples Acceptés et Rejetés

### 🟢 Ce qu'il faut faire :

**Exemple 1 : Ajout de feature (avec justification de test)**
```text
feat(scanner): ajout du bouton d'export PDF

Le bouton a été placé en bas de page pour exporter le rapport d'analyse.
Tests absents : la fonctionnalité repose intégralement sur une librairie front-end externe non-mockable pour le moment.
```

**Exemple 2 : Correction de bug isolée**
```text
fix: empêche le double appel API lors d'un clic rapide
```

### 🔴 Ce qu'il ne faut PAS faire :

**❌ Mélange de sujets sans rapport :**
```text
fix: correction de la div cassée et ajout complet de la nouvelle page de contact et maj docs
```
*(Problème : Casse la règle de l'atomicité, rend le git revert très complexe).*

**❌ Message non descriptif :**
```text
update 
```
*(Problème : Ne permet pas aux relecteurs de comprendre l'intention sans lire le diff).*

---
*Document validé par l'Équipe Projet le 14/04/2026*
