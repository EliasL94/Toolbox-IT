# Diagramme de Séquence : Parcours Principal - Toolbox-IT

Ce document modélise les interactions techniques lors du parcours principal : le scan d'une architecture GitHub par un utilisateur.

## 🔄 Analyse d'Architecture (Scan GitHub)

Le diagramme suivant illustre le flux nominal et un cas d'erreur (dépôt non trouvé).

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant UI as Interface Utilisateur
    participant JS as Logique (AppJS)
    participant SC as ArchiScanner
    participant GH as API GitHub
    participant DB as Templates / LocalStorage

    U->>UI: Saisit URL GitHub & Choisit Template
    UI->>JS: Déclenche scan (URL, TemplateId)
    
    JS->>UI: Affiche état "Chargement..."
    
    JS->>SC: Analyser(URL, TemplateId)
    
    SC->>DB: Récupérer Template JSON
    DB-->>SC: Template (MVC, Clean, etc.)
    
    SC->>GH: GET /repos/{user}/{repo}/contents
    
    alt Flux Nominal (Success 200)
        GH-->>SC: Liste des fichiers/dossiers
        SC->>SC: Comparer arborescence vs Template
        SC->>SC: Calculer Score de Qualité
        SC->>DB: Sauvegarder Score & Rapport
        SC-->>JS: Résultats du Scan
        JS->>UI: Masque Loader & Affiche Résultats
        UI-->>U: Affiche Score et Recommandations
    else Dépôt non trouvé / Erreur API (404/403)
        GH-->>SC: Erreur (Not Found / Rate Limit)
        SC-->>JS: Exception(Error Message)
        JS->>UI: Affiche Message d'Erreur contextuel
        UI-->>U: "⚠️ Dépôt introuvable ou accès refusé"
    end
```

## 📝 Détails des Étapes

### 1. Validation & Traitement
L'interface utilisateur effectue une première validation formatée de l'URL GitHub avant d'appeler la logique applicative. La logique (`AppJS`) orchestre ensuite les appels aux services spécialisés.

### 2. Récupération & Services Externes
Le composant `ArchiScanner` est responsable de la communication avec l'API GitHub. Il transforme la réponse brute de GitHub en une structure interne comparable à nos templates.

### 3. Persistance
Chaque scan réussi est persisté dans le `LocalStorage`. Cela permet à l'utilisateur de retrouver ses analyses précédentes sans re-scanner le dépôt (gain de temps et économie de quota API).

### 4. Gestion d'Erreur
Le diagramme prévoit le cas où le dépôt n'est pas accessible (privé, URL erronée) ou si les limites de l'API GitHub sont atteintes. L'utilisateur reçoit alors un feedback explicite au lieu d'un écran figé.

---
*Diagramme cohérent avec l'Architecture Globale (US10) et la Stack Technique (US11).*
