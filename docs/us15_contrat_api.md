# [API] US15 - Documenter le contrat des routes API

## 📡 Documentation des Routes API (MVP)

Global Base URL : `/api/v1`

### 1. Démarrer une nouvelle analyse (Review)

**`POST /reviews`**

Permet de soumettre l'URL d'un dépôt GitHub public pour déporter et déclencher l'analyse architecturale et algorithmique par l'IA.

#### 📥 Entrée (Requête)

**Headers:**
- `Content-Type: application/json`

**Body :**
```json
{
  "repository_url": "https://github.com/utilisateur/mon-super-projet",
  "branch": "main"
}
```

**Validation :**
- `repository_url` (Requis, string) : Doit être une URL valide commençant par `https://github.com/`. La longueur maximale est de 2048 caractères.
- `branch` (Optionnel, string) : Le nom de la branche à analyser. Ne doit pas contenir d'espaces ni de caractères spéciaux interdits.

#### 📤 Sortie (Réponse)

**Succès (202 Accepted)** : La demande est acceptée et le traitement asynchrone commence.
```json
{
  "id": "rev_abcdef123456",
  "status": "pending",
  "repository_url": "https://github.com/utilisateur/mon-super-projet",
  "created_at": "2026-04-14T13:45:00Z",
  "links": {
    "status_url": "/api/v1/reviews/rev_abcdef123456"
  }
}
```

**Erreurs :**
- **400 Bad Request** : Paramètres invalides (ex: URL manquante ou format incorrect).
- **404 Not Found** : Le dépôt GitHub spécifié est introuvable ou privé.
- **429 Too Many Requests** : Limite de requêtes (Rate Limiting) atteinte.
- **500 Internal Server Error** : Erreur interne inattendue.

---

### 2. Récupérer le statut et les résultats d'une analyse

**`GET /reviews/{id}`**

Consulte l'état d'avancement d'une analyse ou récupère son rapport final si elle est terminée.

#### 📥 Entrée (Requête)

**Paramètres de route (Path Parameters) :**
- `id` (Requis, string) : L'identifiant unique de l'analyse retourné lors de la création (ex: `rev_abcdef123456`).

#### 📤 Sortie (Réponse)

**Succès en cours de traitement (200 OK)** :
```json
{
  "id": "rev_abcdef123456",
  "status": "processing",
  "progress": 45, // Pourcentage d'avancement optionnel
  "message": "Analyse de la structure des dossiers en cours..."
}
```

**Succès terminé (200 OK)** :
```json
{
  "id": "rev_abcdef123456",
  "status": "completed",
  "repository_url": "https://github.com/utilisateur/mon-super-projet",
  "completed_at": "2026-04-14T13:50:00Z",
  "report": {
    "architecture": {
      "score": 85,
      "summary": "Architecture claire et bien structurée (modèle MVC)",
      "improvements": [
        "Extraire la logique métier des contrôleurs",
        "Ajouter des interfaces pour le couplage"
      ]
    },
    "security": {
      "score": 92,
      "issues_found": 0
    },
    "general_feedback": "Très bon projet, pensez à centraliser les variables d'environnement."
  }
}
```

**Erreurs :**
- **400 Bad Request** : Format d'ID invalide.
- **404 Not Found** : L'ID de review demandé n'existe pas.
- **500 Internal Server Error** : Une erreur interne critique a empêché la lecture de l'analyse.
- **502 Bad Gateway / 503 Service Unavailable** : Echec du moteur d'IA. Statut de l'objet mis à `failed` :
  ```json
  {
    "id": "rev_abcdef123456",
    "status": "failed",
    "error_message": "Impossible de contacter l'agent d'analyse au cours du process."
  }
  ```
