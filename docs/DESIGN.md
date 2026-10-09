# Roamly — Design System

---

## 1. Current Theme (as of Phase 0 — White & Warm Orange)

This is the **live theme today**. Do not restyle until Phase 8.

### Color Tokens (CSS variables in `frontend/src/index.css`)

| Token | Value | Usage |
|---|---|---|
| `--accent` | `#F97316` | Primary CTA, active chips, FAB |
| `--accent-light` | `#FDBA74` | Focus borders, hover tints |
| `--accent-dark` | `#EA580C` | Hover state on primary buttons |
| `--accent-bg` | `#FFF7ED` | Active tab background, user chat bubble |
| `--accent-bg-hover` | `#FFEDD5` | Chip hover fill |
| `--bg` | `#F8FAFC` | Page backdrop |
| `--bg-card` | `#FFFFFF` | Card and drawer background |
| `--bg-card-hover` | `#F8FAFC` | Card hover state |
| `--bg-surface` | `#FFFFFF` | Surface elements |
| `--bg-input` | `#FFFFFF` | Input fields |
| `--border` | `#E2E8F0` | Default divider |
| `--border-light` | `#F1F5F9` | Subtle divider |
| `--text` | `#0F172A` | Primary text |
| `--text-secondary` | `#475569` | Secondary/metadata text |
| `--text-muted` | `#94A3B8` | Placeholders, helper text |
| `--radius` | `16px` | Card/modal radius |
| `--radius-sm` | `12px` | Button/chip radius |
| `--radius-full` | `9999px` | Pill radius |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Card shadow |
| `--shadow-md` | `0 4px 6px -1px …` | Hover shadow |
| `--shadow-lg` | `0 10px 15px -3px …` | Modal/drawer shadow |
| `--ease` | `cubic-bezier(0.4,0,0.2,1)` | All transitions |

### Category Colors (current)

| Category | Color | Token |
|---|---|---|
| historical | `#D97706` (Amber) | `--cat-historical` |
| attraction | `#7C3AED` (Violet) | `--cat-attraction` |
| restaurant | `#DC2626` (Red) | `--cat-restaurant` |
| cafe | `#059669` (Emerald) | `--cat-cafe` |
| hotel | `#DB2777` (Pink) | `--cat-hotel` |

### Typography (current)
- **Font**: Inter (Google Fonts CDN in `index.html`)
- **Body**: `font-size: 16px`, `line-height: 1.6`
- **Headings**: heavier Inter weights (600, 700)
- **Target font (Phase 8)**: Space Grotesk or Poppins for headings, keep Inter for body

### Existing UI Patterns
- **Skeleton loaders**: shimmer animation (`shimmer` keyframe, `background-image: linear-gradient`)
- **Pulse marker**: CSS `::before`/`::after` on `.user-marker` divIcon with `pulse-ring` keyframe
- **Tab nav**: horizontal scrollable, `active` = orange bg + text
- **Chips**: pill shape, orange when active
- **FAB**: fixed bottom-right, orange with `box-shadow` glow
- **Location bar**: sticky top, frosted glass effect (backdrop-filter: blur)
- **Drawer**: slide from right, overlay with backdrop blur
- **Toast**: fixed center-top, dark slate pill

---

## 2. Target Theme (Phase 8 — Dark Navy + Violet-Cyan-Pink)

**Do NOT implement until Phase 8 and user approval.**

### Concept
- "Night-out glow" — glassmorphism, soft gradients, smooth micro-interactions
- Dark by default, light mode toggle

### Target Color Palette

| Token | Dark Value | Light Value | Usage |
|---|---|---|---|
| `--bg-base` | `#0B1020` | `#F8FAFC` | Page background |
| `--bg-card` | `rgba(255,255,255,0.05)` | `#FFFFFF` | Glass card |
| `--bg-card-border` | `rgba(255,255,255,0.1)` | `#E2E8F0` | Card border |
| `--accent-gradient` | `linear-gradient(135deg, #7C3AED, #06B6D4, #EC4899)` | — | Logo, CTAs |
| `--accent-violet` | `#7C3AED` | `#6D28D9` | Primary |
| `--accent-cyan` | `#06B6D4` | `#0891B2` | Secondary |
| `--accent-pink` | `#EC4899` | `#DB2777` | Accent |
| `--safe` | `#22C55E` | `#16A34A` | Safe indicators |
| `--caution` | `#F59E0B` | `#D97706` | Caution indicators |
| `--danger` | `#EF4444` | `#DC2626` | Danger indicators |
| `--text` | `#F1F5F9` | `#0F172A` | Primary text |
| `--text-secondary` | `#94A3B8` | `#475569` | Secondary text |

