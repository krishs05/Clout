# Clout Website Redesign — Critique & Prompt

Use this document to guide a full redesign of the Clout landing page into a professional, tech-focused website that strictly adheres to `DESIGN_SYSTEM.md`.

---

## 1. Frontend Critique

### 1.1 What Works (Aligned with DESIGN_SYSTEM.md)

| Element | Status | Notes |
|--------|--------|-------|
| **Dark theme** | ✓ | Background `#0a0a0b` is correct |
| **Glassmorphism** | ✓ | `.glass` and `.glass-strong` used on nav and cards |
| **Indigo primary** | ✓ | CTAs use `indigo-600` |
| **Typography** | ✓ | Geist Sans, semibold headings, zinc muted text |
| **Logo** | ✓ | Crown motif (LogoIcon, Logo3D) present |
| **Hero tagline** | ✓ | "Build Community Clout" with gradient on "Community" |
| **Card structure** | ✓ | MagicCard, rounded-xl, inner-glow |
| **Semantic accents** | ✓ | Emerald/amber/red/violet for features |

### 1.2 Gaps & Issues

#### Navigation
- **Current:** Features, Benefits, GitHub — minimal, no Docs, Gallery, Contact
- **Issue:** Screenshots show FEATURES/GALLERY/DOCS/CONTACT with pill-style nav; current code lacks Gallery, Docs, Contact
- **Icon mismatch:** Music note for Contact is confusing for a tech site — use Mail, MessageCircle, or similar
- **Design system:** Nav should use `glass-strong`, inactive items `text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]`, active `bg-indigo-500/10 text-indigo-300 border-indigo-500/20`

#### Layout & Content Depth
- **Single-product focus:** Landing is hero → features → benefits → CTA — feels like a product page, not a "full tech website"
- **Missing sections:** No Gallery, Docs, Deploy/Get Started, About, Contact, Resources
- **Footer:** Minimal (Privacy, Terms, Support). No Resources, Connect, Newsletter, or social links

#### Visual Consistency
- **Light blue section:** If "Deploy in Minutes" uses a light blue background, it breaks the dark theme (`#0a0a0a`–`#1a1a1a`). All sections must stay in dark range
- **Background numbers:** Large faded "01, 02, 03, 04" or "ALBUM 02 / 04" — consider "SECTION" or "FEATURE" for a more professional tech tone
- **Abstract shapes:** Large "JAL RR" or similar background text — remove or make purposeful (e.g., subtle "CLOUT" watermark)

#### Card & Component Polish
- **Feature cards:** Already use MagicCard + glass; ensure `border-white/[0.06]` per design system
- **Deploy steps:** Use `.glass` for step cards; avoid bright green "Ready" tags — use `bg-emerald-500/10 text-emerald-400 border-emerald-500/20` for subtlety
- **Buttons:** Primary: `bg-indigo-600 hover:bg-indigo-500`; secondary: `border-zinc-700 text-zinc-300 hover:bg-white/[0.03]`

#### Typography & Spacing
- **Hierarchy:** Good overall; ensure section titles use `text-4xl`–`text-5xl`, card titles `text-xl`–`text-2xl`
- **Spacing:** `max-w-7xl`, `px-4 sm:px-6 lg:px-8`, `gap-6`, `space-y-8` for vertical stacks

#### Motion & Effects
- **Hero:** Scroll-based opacity/scale is good
- **Cards:** Optional hover lift `translateY(-2px)`; MagicCard with subtle gradient follow
- **BorderBeam:** Use on key CTA and Bot Controls cards

#### Dashboard & Discord Sign-In
- **Landing → Dashboard:** No visible "Dashboard" link on landing for returning users. Add "Dashboard" nav item when user has `clout_token` in localStorage, or always show it and redirect to dashboard if already logged in.
- **Sign-in prominence:** "Sign In" and "Get Started" exist but may not be prominent enough. Ensure primary CTA is "Login with Discord" or "Get Started" with clear Discord branding (icon, copy).
- **Auth flow visibility:** Landing should explain the flow: "Sign in with Discord to access your dashboard." Add a dedicated "Dashboard" link in nav that either (a) goes to `/dashboard` (redirects to login if unauthenticated) or (b) shows "Dashboard" only when logged in.
- **Post-login redirect:** Auth callback at `/auth/callback` stores token and redirects to `/dashboard`. Ensure error states (`?error=auth_failed`, `?error=no_token`) are handled on landing with user-friendly messages.

---

## 2. Redesign Prompt (Copy-Paste Ready)

Use this prompt when instructing an AI or developer to redesign the Clout landing page:

---

**Prompt:**

