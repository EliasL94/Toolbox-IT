# Engineering Precision: The Design System Manual

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Architectural Monolith."** 

In an era of cluttered B2B interfaces, we prioritize structural integrity and editorial clarity. This system moves away from "app-like" containers and toward a high-end, digital workspace that feels like a precision instrument. We reject the generic "card-on-gray" layout in favor of intentional asymmetry, massive whitespace, and tonal depth. By utilizing deep navy structural anchors and pure white surfaces, we create a high-contrast environment that signals both technical authority and uncompromising cleanliness.

---

## 2. Color & Surface Architecture
This system utilizes a "High-Contrast Structural" model. We do not use color to decorate; we use it to define purpose and hierarchy.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders (`#D1D5DB` style) are strictly prohibited for sectioning or layout containment. 
Boundaries must be established through **Tonal Shifts**. To separate a sidebar from a main content area, transition from `inverse_surface` (#283044) directly to `surface` (#faf8ff). To separate content blocks, use a shift from `surface_container_low` (#f2f3ff) to `surface_container_lowest` (#ffffff).

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of premium materials.
*   **The Foundation:** Use `surface` (#faf8ff) for the primary application backdrop.
*   **The Structural Anchor:** Sidebars and global headers must use `inverse_surface` (#283044) to provide a "weighted" frame that grounds the user experience.
*   **The Inset:** Use `surface_container_low` (#f2f3ff) for recessed areas like code blocks or secondary utility panels.
*   **The Elevated Layer:** Use `surface_container_lowest` (#ffffff) for the primary interaction objects (cards, modals).

### Signature Textures: Glass & Gradient
To achieve a "Vercel-inspired" premium feel, use **Glassmorphism** for floating elements (modals, dropdowns, and hover-tooltips). 
*   **Token Application:** Combine `surface_container_lowest` at 80% opacity with a `20px` backdrop-blur.
*   **The CTA Soul:** Primary actions should not be flat. Apply a subtle linear gradient from `primary` (#0058bc) to `primary_container` (#0070eb) at a 135-degree angle to give buttons a "lithic" presence.

---

## 3. Typography: The Editorial Edge
We use **Inter** exclusively. To move beyond the standard look, we utilize "Tight Tracking" (letter-spacing: -0.02em) for all headlines to create a dense, authoritative aesthetic.

*   **Display & Headline (The Authority):** Use `display-md` and `headline-lg` for dashboard summaries. These should be high-contrast (`on_surface`) and bold. The scale jump between a headline and body text should be dramatic to enforce an editorial hierarchy.
*   **Title (The Navigator):** Use `title-md` for card headers. These act as the primary anchors for scanning.
*   **Body (The Utility):** `body-md` is our workhorse. Ensure line-height is generous (1.6x) to contrast against the tight tracking of the headers.
*   **Labels (The Detail):** `label-sm` should be used for metadata, often in `on_surface_variant` (#414755) with all-caps styling and increased letter-spacing (+0.05em) to differentiate from interactive text.

---

## 4. Elevation & Depth
We eschew "Material" style drop shadows. Depth is achieved through **Tonal Layering** and **Ambient Light**.

*   **The Layering Principle:** Instead of a shadow, place a `surface_container_highest` object inside a `surface` background. The subtle 4% difference in luminance creates a more sophisticated "lift."
*   **Ambient Shadows:** When a component must float (e.g., a Command Palette), use a "Ghost Shadow":
    *   `box-shadow: 0 20px 50px -12px rgba(19, 27, 46, 0.08);`
    *   The shadow color must be derived from `on_surface` to simulate natural light absorption.
*   **The Ghost Border:** If a boundary is required for accessibility, use `outline_variant` (#c1c6d7) at **15% opacity**. This creates a suggestion of a container without breaking the "No-Line" rule.

---

## 5. Component Logic

### Buttons
*   **Primary:** Gradient of `primary` to `primary_container`. Radius: `xl` (0.75rem). Text: White.
*   **Secondary:** Ghost style. No background, `outline_variant` at 20% opacity.
*   **Tertiary:** No background or border. `primary` text. Transitions to `surface_container_high` on hover.

### Cards & Lists
*   **Rule:** Zero dividers. Use vertical spacing (`2rem` or `32px`) to separate list items.
*   **Interactive Cards:** Use `surface_container_lowest` (#ffffff). On hover, do not change the border; instead, slightly shift the background to `surface_bright` and increase the ambient shadow depth.

### Input Fields
*   **State:** Default background should be `surface_container_low`. 
*   **Focus State:** Transition background to `surface_container_lowest` and apply a 2px "Ghost Border" using the `primary` token at 40% opacity.

### Navigation (Sidebar)
*   **Surface:** `inverse_surface` (#283044).
*   **Active State:** Use a "Pill" indicator in `primary` (#0058bc) but keep the background of the menu item transparent. The contrast between the navy sidebar and the white content area is the primary navigation cue.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use whitespace as a functional tool. If a section feels crowded, double the padding instead of adding a divider.
*   **DO** use `tertiary` (#006947) for success states sparingly. It should feel like a jewel-tone accent, not a primary theme.
*   **DO** ensure all "sharp" corners use the `xl` (12px) radius for containers and `lg` (8px) for inner components (buttons/inputs) to create a nested geometric harmony.

### Don’t
*   **DON'T** use pure black (#000000). Use `on_surface` (#131b2e) for all "black" text to maintain the navy tonal consistency.
*   **DON'T** use standard 1px borders to separate the header from the body. Use a subtle `surface_container_low` strip or a backdrop-blur transition.
*   **DON'T** use center-alignment for B2B layouts. Stick to a rigorous left-aligned editorial grid to reinforce the feeling of a professional tool.