### Target Typography (Phase 8)
- **Headings**: Space Grotesk or Poppins (Google Fonts)
- **Body**: Inter (keep)
- **Weights**: heading 600/700, body 400/500

### Target UI Patterns (Phase 8)
- **Glass cards**: `backdrop-filter: blur(12px)`, translucent bg, subtle border
- **Gradient accents**: violet → cyan → pink on CTAs, logo, active states
- **Hover glow**: `box-shadow: 0 0 20px rgba(124,58,237,0.3)`
- **Framer Motion**: tab transitions (slide/fade), card entrance (stagger), drawer (spring)
- **Map tiles dark**: CartoDB dark tiles in dark mode (`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`)
- **Mobile bottom nav**: 4 icons (Explore, Map, AI, More)

---

## 3. Category Config (Single Source of Truth)

Defined in `frontend/src/config/categories.js`. All components import from here.

| Key | Label | Emoji | Color |
|---|---|---|---|
| `''` | All | 🌐 | — |
| `historical` | Historical | 🏛️ | #D97706 |
| `attraction` | Attractions | 🎯 | #7C3AED |
| `restaurant` | Food | 🍽️ | #DC2626 |
| `cafe` | Cafes | ☕ | #059669 |
| `hotel` | Hotels | 🏨 | #DB2777 |
| `park` | Parks | 🌿 | #16A34A |

---

## 4. Map Styling

### Current Markers
- **User location**: CSS `divIcon` with `.user-marker` class, animated pulse ring in orange `#F97316`
- **Place markers**: `CircleMarker`, color from category, radius 8, fillOpacity 0.8, weight 2

### Current Tiles
- OpenStreetMap: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`

### Target Tiles (Phase 8, dark theme)
- Dark mode: CartoDB: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
- Keep OSM for light mode

---

## 5. Page ASCII Wireframes

### Explore Tab
```
┌─────────────────────────────────────────────────────┐
│ 🔍 [Searching near: Pune, Maharashtra]  [Change] [GPS]│ ← sticky location bar
├─────────────────────────────────────────────────────┤
│ 🗺️ Roamly                               ☁️ 28°C     │ ← navbar
├─────────────────────────────────────────────────────┤
│ [Explore] [Map] [AI] [Compare]                       │ ← tab nav
├─────────────────────────────────────────────────────┤
│ 🔍 [Search places...]                                │
│ [All] [🏛️ Historical] [🎯 Attractions] [🍽️ Food]...  │ ← category chips
│ Radius: [1km] [3km] [5km✓] [10km]  Budget: [  ] ⭐  │ ← filters
├─────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Shaniwar Wada│ │ German Bakery│ │ Dagdusheth   │ │ ← place cards
│ │ 🏛️ Historical │ │ ☕ Cafe       │ │ 🎯 Attraction │ │
│ │ 📍 1.2km     │ │ 📍 3.1km     │ │ 📍 0.8km     │ │
│ │ ₹25  ⭐4.4   │ │ ₹400 ⭐4.1  │ │ Free ⭐4.7   │ │
│ │ [Demo data]  │ │ [Demo data]  │ │ [Demo data]  │ │
│ │ □ Compare    │ │ □ Compare    │ │ □ Compare    │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Place Details Drawer
```
                              ┌──────────────────────┐
                              │ Shaniwar Wada    [✕] │
                              │ 🏛️ historical [Demo] │
                              ├──────────────────────┤
                              │ DESCRIPTION          │
                              │ 7-story fort...      │
                              │                      │
                              │ PRICE                │
                              │ ₹25 (Entry fee)      │
                              │                      │
                              │ RATING               │
                              │ ⭐ 4.4               │
                              │                      │
                              │ HOURS                │
                              │ 08:00 AM – 06:30 PM  │
                              │                      │
                              │ ┌──────────────────┐ │
                              │ │ Source: Seed data│ │ ← metadata box
                              │ │ Verified: ..date │ │
                              │ └──────────────────┘ │
                              ├──────────────────────┤
                              │ [🧭 Directions] [Save]│
                              └──────────────────────┘
```