> Transform the Clout landing page into a **full, professional tech-related website** that strictly adheres to `DESIGN_SYSTEM.md`. The goal is a **clean, premium, community-focused** aesthetic — not playful or generic SaaS.
>
> ### Design System Compliance
>
> - **Background:** Solid `#0a0a0b` everywhere. No light sections (e.g., no light blue backgrounds). Use subtle ambient blurs (`bg-indigo-500/[0.03]`, `bg-sky-500/[0.02]`) for depth only.
> - **Glass:** `bg-white/[0.02]` + `backdrop-blur-xl` + `border border-white/[0.05]` for cards; `glass-strong` for nav.
> - **Primary:** Indigo `#6366f1` for CTAs, active states, links. Primary buttons: `bg-indigo-600 hover:bg-indigo-500`.
> - **Typography:** Geist Sans (UI), Geist Mono (code). Hero: `text-5xl`–`text-7xl`, section titles: `text-4xl`–`text-5xl`, card titles: `text-xl`–`text-2xl`. Muted: `text-zinc-400` or `text-zinc-500`.
> - **Cards:** `rounded-xl` (or `rounded-2xl` for hero/CTA), `border-white/[0.06]`, `inner-glow`, optional `BorderBeam` on key cards.
> - **Semantic accents:** Emerald (success/online), red (destructive/offline), amber (warning/coins), violet/sky for secondary.
> - **Logo:** Crown motif in nav (SVG) and hero (3D via Three.js). Tagline: "Build Community Clout" with gradient on "Community".
>
> ### Navigation
>
> - Sticky nav with `glass-strong`. Logo + "Clout" left; nav items: **Features**, **Gallery**, **Docs**, **Contact**.
> - Inactive: `text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] rounded-lg`.
> - Active: `bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-xl`.
> - Icons: Use appropriate Lucide icons (e.g., FileText for Docs, Mail for Contact — not generic).
> - Right: **Sign In** (ghost), **Get Started** (primary indigo). When user is logged in (has `clout_token`), show **Dashboard** link instead of Sign In, and **Get Started** can become "Open Dashboard".
>
> ### Dashboard & Discord Sign-In (Required)
>
> - **Prominent Discord auth:** Primary CTA must be "Login with Discord" or "Get Started" — clearly indicate Discord OAuth. Use Discord brand color (`#5865F2`) sparingly for the login button icon or accent if desired, or keep indigo per design system.
> - **Dashboard access:** Add "Dashboard" to the nav. If user has valid token in localStorage, show "Dashboard" (links to `/dashboard`) and optionally "Sign Out". If not logged in, "Dashboard" link goes to `/dashboard` — the dashboard page redirects to `/` when no token.
> - **Auth flow:** Landing → Discord OAuth → API callback → Frontend `/auth/callback?token=...` → store token → redirect to `/dashboard`. Ensure landing page uses correct `NEXT_PUBLIC_DISCORD_CLIENT_ID` and `NEXT_PUBLIC_DISCORD_REDIRECT_URI` (API callback URL, e.g. `http://localhost:3001/auth/callback`).
> - **Error handling:** If user lands on `/` with `?error=auth_failed` or `?error=no_token`, show a subtle toast or inline message: "Sign-in failed. Please try again."
> - **Dashboard page:** Must exist at `/dashboard` with sidebar (Overview, Servers, Embed Editor, Commands, Analytics), user avatar, "Logged in", Sign Out. Protected route: redirect to `/` if no token.
>
> ### Page Sections (Required)
>
> 1. **Hero** — "Build Community Clout", tagline, "Add to Discord" + "Explore Features" CTAs, 3D logo, benefits checklist.
> 2. **Features** — Grid of 6 feature cards (Karma, Economy, Moderation, Music, Dashboard, Customization). Use MagicCard + glass, icon + title + description. Optional horizontal scroll for feature categories (Karma, Economy, Moderation, Music, Analytics, Custom Commands, Leveling, Self-Hosted).
> 3. **Showcase** — "See Clout in Action" with 4 feature blocks (Karma, Economy, Moderation, Music). Each: large faded number (01–04), subtle 3D/abstract graphic, subtitle "Reputation Tracking" / "Virtual Currency" (etc.), main title. Use card-based layout with `rounded-xl` and soft shadows.
> 4. **Deploy / Get Started** — "Deploy in Minutes" with steps. Dark theme only. No light blue. Three step cards: GitHub, Environment, Docker. Each: icon, title, description, "View Docs" button. Use `.glass` for cards. Status indicators: subtle `bg-emerald-500/10 text-emerald-400` if needed.
> 5. **Self-Hosted Benefits** — Keep existing expandable section. Ensure "Why Clout?" and benefits list use design system colors.
> 6. **CTA** — "Ready to elevate your community?" with BorderBeam, primary + secondary buttons.
> 7. **Footer** — Four columns: (1) Clout description + social links, (2) Resources (Documentation, GitHub, Docker Hub, Discord Support), (3) Connect (Email, Discord, GitHub), (4) Get Updates (newsletter + Subscribe). Use `bg-white/[0.02]` or similar for footer blocks; no strong gradients.
>
> ### Visual Polish
>
> - Remove or repurpose large background text (e.g., "JAL RR").
> - Use "SECTION 01 / 04" or "FEATURE 01 / 04" instead of "ALBUM" for tech tone.
> - FlickeringGrid or dot grid background: low opacity (~0.12), purple/gray.
> - Ensure all interactive elements have consistent hover states (e.g., `hover:bg-white/[0.05]`).
> - Smooth transitions: Framer Motion for enter/exit; duration ~0.2s. Optional hover lift on cards.
>
> ### Content Tone
>
> Professional, premium, community-focused. "Built for communities that value quality." Avoid playful or cartoon-like language.
>
> ### Deliverables
>
> - Updated `apps/web/app/page.tsx` with all sections.
> - Updated `apps/web/app/globals.css` if new utilities needed.
> - Ensure `DESIGN_SYSTEM.md` is the single source of truth for colors, spacing, and components.

