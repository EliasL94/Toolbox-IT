
## 🎨 Socle de Cohérence Visuelle (Mini Guide UI)

*Basé sur les spécifications du projet Stitch "Toolbox-IT UI Mockups" (The Cinematic Workspace).*

### 1. Philosophie & Esthétique (Creative North Star)
- **Thème :** "The Digital Ether". Un environnement fluide et cinématique inspiré par la légèreté et la précision des mises en page éditoriales haut de gamme.
- **Principe fondamental :** Asymétrie intentionnelle et profondeur tonale. Les éléments doivent donner l'impression de flotter au sein d'un espace profond, en utilisant des calques de verre superposés ("glassmorphism").

### 2. Couleurs et Contrastes ("The No-Line Rule")
- **Palette :** Interplay entre un "Pristine White", un "Deep Black", et des accents néons (Emerald et Blue) pour les actions structurantes.
- **Séparations :** Les bordures solides traditionnelles (1px) sont proscrites. La hiérarchie est définie par des changements de couleur d'arrière-plan, des flous sur des mailles dégradées, et l'espace négatif (white space).

### 3. Typographie (Tension entre le Gras et le Fin)
- **Typographie principale :** Inter (imitation de l'esthétique Apple SF Pro).
- **Titres (Display & Headlines) :** Font-Weight 700 (Bold) avec un espacement très serré (-0.02em).
- **Corps de texte :** Font-Weight 400 (Regular). Métadonnées en Font-Weight 300 (Light) pour créer de la respiration.
- **Labels (Navigation/Catégories) :** Uppercase avec un espacement étendu (+0.05em).

### 4. Élévation et Profondeur (Tonal Layering)
- **Effet de verre (Glass Layer) :** Utiliser des fonds blancs (60-80% d'opacité) avec un `backdrop-blur` (20-40px). 
- **Ombres (Ambient Shadows) :** "Long-Tail Shadow" colorisée (teinte d'interface) à très faible opacité (4-8%) plutôt qu'une ombre portée noire et opaque.
- **Bordure fantôme (Accessibilité) :** Si nécessaire, utiliser un `outline-variant` à 15% d'opacité maximum.

### 5. Composants et Formes (Squircles)
- **Conteneurs et Cartes :** Arrondis très prononcés (`lg` ou `xl`). Ne pas utiliser de coins classiques 4px ou 8px.
- **Boutons :** 
  - *Primaire :* Bleu uni ou dégradé, coins `md`.
  - *Secondaire :* Effet verre dépoli avec bordure fantôme et texte foncé.
- **La "IT-Toolbox Drawer" :** Un panneau (tiroir) ancré en bas, lourdement flouté, contenant les actions rapides avec des accents violets.

---

## 📱 Écrans Structurants du Parcours Principal

*(Identifiés à partir des écrans du projet `14801459075881181717`)*

**1. Dashboard Principal (État Normal & Vide)**
- *Normal :* Liste des projets récents, barre de recherche, accès au tiroir "IT-Toolbox Drawer" en bas.
- *Vide :* Illustration cinématique ("Digital Ether"), appel à l'action primaire "Analyser un nouveau projet Github".

**2. Écran d'Analyse / Import (États Normal & Erreur)**
- *Zones :* Champ de saisie pour l'URL GitHub, bouton d'action primaire.
- *Erreur :* Feedback utilisateur en cas d'URL invalide (utilisation de couleurs d'erreur douces et non agressives).

**3. Résultats du Reviewer Architecture**
- *Actions :* Thèmes de l'analyse (Design, Code, Sécurité), cartes superposées ("glass layer") pour lire les retours de l'IA. Navigation fluide entre les points de revue.

**4. Panneau "IT-Toolbox Drawer"**
- Composant persistant et récurrent, affichable en superposition, listant les différents outils disponibles au-delà du reviewer.
