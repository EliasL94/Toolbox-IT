# [Produit] Cartographie des User Journeys prioritaires

Ce document modélise les parcours utilisateurs de bout en bout pour le MVP de **Toolbox-IT** (Reviewer d'architecture de projets GitHub), conformément aux personas définis dans le cadrage.

---

## 1. User Journey 1 : La correction massive et automatisée (Le Parcours Principal)

**Persona cible :** Marc, le Professeur / Correcteur
**Objectif :** Évaluer et noter rapidement l'architecture d'une trentaine de projets GitHub étudiants.
**Contexte MVP :** C'est le flux fondamental qui apporte la valeur de gain de temps immédiat promise par Toolbox-IT.

| Étape | Actions & Décisions | Irritants & Frictions identifiés | Résultat attendu & Valeur délivrée |
|:---|:---|:---|:---|
| **1. Authentification & Accès** | Marc se connecte à l'outil (via GitHub OAuth) pour lier son compte et donner accès aux dépôts. | Les dépôts étudiants sont souvent privés. L'école n'a pas forcément formalisé d'organisation GitHub globale. | Connexion réussie et autorisation de lecture des dépôts accordée. |
| **2. Importation des projets** | Marc fournit l'URL de l'organisation GitHub de la promotion ou copie/colle une liste d'URLs de repos étudiants. | L'import manuel d'URLs peut être lourd. Des repos peuvent être mal nommés par les groupes, rendant l'identification difficile. | L'outil identifie et liste tous les projets étudiants à évaluer. |
| **3. Choix du référentiel** | Marc sélectionne le "Template architectural" à utiliser pour la correction (ex: "Standard MVC Node.js" ou "Règles strictes École"). | La configuration d'un template depuis zéro serait trop complexe et découragerait l'utilisateur. | Le standard d'évaluation est fixé. |
| **4. Analyse en lot (Scan)** | Marc déclenche le scan de tous les projets de la promotion en un clic. | L'API GitHub a des limites de requêtes (rate limiting). Attendre devant un écran de chargement pour 30 repos peut être long. | Le scan se lance. **C'est le moment "Magique" de l'outil.** |
| **5. Tableau de bord** | Marc visualise un Dashboard récapitulatif listant chaque groupe/repo, son score architectural, et les fichiers manquants/mal placés. | Frustration s'il y a des "faux positifs" de l'outil (ex: un élève a orthographié `Controllers` en `Controller` et a pris un 0). | Marc a une vision globale et instantanée de qui a respecté l'architecture ou non. |
| **6. Exportation** | Marc télécharge les résultats au format tableau pour insérer les notes dans la plateforme de l'école (LMS). | Le format CSV n'est pas dans le même ordre que sa liste d'appel, l'obligeant à faire du tri manuel. | Les notes architecturales sont prêtes à l'emploi. |

---

## 2. User Journey 2 : L'auto-évaluation continue (Le Parcours Bénéficiaire)

**Persona cible :** Sarah, l'Étudiante / Apprenante
**Objectif :** Vérifier que son projet est conforme aux exigences de son professeur pendant sa phase de développement (avant le rendu).
**Contexte MVP :** Ce parcours apporte une dimension pédagogique forte au produit, réduisant les échecs lors des soutenances.

| Étape | Actions & Décisions | Irritants & Frictions identifiés | Résultat attendu & Valeur délivrée |
|:---|:---|:---|:---|
| **1. Connexion au projet** | Sarah accède à l'outil et entre l'URL de son dépôt GitHub. | Elle ne veut pas s'inscrire, elle veut juste tester son repo public ou partagé. | Le projet de Sarah est relié à Toolbox-IT. |
| **2. Test contre un référentiel** | Elle lance l'analyse. Elle choisit le template fourni formellement par son professeur via un lien ou une recherche de nom. | Elle ne sait pas forcément quel est le nom du bon template à utiliser parmi ceux proposés par l'outil. | Le projet est analysé spécifiquement pour le cours suivi. |
| **3. Analyse des retours** | L'outil lui affiche des "warnings" visuels : ex. *`├── src/tests missing`* ou *`README.md vide`*. | Un message d'erreur technique brut (type linter) serait incompréhensible pour elle. | Une To-Do liste claire de ce qu'il faut structurer. |
| **4. Apprentissage pédagogique** | Sarah clique sur une erreur. L'outil ouvre un panneau éducatif expliquant "Pourquoi un dossier Tests est important en Clean Architecture". | Si la ressource n'existe pas, Sarah va ignorer le warning sans comprendre le concept. | Elle comprend la théorie logicielle derrière la consigne. |
| **5. Itération et Validation** | Sarah modifie le code, push sur GitHub, et relance l'analyse manuellement pour vérifier si le score est à 100%. | Devoir retourner sur la page web à chaque push pour relancer le scan est un effort constant. | Son projet est validé et prêt à être rendu. |

---

## 3. Futures Stories (Backlog) générées à partir des Frictions

Pour répondre aux irritants identifiés lors la modélisation, voici les stories qui devront être incluses dans le backlog (Priorisation MVP ou Post-MVP) :

* **[Story] Interface de configuration de templates par défaut :** Pour éviter que Marc ne doive créer sa propre grille de correction à la main (Journey 1, Étape 3), fournir des templates standards (MVC, Clean-Archi, REST API).
* **[Story] Gestion des files d'attente asynchrones (Background jobs) :** Pour gérer la limite de l'API GitHub et que Marc ne patiente pas devant un loader infini lors d'un scan de 40 repos (Journey 1, Étape 4).
* **[Story] Option de souplesse (Fuzzy matching) sur les noms de dossiers :** Pour éviter que les étudiants ne soient sanctionnés si l'outil est trop rigide (`test` au lieu de `tests`) (Journey 1, Étape 5).
* **[Story] Base de connaissances pédagogique (Infobulles) :** Pour afficher des explications théoriques lors des erreurs générées pour les étudiants (Journey 2, Étape 4).
* **[Story] Génération d'un "lien de classe" partageable :** Hélène ou Marc peuvent générer un lien direct imposant un template précis pour que les élèves (Sarah) n'aient pas à le chercher (Journey 2, Étape 2).
* **[Story] Intégration du bot GitHub (Actions / PR Checks) (Post-MVP) :** Pour que Sarah n'ait pas à lancer l'analyse manuellement, l'outil analyse le projet automatiquement à chaque *Push* ou *Pull Request* (Journey 2, Étape 5).
