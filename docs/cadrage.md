# [Cadrage] Définir le problème, la cible et la proposition de valeur

## 1. Définition du problème

**Contexte d'usage éducatif :**
Dans les écoles d'informatique, les bootcamps ou les cursus universitaires techniques, les étudiants réalisent de nombreux projets de développement (en groupe ou individuellement). Une part importante de l'évaluation repose sur la qualité du code et le respect de l'architecture logicielle (MVC, Clean Architecture, structuration des dossiers, présence de fichiers clés comme le README, Dockerfile, tests, etc.).

**Causes :**
- Les étudiants manquent d'expérience pratique et peinent souvent à structurer correctement leurs projets dès le départ.
- Les professeurs et intervenants ont des dizaines de projets à évaluer dans un laps de temps très court.
- L'évaluation de l'architecture d'un projet demande de cloner le dépôt GitHub, d'explorer les dossiers, et d'analyser manuellement la structure, ce qui est chronophage.

**Impacts :**
- **Pour les professeurs** : Perte de temps considérable sur des tâches de vérification répétitives et à faible valeur ajoutée (vérifier si les dossiers respectent la norme imposée), au détriment de l'évaluation de la logique métier ou de l'accompagnement pédagogique.
- **Pour les étudiants** : Frustration de perdre des points bêtement sur la structure, et manque de feedback rapide et itératif pendant le développement (ils s'en rendent compte souvent trop tard à la correction finale).
- **Pour l'école** : Qualité hétérogène des livrables et difficulté à standardiser les critères de correction architecturale entre différents correcteurs.

---

## 2. Personas Détaillés (US02)

**Cible Principale :** 
Les établissements d'enseignement supérieur en informatique (Écoles d'ingénieurs, Universités, Bootcamps de code) proposant un apprentissage par la pratique (PBL).

### Persona 1 : Marc, le Professeur / Correcteur (Utilisateur principal)
* **Objectifs** : Évaluer rapidement une trentaine de projets étudiants en un week-end, et se concentrer sur l'appréciation de la logique métier plutôt que de fouiller pour trouver où se cachent les fichiers.
* **Frustrations** : Perdre 10 à 15 minutes par dépôt GitHub juste pour vérifier son arborescence et si les éléments basiques (README, .gitignore) sont présents. Subir la subjectivité et le manque d'indicateurs visuels lors de la notation.
* **Contexte** : Intervenant externe, il a très peu de temps alloué à la correction et réclame de l'outillage pour automatiser ce qui peut l'être.

### Persona 2 : Sarah, l'Étudiante / Apprenante (Bénéficiaire)
* **Objectifs** : Rendre un projet propre qui respecte les consignes architecturales de son professeur. Avoir de bonnes notes et comprendre ses erreurs pour progresser avant l'évaluation de fin de module.
* **Frustrations** : Découvrir lors du rendu final qu'elle a perdu des points parce que le dossier "Controllers" était mal orthographié ou mal placé. Manque de feedback en temps réel durant ses semaines de développement.
* **Contexte** : Étudiante en 3ème année, elle découvre seulement les design patterns d'architecture et n'est pas encore autonome sur le sujet.

### Persona 3 : Hélène, la Responsable Pédagogique (Acheteur / Prescriptrice)
* **Objectifs** : Assurer une qualité d'évaluation homogène entre tous les intervenants, moderniser l'outillage de l'école et améliorer le taux de satisfaction des étudiants concernant la clarté des attentes.
* **Frustrations** : Les étudiants se plaignent que certains correcteurs sont très stricts sur l'architecture, alors que d'autres ne l'évaluent pas du tout. Manque de statistiques globales sur les carences techniques d'une promotion entière.
* **Contexte** : Directrice technique dans l'école, elle cherche à standardiser les grilles de notation et outiller ses professeurs.

---

## 3. Scénarios d'usage (US02)

### Scénario 1 : La correction massive et automatisée (Persona : Marc)
* **Besoin principal** : Marc insère dans Toolbox-IT l'URL de l'organisation GitHub regroupant tous les projets de sa classe. L'outil scanne en lot tous les dépôts et lui sort un tableau de bord (ex: "Groupe 1 : Structure MVC valide", "Groupe 2 : Pas de Dockerfile trouvé").
* **Besoin secondaire crédible** : Marc peut télécharger ce rapport en format CSV (ou tableur) pour pré-remplir les scores architecturaux dans sa grille officielle de notation Excel.

### Scénario 2 : L'auto-évaluation continue (Persona : Sarah)
* **Besoin principal** : À mi-parcours de son projet, Sarah scanne l'URL de son propre dépôt avec Toolbox-IT (ou l'outil tourne via une action GitHub). Elle voit s'afficher des warnings : "Dossier tests manquant" et "Readme vide".
* **Besoin secondaire crédible** : L'interface ne se contente pas de signaler l'erreur : elle propose un lien éducatif ("Pourquoi un README est important ?") permettant à Sarah d'apprendre au passage.

### Scénario 3 : La définition d'un standard de promotion (Persona : Hélène)
* **Besoin principal** : Hélène se connecte et crée un "Template architectural de référence" (ex: "Attendus API Node.js - Année 3"). Elle fournit ce template à l'outil pour que toutes les corrections de l'école se basent sur ce même standard.
* **Besoin secondaire crédible** : Une fonctionnalité de "Vue analytique de promotion" lui permet de constater que 80% des élèves ont raté la configuration d'un `.gitignore`, lui suggérant d'inclure un cours de rattrapage sur Git.

---

## 4. Proposition de Valeur (US01)

**Situation Actuelle :** La revue de l'architecture des projets étudiants est un processus entièrement manuel, lent et soumis à la subjectivité de l'évaluateur, avec trop peu de retours itératifs pour l'apprenant.

**Ce que permet Toolbox-IT (La Suite d'Outils) :** 

*   **L'Analyseur d'Archi** : Vérification automatisée de la structure des dossiers par rapport à des standards (MVC, Clean, etc.).
*   **L'Analyseur de Code** : Review automatisée de la qualité, sécurité et lisibilité du code source.
*   **L'IA Architecte** : Un outil conversationnel qui interroge l'apprenant sur sa stack et ses objectifs pour lui proposer des schémas d'architecture professionnels et sécurisés.

**La mission de la plateforme :**
*« Accompagner les apprenants et les équipes pédagogiques dans la maîtrise des standards de l'industrie grâce à une suite d'outils d'analyse, de review et de conception automatisée. »*

---

## 5. Elevator Pitch (US06)

**Format court (à lire en moins de 45 secondes) :**

> « Aujourd'hui, la qualité d'un projet tech ne se résume pas à son fonctionnement : sa structure et sa propreté sont critiques pour sa maintenabilité. Pourtant, l'évaluation de ces critères reste lente et subjective dans les écoles.
> 
> **Toolbox-IT** est une suite d'outils intelligents qui automatise la review d'architecture et de code des dépôts étudiants. 
> 
> Grâce à nos analyseurs et à notre assistant de conception IA, les professeurs gagnent un temps précieux sur les tâches répétitives et les étudiants bénéficient d'un mentor virtuel disponible 24h/24 pour les aider à bâtir des projets aux standards professionnels. »
