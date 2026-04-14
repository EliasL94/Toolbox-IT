# Journal des Décisions Structurantes (ADR) - Toolbox-IT

Ce document trace les choix majeurs d'architecture, de produit, de sécurité et de déploiement réalisés lors du projet. Il permet de justifier les arbitrages en soutenance et d'éviter un historique d'évolution opaque.

## 🏛️ Décision 001 : Utilisation de Vanilla Web (HTML/CSS/JS natif)

**Date :** 14/04/2026
**Domaine :** Architecture / Produit

**Contexte :** 
Pour le MVP de Toolbox-IT, un besoin clé est d'assurer une reprise simple par des étudiants ou des agents IA, avec une courbe d'apprentissage minimale ("Onboarding") sans étapes de compilation complexes.

**Options envisagées :**
1. *Framework UI (React/Vue/Angular)* : Puissant mais ajoute une surcouche de tooling (npm, build steps) lourde pour une application orientée document/cadrage.
2. *Backend-Heavy (Laravel/PHP)* : Nécessite un serveur, compliquant l'hébergement statique.
3. *Vanilla Web (natif)* : Zéro dépendance, chargement ultra-rapide.

**Choix retenu :** 
**Vanilla Web (HTML/CSS/JS natif).**

**Compromis / Conséquence acceptée :** 
La gestion de l'état (state managment) des vues riches ou des modales devra se faire de façon manuelle. Si l'application devient nettement plus complexe à l'avenir, cela engendrera une dette technique au niveau manipulation du DOM, mais ce compromis est assumé pour garantir une livraison initiale ultra-légère.

---

## 🔒 Décision 002 : Architecture Client-Side et exposition des API

**Date :** 14/04/2026
**Domaine :** Sécurité

**Contexte :** 
Le projet requiert de consommer des API externes (GitHub, IA) pour réaliser l'analyse de code, ce qui soulève la question de la gestion des clés secrètes.

**Options envisagées :**
1. *Stockage purement client (LocalStorage / config en clair)* : Vulnérabilité forte si exposé en ligne.
2. *Lancement d'un Backend complet (Node/PHP)* : Lourd à héberger, casse la proposition de valeur "100% navigateur".
3. *Proxy Minimaliste (Serverless Functions)* : Joue le rôle de passe-plat sécurisé pour la production.

**Choix retenu :** 
**Stockage client des clés pour le développement local et ajout d'un Proxy Serverless (ex: Vercel/Netlify functions) pour le déploiement de production.**

**Compromis / Conséquence acceptée :** 
Pendant un temps limité (MVP), une exposition locale est tolérée pour le développement et la validation de faisabilité (Proof of Concept). En production, la dépendance à un acteur Serverless devient obligatoire.

---

## 🚀 Décision 003 : Déploiement continu via GitHub Pages

**Date :** 14/04/2026
**Domaine :** Déploiement

**Contexte :** 
Le projet a vocation à être démontré facilement en soutenance, nécessitant une mise à disposition rapide, gratuite et intégrée aux outils de versionnement habituels des étudiants.

**Options envisagées :**
1. *Hébergement Cloud classique (VPS/AWS)* : Trop coûteux et configuration serveur lourde pour un site statique.
2. *Vercel / Netlify* : Très adapté, mais introduit un compte fournisseur supplémentaire.
3. *GitHub Pages* : Déjà intégré là où vit le code.

**Choix retenu :** 
**Déploiement statique via GitHub Actions sur GitHub Pages.**

**Compromis / Conséquence acceptée :** 
L'application doit rester strictement statique (pas de calcul backend natif exécuté sur l'hébergement). On s'inscrit dans une logique API-First externe.

---
*Document maintenu et validé par l'Architecte Logiciel et le Product Owner*