---

## 3. Quick Checklist

### Landing & Design
- [ ] Background `#0a0a0b` everywhere. No light sections.
- [ ] Nav: Features, Gallery, Docs, Contact with correct icons.
- [ ] Hero: "Build Community Clout", tagline, CTAs, 3D logo.
- [ ] Features: 6-card grid with MagicCard + glass.
- [ ] Showcase: "See Clout in Action" with 4 feature blocks.
- [ ] Deploy: "Deploy in Minutes" with 3 step cards, dark theme.
- [ ] Self-hosted benefits section preserved.
- [ ] CTA section with BorderBeam.
- [ ] Footer: 4 columns (description, Resources, Connect, Get Updates).
- [ ] All cards use `rounded-xl`, `border-white/[0.06]`, `inner-glow`.
- [ ] Primary buttons: `bg-indigo-600 hover:bg-indigo-500`.
- [ ] Secondary buttons: `border-zinc-700 text-zinc-300 hover:bg-white/[0.03]`

### Dashboard & Auth
- [ ] "Dashboard" link in nav — goes to `/dashboard`; show "Sign Out" when logged in.
- [ ] "Login with Discord" / "Get Started" as primary CTA; Discord OAuth flow works.
- [ ] Auth callback at `/auth/callback` stores token, redirects to `/dashboard`.
- [ ] Dashboard at `/dashboard` with Overview, Servers, Embed Editor, Commands, Analytics.
- [ ] Dashboard protected: redirect to `/` if no `clout_token`.
- [ ] Error states (`?error=auth_failed`) shown on landing when auth fails.

---

## 4. Standalone Prompts (Use When Fixing Specific Areas)

### 4.1 Dashboard & Discord Sign-In Prompt

> Add or fix **Dashboard** and **Discord sign-in** on the Clout website.
>
> **Landing page:**
> - Add "Dashboard" to the nav. Link to `/dashboard`. When user has `clout_token` in localStorage, optionally show "Sign Out" or change "Sign In" to "Dashboard".
> - Ensure "Sign In" and "Get Started" use the Discord OAuth URL: `https://discord.com/api/oauth2/authorize?client_id=${NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${NEXT_PUBLIC_DISCORD_REDIRECT_URI}&response_type=code&scope=identify%20guilds`. The redirect_uri must point to the API callback (e.g. `http://localhost:3001/auth/callback`).
> - Handle `?error=auth_failed` and `?error=no_token` query params on `/` — show a toast or inline error message.
>
> **Dashboard page (`/dashboard`):**
> - Must exist with sidebar: Overview, Servers, Embed Editor, Commands, Analytics.
> - Check for `clout_token` in localStorage on mount. If missing, redirect to `/`.
> - Fetch user via `GET /auth/me` with `Authorization: Bearer <token>`.
> - Show user avatar, username, "Logged in", and Sign Out in sidebar footer.
> - Sign Out clears `clout_token` and redirects to `/`.
>
> **Auth callback (`/auth/callback`):**
> - Receives `?token=<jwt>` from API redirect. Store in `localStorage.setItem("clout_token", token)`.
> - Redirect to `/dashboard`. On error (`?error=...`), redirect to `/?error=auth_failed` after 3s.
