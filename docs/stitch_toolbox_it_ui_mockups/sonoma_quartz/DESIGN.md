# Design System Specification: The Cinematic Workspace

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Ether"**

This design system moves away from the rigid, boxy constraints of traditional B2B SaaS and into a fluid, cinematic environment. It is inspired by the weightlessness of macOS Sonoma and the precision of high-end editorial layouts. We are not building a "website"; we are crafting a professional instrument that feels like it’s carved from frosted light.

To break the "template" look, this system leans heavily on **intentional asymmetry** and **tonal depth**. Elements should appear to float within a deep, three-dimensional space, using overlapping glass layers to create a sense of hierarchy. High-contrast typography—pairing massive, authoritative headlines with delicate, airy secondary text—creates an editorial rhythm that guides the user’s eye with surgical precision.

---

## 2. Color & Materiality
The palette is a sophisticated interplay between "Pristine White," "Deep Black," and a spectrum of translucent neutrals, punctuated by high-energy neon accents.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders are strictly prohibited for sectioning or containment. Boundaries must be defined through:
1.  **Background Color Shifts:** Placing a `surface-container-lowest` card on a `surface-container-low` background.
2.  **Glass Differentiation:** Overlapping a blurred surface over a gradient mesh.
3.  **Soft Transitions:** Using negative space (white space) as the primary separator.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of glass sheets. Use the surface tiers to communicate importance:
*   **Background (`#f9f9fb`):** The canvas. Usually hosts the animated pastel gradient mesh.
*   **Surface-Container-Low:** Used for large sidebar or navigation regions.
*   **Surface-Container-Highest (`#e2e2e4`):** Reserved for small, high-focus interactive elements like tooltips or popovers.
*   **The Glass Layer:** Use `surface-container-lowest` (`#ffffff`) at 60-80% opacity with a `20px` to `40px` backdrop-blur for primary content cards.

### Signature Textures
*   **Neon Accents:** Use `secondary` (Emerald) and `primary` (Blue) for high-intent actions. 
*   **The Mesh Gradient:** Apply a subtle, animating background mesh using `primary_fixed` and `tertiary_fixed` to give the UI "soul" and prevent the minimalist white from feeling "empty."

---

## 3. Typography
We utilize a high-contrast sans-serif scale (Inter) to mimic the Apple SF Pro aesthetic. The core of this system is the tension between **Bold** and **Thin**.

*   **Display & Headlines:** Use `display-lg` and `headline-lg` with `Font-Weight: 700` (Bold). These should have tight letter-spacing (-0.02em) to feel like a premium magazine title.
*   **Body Text:** Use `body-md` at `Font-Weight: 400`. For secondary metadata, use `body-sm` with `Font-Weight: 300` (Light) to create visual "air."
*   **Labels:** `label-md` should be uppercase with slightly increased letter-spacing (+0.05em) when used for category headers to provide an authoritative, structural feel.

---

## 4. Elevation & Depth
Depth is not achieved through shadows alone, but through **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural "lift" without the "dirty" look of heavy shadows.
*   **Ambient Shadows:** When an element must float (e.g., a modal), use a "Long-Tail Shadow."
    *   *Values:* `0px 20px 80px rgba(26, 28, 29, 0.06)`. 
    *   The shadow color must be a tinted version of `on-surface` at a very low opacity (4-8%) to mimic natural light refraction through glass.
*   **The Ghost Border:** If accessibility requires a stroke (e.g., in high-contrast mode), use `outline-variant` at **15% opacity**. Never use 100% opaque lines.
*   **Glassmorphism:** All "floating" containers (Modals, Popovers, Floating Action Buttons) must use a backdrop-blur. This ensures the background mesh "bleeds" through, integrating the component into the environment.

---

## 5. Components

### Shapes & Squircles
All containers must use the **Roundedness Scale**.
*   **Cards/Large Containers:** `xl` (3rem) or `lg` (2rem).
*   **Buttons/Inputs:** `md` (1.5rem).
*   **Status Tags:** `full` (9999px).

### Key Components
*   **Buttons:**
    *   *Primary:* Solid `primary` (`#0058bc`) or a gradient from `primary` to `primary_container`. Text is `on_primary`.
    *   *Secondary:* Frosted glass (`surface-container-lowest` at 50% opacity) with a `0.5px` Ghost Border.
*   **Cards:** No dividers. Use `title-lg` for the header and `body-md` for content. Separate sections within the card using a vertical jump of `2rem` (spacing scale).
*   **Inputs:** Use `surface-container-low` with a soft squircle radius. On focus, the background should transition to `surface-container-lowest` with a subtle `primary` glow.
*   **The "IT-Toolbox" Drawer:** A unique component—a bottom-anchored, heavily blurred glass tray that houses quick-action tools, utilizing the `tertiary` (purple) accents for utility functions.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** embrace negative space. If a layout feels "empty," increase the typography size rather than adding more boxes.
*   **Do** use overlapping elements. A card slightly hanging off a container edge creates a premium, bespoke feel.
*   **Do** use the `secondary` (Emerald) for "Success" or "Active" states to provide a neon pop against the pristine background.

### Don't:
*   **Don't** use 1px solid black or grey borders. This instantly kills the macOS "Liquid Glass" vibe.
*   **Don't** use "Drop Shadows" that are small and dark. If it’s not diffused, it’s not in the system.
*   **Don't** use standard 4px or 8px corners. If it isn't "Heavily Rounded," it doesn't belong in this system.
*   **Don't** use dividers in lists. Use tonal shifts or increased vertical padding to distinguish items.