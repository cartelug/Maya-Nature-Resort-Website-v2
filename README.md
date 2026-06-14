# Maya Nature Resort — Website v2

A premium, conversion-focused, mobile-first website for Maya Nature Resort.
Built as a properly-engineered multi-file project — no inline base64, no monolithic
HTML, no specificity wars.

## Structure

```
maya-resort-website/
├── index.html                 # Semantic HTML5 entry point
├── assets/
│   ├── fonts/                 # Fraunces + Inter (woff2, 12 weights/styles)
│   ├── img/
│   │   ├── logo.jpg           # Resort logo
│   │   ├── favicon.svg        # Tab icon
│   │   ├── hero-sunhill.jpg   # Hero: Sun Hill view to Kampala
│   │   ├── event-heart.jpg    # Events feature: heart installation
│   │   └── wildlife-vervet.jpg# Experiences: vervet monkeys
├── css/
│   ├── fonts.css              # @font-face declarations
│   ├── tokens.css             # Design tokens (colors, type, spacing, motion)
│   ├── base.css               # Reset, accessibility, focus states
│   ├── layout.css             # Containers, grid utilities
│   ├── components.css         # Buttons, eyebrows, fields, cards
│   ├── nav.css                # Top nav + mobile drawer
│   ├── hero.css               # Hero composition
│   └── sections.css           # All page section styles
└── js/
    ├── main.js                # Entry point — imports all modules
    ├── nav.js                 # Scroll state + mobile menu
    ├── hero.js                # Procedural sun ornament + parallax
    ├── fountain.js            # Animated water jets + light particles
    ├── reveal.js              # IntersectionObserver scroll reveals
    ├── counters.js            # Animated number counters
    ├── booking.js             # Form validation + WhatsApp deep link
    └── scrollfx.js            # Back-to-top button
```

## Running locally

The site is fully static — no build step. Open via any local server:

```bash
# Python
python3 -m http.server 8000

# Or Node
npx serve .
```

Then visit `http://localhost:8000`.

> The site uses ES modules, which require a server (not `file://`).

## Brand

- **Green:** `#3F884A` (primary), `#1F5228` (deep)
- **Gold:**  `#EAC059` (sun dots), `#DFB23B` (script)
- **Fonts:** Fraunces (display, with italic), Inter (body)
- **Tagline:** *Where the sun rises and sets*

## Conversion path

The Book / WhatsApp flow is the primary conversion mechanic:
- Every `Book This Room` button pre-fills the form and opens WhatsApp
- The form composes a structured message to `+256 704 602 520`
- A floating WhatsApp button is visible on every page
- A sticky mobile booking bar appears on small screens

## Accessibility

- Skip link to main content
- Semantic HTML5 (`header`, `nav`, `main`, `section`, `article`, `figure`, `blockquote`)
- ARIA labels on icon-only buttons and ornamental elements
- Focus-visible outlines (gold, 3px offset)
- `prefers-reduced-motion` respected — all animations disabled
- Keyboard navigation: ESC closes mobile menu, focus returns to burger

## Next steps

Drop real photos into `assets/img/` to replace the gradient scenes:
- Dancing fountain at night → swap into `.fountain__stage` background
- Msizi cottage interiors → swap `scene-forest`, `scene-honey` etc.
- Pool, Bulangiti Hall full, Ropes Bar at dusk → gallery + events
