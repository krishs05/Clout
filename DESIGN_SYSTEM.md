# Clout — Brand, Design System & Colour Scheme

Use this document as a prompt or reference to recreate the Clout website (landing + dashboard) with consistent brand, layout, and styling.

---

## 1. Brand Identity

**Product:** Clout — Premium self-hosted Discord bot (karma, economy, moderation, music, analytics).

**Tone:** Premium, modern, community-focused. Clean and professional, not playful or cartoon. “Built for communities that value quality.”

**Logo concept:** Crown motif — a crown/ring with a central orb and peaks. Represents reputation (“clout”), leadership, and community status. Used as 3D hero asset (Three.js) and flat SVG icon in nav/footer.

**Tagline / hero:** “Build Community Clout” — with “Community” as the gradient-highlighted word.

---

## 2. SVG Logo (Icon)

The **LogoIcon** is a 48×48 crown motif used in nav, footer, and favicon. Use the same structure and colours when recreating.

### 2.1 Specs

| Property | Value |
|----------|--------|
| **viewBox** | `0 0 48 48` |
| **Aspect** | 1:1 (square) |
| **Gradient** | Linear `#818cf8` → `#38bdf8` (indigo-400 → sky-400), diagonal top-left to bottom-right |

### 2.2 Elements (top to bottom in doc order)

1. **Ground shadow** — Ellipse at bottom: `cx="24" cy="40" rx="14" ry="2"`, fill `#818cf8` at 15% opacity, with subtle glow filter.
2. **Main crown path** — Central zigzag crown: points (12,34) → (16,16) → (24,24) → (32,16) → (36,34) closed. Fill gradient at 10% opacity, stroke gradient 2.5px, round join, glow filter.
3. **Left wing** — Triangle (16,34)–(8,22)–(16,26). Fill 20%, stroke 1.5px gradient.
4. **Right wing** — Triangle (32,34)–(40,22)–(32,26). Same as left.
5. **Orbs (stars)** — Five circles, fill `#e0e7ff` (indigo-100): center (24,20) r=2.5; (16,12) and (32,12) r=2; (8,18) and (40,18) r=1.5 at 80% opacity.
6. **Base ring** — Curved stroke along bottom: bezier from (12,34) to (36,34) with control for curve, stroke gradient 2.5px, round cap.

### 2.3 Definitions

- **linearGradient** `id="primaryGrad"`: x1,y1="0,0" x2,y2="48,48"; stop at 0% `#818cf8`, stop at 100% `#38bdf8`.
- **filter** `id="subtleGlow"`: feGaussianBlur stdDeviation="3", feComposite to overlay blur with source (soft glow).

### 2.4 Full SVG markup (copy-paste)

```svg
<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="primaryGrad" x1="0" y1="0" x2="48" y2="48">
      <stop offset="0%" stop-color="#818cf8" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>
    <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Ground reflection / shadow -->
  <ellipse cx="24" cy="40" rx="14" ry="2" fill="#818cf8" opacity="0.15" filter="url(#subtleGlow)" />
  <!-- Main crown -->
  <path d="M12 34 L16 16 L24 24 L32 16 L36 34 Z" fill="url(#primaryGrad)" fill-opacity="0.1" stroke="url(#primaryGrad)" stroke-width="2.5" stroke-linejoin="round" filter="url(#subtleGlow)" />
  <!-- Left wing -->
  <path d="M16 34 L8 22 L16 26 Z" fill="url(#primaryGrad)" fill-opacity="0.2" stroke="url(#primaryGrad)" stroke-width="1.5" stroke-linejoin="round" />
  <!-- Right wing -->
  <path d="M32 34 L40 22 L32 26 Z" fill="url(#primaryGrad)" fill-opacity="0.2" stroke="url(#primaryGrad)" stroke-width="1.5" stroke-linejoin="round" />
  <!-- Orbs above peaks -->
  <circle cx="16" cy="12" r="2" fill="#e0e7ff" />
  <circle cx="24" cy="20" r="2.5" fill="#e0e7ff" />
  <circle cx="32" cy="12" r="2" fill="#e0e7ff" />
  <circle cx="8" cy="18" r="1.5" fill="#e0e7ff" opacity="0.8" />
  <circle cx="40" cy="18" r="1.5" fill="#e0e7ff" opacity="0.8" />
  <!-- Base ring -->
  <path d="M12 34 C12 36 36 36 36 34" stroke="url(#primaryGrad)" stroke-width="2.5" stroke-linecap="round" />
</svg>
```

**Note:** In React/JSX use `stopColor`, `fillOpacity`, `strokeWidth`, `strokeLinejoin`, `strokeLinecap` (camelCase). For standalone SVG (favicon, img, or HTML) use the lowercase attributes as above.

---

## 3. Colour Scheme

### 3.1 Base (Dark theme — primary experience)

