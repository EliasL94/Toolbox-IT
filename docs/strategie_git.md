# Stratégie Git - Toolbox-IT

Ce document définit les règles de collaboration sur le code source afin de garantir la stabilité du projet et de faciliter le travail en équipe.

## 🌿 Modèle de Branches

Nous utilisons un modèle simplifié inspiré de Git Flow :

| Branche | Rôle | Règles |
| :--- | :--- | :--- |
| `main` | **Production** : Version stable et déployée. | 🚫 Push direct interdit. Uniquement via merge de `dev`. |
| `dev` | **Intégration** : Branche de travail commune. | ✅ Fusion des fonctionnalités validées. |
| `feat/*` | **Fonctionnalités** : Branches temporaires (ex: `feat/login`). | 🛠️ Créées à partir de `dev`. Supprimées après fusion. |

## 🔄 Workflow de Développement

1.  **Création** : Partir de `dev` pour créer une branche descriptive : `git checkout -b feat/nom-tâche`.
2.  **Développement** : Faire des commits atomiques et réguliers (en français, comme convenu).
3.  **Sync** : Récupérer régulièrement les nouveautés de `dev` : `git pull origin dev`.
4.  **Fusion** : Une fois la tâche terminée, fusionner vers `dev` (voir auto-revue ci-dessous).

## ✅ Checklist d'Auto-Revue (Avant Intégration)

Avant chaque fusion vers `dev`, le développeur doit valider :
- [ ] Le code est indenté et propre.
- [ ] Les commentaires inutiles sont supprimés.
- [ ] L'application se lance sans erreur.
- [ ] La documentation (cas de US) est mise à jour si nécessaire.
- [ ] Un `git pull` a été fait pour éviter les conflits de dernière minute.

## 🛡️ Règles de Sécurité

- **Protection de `main`** : La branche `main` est le reflet du site public. Aucun code non testé ne doit y transiter.
- **Revue systématique** : Bien que nous travaillions en binôme avec Antigravity, chaque grosse fonctionnalité doit être relue (via le chat ou via une Pull Request sur GitHub).

---
*Stratégie adoptée le 14/04/2026 pour le projet Toolbox-IT.*
