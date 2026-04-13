# [Produit] Définition du MVP, Hors Périmètre et Critères de Coupe

Ce document liste, pour l'outil de validation d'architecture de Toolbox-IT, le noyau fonctionnel strictement essentiel (MVP) pour prouver sa proposition de valeur, ainsi que les éléments délibérément écartés.

---

## 1. Le Noyau Minimal Livrable (MVP)

Le MVP contient **uniquement** les éléments indispensables pour dérouler de bout en bout le parcours principal d'évaluation d'un rendu, garantissant de livrer un produit cohérent et démontrable :

* **Moteur d'analyse architectural (Le cœur vital) :** Un script capable se connecter à l'API GitHub pour extraire l'arborescence (fichiers/dossiers à un instant T) d'un dépôt ciblé.
* **Soumission unitaire d'un dépôt :** L'utilisateur fournit l'URL d'un dépôt GitHub (public ou privé si droits obtenus).
* **Un Template architectural (JSON/YAML) pré-défini :** L'application intègre en "dur" (sans interface complexe de création) 1 ou 2 standards d'architecture typiques (ex. "API Node.js de base" avec présence obligatoire d'un pattern `src`, `controllers`, `tests`, `README.md`, `Dockerfile`).
* **Tableau de bord de résultat (Feedback) :** Une vue simple après analyse avec un Score global (ex. 80%) et la validation liste par liste des critères en succès (En Vert) et des manquements (En Rouge).
* **Liaison basique par OAuth GitHub :** Pour pouvoir interagir avec l'API GitHub sans se heurter instantanément à des limites de requêtes, et pour accéder aux projets étudiants potentiellement privés.

*Ce qu'il reste est un produit utilisable immédiatement pour corriger un projet lors d'une soutenance.*

---

## 2. Éléments Hors Périmètre pour la V1 (Justifications)

Les éléments suivants sont écartés du développement initial pour forcer la priorisation et sécuriser le délai de livraison étudiant :

* **Analyse de masse (Scan automatique de 40 repos d'un coup) :**
  * *Justification :* Implique une complexe gestion asynchrone pour éviter les Timeouts (dépassements de délais) des requêtes web. Demander au professeur de copier-coller les URL une par une suffira pour un outil V1 (certes un poil plus lent, mais fonctionnel).
* **Éditeur Front-end visuel de Templates (UI Builder) :**
  * *Justification :* Développer une interface (Glisser-Déposer, Ajout dynamique de règles) pour que le professeur crée ses grilles est lourd. Les templates seront écrits statiquement en code par les développeurs ou via un import fichier texte basique pour la démonstration.
* **Intégration Continue (Pipelines, Bot GitHub Actions) :**
  * *Justification :* S'intégrer directement dans les Pull Requests d'un repo déplace la charge sur de l'infrastructure Cloud et s'écarte de la plateforme Web centrale. On garde ce parcours web standalone pour le moment.
* **Fonctions CI/CD et Analyse de Code profonde :**
  * *Justification :* Toolbox-IT n'est ni SonarQube ni ESLint. Nous ne lisons pas la qualité du code à l'intérieur des fichiers, nous jugeons un squelette/arborescence de projet.

---

## 3. Les Critères de Coupe (Arbitrages de Secours)

Si le temps de développement de l'équipe (ou le temps étudiant imparti) vient à manquer sévèrement avant la *Deadline*, voici l'ordre et les critères de ce qui sera abandonné (coupé) pour tout de même conserver un MVP démontrable en condition réelle :

1. **Coupe de Niveau 1 (Atteinte Pédagogique) : Abandon des détails formatifs**
   * *Option choisie :* Retirer toutes les ressources documentaires prévues du genre ("Pourquoi vous avez échoué", infobulles sur le Rôle de tel fichier).
   * *Conséquence sur la Démo :* Le scanner devient un outil punitif/script binaire (Vrai / Faux) mais reste totalement fiable techniquement.

2. **Coupe de Niveau 2 (Atteinte Portée) : Suppression du Scan complet des sous-dossiers**
   * *Option choisie :* Ne limiter l'outil qu'à l'examen Strict de la RACINE du repository pour vérifier s'il est techniquement bien configuré avant l'analyse humaine.
   * *Conséquence sur la Démo :* On ne vérifiera plus toute l'architecture interne MVC, mais au moins les basiques vitaux (`.gitignore`, `README`, `package.json`, `.env.example`, `Docker`).

3. **Coupe de Niveau 3 (Atteinte Technique majeure) : Abandon de la Liaison des Comptes (OAuth)**
   * *Option choisie :* Si l'intégration des accès API est bloquante, on retirera les profils.
   * *Conséquence sur la Démo :* L'application (via un simple champ de texte) ne sera capable d'analyser **exclusivement** que des repos publics ouverts.

*Même au niveau de coupe maximal, Toolbox reste un "Validateur racine de dépôt public pertinent".*
