# [Antigravity] Règles de travail communes des agents IA

Ce document formalise la manière dont les agents IA (comme Antigravity ou d'autres assistants virtuels) doivent analyser, proposer, modifier et se restreindre sur le projet **Toolbox-IT**. 
L'objectif est de garantir des contributions fiables, prédictibles et alignées sur les exigences d'un projet de niveau professionnel.

---

## 1. Méthodologie d'Analyse et Communication
- **Expliciter les hypothèses :** L'agent ne doit jamais agir sur la base d'une supposition muette. Toute déduction ou choix arbitraire fait par l'agent (ex: "J'ai supposé que ce composant était obsolète") doit être écrit clairement dans le fil de conversation avant d'initier une action.
- **Signaler l'incertitude :** Si une demande de l'utilisateur est ambiguë, partielle ou qu'elle risque de provoquer des régressions, l'agent doit formuler ses doutes et poser des questions de clarification explicites.
- **Transparence pré-action :** Avant de lancer toute commande modifiant le système de fichiers, l'agent **doit impérativement lister quels fichiers exacts vont être modifiés, supprimés ou créés**. 

## 2. Garde-fous et Limites d'Intervention
- **Strict respect du périmètre (Scope-locking) :** L'agent a l'interdiction formelle (et doit refuser l'instruction) d'ajouter des fonctionnalités gratuites, de mettre à jour des paquets sans qu'on lui demande, ou de restructurer le code autour de la zone d'intervention. "Fixer un bug" ne donne pas le droit de changer l'architecture du dossier.
- **Défense de la sécurité et de l'architecture :** L'agent doit refuser ou "flag" toute demande utilisateur qui compromettrait manifestement la sécurité de l'application (ex: stocker un secret en clair, retirer un contrôle d'accès) ou qui détruirait l'intégrité architecturale actée du projet.

## 3. Charte d'Exécution (Code, Docs, Tests)
Les règles ci-dessous s'imposent dans les tâches courantes :
- **Génération de code :** Interdiction de générer du code factice (placeholders persistants) sauf si explicitement demandé. Le code doit inclure les vérifications (try/catch, typage) dès le premier jet.
- **Documentation :** Lorsqu'une API ou un composant clef est modifié, l'agent *doit de lui-même* proposer ou effectuer la mise à jour correspondante des fichiers `.md` ou des DocBlocks.
- **Refactoring :** Tout refactoring ne doit concerner que le segment visé par la discussion et ne jamais réécrire globalement la base de code sans un "Planning Mode" validé.
- **Tests et Validation :** L'agent doit exiger de l'utilisateur l'approbation pour tester localement ou fournir les scripts de tests unitaires/E2E liés à sa génération de code, assurant que sa proposition est réellement fonctionnelle.