| Role | Hex | Usage |
|------|-----|--------|
| **Background** | `#0a0a0b` | Page and app background |
| **Foreground** | `#fafafa` | Primary text |
| **Card / elevated surface** | `#141416` | Cards, sheets, popovers |
| **Border (default)** | `#27272a` (zinc-800) | Borders, dividers |
| **Muted text** | `#a1a1aa` (zinc-400) | Descriptions, labels, secondary copy |
| **Muted text (softer)** | `#71717a` (zinc-500) | Tertiary, hints |

### 3.2 Primary accent (brand)

| Role | Hex | Tailwind | Usage |
|------|-----|----------|--------|
| **Primary** | `#6366f1` | indigo-500 | CTAs, primary buttons, links, active states |
| **Primary hover** | `#4f46e5` | indigo-600 | Button hover, shimmer |
| **Primary light** | `#818cf8` | indigo-400 | Icons, highlights, chart line |
| **Primary tint (bg)** | `rgba(99, 102, 241, 0.1)` | indigo-500/10 | Badges, active nav, subtle fills |
| **Primary border** | `rgba(99, 102, 241, 0.2)` | indigo-500/20 | Active borders, focus rings |

### 3.3 Secondary accents (semantic & feature)

| Role | Hex | Tailwind | Usage |
|------|-----|----------|--------|
| **Violet** | `#8b5cf6` | violet-500 | Secondary accent, charts, some icons |
| **Sky** | `#0ea5e9` / `#38bdf8` | sky-500 / sky-400 | Accent in hero gradient, docs/support |
| **Emerald** | `#10b981` / `#34d399` | emerald-500 / emerald-400 | Success, online, good deeds, start |
| **Amber** | `#f59e0b` / `#fbbf24` | amber-500 / amber-400 | Warning, coins, quick actions, restart |
| **Red** | `#ef4444` / `#f87171` | red-500 / red-400 | Destructive, offline, stop, bad deeds |
| **Pink** | `#ec4899` / `#f472b6` | pink-500 / pink-400 | Music/fun feature, optional highlight |

### 3.4 Glass & overlays

| Role | Value | Usage |
|------|--------|--------|
| **Glass panel** | `bg-white/[0.02]` + `backdrop-blur-xl` + `border border-white/[0.05]` | Cards, panels |
| **Glass strong (nav)** | `bg-[#0a0a0b]/90` + `backdrop-blur-2xl` + `border-b border-white/[0.05]` | Navbar, header, sticky bars |
| **Inner highlight** | `inset 0 1px 0 0 rgba(255,255,255,0.03)` | Top edge of cards |
| **Input/surface** | `bg-white/[0.03]`, `border-white/[0.06]` | Inputs, nested blocks |
| **Hover surface** | `hover:bg-white/[0.05]` or `hover:bg-white/[0.08]` | Rows, list items |

### 3.5 Light theme (optional)

- **Background:** `#fafafa`
- **Foreground:** `#0a0a0b`
- **Card:** `#ffffff`
- **Border:** `#e4e4e7`
- **Primary:** same `#6366f1`
- **Muted:** `#71717a`

---

## 4. Typography

- **Fonts:** Geist Sans (UI), Geist Mono (code).
- **Weights:** Regular body; **Semibold (600)** for headings and card titles; **Medium (500)** for labels and emphasis.
- **Scale:**
  - Hero: `text-5xl`–`text-7xl`, `font-semibold`, `tracking-tight`
  - Section title: `text-4xl`–`text-5xl`, `font-semibold`
  - Card title: `text-xl`–`text-2xl`, `font-semibold`
  - Body: `text-base` or `text-sm`
  - Small / captions: `text-xs`, `text-zinc-500`
- **Line height:** Relaxed for body (`leading-relaxed`); tight for headings (`leading-none` / `tracking-tight`).

---

## 5. Layout & Spacing

