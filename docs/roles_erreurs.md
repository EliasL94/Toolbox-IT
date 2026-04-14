# Rôles, Permissions et Gestion des Erreurs - Toolbox-IT

Ce document définit qui peut faire quoi dans l'application et comment le système réagit face aux imprévus pour garantir sécurité et cohérence.

## 👥 Matrice des Rôles et Permissions

| Action | Étudiant | Professeur | Administrateur |
| :--- | :---: | :---: | :---: |
| Scanner ses propres dépôts | ✅ | ✅ | ✅ |
| Voir son historique de scores | ✅ | ✅ | ✅ |
| Consulter les Templates publics | ✅ | ✅ | ✅ |
| Créer/Modifier des Templates | ❌ | ✅ | ✅ |
| Voir les scores d'une promotion | ❌ | ✅ | ✅ |
| Gérer les accès utilisateurs | ❌ | ❌ | ✅ |
| Supprimer des logs système | ❌ | ❌ | ✅ |

### 🚫 Cas de Refus d'Accès (Exemple)
*   **Scénario** : Un Étudiant tente d'accéder à l'URL `/admin/templates/edit/1`.
*   **Comportement API** : Retourne une erreur `403 Forbidden`.
*   **Comportement UI** : Redirection vers une page "Accès Refusé" avec le message : *"Désolé, vous n'avez pas les droits nécessaires pour modifier les standards d'architecture."*

## ⚠️ Stratégie de Gestion des Erreurs

Nous distinguons trois niveaux d'erreurs pour adapter la réponse utilisateur.

### 1. Erreurs de Validation (Saisie)
*   **Cause** : URL GitHub mal formée, champ vide.
*   **Message** : *"L'URL fournie n'est pas une URL GitHub valide (ex: https://github.com/user/repo)."*
*   **Action** : Correction immédiate par l'utilisateur (champ en rouge).

### 2. Erreurs Métier (Logique)
*   **Cause** : Dépôt déjà scanné récemment (anti-spam), template incompatible avec le langage détecté.
*   **Message** : *"Ce projet a déjà été analysé il y a moins de 5 minutes. Veuillez patienter pour un nouveau scan."*
*   **Action** : Blocage temporaire de l'action "Scan".

### 3. Erreurs Techniques (Infrastructure / API)
*   **Cause** : API GitHub indisponible, limite de quota atteinte, crash JS inattendu.
*   **Message** : *"Connexion avec GitHub interrompue. Nous ne parvenons pas à récupérer vos fichiers."*
*   **Action** : Proposition de recharger la page ou de réessayer plus tard.

### 🛑 Cas d'Erreur Critique (Exemple)
*   **Scénario** : Échec total du chargement de la configuration initiale (Fichier JSON corrompu).
*   **Comportement UI** : "Écran de la mort" propre avec message : *"Une erreur critique est survenue lors de l'initialisation de la Toolbox. L'équipe technique a été alertée. [Bouton : Signaler un bug]"*

## 📢 Principes de Communication
- **Clarté** : Pas de codes d'erreur bruts (ex: `Error 0x882`) pour l'utilisateur final.
- **Actionnabilité** : Toujours proposer une solution (ex: "Vérifiez votre connexion", "Repassez plus tard").
- **Sécurité** : Ne jamais afficher de traces de pile (stacktrace) ou de clés d'API dans les messages d'erreur publics.

---
*Stratégie alignée sur l'Architecture Globale (US10) et le Modèle de Données (US13).*