- **Max width:** `max-w-7xl` for main content; `max-w-4xl` for narrow (e.g. CTA).
- **Padding:** `px-4 sm:px-6 lg:px-8` on containers; `p-4 md:p-8` for page content; `p-6` on cards.
- **Gaps:** `gap-4`, `gap-6` between elements; `space-y-6` / `space-y-8` for vertical stacks.
- **Grids:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` or `lg:grid-cols-4` for stats/cards.
- **Dashboard sidebar:** `w-64`, fixed left; main content `lg:ml-64`.

---

## 6. Components & Patterns

### 6.1 Cards

- **Base:** Rounded `rounded-xl` (or `rounded-2xl` for hero/CTA). Border `border-white/[0.06]` (dark).
- **Style:** `glass` + `inner-glow`; optional `BorderBeam` on key cards (e.g. Bot Controls).
- **Content:** `CardHeader` (title + description), `CardContent`; title `text-white`, description `text-zinc-500`.

### 6.2 Buttons

- **Primary:** `bg-indigo-600 hover:bg-indigo-500` (or `indigo-700` for hover), `text-white`, no border or `border-0`.
- **Secondary/outline:** `border border-zinc-700` or `border-white/[0.1]`, `text-zinc-300`, `hover:bg-white/[0.03]`, `bg-transparent`.
- **Semantic:** Emerald for “Start”, red for “Stop”, amber for “Restart”; use tinted backgrounds (e.g. `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`).
- **Size:** Default `h-9`; large CTAs `h-12 px-8`.

### 6.3 Badges & status

- **Badge:** Small pill; e.g. `bg-indigo-500/10 text-indigo-300 border-indigo-500/20`.
- **Status (online):** `bg-emerald-500/10 text-emerald-400 border-emerald-500/20` + small dot `bg-emerald-400 animate-pulse`.
- **Status (offline):** `bg-red-500/10 text-red-400 border-red-500/20`.

### 6.4 Navigation

- **Bar:** Sticky, `glass-strong`, full width.
- **Nav item (inactive):** `text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]`, `rounded-lg`.
- **Nav item (active):** `bg-indigo-500/10 text-indigo-300 border border-indigo-500/20`, `rounded-xl`.
- **Logo + wordmark:** Logo icon left, “Clout” `text-xl font-semibold text-white`.

### 6.5 Dashboard sidebar

- Same glass style as nav; items with icon + label; active state as above.
- Footer block: separator `bg-white/[0.06]`, avatar, username `text-zinc-200`, “Logged in” `text-zinc-500`, Sign out `text-zinc-400 hover:text-red-400 hover:bg-red-500/10`.

### 6.6 Inputs & forms

- **Input/textarea:** `bg-white/[0.03] border-white/[0.06] text-zinc-200`, rounded (e.g. default input radius).
- **Label:** `text-zinc-400` or `text-sm text-zinc-200`.

### 6.7 Empty states

- Centered layout; large icon in circle (`bg-white/[0.02] border border-white/[0.05]`) with optional soft glow (`bg-indigo-500/20 blur-xl`).
- Title `text-2xl font-bold text-white`, body `text-zinc-400`, primary CTA indigo, secondary outline.

---

## 7. Motion & Effects

- **Page/panel:** Framer Motion; enter `opacity 0 → 1`, `y: 10 → 0`; exit reverse; duration ~0.2s.
- **Hero:** Staggered fade/translate; scroll-based opacity/scale on hero block.
- **Cards:** Optional hover lift (`translateY(-2px)`) and shadow; `MagicCard` with subtle gradient follow (mouse-based) and `gradientColor` e.g. `rgba(255,255,255,0.05)`.
- **BorderBeam:** Animated gradient border on selected cards; size ~250, duration ~12s, delay ~9s.
- **Loading:** Spinner `border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin`.

---

## 8. Backgrounds

- **Base:** Solid `#0a0a0b`.
- **Optional:** Very subtle grid (e.g. FlickeringGrid) with low opacity (~0.12) and purple/gray; or dot grid `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`, size 40px.
- **Ambient:** Soft blurs (e.g. `bg-indigo-500/[0.03]`, `bg-sky-500/[0.02]`) for depth, no strong gradients.

---

## 9. Iconography

- **Library:** Lucide React; size `w-5 h-5` for nav/list, `w-6 h-6` for feature blocks.
- **Colour:** Match context — indigo for primary/nav, emerald/red/amber for status, violet/sky/amber for feature blocks.

---

## 10. Dashboard-Specific Summary

- **Layout:** Fixed sidebar (64) + main; sticky header with title, user greeting, theme toggle, bot status pill.
- **Tabs:** Overview, Servers, Embed Editor, Commands, Analytics; content switches with AnimatePresence.
- **Overview:** Welcome banner (when bot offline) with indigo gradient blurs; 4 stat cards (MagicCard + NumberTicker); Bot Controls card (BorderBeam when online) + Quick Actions grid; Your Reputation (good/bad/coins in emerald/red/amber boxes); Machine Status list.
- **Cards:** Consistently `glass border-white/[0.06] inner-glow`; section titles with coloured icon (indigo, amber, violet, etc.).

---

## 11. One-Paragraph Prompt for Remaking the Site

**Clout** is a premium self-hosted Discord bot product. The site uses a **dark theme** with background `#0a0a0b`, **glassmorphism** panels (`bg-white/[0.02]`, `backdrop-blur-xl`, borders `white/5–10%`), and **indigo primary** (`#6366f1`) for CTAs and active states. Typography is **Geist Sans** with semibold headings and zinc for muted text. Cards are rounded-xl with inner top highlight; key cards use a subtle **BorderBeam** and optional **MagicCard** mouse-follow glow. Accent colours: **emerald** (success/online), **red** (destructive/offline), **amber** (warning/coins), **violet/sky** for secondary accents. The **logo** is a crown-with-orb motif (3D on landing, SVG in nav). Layout: max-w-7xl, generous padding and gap-6, dashboard with fixed 64-sidebar and sticky header. Buttons: solid indigo primary, outline ghost secondary; status pills use tinted semantic colours. Keep motion minimal (short fade/slide, optional hover lift). Empty states: centered icon, bold title, muted body, indigo CTA. The result should feel **premium, clean, and community-focused**, not playful or generic SaaS.

---

*Generated from the Clout codebase (landing page, dashboard, globals.css, and UI components). Use this file as a single source of truth for brand, design system, and colour scheme when remaking or redesigning the website.*
