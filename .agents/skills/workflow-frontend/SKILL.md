---
name: workflow-frontend
description: >
  Skill frontend gabungan dari 10 sumber premium. Mencakup stack & setup,
  design read & 3 dials, tipografi & warna, layout patterns, UI components
  anti-slop, animasi & motion, efek advanced, design system tokens,
  performa, aksesibilitas, testing, debugging, build & deploy,
  anti-patterns, dan decision trees.
---

# WORKFLOW FRONTEND — Ultimate Frontend Skill

> Kamu adalah senior frontend engineer dan design engineer. Terapkan aturan-aturan ini saat membangun UI. Setiap aturan bersifat **konteksual** — baca brief dulu, lalu ambil hanya yang relevan.

---

## 1. STACK & SETUP

### 1.1 Stack Picker

| Kebutuhan | Pilihan |
|-----------|---------|
| React SPA | Vite + React + TS + Tailwind + React Router + TanStack Query |
| Next.js | Next.js (RSC default) + Tailwind v4 + `motion/react` |
| Vue SPA | Vite + Vue + Pinia + Vue Router + Tailwind |
| Minimal | Vite + vanilla TS + Tailwind |
| State (client) | Zustand (solo dev) atau Redux Toolkit (team) |
| State (server) | TanStack Query |
| Form | React Hook Form + Zod |
| Animasi | CSS (micro) → `motion/react` (component) → GSAP (scroll-heavy) |
| Testing | Vitest + Testing Library (unit) + Playwright (E2E) |

### 1.2 Project Structure

```
src/
├── components/ui/       # Button, Card, Input, Modal
├── components/layout/   # Header, Sidebar, Footer
├── pages/               # Route pages
├── hooks/               # Custom hooks
├── lib/                 # API client, utils
├── stores/              # Zustand stores
├── types/               # TS types
└── tests/               # Test files
```

### 1.3 Component Library per Stack

| Stack | Component Library | Icon Library | Styling |
|-------|------------------|--------------|---------|
| React/Next.js | shadcn/ui + Radix UI | `@phosphor-icons/react`, `hugeicons-react`, `@radix-ui/react-icons`, `@tabler/icons-react` | Tailwind v4 |
| Vue/Nuxt | shadcn-vue atau Radix Vue atau PrimeVue | `@phosphor-icons/vue`, `@iconify/vue` | Tailwind |
| Vanilla | Hand-built (a11y-equivalent) | `phosphor-icons` (web component), `@iconify/json` | CSS custom properties |

Satu sistem per project — jangan campur shadcn/ui dengan Material 3 dalam satu tree.

### 1.4 RSC Safety (Next.js)

- Global state hanya boleh di Client Components. Wrap provider dalam komponen `"use client"`.
- Komponen yang pakai Motion, scroll listeners, atau pointer physics HARUS jadi isolated leaf dengan `'use client'` di atas.
- Server Components hanya render layout statis.

### 1.5 Dependency Verification (Wajib)

Sebelum import library 3rd-party, cek `package.json` dulu. Kalau package belum ada, keluarkan perintah install dulu. **Jangan pernah asumsikan library sudah ada.**

### 1.6 Tailwind Version

- **Default:** Tailwind v4. Pakai `@tailwindcss/postcss` atau Vite plugin — jangan pakai plugin `tailwindcss` di `postcss.config.js` untuk v4.
- **Override:** Tailwind v3 hanya kalau project existing sudah pakai.

### 1.7 React Patterns

```tsx
// useState - lazy init untuk heavy computation
const [state] = useState(() => expensiveComputation());

// useEffect - mount + cleanup
useEffect(() => {
  const sub = api.subscribe(id, cb);
  return () => sub.unsubscribe();
}, [id]);

// useMemo - heavy computation saja
const filtered = useMemo(() => items.filter(x => x.active).sort(byName), [items]);

// useCallback - stable fn ref untuk child memo
const handleClick = useCallback((id: number) => setSelected(prev => prev === id ? null : id), []);
```

### 1.8 Custom Hooks

```tsx
function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue] as const;
}
```

### 1.9 State Management

| Lib | Bundle | Best For |
|-----|--------|----------|
| Context | 0KB | Theme, auth, locale (NOT untuk frequent updates) |
| Zustand | ~1KB | Solo dev, most apps |
| Redux Toolkit | ~12KB | Large team, complex state |
| Jotai | ~3KB | Atomic state |
| TanStack Query | ~13KB | Server state (API data) |

Rule of thumb: Server state → TanStack Query. Client state → Zustand. URL state → React Router.

```tsx
// Zustand
const useStore = create<BearStore>()(
  persist(
    (set) => ({ bears: 0, increase: () => set((s) => ({ bears: s.bears + 1 })) }),
    { name: 'bear-storage' }
  )
);
// Selector: useStore((s) => s.bears) — re-render hanya saat bears berubah
```

### 1.10 Form Handling

```tsx
// React Hook Form + Zod
const schema = z.object({ name: z.string().min(1, 'Required'), email: z.string().email() });
const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('name')} />
  {errors.name && <p>{errors.name.message}</p>}
</form>
```

---

## 2. DESIGN READ + 3 DIALS

### 2.1 Brief Inference (Baca Brief Dulu)

Sebelum menyentuh kode, **infer apa yang user mau**. Output satu baris "Design Read":

> "Reading this as: \<page kind> untuk \<audience>, dengan \<vibe> language, menuju \<design system atau aesthetic family>."

Contoh:
- *"Reading this as: B2B SaaS landing untuk technical buyers, dengan Linear-style minimalist language, menuju Tailwind utilities + Geist + restrained motion."*
- *"Reading this as: solo designer portfolio untuk hiring managers, dengan editorial / kinetic-type language, menuju native CSS + scroll-driven animation + custom typography."*

Kalau brief ambigu, tanya **satu** pertanyaan klarifikasi — jangan multi-question dump.

### 2.2 Anti-Default Discipline

Jangan default ke: AI-purple gradients, centered hero over dark mesh, three equal feature cards, generic glassmorphism di mana-mana, infinite-loop micro-animations, Inter + slate-900. Ini LLM defaults. Reach past them deliberately berdasarkan design read.

### 2.3 Tiga Dials

Setelah design read, set tiga dial:

- **`DESIGN_VARIANCE: 8`** — 1 = Perfect Symmetry, 10 = Artsy Chaos
- **`MOTION_INTENSITY: 6`** — 1 = Static, 10 = Cinematic / Physics
- **`VISUAL_DENSITY: 4`** — 1 = Art Gallery / Airy, 10 = Cockpit / Packed Data

**Baseline:** `8 / 6 / 4`. Gunakan ini kecuali design read override.

### 2.4 Dial Inference (Design Read → Dial Values)

| Signal | VARIANCE | MOTION | DENSITY |
|--------|----------|--------|---------|
| "minimalist / clean / calm / editorial / Linear-style" | 5-6 | 3-4 | 2-3 |
| "premium consumer / Apple-y / luxury / brand" | 7-8 | 5-7 | 3-4 |
| "playful / wild / Dribbble / Awwwards / experimental / agency" | 9-10 | 8-10 | 3-4 |
| "landing page / portfolio / marketing site (default)" | 7-9 | 6-8 | 3-5 |
| "trust-first / public-sector / regulated / accessibility-critical" | 3-4 | 2-3 | 4-5 |
| "redesign - preserve" | match existing | +1 | match existing |
| "redesign - overhaul" | +2 | +2 | match existing |

### 2.5 Use-Case Presets

| Use case | VARIANCE | MOTION | DENSITY |
|----------|----------|--------|---------|
| Landing (SaaS, mainstream) | 7 | 6 | 4 |
| Landing (Agency / creative) | 9 | 8 | 3 |
| Landing (Premium consumer) | 7 | 6 | 3 |
| Portfolio (Designer / studio) | 8 | 7 | 3 |
| Portfolio (Developer) | 6 | 5 | 4 |
| Editorial / Blog | 6 | 4 | 3 |
| Public-sector service | 3 | 2 | 5 |

### 2.6 Brief → Design System Map

| Brief reads as… | Reach for | Why |
|-----------------|-----------|-----|
| Microsoft / enterprise SaaS | `@fluentui/react-components` | Official Fluent UI |
| Google-ish UI | `@material/web` + Material 3 tokens | Official, theme-able |
| IBM-style B2B | `@carbon/react` + `@carbon/styles` | Official Carbon |
| Modern SaaS (you own components) | shadcn/ui (`npx shadcn@latest add ...`) | You own the code |
| Tailwind-based modern SaaS | Tailwind v4 utilities + `dark:` variant | Default untuk indie |
| Public-sector UK | `govuk-frontend` | Legally expected |
| Bootstrap 5.3 | Bootstrap | Boring, fast, works |

**Honesty rule:** kalau brief reads sebagai salah satu system di atas, install dan gunakan **official** package. Jangan recreation CSS by hand.

---

## 3. TIPOGRAFI & WARNA

### 3.1 Font Pairings

| Tipe | Heading | Body | Kesan |
|------|---------|------|-------|
| Modern | Geist, Outfit, Satoshi | DM Sans, Geist | Clean, professional |
| Editorial | PP Editorial New, GT Sectra | Lyon Text, Newsreader | Elegant, authoritative |
| Tech | Space Grotesk, JetBrains Mono | Inter, DM Sans | Technical, precise |
| Creative | Cabinet Grotesk, Clash Display | General Sans | Bold, distinctive |
| Brutalist | Neue Haas Grotesk, Archivo Black | JetBrains Mono | Industrial, raw |

### 3.2 Font Loading

```tsx
// Next.js — gunakan next/font (MANDATORY)
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap' });

// Self-host — @font-face + font-display: swap
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;
}
// NEVER link Google Fonts via <link> di production
```

### 3.3 Fluid Type Scale

```css
:root {
  --text-sm: clamp(0.8rem, 0.17vw + 0.76rem, 0.89rem);
  --text-base: clamp(1rem, 0.34vw + 0.91rem, 1.19rem);
  --text-lg: clamp(1.25rem, 0.61vw + 1.1rem, 1.58rem);
  --text-xl: clamp(1.56rem, 1vw + 1.31rem, 2.11rem);
  --text-2xl: clamp(1.95rem, 1.56vw + 1.56rem, 2.81rem);
  --text-3xl: clamp(2.44rem, 2.38vw + 1.85rem, 3.75rem);
  --text-4xl: clamp(3.05rem, 3.54vw + 2.17rem, 5rem);
  --text-5xl: clamp(3.81rem, 5.18vw + 2.52rem, 6.66rem);
}
```

### 3.4 Tipografi Rules

- **Maksimal 2 font families** — 1 untuk headings, 1 untuk body
- **Weight range:** minimal 3 weight (Light/Regular/Bold)
- **Line height:** 1.2-1.3 untuk headings, 1.5-1.6 untuk body
- **Jangan wrap 6+ kata per baris di headline** — potong baris secara visual
- **Gunakan clamp() untuk fluid typography** — jangan fixed pixel
- **Hindari center-aligned untuk >3 baris** — rata kiri
- **Heading harus punya contrast** — jangan sama ukuran dengan body
- **Spacing setelah heading** — margin-bottom 1.5-2x dari line-height
- **Italic descender clearance:** setiap italic word dengan `y g j p q` harus pakai `leading-[1.1]` min + `pb-1` reserve

### 3.5 Serif Discipline

- Serif **sangat discouraged sebagai default** untuk project apapun
- Serif hanya acceptable kalau: (a) brand brief literally name serif font, ATAU (b) aesthetic genuinely editorial/luxury/publication
- **Default sans-serif display** untuk semua project lainnya
- **Specifically BANNED sebagai default:** `Fraunces` dan `Instrument_Serif`
- Kalau serif justified, rotate dari pool: PP Editorial New, GT Sectra Display, Playfair Display, EB Garamond, Cormorant Garamond

### 3.6 Color Calibration

- **Max 1 accent color.** Saturation < 80% by default
- **The Lila Rule:** AI Purple / Blue glow aesthetic discouraged sebagai default. Gunakan neutral bases (Zinc / Slate / Stone) dengan high-contrast singular accents
- **Satu palette per project.** Jangan fluctuate antara warm dan cool grays
- **COLOR CONSISTENCY LOCK:** Sekali accent dipilih, gunakan di SELURUH page

### 3.7 Premium-Consumer Palette Ban

Untuk premium-consumer briefs (cookware, wellness, artisan, luxury), LLM default adalah warm beige/cream + brass/clay/oxblood/ochre + espresso dark text. **BANNED sebagai default:**
- Backgrounds: `#f5f1ea`, `#f7f5f1`, `#fbf8f1`, `#efeae0`
- Accents: `#b08947`, `#b6553a`, `#9a2436`, `#9c6e2a`
- Text: `#1a1714`, `#1a1814`, `#1b1814`

**Default alternatives (rotate, jangan reuse):**
- Cold Luxury: silver-grey + chrome + smoke
- Forest: deep green + bone + amber accent
- Black and Tan: true off-black + warm tan
- Cobalt + Cream: saturated blue against single neutral
- Terracotta + Slate: warm rust against cool grey
- Pure monochrome + single saturated pop

### 3.8 Dark Mode Protocol

- **Dual-mode by default.** Desain untuk kedua mode sejak awal
- Gunakan Tailwind `dark:` variant ATAU CSS variables — pilih satu strategy per project
- **Jangan prescribe specific dark-mode colors** — brief decides
- **No pure `#000000` dan no pure `#ffffff`** — gunakan off-black (zinc-950) dan off-white
- **Contrast:** WCAG AA minimum untuk body text, AAA target untuk hero copy
- **Hierarchy parity:** visual hierarchy yang works di light harus works di dark
- Respect `prefers-color-scheme` kecuali brand insists

```css
:root {
  --color-background: 255 255 255;
  --color-surface: 249 250 251;
  --color-text: 17 24 39;
  --color-text-muted: 107 114 128;
}
.dark {
  --color-background: 17 24 39;
  --color-surface: 31 41 55;
  --color-text: 249 250 251;
  --color-text-muted: 156 163 175;
}
```

### 3.9 WCAG Contrast

- **4.5:1** minimum untuk normal text
- **3:1** minimum untuk large text (18px+ atau 14px bold)
- Audit semua button, form inputs, placeholder text, focus rings, error text
- Ghost buttons over photographic backgrounds harus pakai backdrop, scrim, atau stroke

---

## 4. LAYOUT PATTERNS

### 4.1 Grid System

| Tipe | Best For | Tailwind |
|------|----------|----------|
| 12-column grid | Complex layouts | `grid-cols-12` |
| 4-column grid | Card layouts | `grid-cols-2 lg:grid-cols-4` |
| Masonry | Image galleries | CSS columns atau masonry library |
| Auto-fill | Responsive cards | `grid-cols-repeat(auto-fill, minmax(300px, 1fr))` |

### 4.2 Responsive Breakpoints

- **Mobile-first:** Tulis mobile styles dulu, tambah breakpoint untuk larger screens
- **Breakpoints:** `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px)
- **Container widths:** Max-width 720px (prose), 1200px (content), 1440px (full)
- **Viewport Stability:** JANGAN pakai `h-screen` — SELALU pakai `min-h-[100dvh]` untuk full-height sections
- **Grid over Flex-Math:** JANGAN pakai complex flexbox percentage math (`w-[calc(33%-1rem)]`). SELALU pakai CSS Grid

### 4.3 Bento Grid

```tsx
// Gapless bento dengan grid-flow-dense
<div className="grid grid-cols-2 md:grid-cols-4 grid-flow-dense gap-4">
  <div className="col-span-2 row-span-2">Large feature</div>
  <div className="col-span-1 row-span-1">Small item</div>
  <div className="col-span-1 row-span-1">Small item</div>
  <div className="col-span-2 row-span-1">Wide item</div>
</div>
```

Rules:
- **Zero empty space** — gunakan `grid-auto-flow: dense` di semua bento grid
- **Cell count = content count** — 3 items = 3 cells, 5 items = 5 cells. Jangan ada empty cells
- **Background Diversity** — minimal 2-3 cells punya real visual variation (image, gradient, pattern)
- **Rhythm, bukan repetition** — jangan stack 6 left-image/right-text rows

### 4.4 Asymmetric Grid

```css
.grid-awwwards {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 1fr;
  gap: clamp(1rem, 2vw, 2rem);
}
```

### 4.5 Spacing

- **8px grid system** — semua spacing kelipatan 8px
- **Section spacing:** `py-24` to `py-48` untuk sections utama
- **Macro-whitespace:** Double standard padding. `py-24` to `py-40` untuk sections
- **Card padding:** 24-32px untuk cards
- **Mathematically perfect** padding dan margins

### 4.6 Hero Rules

- **Hero MUST fit di initial viewport.** Headline max 2 lines, subtext max 20 words, CTAs visible tanpa scroll
- **Hero font-scale discipline:** `text-4xl md:text-5xl lg:text-6xl` untuk most heroes
- **Hero top padding cap:** max `pt-24` di desktop
- **Hero stack discipline:** max 4 text elements (eyebrow, headline, subtext, CTAs)
- **Logo wall** belongs UNDER hero, never inside it

### 4.7 Navigation — Desktop

- **Render on single line di desktop.** Kalau items tidak fit, condense labels
- **Height cap:** 80px max desktop, default 64-72px
- **Solid background** — JANGAN glassmorphism kecuali diminta
- **Active state:** indicator jelas (underline, bg color, atau weight change)

### 4.8 Navigation — Mobile (Bottom Nav)

⚠️ **NO HAMBURGER MENU.** Gunakan Bottom Navigation Bar untuk mobile:

```
┌──────────────────────────────────────────┐
│                                          │
│           ← Page Content →               │
│                                          │
│                                          │
├──────┬──────┬──────┬──────┬──────┬──────┤
│  🏠  │  🔍  │  ➕  │  ❤️  │  👤  │      │
│ Home │ Search│ New  │Saved │Profile│     │
└──────┴──────┴──────┴──────┴──────┴──────┘
```

**Rules:**
- Bottom nav muncul di mobile (< 768px), hidden di desktop (display: none on lg+)
- Max 5 items — lebih dari 5 berarti info architecture problem
- Active item: filled icon + colored label (bukan outline)
- Background: solid (white/dark), NO glassmorphism
- Height: 64-72px fixed, safe-area-inset-bottom untuk notched phones
- z-index: 50 (above content, below modals/tooltips)
- Items: flex-1, center-aligned icon + label (label hidden saat < 360px)

**Anatomy:**
```tsx
<nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pb-safe lg:hidden">
  <div className="flex h-full items-center">
    {items.map((item) => (
      <a
        key={item.path}
        href={item.path}
        className="flex flex-1 flex-col items-center justify-center gap-0.5 h-full"
      >
        {item.active ? item.iconFilled : item.iconOutline}
        <span className="text-[10px] leading-tight">{item.label}</span>
      </a>
    ))}
  </div>
</nav>
```

**Safe Area Padding (CSS):**
```css
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
```

**Why Bottom Nav > Hamburger:**
- 1 tap vs 2 taps untuk akses navigation
- Thumb-friendly zone (bottom of screen)
- Persistent visibility — user selalu tahu halaman apa yang available
- Digunakan oleh apps terbesar (Instagram, TikTok, Twitter, Spotify)

**When to fallback to hamburger:**
- Navigation items > 5 dan ga bisa di-condense
- Web app dengan banyak secondary pages (settings, help, etc.)
- Content-heavy sites (blog, documentation) — bottom nav untuk primary, hamburger untuk secondary

### 4.8 Layout Discipline

- **ANTI-CENTER BIAS:** Centered hero dihindari saat `DESIGN_VARIANCE > 4`
- **Section-Layout-Repetition Ban:** Sekali pakai layout family, max 1x di page
- **ZIGZAG ALTERNATION CAP:** Max 2 consecutive sections dengan image+text-split pattern
- **EYEBROW RESTRAINT:** Max 1 eyebrow per 3 sections
- **SPLIT-HEADER BAN:** Jangan "left big headline + right small explainer" pattern sebagai default
- **Mobile collapse explicit** — setiap multi-column layout harus declare `< 768px` fallback

### 4.9 Full-bleed Sections

```css
.section-bleed {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  padding-left: calc(50vw - 50%);
  padding-right: calc(50vw - 50%);
}
```

### 4.10 Z-Index Discipline

JANGAN spam arbitrary `z-50` atau `z-[9999]`. Gunakan z-index hanya untuk systemic layer contexts (sticky nav, modals, overlays). Document z-index scale di project constants file.

### 4.11 Stagger Grid

```css
.stagger-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.stagger-grid > :nth-child(2) { margin-top: 4rem; }
.stagger-grid > :nth-child(3) { margin-top: 8rem; }
```

---

## 5. UI COMPONENTS (ANTI-SLOP)

### 5.1 Navbar

- **SOLID background** dengan warna yang jelas (bg-white, bg-zinc-900, dll)
- **JANGAN pakai glassmorphism** (backdrop-blur, bg-white/10, bg-black/10) **KECUALI** diminta eksplisit
- Sticky/fixed behavior sesuai konteks
- **Fluid Island Nav (opsional):** Navbar floating glass pill detached dari top (`mt-6`, `mx-auto`, `w-max`, `rounded-full`)

### 5.2 Icons — Wajib Library Ikon

- **WAJIB** gunakan library ikon profesional (priority order):
  1. `@phosphor-icons/react`
  2. `hugeicons-react`
  3. `@radix-ui/react-icons`
  4. `@tabler/icons-react`
- **DILARANG KERAS** pakai emoji sebagai ikon UI
- **JANGAN hand-roll SVG icons** — install library, jangan fallback ke emoji
- **Satu family per project** — jangan mix Phosphor dengan Lucide
- **Standardize strokeWidth** secara global (1.5 atau 2.0)

### 5.3 Dropdown / Menu

- WAJIB ada: rounded yang wajar (md/lg), shadow (md/lg), padding nyaman
- Hover item: **background color subtle** (bukan cuma warna teks)
- Animasi buka/tutup: **fade + slide** (scale-y dari 95% → 100%, opacity 0 → 1)
- Dropdown trigger: indikator visual (arrow down, chevron)

### 5.4 Scrollbar — Wajib Custom

```css
/* Light mode */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: hsl(0 0% 60%); border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: hsl(0 0% 40%); }

/* Dark mode */
.dark ::-webkit-scrollbar-thumb { background: hsl(0 0% 40%); }
.dark ::-webkit-scrollbar-thumb:hover { background: hsl(0 0% 60%); }
```

### 5.5 Resize — Wajib None

- **Semua elemen non-textarea:** `resize: none`
- `<textarea>`: boleh `resize: vertical` saja

### 5.6 Button

```tsx
// Variants: primary, secondary, ghost, destructive
// Sizes: sm, md, lg
// States: default, hover, active, disabled, loading

// CTA Button Wrap Ban: text MUST fit on one line di desktop
// Button Contrast Check: text readable against background (WCAG AA 4.5:1)
// Tactile Feedback: active state pakai -translate-y-[1px] atau scale-[0.98]

// Double-Bezel pattern untuk premium feel:
<button className="group relative overflow-hidden rounded-full px-6 py-3 bg-black text-white">
  <span className="relative z-10">Button Text</span>
  <span className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 group-hover:translate-x-1">
    →
  </span>
</button>
```

### 5.7 Card — Double-Bezel Architecture

```tsx
// Outer Shell: wrapper dengan subtle background + hairline border
// Inner Core: content container dengan distinct background + inner highlight

<div className="rounded-[2rem] p-1.5 bg-black/5 ring-1 ring-black/5">
  <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
    {/* Content */}
  </div>
</div>
```

### 5.8 Form

- Label **di atas** input, error **di bawah**
- Helper text optional tapi present di markup
- **NO placeholder-as-label. Ever.**
- Form Contrast Check: inputs, placeholders, focus rings, labels semua pass WCAG AA

### 5.9 Loading / Empty / Error States

- **Loading:** Skeletal loaders matching final layout shape
- **Empty States:** Beautifully composed; indicate how to populate
- **Error States:** Clear, inline (forms), atau contextual (toasts only untuk transient)

### 5.10 Mobile Responsive Components

- **Mobile-first approach** — tulis mobile styles dulu, tambah breakpoint untuk larger screens
- **Bottom Navigation** — gantikan hamburger menu. Fixed bottom bar dengan max 5 items, safe-area-aware
- **Full-width on mobile** — `w-full` untuk buttons, cards, inputs
- **Touch targets** — minimal 44×44px untuk semua interactive elements (WCAG 2.5.8)
- **Collapse multi-column** — semua multi-column layout jadi single column di < 768px
- **Jangan sembunyikan konten penting** di mobile tanpa alternatif yang setara
- **Bottom sheet** untuk dialogs/actions di mobile (gantikan modals)
- **Sticky CTA** — primary action sticky di bottom (di atas bottom nav)

---

## 6. ANIMASI & MOTION

### 6.1 Motion Principles

- **Purpose:** Animasi harus punya tujuan — hierarchy, storytelling, feedback, state transition
- **GPU-Safe:** Animate HANYA `transform` dan `opacity`. JANGAN animate `top`, `left`, `width`, `height`
- **Respect preferences:** Cek `prefers-reduced-motion` — disable animations jika user minta
- **Consistency:** Duration dan easing harus konsisten dalam satu project

### 6.2 Timing

| Type | Duration | Easing |
|------|----------|--------|
| Micro (button hover) | 150ms | ease-out |
| Small (tooltip) | 200ms | ease-in-out |
| Medium (modal) | 300ms | ease-in-out |
| Large (page transition) | 400-500ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Scroll | 500-800ms | ease-out |

### 6.3 CSS Animations (Micro)

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}
.stagger-children > * {
  opacity: 0;
  animation: fadeInUp 0.3s ease-out forwards;
}
.stagger-children > *:nth-child(1) { animation-delay: 0ms; }
.stagger-children > *:nth-child(2) { animation-delay: 100ms; }
.stagger-children > *:nth-child(3) { animation-delay: 200ms; }
```

### 6.4 Motion Component (React)

```tsx
// Entry animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>Content</motion.div>

// Hover effects
<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
  Button
</motion.button>

// Page transitions (AnimatePresence)
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.2 }}
  >{children}</motion.div>
</AnimatePresence>
```

### 6.5 Scroll Animations

```tsx
// Intersection Observer pattern
const ref = useRef(null);
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.1 }
  );
  if (ref.current) observer.observe(ref.current);
  return () => observer.disconnect();
}, []);

// Dengan motion — lebih ringan dari GSAP untuk simple reveals
<motion.div
  ref={ref}
  initial={reduce ? false : { opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
>Content</motion.div>
```

### 6.6 GSAP + ScrollTrigger

```js
// Master Timeline — orchestrate semua scroll animations
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1.5,
    pin: true,
    anticipatePin: 1,
    markers: false,
    invalidateOnRefresh: true
  }
});

// Stagger children
tl.from('.card', {
  opacity: 0, y: 100, rotation: 5,
  stagger: { each: 0.08, from: 'start' },
  ease: 'power3.out'
}).to('.card', { y: -50, rotation: -2, ease: 'none' }, 0);

// Parallax
gsap.to('.parallax-bg', {
  y: () => window.innerHeight * 0.3,
  ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
});
```

### 6.7 GSAP Sticky-Stack Pattern

```tsx
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function StickyStack({ cards }: { cards: React.ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;
    const ctx = gsap.context(() => {
      const cardEls = gsap.utils.toArray<HTMLElement>(".stack-card");
      cardEls.forEach((card, i) => {
        if (i === cardEls.length - 1) return;
        ScrollTrigger.create({
          trigger: card,
          start: "top top",        // pin di viewport top
          endTrigger: cardEls[cardEls.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
        });
        gsap.to(card, {
          scale: 0.92, opacity: 0.55, ease: "none",
          scrollTrigger: {
            trigger: cardEls[i + 1],
            start: "top bottom", end: "top top", scrub: true,
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <div ref={ref} className="relative">
      {cards.map((card, i) => (
        <div key={i} className="stack-card sticky top-0 min-h-[100dvh] flex items-center justify-center">
          {card}
        </div>
      ))}
    </div>
  );
}
```

Critical: `start: "top top"`, `pin: true`, setiap card kecuali last dipin.

### 6.8 GSAP Horizontal-Pan Pattern

```tsx
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function HorizontalPan({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !wrap.current || !track.current) return;
    const ctx = gsap.context(() => {
      const distance = track.current!.scrollWidth - window.innerWidth;
      gsap.to(track.current, {
        x: -distance, ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${distance}`,
          pin: true, scrub: 1, invalidateOnRefresh: true,
        },
      });
    }, wrap);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section ref={wrap} className="relative overflow-hidden">
      <div ref={track} className="flex h-[100dvh] items-center">
        {children}
      </div>
    </section>
  );
}
```

### 6.9 Lenis Smooth Scroll

```js
import Lenis from 'lenis';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### 6.10 Magnetic Hover Physics

```tsx
// PENTING: Jangan pakai useState untuk continuous values
// Pakai motion values di luar React render cycle
const x = useMotionValue(0);
const y = useMotionValue(0);

const handleMouseMove = (e: React.MouseEvent) => {
  const rect = e.currentTarget.getBoundingClientRect();
  x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
  y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
};

const handleMouseLeave = () => {
  x.set(0);
  y.set(0);
};

<motion.button
  style={{ x, y }}
  transition={{ type: "spring", stiffness: 150, damping: 15 }}
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
>Magnetic Button</motion.button>
```

### 6.11 Text Splitting & Reveal

```tsx
// Split text into spans untuk animation
function splitText(el: HTMLElement) {
  const chars = el.textContent!.split('');
  el.innerHTML = chars.map(c =>
    c === ' ' ? ' ' : `<span class="split-char" style="display:inline-block">${c}</span>`
  ).join('');
}

// Animate dengan GSAP
gsap.from('.split-char', {
  y: '100%', opacity: 0, rotateZ: 15,
  duration: 0.8, stagger: 0.03, ease: 'power4.out',
  scrollTrigger: { trigger: '.split-char', start: 'top 85%' }
});
```

### 6.12 Counter Animation

```tsx
const AnimatedCounter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null!);
  useEffect(() => {
    gsap.from(ref.current, {
      innerText: 0, duration, ease: 'power3.out',
      snap: { innerText: 1 },
      scrollTrigger: { trigger: ref.current, start: 'top 90%' }
    });
  }, []);
  return <span ref={ref}>{value}</span>;
};
```

### 6.13 Scroll Progress Bar

```tsx
const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    gsap.to(barRef.current, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
    });
  }, []);
  return <div ref={barRef} className="fixed top-0 left-0 w-full h-[3px] bg-black origin-left z-[9999]" />;
};
```

### 6.14 Preloader

```tsx
const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const counterRef = useRef<HTMLSpanElement>(null!);
  useEffect(() => {
    const tl = gsap.timeline({ onComplete });
    tl.to(counterRef.current, {
      innerText: 100, duration: 2, ease: 'power3.inOut',
      snap: { innerText: 1 }
    });
    tl.to('.preloader', { y: '-100%', duration: 0.8, ease: 'power4.inOut' }, '-=0.3');
    tl.set('.preloader', { display: 'none' });
  }, []);
  return (
    <div className="preloader fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <span ref={counterRef} className="text-white text-8xl font-bold tabular-nums">0</span>
    </div>
  );
};
```

### 6.15 Animation Anti-Slop

- ❌ **Animate on load semua** — pilih element penting saja
- ❌ **Duration >500ms untuk micro** — button hover harus <200ms
- ❌ **Linear easing** — selalu pakai bezier curves
- ❌ **Janky animations** — jangan animate layout properties
- ❌ **Tanpa exit animation** — element harus fade out saat disappear
- ❌ **Bouncing/overshoot berlebihan** — subtle overshoot (scale 1.02) saja
- ❌ **Scroll hijack** — jangan override natural scroll behavior
- ❌ **`window.addEventListener('scroll')`** — DIBANDED. Pakai Motion `useScroll()`, ScrollTrigger, IntersectionObserver, atau CSS scroll-driven animations
- ❌ **Custom scroll progress pakai `window.scrollY` di React state** — re-renders setiap frame
- ❌ **`requestAnimationFrame` loops yang touch React state** — pakai motion values

### 6.16 Motion Must Be Motivated

Sebelum tambah animation, tanya: "apa yang animation ini komunikasikan?"
- **Valid:** hierarchy, storytelling, feedback, state transition
- **Invalid:** "keren" / "bagus aja"
- GSAP everywhere karena GSAP available = amateur
- Setiap ScrollTrigger, marquee, pinned section butuh reason

### 6.17 Marquee Max-One-Per-Page

Horizontal scrolling text marquees appropriate max ONCE per page. Dua atau lebih marquees = lazy filler.

---

## 7. ADVANCED EFFECTS

### 7.1 Three.js / React Three Fiber

```tsx
// Floating 3D shapes sebagai background accent
const Scene = () => {
  const meshRef = useRef<Mesh>(null!);
  useFrame(({ clock }) => {
    meshRef.current.rotation.x = clock.getElapsedTime() * 0.1;
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.3;
  });
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#4F46E5" wireframe />
    </mesh>
  );
};
```

Rules:
- Hanya 1-2 WebGL elements per page
- Lower polygon count untuk mobile
- Lazy load Three.js bundle
- **JANGAN mix GSAP/Three.js dengan Motion dalam satu component tree** — they fight over same frames
- Isolate di dedicated leaf components dengan `useEffect` cleanup

### 7.2 Particle System (Canvas)

```js
class ParticleSystem {
  constructor(canvas, count = 80) {
    this.ctx = canvas.getContext('2d');
    this.particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.3
    }));
  }
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      this.ctx.fill();
    });
    requestAnimationFrame(() => this.animate());
  }
}
```

### 7.3 Glassmorphism

```css
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* Apple Liquid Glass web approximation */
.liquid-glass-web-approx {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / .32);
  background:
    linear-gradient(135deg, rgb(255 255 255 / .30), rgb(255 255 255 / .08)),
    rgb(255 255 255 / .12);
  backdrop-filter: blur(24px) saturate(180%) contrast(1.05);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .48),
    inset 0 -1px 0 rgb(255 255 255 / .12),
    0 18px 60px rgb(0 0 0 / .18);
}

@media (prefers-reduced-transparency: reduce) {
  .liquid-glass-web-approx {
    background: rgb(255 255 255 / .96);
    backdrop-filter: none;
  }
}
```

Rules:
- Glassmorphism appropriate untuk premium consumer, Apple-adjacent, luxury brand
- **TIDAK appropriate** untuk dashboards, public-sector, "boring B2B"
- Selalu provide solid-fill fallback under `prefers-reduced-transparency`
- Hanya apply `backdrop-blur` ke fixed/sticky elements, JANGAN ke scrolling containers

### 7.4 Mesh Gradient

```css
.mesh-gradient {
  background:
    radial-gradient(ellipse 80% 50% at 0% 0%, rgba(79, 70, 229, 0.4), transparent),
    radial-gradient(ellipse 50% 50% at 100% 0%, rgba(236, 72, 153, 0.3), transparent),
    radial-gradient(ellipse 50% 80% at 50% 100%, rgba(251, 146, 60, 0.3), transparent);
  background-size: 200% 200%;
  animation: meshShift 15s ease infinite;
}
@keyframes meshShift {
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}
```

### 7.5 Grain / Noise Overlay

```css
.grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  opacity: 0.03;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,..."); /* Base64 noise */
  background-repeat: repeat;
  background-size: 200px 200px;
}
```

Rules:
- Apply noise ke fixed, `pointer-events-none` pseudo-elements SAJA
- **JANGAN** apply ke scrolling containers — continuous GPU repaints

### 7.6 Post-Processing (Bloom, Glitch)

```tsx
import { EffectComposer, Bloom, Glitch } from '@react-three/postprocessing';

const Effects = () => (
  <EffectComposer>
    <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
    <Glitch delay={[5, 15]} duration={[0.1, 0.3]} />
  </EffectComposer>
);
```

### 7.7 Scroll-Driven Animations (CSS)

```css
@keyframes reveal {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
}
.reveal-on-scroll {
  animation: reveal linear forwards;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

### 7.8 Advanced Effects Anti-Slop

- ❌ **WebGL everywhere** — hanya untuk hero/feature highlights
- ❌ **Complex 3D on mobile** — simplify atau disable
- ❌ **Scroll hijacking** — biarkan user scroll natural
- ❌ **Performance-heavy effects** — test di low-end devices
- ❌ **Effects tanpa fallback** — always degrade gracefully

---

## 8. DESIGN SYSTEM

### 8.1 Design System Philosophy

Setiap komponen harus punya **alasan** — bukan cuma "biar bagus". Design system yang baik:

- **Consistent** — satu cara untuk satu hal, di mana-mana sama
- **Composable** — komponen kecil bisa digabung jadi pattern kompleks
- **Accessible** — WCAG AA minimum, AAA untuk teks
- **Performant** — bundle kecil, zero layout shift
- **Themeable** — light/dark/custom via CSS variables
- **Documented** — setiap token punya purpose, bukan cuma value

### 8.2 Design Principles Framework

Setiap project WAJIB define 3-5 design principles sebelum mulai build. Contoh:

| Principle | Deskripsi | Dampak |
|-----------|-----------|--------|
| **Content First** | Layout mengikuti konten, bukan sebaliknya | Padding, type scale, grid fleksibel |
| **Frictionless** | Hilangkan hambatan sekecil apapun | Navigation clear, feedback instan |
| **Human Voice** | Bahasa natural, bukan robotik | Mikrocopy, error messages hangat |
| **Zero Assumptions** | Jangan tebak preferensi user | User testing, data-informed decisions |

### 8.3 Full Token Taxonomy

```
┌─────────────────────────────────────────────────┐
│                 GLOBAL TOKENS                    │
│  (raw values — platform-independent)             │
│  Contoh: --blue-500: #3B82F6                      │
├─────────────────────────────────────────────────┤
│                       ↓                          │
│                 ALIAS TOKENS                      │
│  (semantic mapping — purpose-driven)              │
│  Contoh: --color-primary: --blue-500              │
├─────────────────────────────────────────────────┤
│                       ↓                          │
│              COMPONENT TOKENS                     │
│  (component-specific overrides)                   │
│  Contoh: --btn-bg: --color-primary                │
└─────────────────────────────────────────────────┘
```

### 8.4 Expanded CSS Custom Properties

```css
:root {
  /* ── Colors (HSL format untuk opacity control) ── */
  --color-primary: 221 83% 53%;
  --color-primary-hover: 221 83% 45%;
  --color-primary-active: 221 83% 38%;
  --color-primary-muted: 221 83% 90%;
  --color-primary-foreground: 0 0% 100%;

  --color-secondary: 220 14% 96%;
  --color-secondary-hover: 220 14% 90%;
  --color-secondary-foreground: 220 14% 10%;

  --color-background: 0 0% 100%;
  --color-surface: 0 0% 98%;
  --color-surface-hover: 0 0% 95%;
  --color-border: 220 13% 91%;
  --color-divider: 220 13% 91%;

  --color-text: 220 14% 10%;
  --color-text-secondary: 220 9% 46%;
  --color-text-tertiary: 220 8% 56%;
  --color-text-inverse: 0 0% 100%;

  --color-success: 142 71% 45%;
  --color-warning: 38 92% 50%;
  --color-error: 0 84% 60%;
  --color-info: 199 89% 48%;

  /* ── Spacing (8px base grid) ── */
  --space-0: 0px;
  --space-1: 0.25rem;    /*  4px */
  --space-2: 0.5rem;     /*  8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-14: 3.5rem;    /* 56px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
  --space-28: 7rem;      /* 112px */
  --space-32: 8rem;      /* 128px */
  --space-40: 10rem;     /* 160px */
  --space-48: 12rem;     /* 192px */
  --space-56: 14rem;     /* 224px */
  --space-64: 16rem;     /* 256px */

  /* ── Typography ── */
  --font-sans: 'Inter', 'SF Pro', system-ui, -apple-system, sans-serif;
  --font-serif: 'Merriweather', 'Georgia', serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
  --font-display: 'Clash Display', 'Cabinet Grotesk', 'Satoshi', sans-serif;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.1;
  --line-height-snug: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;

  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0em;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;

  /* ── Elevation & Shadow ── */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.03);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.15);
  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
  --shadow-glow: 0 0 15px rgb(59 130 246 / 0.4);
  --shadow-colorful: 0 4px 14px 0 rgb(59 130 246 / 0.35);

  /* ── Border Radius ── */
  --radius-none: 0px;
  --radius-sm: 0.125rem;    /*  2px */
  --radius-base: 0.25rem;   /*  4px */
  --radius-md: 0.375rem;    /*  6px */
  --radius-lg: 0.5rem;      /*  8px */
  --radius-xl: 0.75rem;     /* 12px */
  --radius-2xl: 1rem;       /* 16px */
  --radius-3xl: 1.5rem;     /* 24px */
  --radius-full: 9999px;

  /* ── Motion Tokens ── */
  --duration-instant: 0ms;
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;
  --duration-slowest: 700ms;

  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.27, 1.55);
  --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);

  /* ── Z-Index Scale ── */
  --z-base: 1;
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-fixed: 30;
  --z-modal-backdrop: 40;
  --z-modal: 50;
  --z-popover: 60;
  --z-tooltip: 70;
  --z-toast: 80;
  --z-loader: 100;
}
```

### 8.5 Color Token Mapping (Light/Dark)

```css
/* Light Theme (default) */
:root {
  --bg-primary: var(--color-background);
  --bg-secondary: var(--color-surface);
  --bg-tertiary: var(--color-surface-hover);
  --text-primary: var(--color-text);
  --text-secondary: var(--color-text-secondary);
  --text-tertiary: var(--color-text-tertiary);
  --border-default: var(--color-border);
  --accent-solid: var(--color-primary);
  --accent-hover: var(--color-primary-hover);
  --accent-soft: var(--color-primary-muted);
  --accent-text: var(--color-primary-foreground);
}

/* Dark Theme */
[data-theme="dark"] {
  --bg-primary: 220 14% 6%;
  --bg-secondary: 220 14% 10%;
  --bg-tertiary: 220 14% 14%;
  --text-primary: 0 0% 95%;
  --text-secondary: 220 9% 65%;
  --text-tertiary: 220 8% 50%;
  --border-default: 220 13% 20%;
  --accent-solid: 221 83% 60%;
  --accent-hover: 221 83% 55%;
  --accent-soft: 221 83% 20%;
  --accent-text: 0 0% 100%;
}
```

### 8.6 Spacing Rhythm System

```css
/* Layout rhythm — gunakan scale ini untuk vertical spacing antar section */
:root {
  --rhythm-section: var(--space-24);    /* antar section: 6rem / 96px */
  --rhythm-content: var(--space-8);     /* antar content block: 2rem / 32px */
  --rhythm-paragraph: var(--space-6);   /* antar paragraph: 1.5rem / 24px */
  --rhythm-inline: var(--space-3);      /* antar inline element: 0.75rem / 12px */
  --rhythm-stack: var(--space-1);       /* antar stacked children: 0.25rem / 4px */
}

/* Collapse rules:
 * < 768px  → rhythm-section jadi space-16 (4rem)
 *            rhythm-content jadi space-6 (1.5rem)
 * > 768px  → full scale */
```

### 8.7 Fluid Typography Scale

```css
/* Base: 1rem = 16px
   Scale: Perfect Fourth (1.333)
   Viewport: 375px → 1440px */

:root {
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.37vw, 1rem);
  --text-base: clamp(1rem, 0.92rem + 0.39vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.62vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);
  --text-3xl: clamp(1.875rem, 1.5rem + 1.87vw, 2.5rem);
  --text-4xl: clamp(2.25rem, 1.75rem + 2.5vw, 3rem);
  --text-5xl: clamp(3rem, 2.25rem + 3.75vw, 4rem);
  --text-6xl: clamp(3.75rem, 2.75rem + 5vw, 5rem);
  --text-7xl: clamp(4.5rem, 3rem + 7.5vw, 6rem);
}
```

### 8.8 Elevation & Layer System

| Layer | Shadow Token | Z-Index | Use Case |
|-------|-------------|---------|----------|
| Base (layer 0) | none | auto | Page content |
| Raised (layer 1) | shadow-sm | z-base | Cards, tiles |
| Elevated (layer 2) | shadow-md | z-sticky | Sticky headers |
| Floating (layer 3) | shadow-lg | z-dropdown | Dropdowns, menus |
| Overlay (layer 4) | shadow-xl | z-modal-backdrop | Modals, dialogs |
| Top (layer 5) | shadow-2xl | z-tooltip | Tooltips, toasts |

Rule: Jangan pernah mix layer tanpa alasan. Card di layer 1, dropdown di layer 3. Konsisten.

### 8.9 Motion Design Tokens

```css
/* Easing Curves — pilih satu untuk seluruh project */
:root {
  /* Standard */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Expressive — untuk entrance / emphasis */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Smooth — untuk page transition */
  --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);

  /* Durations */
  --duration-micro: 100ms;    /* micro-interaction, hover */
  --duration-tiny: 150ms;     /* state change */
  --duration-fast: 200ms;     /* dropdown, tooltip */
  --duration-normal: 300ms;   /* modal, drawer */
  --duration-slow: 500ms;     /* page transition */
  --duration-epic: 1000ms;    /* hero entrance, loading */
}
```

### 8.10 Component Spec Template

Setiap komponen WAJIB punya spec table:

```markdown
# Button Component Spec

## Purpose
Primary action trigger. Gunakan untuk submit, save, continue, atau call-to-action.

## States
| State | Background | Text | Border | Shadow |
|-------|-----------|------|--------|--------|
| Default | primary-500 | white | none | sm |
| Hover | primary-600 | white | none | md |
| Active | primary-700 | white | none | none |
| Focus | primary-500 | white | ring-2 primary-400 | sm |
| Disabled | neutral-200 | neutral-500 | none | none |
| Loading | primary-500 | white | none | sm + spinner |

## Anatomy
```
┌──────────────────────────┐
│   [icon]  Label  [icon]  │  → Text + optional leading/trailing icon
└──────────────────────────┘
```

## Spacing
| Size | Padding X | Padding Y | Gap | Font Size |
|------|-----------|-----------|-----|-----------|
| sm   | 12px      | 6px       | 6px | 14px      |
| md   | 16px      | 8px       | 8px | 14px      |
| lg   | 24px      | 12px      | 8px | 16px      |

## Responsive
- sm/md/lg behave same size at all breakpoints
- Full-width on mobile with `w-full`, center-aligned on desktop with `w-auto`

## Accessibility
- Role: button (native `<button>`)
- Keyboard: Enter/Space to activate
- Focus: visible ring at 3:1 minimum contrast

## Dark Mode
- Background: lighten by 1 step (primary-400 instead of primary-500)
- Text: always white
```

### 8.11 Theme Architecture

```
ThemeProvider
├── CSS Variables (global)
│   ├── colors (HSL)
│   ├── spacing
│   ├── typography
│   └── shadows
├── Theme Context (React)
│   ├── theme: 'light' | 'dark' | 'custom'
│   ├── setTheme()
│   └── resolvedTheme (auto-detect system preference)
└── Theme Script (FOUC prevention)
    └── inline <script> di <head> — baca localStorage, set data-theme sebelum paint
```

Implementation pattern — Theme Script (FLoC prevention):

```html
<script>
  (function() {
    const theme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = theme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', resolved);
  })();
</script>
```

### 8.12 Design System Governance

**Versioning Strategy:**
- **Major** — breaking change (token dihapus, component API berubah)
- **Minor** — additive (token baru, component baru)
- **Patch** — fix (value berubah, bug fix)

**Contribution Workflow:**
1. Buat proposal di design-system/changelog
2. Implement token → component → documentation
3. Review: konsistensi + aksesibilitas + performa
4. Tag release + update consumer packages

**Documentation Requirements:**
Setiap component butuh minimal:
- Purpose (1-2 kalimat)
- Anatomy (visual structure)
- States matrix
- Spacing & sizing
- Accessibility notes
- Dark mode behavior
- Example code (JSX/TSX)

---

## 9. PERFORMANCE

### 9.1 Core Web Vitals Targets

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |

### 9.2 Code Splitting

```tsx
const Dashboard = lazy(() => import('./pages/Dashboard'));
<Suspense fallback={<Skeleton />}><Dashboard /></Suspense>
```

Bundle splitting strategy:
```
Route → [landing, work, about, contact]
  Landing chunk:     GSAP + Lenis (critical)
  Work chunk:        Three.js + R3F (heavy, lazy)
  About chunk:       Barba.js (page transitions)
  Contact chunk:     Canvas particle system
  Common chunk:      React, Motion
```

### 9.3 Image Optimization

```html
<img loading="lazy" decoding="async"
  srcset="small.jpg 400w, large.jpg 1200w"
  sizes="(max-width: 768px) 100vw, 50vw" />
<picture><source srcset="image.webp" type="image/webp" /><img src="image.jpg" alt="" /></picture>
```

- Hero image harus `next/image priority` atau preloaded
- Reserve space untuk images, fonts, embeds (cegah CLS)
- Gunakan `https://picsum.photos/seed/{keyword}/{w}/{h}` untuk placeholders
- Real company logos pakai Simple Icons CDN: `https://cdn.simpleicons.org/{slug}/ffffff`

### 9.4 Critical Rendering Path

```
1. Preload critical fonts + hero images    <link preload>
2. Inline critical CSS di <head>           <style> above fold
3. Defer non-critical CSS                  media="print" onload="media='all'"
4. Load GSAP + ScrollTrigger async         <script defer> atau dynamic import
5. Lazy load Three.js / heavy libs         import('three')
6. content-visibility: auto di below-fold sections
```

```css
.lazy-section { content-visibility: auto; contain-intrinsic-size: 500px; }
```

### 9.5 Preload

```html
<link rel="preload" as="image" href="/hero.webp" />
<link rel="preconnect" href="https://api.example.com" />
```

### 9.6 DOM Cost Awareness

- Be aware of bundle size. Motion tidak kecil. Three.js besar. Lazy-load apa pun yang bukan above-the-fold
- Monitor frame drops:

```js
let frameCount = 0, lastTime = performance.now();
function checkFPS() {
  frameCount++;
  const now = performance.now();
  if (now - lastTime >= 1000) {
    const fps = Math.round(frameCount * 1000 / (now - lastTime));
    if (fps < 30) console.warn('Low FPS:', fps, '- reduce animation complexity');
    frameCount = 0; lastTime = now;
  }
  requestAnimationFrame(checkFPS);
}
```

### 9.7 GPU Acceleration

```css
.gpu-layer {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}
.animate-gpu { contain: layout style paint; }
```

- `will-change: transform` hanya pada elements yang benar-benar akan animate
- `backdrop-blur` hanya ke fixed/sticky elements, JANGAN ke scrolling content

### 9.8 Horizontal Scroll Prevention

```tsx
<main className="overflow-x-hidden w-full max-w-full">
  {/* page content */}
</main>
```

---

## 10. ACCESSIBILITY (WCAG)

### 10.1 WCAG AA Minimum

- **Alt text** di semua images — deskripsikan konten, bukan "image of..."
- **Labels** di semua form fields
- **Logical heading hierarchy** — h1 → h2 → h3, jangan skip levels
- **Color contrast 4.5:1** untuk normal text, **3:1** untuk large text (18px+)
- **Keyboard navigation:** focus states visible, tab order logical
- **`prefers-reduced-motion`** dihormati — disable animations jika aktif
- **`aria-label`**, **`aria-labelledby`**, **`role`** dimana dibutuhkan
- **Screen reader testing** — test dengan axe DevTools + screen reader

### 10.2 Focus States

```tsx
// Selalu ada focus ring yang jelas
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Button
</button>

// Custom focus styles untuk dark mode
.dark .focus-ring {
  --tw-ring-color: rgba(96, 165, 250, 0.5);
}
```

### 10.3 Form Accessibility

- Setiap input harus punya label (visible atau `aria-label`)
- Error messages harus terkait dengan input via `aria-describedby`
- Required fields harus punya `aria-required="true"`
- Group related inputs dengan `fieldset` dan `legend`

### 10.4 Navigation Accessibility

- Skip navigation link untuk keyboard users
- Current page indicator via `aria-current="page"`
- Menu items harus bisa diakses dengan keyboard (arrow keys, Enter, Escape)
- Mobile menu harus trap focus di dalamnya

### 10.5 Content Accessibility

- Links harus punya meaningful text (bukan "click here" atau "read more")
- Icon-only buttons harus punya `aria-label`
- Status messages harus announce ke screen readers via `aria-live`
- Tables harus punya proper headers (`<th>`, `scope`)

---

## 11. TESTING

### 11.1 Vitest + Testing Library (Unit)

```tsx
render(<Button>Click</Button>);
await userEvent.click(screen.getByText('Click'));
expect(onClick).toHaveBeenCalledTimes(1);

// Hook testing
renderHook(() => useCounter());
act(() => result.current.increment());

// Mock fetch
global.fetch = vi.fn(() => Promise.resolve({
  json: () => Promise.resolve({ data: 'test' })
}));
```

### 11.2 Playwright (E2E)

```tsx
await page.goto('/login');
await page.fill('[name="email"]', 'user@test.com');
await page.click('button[type="submit"]');
await page.waitForURL('/dashboard');
```

### 11.3 Coverage Target

- **Unit:** 80%+ lines
- **Integration:** Critical paths
- **E2E:** Main flows only

### 11.4 Component Testing

```tsx
// Test component rendering
render(<Card title="Test" />);
expect(screen.getByText('Test')).toBeInTheDocument();

// Test user interactions
render(<Form />);
await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
await userEvent.click(screen.getByText('Submit'));
expect(mockSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });

// Test async operations
render(<AsyncComponent />);
await screen.findByText('Loaded');
expect(screen.getByText('Loaded')).toBeInTheDocument();
```

---

## 12. DEBUGGING

### 12.1 Chrome DevTools

**Elements Panel:**
- Inspect DOM structure dan computed styles
- Toggle CSS classes untuk debugging layout
- Check `box model` untuk spacing issues
- Screenshot element untuk sharing

**Console Panel:**
```tsx
// Console patterns yang berguna
console.log('Simple log');
console.table([{ name: 'Item 1', value: 1 }, { name: 'Item 2', value: 2 }]);
console.group('Group Label'); console.log('Item 1'); console.log('Item 2'); console.groupEnd();
console.time('Timer'); /* ... */ console.timeEnd('Timer');
console.trace('Stack trace');
console.assert(false, 'Assertion failed'); // Hanya log jika false
// Styled console untuk visibility
console.log('%cStyled text', 'color: blue; font-size: 16px; font-weight: bold');
```

**Sources Panel:**
- Set breakpoints di JavaScript execution
- Watch expressions untuk monitor variables
- Call stack analysis
- snippets untuk quick code execution

**Network Panel:**
- Waterfall analysis untuk performance bottlenecks
- Filter by XHR/Fetch, JS, CSS, Images
- Check response headers dan status codes
- Throttle network untuk testing slow connections

**Performance Panel:**
- Record runtime performance
- Identify long tasks (>50ms)
- Check for layout thrashing
- Analyze paint times

**Lighthouse Panel:**
- Performance, Accessibility, SEO, Best Practices scores
- Actionable recommendations
- Progressive Web App audit

### 12.2 React DevTools

**Components Panel:**
- Inspect component hierarchy
- Check props dan state
- Profile component updates
- Highlight updates saat state berubah

**Profiler Panel:**
- Record performance profiles
- Identify slow renders
- Analyze commit patterns
- Check why component re-rendered

```tsx
// Why did this render? Gunakan React DevTools Profiler
// Atau tambah custom hook untuk development:
function useRenderCount(componentName: string) {
  const renderCount = useRef(0);
  renderCount.current++;
  useEffect(() => {
    console.log(`${componentName} rendered ${renderCount.current} times`);
  });
}
```

### 12.3 Network Debugging

**Waterfall Analysis:**
- Identifikasi sequential requests yang bisa di-parallel
- Check untuk render-blocking resources
- Verify caching headers
- Monitor API response times

**Common Network Issues:**
- CORS errors — check server headers
- Mixed content — semua resources harus HTTPS
- Large payloads — check API response size
- Missing resources — 404 errors di console

### 12.4 Performance Profiling

**FPS Monitoring:**
```js
// Monitor frame rate
let frames = 0;
let lastTime = performance.now();
function countFrames() {
  frames++;
  const now = performance.now();
  if (now - lastTime >= 1000) {
    console.log(`${frames} FPS`);
    if (frames < 30) console.warn('Low FPS detected');
    frames = 0;
    lastTime = now;
  }
  requestAnimationFrame(countFrames);
}
requestAnimationFrame(countFrames);
```

**Memory Profiling:**
```js
// Monitor memory usage (Chrome only)
if (performance.memory) {
  console.log(`Used: ${performance.memory.usedJSHeapSize / 1048576} MB`);
  console.log(`Total: ${performance.memory.totalJSHeapSize / 1048576} MB`);
}
```

**Layout Shift Detection:**
```js
// Monitor CLS
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      console.log('Layout shift:', entry.value);
    }
  }
});
observer.observe({ type: 'layout-shift', buffered: true });
```

### 12.5 React Error Boundary

```tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }
    return this.state.children;
  }
}

// Usage
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>
```

### 12.6 Common Frontend Bugs

**Race Condition:**
```tsx
// Problem: Multiple API calls, last one might resolve first
useEffect(() => {
  let cancelled = false;
  fetchData().then(data => {
    if (!cancelled) setData(data);
  });
  return () => { cancelled = true; };
}, []);
```

**Stale Closure:**
```tsx
// Problem: Callback uses old state
const handleClick = () => {
  console.log(count); // Always logs initial value!
};

// Solution: Use functional update
const handleClick = () => {
  setCount(prev => {
    console.log(prev); // Logs current value
    return prev + 1;
  });
};
```

**Infinite Re-render Loop:**
```tsx
// Problem: useEffect dependencies change every render
useEffect(() => {
  setFiltered(items.filter(x => x.active));
}, [filtered]); // filtered changes, triggers re-render

// Solution: Proper dependency array
useEffect(() => {
  setFiltered(items.filter(x => x.active));
}, [items]); // Only re-run when items changes
```

**Memory Leak:**
```tsx
// Problem: Missing cleanup
useEffect(() => {
  const interval = setInterval(() => {
    console.log('tick');
  }, 1000);
  // No cleanup!
}, []);

// Solution: Always cleanup
useEffect(() => {
  const interval = setInterval(() => {
    console.log('tick');
  }, 1000);
  return () => clearInterval(interval);
}, []);
```

### 12.7 Debug Tools Integration

**TanStack Query Devtools:**
```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

**Zustand Devtools:**
```tsx
import { devtools } from 'zustand/middleware';

const useStore = create(devtools((set) => ({
  bears: 0,
  increase: () => set((s) => ({ bears: s.bears + 1 })),
}), { name: 'BearStore' }));
```

### 12.8 Source Maps Setup

```js
// Vite config untuk development
export default defineConfig({
  build: {
    sourcemap: true, // Generate source maps
  },
  css: {
    devSourcemap: true, // CSS source maps
  },
});
```

### 12.9 Common Debugging Checklist

1. **Check browser console** untuk errors dan warnings
2. **Verify network requests** — status codes, response sizes, timing
3. **Inspect element styles** — computed values, box model
4. **Check React DevTools** — props, state, re-renders
5. **Profile performance** — FPS, memory, layout shifts
6. **Test responsive** — mobile viewport, different screen sizes
7. **Verify accessibility** — keyboard navigation, screen reader
8. **Check dark mode** — both themes, contrast ratios

---

## 13. BUILD & DEPLOY

### 13.1 Vite Build Config

```js
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animation: ['framer-motion'], // atau 'gsap'
          three: ['three', '@react-three/fiber'], // lazy load
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@lib': '/src/lib',
    },
  },
});
```

**Key Vite patterns:**
- `manualChunks` — isolate heavy libs agar user tidak download semua sekaligus
- `build.target: 'esnext'` — output modern JS untuk browsers terkini
- `sourcemap: true` — aktifkan di dev, disable di production jika tidak perlu
- Path aliases — konsisten, hemat import statements

### 13.2 Environment Variables

```bash
# .env (committed — publik)
VITE_APP_TITLE=MyApp
VITE_API_URL=https://api.example.com

# .env.local (NOT committed — secrets)
VITE_API_KEY=sk_live_xxx
```

```tsx
// Access via import.meta.env (VITE), bukan process.env
const apiUrl = import.meta.env.VITE_API_URL;
```

Rules:
- Hanya prefix `VITE_` yang exposed ke client bundle
- **JANGAN** taruh secrets di VITE_ vars — client-side = public
- Gunakan server-side proxy untuk API calls di dev
- `.env.local` di `.gitignore`

### 13.3 Deployment Platforms

**Vercel (Next.js / Vite recommended):**
```json
// vercel.json (jika butuh custom config)
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

**Netlify:**
```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Cloudflare Pages:**
```bash
npx wrangler pages deploy dist --project-name=my-app
```

### 13.4 Docker + Nginx (SPA)

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets — aggressive cache
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
```

### 13.5 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test -- --run
      - run: npm run build
      - run: npm run preview -- --port 4173 &
      - run: npx playwright test # E2E smoke test
      # Deploy to platform of choice
      - uses: amnet/actions-deploy@v1
        with:
          # Configure per platform
```

Pipeline stages:
1. **Install** — `npm ci` (deterministic, gunakan lock file)
2. **Validate** — lint + typecheck + unit tests
3. **Build** — production bundle
4. **Verify** — preview server + E2E smoke test
5. **Deploy** — push to platform

### 13.6 Post-Deploy Checklist

- [ ] **Lighthouse > 90** di performance, accessibility, best practices
- [ ] **CLS < 0.1** — no layout shifts setelah deploy
- [ ] **Font loading** — text visible during web font load (font-display: swap)
- [ ] **Images** — semua gambar load, tidak ada 404
- [ ] **API** — endpoints reachable dari production URL
- [ ] **CORS** — server accept production domain
- [ ] **Redirects** — SPA routes yang deep-linked tetap work
- [ ] **Cache headers** — static assets immutable, HTML no-cache
- [ ] **Error tracking** — Sentry / LogRocket terpasang
- [ ] **Dark mode** — kedua theme funciona di production

---

## 14. ANTI-PATTERNS (SEMUA SUMBER)

Konsolidasi semua larangan dari 10 skill sources. **Semua item di section ini adalah hard fails** — jangan pernah lakukan.

### 14.1 Typography Anti-Patterns

| ❌ Dilarang | ✅ Sebagai Ganti |
|-------------|-------------------|
| Inter sebagai default font | Geist, Satoshi, Cabinet Grotesk, GT America |
| Roboto, Open Sans | System fonts atau modern alternatives |
| Fraunces, Instrument_Serif sebagai display serif | Serif hanya jika brief minta secara eksplisit |
| Serif sebagai default untuk "creative" briefs | Sans-serif display (Geist Display, ABC Diatype) |
| Mixed font-family emphasis (serif word dalam sans headline) | Italic/bold dari font yang SAMA |
| Monospace sebagai body font | Monospace hanya untuk code, keystrokes, metadata |
| `text-8xl` untuk headline >5 words | Scale yang proporsional, max 2-3 lines |

### 14.2 Color Anti-Patterns

| ❌ Dilarang | ✅ Sebagai Ganti |
|-------------|-------------------|
| Neon colors (cyan #00FFF0, magenta #FF00FF, lime #00FF00) | Muted versions: emerald, violet, amber |
| AI purple/blue glow sebagai default | Neutral base (Zinc/Slate/Stone) + singular accent |
| Warm beige+brass+espresso palette untuk premium consumer | Rotate: cold luxury, forest, cobalt+cream, terracotta+slate |
| Multiple accent colors dalam satu page | Max 1 accent color, consistency lock |
| Pure black text (#000000) | Off-black: #111111, #1a1714, #2F3437 |
| Primary colored backgrounds untuk hero sections | Neutral bg dengan accent di CTA atau element kecil |
| Warna konsisten di awal, berubah di section akhir | Color consistency lock: sekali pilih, pakai di SEMUA |

### 14.3 Layout Anti-Patterns

| ❌ Dilarang | ✅ Sebagai Ganti |
|-------------|-------------------|
| Hero yang overflow viewport (scroll untuk CTA) | Hero max 2 lines headline, 20 words subtext, CTA visible |
| Centered hero sebagai default | Split screen, left-aligned, asymmetric (kecuali manifesto) |
| Two-line navigation di desktop | Condense labels, drop secondary, atau hamburger |
| Card-inside-card-inside-card nesting | `border-t`, `divide-y`, atau negative space |
| Zigzag >2 sections berturut-turut | Max 2 image+text split, lalu break pattern |
| Section layout repetisi (8 section, 4 sama) | Min 4 layout families berbeda per page |
| Bento grid dengan cell kosong | Cell count = content count, no blanks |
| Bento 6 white-on-white cards | Min 2-3 cells dengan real visual: image, gradient, pattern |
| Split-header sebagai default (left headline + right small text) | Stack vertically, atau justify dengan visual di kanan |
| `max-width` yang terlalu kecil untuk konten | Max-width 4xl-5xl untuk editorial, 7xl-8xl untuk marketing |
| Hero top padding > `pt-24` | Max pt-24 di desktop |
| `h-screen` untuk sections | Min-h-screen atau height berdasarkan content |
| CTA text wrap ke baris ke-2 | Shorten label atau widen button, max 3 words primary |

### 14.4 Typography & Content Anti-Patterns

| ❌ Dilarang | ✅ Sebagai Ganti |
|-------------|-------------------|
| Eyebrow di SETIAP section | Max 1 eyebrow per 3 sections |
| AI copywriting: "Elevate", "Seamless", "Unleash", "Delve" | Plain, specific language |
| Fake-precise numbers ("47,293 users", "99.97%") | Rounded atau remove entirely |
| Placeholder names: "John Doe", "Acme Corp", "Lorem Ipsum" | Realistic, contextual content |
| Meta-labels di logo wall ("Vercel" + "hosting") | Logo saja, no labels |
| "Used by" / "Trusted by" di dalam hero | Pindah ke section sendiri di bawah hero |
| Feature list di hero | Hero = value prop + CTA saja |
| Trust micro-strip di hero | Section terpisah di bawah hero |

### 14.5 Component Anti-Patterns

| ❌ Dilarang | ✅ Sebagai Ganti |
|-------------|-------------------|
| Emoji sebagai ikon UI | Phosphor, HugeIcons, Radix, Tabler |
| Default browser scrollbar | Custom scrollbar (6px, rounded, transparent track) |
| Generic spinners untuk loading | Skeleton loaders matching final layout shape |
| Placeholder-as-label di forms | Label di atas input, error di bawah |
| No error/empty/loading states | Full cycle: loading, empty, error, success |
| `rounded-full` untuk large containers/cards | 8-16px radius untuk cards, full hanya untuk pill buttons |
| Generic heavy shadows (`shadow-lg`) | Ultra-diffuse, low opacity shadows (< 0.05 opacity) |
| Resize di non-textarea elements | `resize: none` di semua non-texta |
| Dropdown tanpa visual hierarchy | Rounded + shadow + hover bg + icon |
| Ghost button tanpa backdrop | Scrim, stroke, atau backdrop di photographic bg |
| `bg-white` CTA + `text-white` | Audit contrast: min 4.5:1 normal, 3:1 large text |

### 14.6 Animation Anti-Patterns

| ❌ Dilarang | ✅ Sebagai Ganti |
|-------------|-------------------|
| `window.addEventListener('scroll')` | Motion `useScroll()`, ScrollTrigger, IntersectionObserver |
| Animate width/height | Transform dan opacity saja |
| requestAnimationFrame loops + React state | Motion values |
| Floating terus-menerus | Subtle, purposeful micro-interactions |
| GSAP + Motion dalam satu component tree | Pilih SATU, isolate di separate trees |
| Duration >200ms untuk hover/micro | 150-200ms ease-in-out |
| Linear easing | Custom bezier curves |
| Animate on load semua | Pilih element penting saja |
| Scroll hijack | Biarkan user scroll natural |
| `window.scrollY` di React state | CSS scroll-driven animations atau motion values |

### 14.7 Performance Anti-Patterns

| ❌ Dilarang | ✅ Sebagai Ganti |
|-------------|-------------------|
| `backdrop-blur` di scrolling containers | Hanya ke fixed/sticky elements |
| `will-change: transform` di semua elements | Hanya pada elements yang benar-benar animate |
| Noise/grain overlay di scrolling container | Fixed `pointer-events-none` layer saja |
| Three.js tanpa lazy load | Dynamic import, isolate di leaf component |
| `content-visibility` tidak aktif | `content-visibility: auto` di below-fold sections |
| Render-blocking resources | Async/defer scripts, preload critical |

### 14.8 Image Anti-Patterns

| ❌ Dilarang | ✅ Sebagai Ganti |
|-------------|-------------------|
| Text-only hero tanpa visual | Real image, generated image, atau editorial photo |
| Div-based "fake screenshots" | Real screenshots, generated, atau component preview |
| Hand-rolled decorative SVGs | Library icons atau generated images |
| Placeholder text wordmarks untuk logos | Simple Icons CDN (`cdn.simpleicons.org/{slug}/ffffff`) |
| Logo wall dengan category labels | Logo saja, alt-text untuk a11y |
| Oversaturated stock photos | Desaturated, warm-toned photography |
| No `loading="lazy"` pada below-fold images | Lazy load + decoding="async" |
| No image space reservation (CLS) | Width/height atau aspect-ratio attributes |

---

## 15. DECISION TREES

### 15.1 State Management

```
Apakah state nya...
│
├─ Hanya dipakai 1 component?
│  └─ useState ✓
│
├─ Dipakai di parent-child chain (2-4 level)?
│  └─ Props drilling ✓
│
├─ Dipakai di banyak component yang tidak berdekatan?
│  │
│  ├─ Updates jarang (<10x/detik)?
│  │  └─ Zustand ✓ (recommended)
│  │
│  ├─ Updates sangat sering (cursor, drag, animation)?
│  │  └─ useRef ✓ atau Motion values
│  │
│  └─ Butuh undo/redo, persistence, complex transactions?
│     └─ Zustand + middleware (persist, devtools) ✓
│
├─ Butuh caching / async data?
│  └─ TanStack Query ✓ (bukan state management, tapi data fetching)
│
└─ React Context?
   └─ ❌ JANGAN pakai Context untuk frequent updates
      Context menyebabkan re-render semua consumers.
      Context cocok untuk: theme, auth, locale.
      Context TIDAK cocok untuk: form data, cursor position, scroll.
```

### 15.2 Animation Tool

```
Apakah animasinya...
│
├─ Simple hover/tap transitions?
│  └─ CSS transitions ✓ (tailwind: transition-all duration-200)
│
├─ Scroll-triggered reveal / stagger?
│  │
│  ├─ Tanpa scroll-jacking, tanpa pinned sections?
│  │  └─ Motion (framer-motion) ✓ — lebih clean, React-native
│  │
│  └─ Butuh scroll-jacking, pinned sections, scrubbing?
│     └─ GSAP + ScrollTrigger ✓
│
├─ Complex sequenced timelines?
│  └─ GSAP timeline ✓
│
├─ Page transitions (SPA)?
│  └─ Barba.js ✓ atau Motion AnimatePresence
│
├─ Smooth scroll / scroll hijacking?
│  └─ Lenis ✓ (bukan native scroll hijack)
│
├─ 3D scenes / WebGL?
│  └─ Three.js + React Three Fiber ✓
│
├─ Cursor following / drag?
│  └─ Motion (useMotionValue, useSpring) ✓
│
└─ Marquee / infinite scroll?
   └─ CSS animation atau Motion, max 1 per page
```

**Critical rule:** ❌ **JANGAN mix GSAP/Three.js dengan Motion dalam satu component tree.** Mereka fight over same frames. Pisahkan ke dedicated leaf components.

### 15.3 Project Stack Picker

```
Project type?
│
├─ Marketing site / Landing page / Portfolio?
│  ├─ Framework: Next.js atau Vite + React
│  ├─ Styling: Tailwind CSS
│  ├─ Animation: Motion + GSAP (jika butuh scroll effects)
│  ├─ Deploy: Vercel
│  └─ Font: Geist / Satoshi + Inter Tight
│
├─ SaaS Dashboard / Admin panel?
│  ├─ Framework: Next.js (App Router) atau Vite + React
│  ├─ Styling: Tailwind + shadcn/ui
│  ├─ State: Zustand + TanStack Query
│  ├─ Deploy: Vercel atau Docker
│  └─ Font: Geist Mono + Geist Sans
│
├─ E-commerce?
│  ├─ Framework: Next.js (App Router) — SSR/SSG penting
│  ├─ Styling: Tailwind + shadcn/ui
│  ├─ Payment: Stripe
│  ├─ Deploy: Vercel
│  └─ Font: Brand font + Geist
│
├─ Mobile-first PWA?
│  ├─ Framework: Next.js atau Vite + React
│  ├─ Styling: Tailwind (compact spacing scale)
│  ├─ Offline: Service worker
│  └─ Deploy: Vercel / Cloudflare Pages
│
└─ Awwwards / experimental / creative?
   ├─ Framework: Vite + React (atau vanilla)
   ├─ Animation: GSAP + Lenis + Barba.js
   ├─ 3D: Three.js + R3F (jika diperlukan)
   ├─ Deploy: Vercel / Netlify
   └─ Font: Display font yang bold (sesuai brand)
```

### 15.4 Responsive Breakpoint Strategy

```
Mobile-first (default)?
│
├─ Tailwind breakpoints:
│  sm: 640px   — large phone landscape
│  md: 768px   — tablet portrait
│  lg: 1024px  — tablet landscape / small desktop
│  xl: 1280px  — desktop
│  2xl: 1536px — large desktop
│
├─ Navigation:
│  < 1024px → hamburger menu
│  ≥ 1024px → horizontal nav (single line, max 80px height)
│
├─ Hero:
│  < 768px  → stacked layout, smaller font
│  ≥ 768px  → side-by-side atau asymmetric
│
├─ Content max-width:
│  Editorial/text: max-w-4xl (≈896px)
│  Marketing: max-w-7xl (≈1280px)
│  Full-bleed: max-w-full
│
└─ Spacing:
   < 768px  → py-16, px-4
   ≥ 768px  → py-24, px-6
   ≥ 1024px → py-32, px-8
```

### 15.5 Icon Selection

```
Project style?
│
├─ Premium / Editorial / Design-forward?
│  └─ Phosphor Icons (Bold or Fill weights)
│
├─ Technical / Developer / Data-heavy?
│  └─ Radix UI Icons atau Tabler Icons
│
├─ Consumer / Playful / Brand-heavy?
│  └─ HugeIcons
│
├─ Need specific brand logos?
│  └─ Simple Icons CDN (cdn.simpleicons.org)
│
├─ Tech stack logos?
│  └─ devicon
│
└─ ❌ NEVER use emoji as UI icons
   ❌ Avoid Lucide/Feather (too thin, too generic)
```

---

## 16. COLOR PALETTE & PSYCHOLOGY

### 16.1 Color Psychology by Industry

| Industry | Primary Energy | Recommended Hue | Avoid | Reasoning |
|----------|---------------|-----------------|-------|-----------|
| **Fintech / Banking** | Trust, stability, security | Blue (#0052CC), Navy (#1B2A4A) | Red, orange (danger = anxiety) | Blue = stability, calm, professional |
| **Healthcare** | Clean, calm, healing | Teal (#008080), Soft Blue (#5B9BD5), White | Dark, aggressive colors | Teal = balance, healing. White = sterile, clean |
| **E-Commerce** | Urgency, excitement, trust | Orange (#FF6B35), Blue (#0066CC), Red (#E63946) | Muted, boring tones | Orange = CTA urgency. Blue = trust badge. Red = sale |
| **Food & Beverage** | Appetite, warmth, organic | Red (#E63946), Orange (#FB8500), Olive (#606C38) | Blue (appetite suppressant), neon | Red/orange stimulate appetite. Green = organic/fresh |
| **Technology / SaaS** | Innovation, clarity, precision | Blue (#3B82F6), Indigo (#6366F1), Gray scale | Overly warm tones | Blue = logic, intelligence. Indigo = creativity |
| **Luxury / Premium** | Exclusivity, elegance, quality | Black (#0A0A0A), Gold (#B8860B), Deep Purple (#2D1B69) | Bright primary colors, neon | Black = sophistication. Gold = premium. Deep = richness |
| **Wellness / Yoga** | Peace, balance, nature | Sage (#84A98C), Lavender (#C4A4E5), Warm Beige (#F5E6D3) | Sharp, aggressive colors | Soft earth tones = calm. Lavender = spirituality |
| **Creative / Agency** | Bold, expressive, memorable | Vibrant Purple (#7C3AED), Hot Pink (#EC4899), Cyan (#06B6D4) | Corporate safe colors | Bold = creativity. Unexpected combos = memorable |
| **Education** | Trust, clarity, focus | Blue (#2563EB), Slate (#475569), Green (#16A34A) | Distracting brights | Blue = focus. Slate = serious. Green = growth |
| **Gaming** | Energy, excitement, immersion | Neon Purple (#A855F7), Electric Blue (#3B82F6), Red (#EF4444) | Boring neutrals | High saturation = excitement. Purple = fantasy |
| **Real Estate** | Trust, warmth, stability | Navy (#1E3A5F), Warm Gray (#8B7D6B), Sage (#84A98C) | Neon, aggressive tones | Navy = stability. Warm gray = grounded. Sage = nature |
| **Fashion** | Trendy, bold, aspirational | Black (#0A0A0A), Cream (#FEF3C7), Accent (#EC4899) | Corporate, utilitarian | Black canvas + bold accent = editorial |

### 16.2 Color Harmonies & Schemes

```
Analogous ─────────────── Complementary ─────────────── Triadic
   adjacent on wheel          opposite on wheel          120° apart
   🌊 #2563EB, #3B82F6,     🔥 #EF4444 + #3B82F6        🎨 #EF4444, #22C55E, #3B82F6
       #60A5FA, #93C5FD     (high contrast, bold)        (balanced, vibrant)

Split-Complementary ──── Tetradic (Double) ────────── Monochromatic
   base + two adjacent      two complementary pairs        satu hue, multiple values
   to complement            📊 #3B82F6, #F59E0B,        🎯 #1E3A5F, #2563EB,
   🌿 #22C55E, #A855F7,         #EF4444, #10B981              #3B82F6, #93C5FD
       #F97316              (rich, complex palette)      (elegant, harmonious)
```

### 16.3 Pre-Built Palette Recipes

Setiap palette punya: Primary, Secondary, Accent, Neutral, Surface, dan Text colors.

```
─── 1. SAAS MODERN ───
Primary: #2563EB       → Trustworthy blue
Secondary: #7C3AED     → Creative purple
Accent: #06B6D4        → Tech cyan
Surface: #F8FAFC        → Clean white
Text: #0F172A           → Deep slate
Muted: #64748B          → Slate gray
Success: #22C55E         → Green
Warning: #F59E0B         → Amber
Error: #EF4444           → Red
Info: #0EA5E9            → Sky blue
Vibe: Professional, clean, high-tech

─── 2. WARM & ORGANIC ───
Primary: #B45309        → Amber-700 (warmth)
Secondary: #D97706      → Amber-600 (energy)
Accent: #059669         → Emerald-600 (fresh)
Surface: #FFFBEB        → Amber-50 (warm white)
Text: #292524            → Warm gray-900
Muted: #78716C           → Warm gray-500
Vibe: Earthy, welcoming, natural

─── 3. DARK LUXURY ───
Primary: #F59E0B        → Gold
Secondary: #1C1917       → Near black
Accent: #D4D4D8          → Cool gray
Surface: #18181B         → Deep charcoal
Text: #FAFAFA            → White
Muted: #A1A1AA           → Gray
Vibe: Premium, exclusive, editorial

─── 4. HEALTH & WELLNESS ───
Primary: #84A98C        → Sage green
Secondary: #C4A4E5      → Lavender
Accent: #F5E6D3          → Warm beige
Surface: #FAF5F0         → Cream
Text: #2D2A25            → Warm black
Muted: #8B8A86           → Warm gray
Vibe: Calm, natural, healing

─── 5. E-COMMERCE VIBRANT ───
Primary: #FF6B35         → Burnt orange (CTA)
Secondary: #0066CC       → Trust blue
Accent: #E63946          → Sale red
Surface: #FFFFFF          → White
Text: #1A1A2E            → Deep navy
Muted: #8D99AE            → Cool gray
Vibe: Energetic, urgent, trustworthy

─── 6. CREATIVE AGENCY ───
Primary: #7C3AED         → Vibrant purple
Secondary: #EC4899       → Hot pink
Accent: #06B6D4          → Cyan
Surface: #0F172A          → Dark navy
Text: #F8FAFC             → White
Muted: #64748B            → Slate
Vibe: Bold, artistic, memorable

─── 7. MINIMALIST EDITORIAL ───
Primary: #1A1A1A         → Almost black
Secondary: #F5F5F5       → Off white
Accent: #C73659          → Deep rose
Surface: #FFFFFF          → Pure white
Text: #1A1A1A             → Black
Muted: #737373            → Gray-500
Vibe: Clean, sophisticated, print-like

─── 8. FINTECH SECURE ───
Primary: #0052CC         → Bank blue
Secondary: #00A3BF       → Teal accent
Accent: #36B37E          → Success green
Surface: #F4F5F7          → Light gray
Text: #172B4D             → Dark navy
Muted: #5E6C84            → Slate
Vibe: Stable, secure, professional

─── 9. GAMING ENERGY ───
Primary: #A855F7         → Neon purple
Secondary: #3B82F6       → Electric blue
Accent: #EF4444          → Danger red
Surface: #09090B          → Pure black
Text: #FAFAFA             → White
Muted: #52525B            → Zinc
Vibe: Energetic, immersive, exciting

─── 10. NATURE ORGANIC ───
Primary: #2D6A4F         → Forest green
Secondary: #95D5B2       → Mint
Accent: #E9C46A          → Warm yellow
Surface: #F1FAEE          → Ice white
Text: #1B1B1B             → Nearly black
Muted: #6B7280            → Gray
Vibe: Natural, fresh, sustainable

─── 11. COSMIC DARK ───
Primary: #818CF8         → Indigo-400
Secondary: #C084FC       → Purple-400
Accent: #22D3EE          → Cyan-400
Surface: #0F0F23          → Deep space blue
Text: #E2E8F0             → Light gray
Muted: #64748B            → Slate-500
Vibe: Futuristic, dreamy, tech-forward

─── 12. SUNSET MEDITERRANEAN ───
Primary: #E07A5F         → Terracotta
Secondary: #F2CC8F       → Sand
Accent: #3D405B          → Deep indigo
Surface: #F4F1DE          → Warm cream
Text: #2D2A25             → Warm black
Muted: #8D8D8D            → Gray
Vibe: Warm, vacation, artistic

─── 13. JAPANESE WABI-SABI ───
Primary: #8B4513         → Rust brown
Secondary: #D4A373       → Warm beige
Accent: #2B9348          → Moss green
Surface: #FEFAE0          → Rice paper white
Text: #2B2B2B             → Charcoal
Muted: #8C8C8C            → Stone gray
Vibe: Imperfect, natural, serene

─── 14. NEON SYNTHWAVE ───
Primary: #FF006E         → Hot pink
Secondary: #8338EC       → Deep purple
Accent: #00F5D4          → Aqua cyan
Surface: #0A0A23          → Midnight blue
Text: #FFFFFF             → Pure white
Muted: #6C6C8A            → Muted indigo
Vibe: Retro-future, night, electric

─── 15. CORPORATE CLEAN ───
Primary: #1E40AF         → Deep blue
Secondary: #3B82F6       → Medium blue
Accent: #10B981          → Green
Surface: #FFFFFF          → White
Text: #111827             → Gray-900
Muted: #6B7280            → Gray-500
Vibe: Professional, clean, reliable

─── 16. BOHEMIAN EARTH ───
Primary: #B4654A         → Warm sienna
Secondary: #D4A373       → Tan
Accent: #606C38          → Olive green
Surface: #FFF8F0          → Warm cream
Text: #2C1810             → Dark brown
Muted: #9C8F8A            → Warm taupe
Vibe: Free-spirited, earthy, eclectic

─── 17. ICE COOL ───
Primary: #0EA5E9         → Sky blue
Secondary: #06B6D4       → Cyan
Accent: #6366F1          → Indigo
Surface: #F0F9FF          → Ice white
Text: #0F172A             → Dark slate
Muted: #94A3B8            → Cool gray
Vibe: Fresh, clean, modern

─── 18. COPPER & CLAY ───
Primary: #C8623F         → Copper
Secondary: #DEAB8A       → Clay beige
Accent: #4A7C59          → Sage
Surface: #FDF5ED          → Cream
Text: #2C1810             → Dark brown
Muted: #8C7D72            → Warm gray
Vibe: Artisanal, craft, handmade

─── 19. NEUTRAL ESSENTIAL ───
Primary: #1F2937         → Gray-800
Secondary: #4B5563       → Gray-600
Accent: #6366F1          → Indigo-500
Surface: #F9FAFB          → Gray-50
Text: #111827             → Gray-900
Muted: #9CA3AF            → Gray-400
Vibe: Minimal, versatile, timeless

─── 20. TROPICAL PARADISE ───
Primary: #0D9488         → Teal-600
Secondary: #F97316       → Orange-500
Accent: #EAB308          → Yellow-500
Surface: #F0FDFA          → Teal-50
Text: #134E4A             → Dark teal
Muted: #5EEAD4            → Teal-300
Vibe: Vibrant, exotic, energetic

─── 21. NOIR FILM ───
Primary: #1A1A1A         → Pure black
Secondary: #404040       → Dark gray
Accent: #DC2626          → Blood red
Surface: #262626          → Charcoal
Text: #F5F5F5             → Off white
Muted: #737373            → Medium gray
Vibe: Dramatic, moody, cinematic

─── 22. PASTEL DREAM ───
Primary: #A78BFA         → Soft purple
Secondary: #F9A8D4       → Pink
Accent: #6EE7B7          → Mint
Surface: #FAF5FF          → Lavender white
Text: #1F2937             → Slate-800
Muted: #9CA3AF            → Gray-400
Vibe: Soft, dreamy, gentle

─── 23. DESERT WARMTH ───
Primary: #D97706         → Amber-600
Secondary: #B45309       → Amber-700
Accent: #0F766E          → Teal-700
Surface: #FFFBEB          → Amber-50
Text: #292524             → Stone-800
Muted: #78716C            → Stone-500
Vibe: Warm, sandy, grounded

─── 24. OCEAN DEEP ───
Primary: #1E3A8A         → Blue-900
Secondary: #3B82F6       → Blue-500
Accent: #22D3EE          → Cyan-400
Surface: #EFF6FF          → Blue-50
Text: #0F172A             → Slate-900
Muted: #64748B            → Slate-500
Vibe: Deep, calm, trustworthy

─── 25. AUTUMN HARVEST ───
Primary: #C2410C         → Orange-700
Secondary: #A16207       → Yellow-800
Accent: #4D7C0F          → Green-800
Surface: #FFFBEB          → Amber-50
Text: #292524             → Stone-800
Muted: #78716C            → Stone-500
Vibe: Warm, seasonal, cozy

─── 26. TOKYO NIGHT ───
Primary: #6366F1         → Indigo-500
Secondary: #EC4899       → Pink-500
Accent: #22D3EE          → Cyan-400
Surface: #0B0F19          → Dark midnight
Text: #E2E8F0             → Slate-200
Muted: #475569            → Slate-600
Vibe: Urban, neon, electric

─── 27. SCANDINAVIAN MINIMAL ───
Primary: #292524         → Stone-800
Secondary: #F5F5F4       → Stone-100
Accent: #0D9488          → Teal-600
Surface: #FAFAF9          → Stone-50
Text: #1C1917             → Stone-900
Muted: #78716C            → Stone-500
Vibe: Clean, functional, serene

─── 28. RETRO VIBE ───
Primary: #E85D04         → Pumpkin orange
Secondary: #7209B7       → Purple
Accent: #F9C74F          → Mustard yellow
Surface: #FFF9ED          → Warm cream
Text: #1B1B1B             → Almost black
Muted: #8D8D8D            → Gray
Vibe: Nostalgic, funky, 70s/80s

─── 29. FOREST CANOPY ───
Primary: #14532D         → Green-900
Secondary: #22C55E       → Green-500
Accent: #EAB308          → Yellow-500
Surface: #F0FDF4          → Green-50
Text: #052E16             → Green-950
Muted: #6B7280            → Gray-500
Vibe: Deep, natural, grounded

─── 30. SAKURA BLOSSOM ───
Primary: #DB2777         → Pink-600
Secondary: #FDF2F8       → Pink-50
Accent: #A78BFA          → Violet-400
Surface: #FFF7F9          → Pinkish white
Text: #1F2937             → Slate-800
Muted: #9CA3AF            → Gray-400
Vibe: Delicate, feminine, elegant

─── 31. MID-CENTURY MODERN ───
Primary: #C75B39         → Rust orange
Secondary: #E8C9A0       → Warm tan
Accent: #3A7D44          → Forest green
Surface: #F7F0E8          → Buttermilk
Text: #2C2C2C             → Dark charcoal
Muted: #8C8C8C            → Warm gray
Vibe: Vintage, design-forward, cozy

─── 32. INDUSTRIAL BRUTALIST ───
Primary: #1C1917         → Near black
Secondary: #44403C       → Dark stone
Accent: #DC2626          → Signal red
Surface: #F5F5F4          → Concrete
Text: #292524             → Stone-800
Muted: #A8A29E            → Stone-400
Vibe: Raw, bold, utilitarian
```

### 16.4 Accessibility-First Color Selection

```css
/* WCAG 2.1 Contrast Requirements
   AA Normal text:      ≥ 4.5:1
   AA Large text:       ≥ 3:1   (≥18px regular or ≥14px bold)
   AAA Normal text:     ≥ 7:1
   AAA Large text:      ≥ 4.5:1
   UI Components:       ≥ 3:1
*/

/* Quick reference — safe color pairings */
:root {
  /* Safe combinations (AA minimum) */

  /* Dark backgrounds with white text */
  --pair-dark-bg-light-text: 12:1;    /* #1A1A1A on #FFFFFF */

  /* Colored backgrounds with white text */
  --pair-blue-bg-white-text: 4.6:1;   /* #2563EB on #FFFFFF — AA */
  --pair-green-bg-white-text: 4.8:1;  /* #16A34A on #FFFFFF — AA */
  --pair-purple-bg-white-text: 5.1:1; /* #7C3AED on #FFFFFF — AA */
  --pair-amber-bg-white-text: 4.2:1;  /* #D97706 on #FFFFFF — borderline */
  --pair-red-bg-white-text: 5.2:1;    /* #DC2626 on #FFFFFF — AA */

  /* Dark backgrounds with colored text */
  --pair-dark-bg-blue-text: 8.4:1;    /* #0F172A on #60A5FA — AAA */
  --pair-dark-bg-green-text: 9.1:1;   /* #0F172A on #4ADE80 — AAA */
}

/* Color-blind safe palette (CVD — Color Vision Deficiency) */
:root {
  /* Use these for data visualization, status indicators, charts */
  --cb-safe-blue: #0077BB;
  --cb-safe-orange: #EE7733;
  --cb-safe-cyan: #33BBEE;
  --cb-safe-magenta: #EE3377;
  --cb-safe-yellow: #CCBB44;
  --cb-safe-green: #009988;

  /* ❌ Avoid for data viz: red+green, blue+purple, green+blue */
}
```

### 16.5 Tailwind v4 Color Extension

```css
/* tailwind.config.js — extended colors */
@import "tailwindcss";

@theme {
  /* Custom brand colors */
  --color-brand-50: #FFF7ED;
  --color-brand-100: #FFEDD5;
  --color-brand-200: #FED7AA;
  --color-brand-300: #FDBA74;
  --color-brand-400: #FB923C;
  --color-brand-500: #F97316;
  --color-brand-600: #EA580C;
  --color-brand-700: #C2410C;
  --color-brand-800: #9A3412;
  --color-brand-900: #7C2D12;
  --color-brand-950: #431407;

  /* Semantic aliases */
  --color-accent: var(--color-brand-500);
  --color-accent-hover: var(--color-brand-600);
  --color-accent-soft: var(--color-brand-100);
  --color-accent-text: white;

  /* Extra surfaces */
  --color-surface-raised: #FAFAFA;
  --color-surface-sunken: #F0F0F0;
}
```

### 16.6 Gradient Recipes

```css
/* 15 production-ready gradients */

.grad-sunset { background: linear-gradient(135deg, #FF6B35, #F7C59F, #EFEFEF); }
.grad-ocean { background: linear-gradient(135deg, #00B4D8, #0077B6, #023E8A); }
.grad-forest { background: linear-gradient(135deg, #2D6A4F, #40916C, #52B788); }
.grad-neon { background: linear-gradient(135deg, #A855F7, #EC4899, #F43F5E); }
.grad-aurora { background: linear-gradient(135deg, #06B6D4, #10B981, #84CC16); }
.grad-warmth { background: linear-gradient(135deg, #F97316, #DC2626, #DB2777); }
.grad-lavender { background: linear-gradient(135deg, #7C3AED, #A78BFA, #C4B5FD); }
.grad-mint { background: linear-gradient(135deg, #059669, #34D399, #6EE7B7); }
.grad-twilight { background: linear-gradient(135deg, #1E1B4B, #312E81, #4338CA); }
.grad-golden { background: linear-gradient(135deg, #92400E, #D97706, #FCD34D); }
.grad-corporate { background: linear-gradient(135deg, #1E40AF, #3B82F6, #60A5FA); }
.grad-rose { background: linear-gradient(135deg, #9D174D, #DB2777, #F472B6); }
.grad-midnight { background: linear-gradient(135deg, #020617, #0F172A, #1E293B); }
.grad-sage { background: linear-gradient(135deg, #365314, #4D7C0F, #65A30D); }
.grad-copper { background: linear-gradient(135deg, #7C2D12, #C2410C, #EA580C); }

/* Usage: text gradient for headings */
.text-gradient {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 16.7 Dark Mode Color Inversion Strategy

Tidak perlu invert semua warna. Gunakan strategi:

```
Surface Colors:     Darken (white → dark gray)
Text Colors:        Lighten (dark → light gray)
Accent Colors:      Slightly lighten or keep same intensity
Border Colors:      Darken (light gray → darker gray)
Shadows:            None or very subtle (elevated glow instead)
Images:             Reduce brightness 20-30%, increase contrast
Gradients:          Invert base but keep accent direction
```

---

## 17. BRAINSTORMING FRAMEWORK

### 17.1 Design Thinking (5 Phases)

```
┌──────────────────────────────────────────────────────────────────┐
│                    DESIGN THINKING PROCESS                        │
│                                                                   │
│  EMPATHIZE → DEFINE → IDEATE → PROTOTYPE → TEST                   │
│     ↓          ↓         ↓          ↓         ↓                  │
│  Understand  Frame the  Generate   Build     Validate             │
│   users      problem   ideas      solutions with users            │
│                                                                   │
│  ─────────────────────────────────────────────────────────────    │
│  Non-linear! Lompat antar fase kalo nemu insight baru.            │
└──────────────────────────────────────────────────────────────────┘
```

**Phase 1: Empathize**
- User interviews (5-8 users per persona)
- Contextual observation
- Diary studies
- Empathy mapping
- Customer journey mapping

**Phase 2: Define**
- Point of View (POV) statements
- "How Might We" (HMW) questions
- Problem statement (see 17.4)
- User needs prioritization

**Phase 3: Ideate**
- Brainstorming sessions (quantity > quality first)
- Crazy 8s (8 ideas in 8 minutes)
- Worst Possible Idea (remove inhibition)
- SCAMPER technique
- Mind mapping

**Phase 4: Prototype**
- Paper prototyping
- Figma low-fi → hi-fi
- Clickable prototype
- Wizard of Oz testing
- Code prototype (if needed)

**Phase 5: Test**
- Usability testing
- A/B testing
- Analytics review
- Feedback synthesis
- Iteration planning

### 17.2 Brief Decomposition Framework

Gunakan framework ini untuk membuka brief apapun:

```
┌──────────────────────────────────────────────────────────────────┐
│                     BRIEF DECOMPOSITION                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  WHO          ─── Target audience / Persona                       │
│  WHAT         ─── Feature / Page / Component                      │
│  WHY          ─── Business goal / User need                       │
│  WHERE        ─── Platform / Context / Device                     │
│  WHEN         ─── Timeline / Milestones                           │
│  HOW          ─── Technical constraints / Stack                   │
│  HOW MUCH     ─── Budget / Resources / Team                       │
│  SUCCESS      ─── Metrics / KPIs / Definition of Done             │
│  RISKS        ─── What could go wrong?                            │
│  ASSUMPTIONS  ─── What are we taking for granted?                 │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

Template:

```markdown
## Brief Decomposition

| Element | Question | Answer |
|---------|----------|--------|
| **WHO** | Siapa target user? | |
| **WHAT** | Apa yang harus dibangun? | |
| **WHY** | Kenapa ini penting? | |
| **WHERE** | Platform apa? | |
| **WHEN** | Deadline kapan? | |
| **HOW** | Stack & constraint apa? | |
| **SUCCESS** | Gimana kita tahu ini berhasil? | |
| **RISKS** | Apa resikonya? | |
| **ASSUMPTIONS** | Apa yang kita asumsikan? | |
```

### 17.3 User Persona Canvas

```markdown
## [Persona Name]
*"[Quote that captures their attitude]"*

### Demographics
- Age: XX
- Occupation: XXX
- Location: XXX
- Tech Literacy: Low / Medium / High

### Goals & Motivations
- Primary goal: _______
- Secondary goal: ______
- What drives them? ______

### Pain Points & Frustrations
- 🔴 [Biggest frustration]
- 🟡 [Medium frustration]
- 🟡 [Medium frustration]

### Behaviour & Habits
- How they currently solve the problem: ______
- Tools they use: ______
- Decision triggers: ______

### Needs from This Product
- [Must-have need]
- [Should-have need]
- [Nice-to-have need]

### Emotional State
😟 Frustrated → 😐 Neutral → 😊 Satisfied → 😍 Delighted
```

### 17.4 Problem Statement Formula

```
[User type] needs [user need] because [insight].
Unlike [alternative], our solution [differentiator].

─── Examples ───
❌ Bad: "Bikin landing page untuk cafe"
✅ Good: "Young professionals (25-35) in Jakarta need a way to discover
   specialty coffee shops with reliable WiFi because they work remotely
   and value quality ambiance. Unlike standard coffee shop websites
   that feel generic, our landing page will showcase the unique
   interior, brew methods, and community atmosphere."

❌ Bad: "Bikin dashboard admin"
✅ Good: "E-commerce managers need real-time visibility into daily
   sales, inventory alerts, and customer trends because slow decisions
   cost revenue. Unlike complex BI tools that require training, our
   dashboard will surface the 5 most critical metrics at a glance."
```

### 17.5 Ideation Techniques

**1. Crazy 8s ⏱️ 8 menit**
- Lipat kertas jadi 8 bagian
- Setiap 60 detik, gambar 1 ide
- Akhir: 8 solusi berbeda
- Pilih 2 terbaik untuk di-develop

**2. SCAMPER Technique**

| Letter | Technique | Example Questions |
|--------|-----------|-------------------|
| **S** | Substitute | Apa yang bisa diganti? |
| **C** | Combine | Bisa digabung dengan apa? |
| **A** | Adapt | Dari industri mana bisa diadaptasi? |
| **M** | Modify | Apa yang bisa diubah skalanya? |
| **P** | Put to other use | Bisakah dipakai untuk hal lain? |
| **E** | Eliminate | Apa yang bisa dihilangkan? |
| **R** | Reverse | Apa jadinya kalo dibalik? |

**3. Worst Possible Idea** 🎯
- Cari ide TERBURUK yang mungkin
- Kenapa itu buruk? → Reverse jadi insight
- Hilangkan inhibition, kreativitas mengalir

**4. Round Robin**
- Start: 1 orang tulis ide (3 menit)
- Pass ke kanan: tambah, modifikasi, kritik (2 menit)
- Repeat sampai kertas balik ke owner
- Hasil: ide original + 4-5 perspektif baru

### 17.6 Solution Sketching

```
Step 1: Review         (10 min)
  └─ Tempel semua research di dinding. Review bersama.

Step 2: Ideate         (20 min)
  └─ Masing-masing bikin 4 sketsa (kertas A4, divided into 4)

Step 3: Critique       (15 min)
  └─ Tempel di dinding. Silent critique: sticky notes.
     👍 = Strong point    ❓ = Question    💡 = Suggestion

Step 4: Converge       (10 min)
  └─ Vote dengan dot stickers. Pilih elemen terbaik tiap sketsa.
     Strecth goal: combine best elements into 1 final solution.

Step 5: Storyboard     (15 min)
  └─ Gambar user flow 6-8 panel. Dari entry sampai completion.
```

### 17.7 Design Critique Framework

**Give Feedback:**
```
1. Start positive: "I really like how [specific element] because..."
2. Ask question: "What if [alternative approach]?"
3. Suggest: "Have you considered [suggestion]?"
4. Frame as opportunity: "One opportunity I see is..."

❌ "Ini jelek, ganti warna"
✅ "Warna merah ini powerful untuk CTA, tapi untuk background mungkin
   terlalu dominan. Gimana kalo kita coba variant dengan neutral bg?"
```

**Receive Feedback:**
```
1. Listen fully — jangan defensif
2. Ask clarifying questions: "Bisa dijelasin lebih detail?"
3. Separate person from work: feedback bukan personal
4. Thank: "Makasih insightnya, gue coba eksplor itu"
5. Decide later: catat semua, decide setelah session
```

**Critique Checklist:**
- [ ] Apakah solusi ini solve the problem?
- [ ] Apakah hierarchy-nya jelas? (apa yang dilihat pertama?)
- [ ] Apakah aksesibel? (WCAG AA minimum)
- [ ] Apakah konsisten dengan design system?
- [ ] Apakah performanya acceptable?
- [ ] Apakah mobile-first?
- [ ] Apakah copy-nya jelas dan manusiawi?
- [ ] Apakah error states ter-handle?

### 17.8 Decision Matrix

Gunakan untuk memilih antara beberapa opsi secara objektif:

```markdown
## Decision Matrix

| Criteria                    | Weight | Option A | Option B | Option C |
|-----------------------------|--------|----------|----------|----------|
| User impact                 | 30%    | 8 / 2.4  | 6 / 1.8  | 7 / 2.1  |
| Implementation effort       | 25%    | 6 / 1.5  | 8 / 2.0  | 4 / 1.0  |
| Business value              | 20%    | 9 / 1.8  | 5 / 1.0  | 7 / 1.4  |
| Technical risk              | 15%    | 7 / 1.05 | 6 / 0.9  | 5 / 0.75 |
| Maintenance cost (LTV)      | 10%    | 5 / 0.5  | 7 / 0.7  | 6 / 0.6  |
| **TOTAL**                   | 100%   | **7.25** | **6.4**  | **5.85** |

→ **Option A** is the winner with 7.25/10
```

**Priority Frameworks:**

| Framework | Formula / Categories | Use For |
|-----------|---------------------|---------|
| **RICE** | Reach × Impact × Confidence / Effort | Feature prioritization |
| **ICE** | Impact × Confidence × Ease | Growth experiments |
| **MoSCoW** | Must-have / Should-have / Could-have / Won't-have | Release scoping |
| **Kano** | Basic needs → Performance → Delighters | Feature categorization |
| **Effort-Impact** | 2×2 matrix (Quick Wins, Big Bets, Fill-ins, Avoid) | Strategic planning |

### 17.9 Brainstorming Session Template

```markdown
# Brainstorming Session: [TOPIC]

## Prep (before session)
- [ ] Brief distributed 48h before
- [ ] Research & inspiration board ready
- [ ] Tools: Miro / FigJam / whiteboard + sticky notes
- [ ] Timer ready
- [ ] Roles assigned: Facilitator, Note-taker, Time-keeper

## Agenda (90 min total)
| Time | Activity | Format |
|------|----------|--------|
| 0:00 | Context setting (read brief, share research) | Present |
| 0:15 | Warm-up: "How Might We" reframing | Group |
| 0:25 | Ideation: Crazy 8s | Individual |
| 0:35 | Ideation: Round Robin | Group |
| 0:50 | Break + gallery walk | Silent |
| 1:00 | Critique & dot voting | Group |
| 1:15 | Converge + action items | Group |
| 1:30 | Wrap + next steps | Present |

## Output
- Top 3 ideas selected
- Action items with owners
- Follow-up: prototype plan

## Rules
1. Quantity over quality — jangan sensor diri
2. Build on others' ideas — "yes, and..."
3. Stay on topic — satu diskusi dalam satu waktu
4. Defer judgment — no critiquing during ideation
5. Be visual — gambar > kata-kata
```

### 17.10 Rapid Prototype Decision Tree

```
Need to validate an idea?
│
├─ Need to test desirability (do users want it?)
│  └─ Landing page / waiting list → launch in 2 days
│
├─ Need to test usability (can users use it?)
│  └─ Figma prototype → test with 5 users
│
├─ Need to test feasibility (can we build it?)
│  └─ Tech spike → code prototype → 1 week max
│
├─ Need to test viability (will it make money?)
│  └─ Concierge MVP → manual process → validate demand first
│
└─ Need all three?
   └─ Build MVP → feature-light, quality-high → ship in 2-4 weeks
```

## 18. MOBILE-FIRST & RESPONSIVE PATTERNS

### 18.1 Mobile-First Philosophy

```
Mobile-first = design untuk layar TERKECIL dulu, lalu progressive enhancement.
Bukan "desktop dulu, nanti di-push ke mobile."

┌─────────────────────────────────────────────┐
│  MOBILE-FIRST WORKFLOW                       │
│                                              │
│  1. Content hierarchy — apa yang PENTING?    │
│  2. Single column layout — satu hal per view │
│  3. Touch-friendly — 44×44px minimum         │
│  4. Performance — smaller bundles, less JS   │
│  5. Progressive enhancement — tambah untuk   │
│     larger screens                           │
└─────────────────────────────────────────────┘
```

### 18.2 Mobile Layout Patterns

| Pattern | Description | Use Case |
|---------|-------------|----------|
| **Single Column** | Semua content stacked vertikal | Default mobile layout |
| **Bottom Sheet** | Panel slide up dari bawah | Filters, actions, menus |
| **Full-Width Tabs** | Horizontal scrollable tabs | Categories, sections |
| **Sticky Header** | Minimal header (logo + icon) | General browsing |
| **Bottom Nav** | 5 menu items di bottom | Primary navigation |
| **Swipeable** | Horizontal swipe antar sections | Carousel, gallery |
| **Pull to Refresh** | Pull down untuk reload | Feeds, lists |
| **Infinite Scroll** | Auto-load more content | Feeds, search results |
| **Slide Drawer** | Panel slide dari kiri/kanan | Secondary navigation |
| **Bottom CTA** | Sticky button di bottom | Checkout, signup, booking |

### 18.3 Touch Target Guidelines

```css
/* Minimum touch targets — WCAG 2.5.8 (Level AA) */
:root {
  --touch-min: 44px;   /* minimum interactive element */
  --touch-gap: 8px;    /* minimum gap between touch targets */
}

/* ✅ Correct */
button, a, input, select, textarea {
  min-height: var(--touch-min);
  /* At minimum, padding to reach 44×44px */
}

/* ❌ Never use these without 44×44px padding */
.small-link { font-size: 12px; }     /* TOO SMALL */
.tiny-icon { width: 16px; height: 16px; }  /* TOO SMALL */
```

### 18.4 Mobile Spacing Scale

```css
/* Mobile-first spacing — lebih kompak, lebih banyak padding */
:root {
  /* Mobile (< 768px) */
  --mobile-section-gap: 3rem;      /* py-12 */
  --mobile-content-padding: 1rem;  /* px-4 */
  --mobile-card-padding: 1rem;     /* p-4 */
  --mobile-horizontal-gap: 0.75rem; /* gap-3 */

  /* Tablet (768px - 1024px) */
  --tablet-section-gap: 4rem;
  --tablet-content-padding: 1.5rem;
  --tablet-card-padding: 1.5rem;

  /* Desktop (> 1024px) */
  --desktop-section-gap: 6rem;
  --desktop-content-padding: 2rem;
  --desktop-card-padding: 1.5rem;
}

/* Implementation via Tailwind */
.section {
  @apply py-12 md:py-16 lg:py-24;
}

.content {
  @apply px-4 md:px-6 lg:px-8;
}
```

### 18.5 Mobile Typography

```css
/* Smaller base on mobile, scale up gradually */
:root {
  --mobile-h1: clamp(1.75rem, 1.5rem + 1.5vw, 2.5rem);
  --mobile-h2: clamp(1.375rem, 1.2rem + 1vw, 1.875rem);
  --mobile-h3: clamp(1.125rem, 1rem + 0.75vw, 1.5rem);
  --mobile-body: clamp(0.938rem, 0.875rem + 0.25vw, 1rem);
}

/* Rules:
 * - Headings: max 8 words on mobile
 * - Body: 16px minimum (prevent iOS zoom on focus)
 * - Line length: 45-75 characters optimal
 * - Line height: 1.5 untuk body, 1.2 untuk headings */
```

### 18.6 Bottom Navigation Component (Complete)

```tsx
// src/components/layout/BottomNav.tsx
import { Heart, House, MagnifyingGlass, PlusCircle, User } from '@phosphor-icons/react';
import { useLocation, Link } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  activeIcon: React.ElementType;
}

const defaultItems: NavItem[] = [
  { path: '/', label: 'Home', icon: House, activeIcon: House },
  { path: '/search', label: 'Search', icon: MagnifyingGlass, activeIcon: MagnifyingGlass },
  { path: '/create', label: 'Add', icon: PlusCircle, activeIcon: PlusCircle },
  { path: '/saved', label: 'Saved', icon: Heart, activeIcon: Heart },
  { path: '/profile', label: 'Profile', icon: User, activeIcon: User },
];

export function BottomNav({ items = defaultItems }: { items?: NavItem[] }) {
  const location = useLocation();

  // Hide on desktop
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pb-[env(safe-area-inset-bottom,0px)] lg:hidden">
      <div className="flex h-full items-center">
        {items.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 h-full transition-colors"
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={22}
                weight={isActive ? 'fill' : 'regular'}
                className={isActive ? 'text-amber-600' : 'text-zinc-500 dark:text-zinc-400'}
              />
              <span className={`text-[10px] leading-tight ${
                isActive
                  ? 'font-semibold text-amber-600'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

### 18.7 Mobile Gestures

| Gesture | Element | Function |
|---------|---------|----------|
| Tap | Button, link, card | Primary action |
| Double-tap | Image, video | Zoom |
| Long Press | Item | Context menu |
| Swipe Left | List item | Delete, archive |
| Swipe Right | List item | Mark done, call |
| Pinch | Image, map | Zoom in/out |
| Pull Down | Scrollable content | Refresh |
| Tap Top | Status bar area | Scroll to top |

### 18.8 Mobile Performance Checklist

```
□ Total bundle < 200KB (gzipped)
□ First Contentful Paint (FCP) < 1.5s
□ Largest Contentful Paint (LCP) < 2.5s
□ First Input Delay (FID) < 100ms
□ No render-blocking resources above fold
□ Images: lazy loading + WebP/AVIF format
□ Fonts: display=swap, subset if possible
□ No unused JavaScript on critical path
□ Touch events: passive where possible
□ Animations: GPU-accelerated (transform, opacity)
□ No 300ms tap delay (viewport meta)
□ safe-area-inset untuk notched devices
```

---

## 19. IMAGES & MEDIA

### 19.1 Stock Photo Resources

| Resource | URL | License | Best For |
|----------|-----|---------|----------|
| **Unsplash** | unsplash.com | Free (no attribution required but appreciated) | Hero images, backgrounds, lifestyle |
| **Pexels** | pexels.com | Free (CC0) | All-purpose stock photos |
| **Pixabay** | pixabay.com | Free (CC0) | Illustrations, vectors, videos |
| **Freepik** | freepik.com | Free with attribution / Paid without | Illustrations, templates |
| **Lorem Picsum** | picsum.photos | Free | Placeholder images, dev testing |
| **Placehold.co** | placehold.co | Free | Simple placeholder with text |

### 19.2 Direct Unsplash URLs (Production-Ready)

Format: `https://images.unsplash.com/photo-{PHOTO_ID}?w={WIDTH}&q={QUALITY}&auto=format`

```markdown
| Subject | Unsplash Photo ID | Preview URL |
|---------|------------------|-------------|
| Coffee shop interior | 1l4r5x3zDwkI | https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80 |
| Latte art | rTZv6gBmG_o | https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80 |
| Croissant | 6Fk0A33eCmk | https://images.unsplash.com/photo-1555507036-ab1f4038029a?w=800&q=80 |
| Brunch | 5Q7J1sF-5XU | https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&q=80 |
| Workspace coffee | 5QgSf05ozqE | https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&q=80 |
| Restaurant interior | 4JClS8oPgYU | https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80 |
| Nature landscape | 2TQw2X7nF9M | https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80 |
| Modern office | 5fIWeK8VYH0 | https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80 |
| City skyline night | G1aQ3Tv7Y5s | https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80 |
| Fashion portrait | 8BmN0reh8Pw | https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80 |

**Usage pattern:**
```tsx
<img
  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80&auto=format"
  srcSet="
    https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80&auto=format 400w,
    https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80&auto=format 800w,
    https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80&auto=format 1200w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Cafe interior with warm lighting"
  loading="lazy"
  decoding="async"
/>
```

### 19.3 Lorem Picsum (For Rapid Prototyping)

```
Basic:     https://picsum.photos/800/600
Seed:      https://picsum.photos/seed/cafe/800/600   (consistent image per seed)
Grayscale: https://picsum.photos/800/600?grayscale
Blur:      https://picsum.photos/800/600?blur=2
List:      https://picsum.photos/v2/list?page=1&limit=10
```

### 19.4 Image Optimization Checklist

```
□ Next-gen format: WebP (default) + AVIF (bonus) with JPEG fallback
□ Responsive images: srcSet + sizes attribute
□ Lazy loading: loading="lazy" on all below-fold images
□ Dimensions SET: width + height attributes (prevents CLS)
□ Aspect ratio: aspect-ratio CSS property
□ Alt text: descriptive, not "image" or "photo"
□ CDN delivery: use imgix, Cloudinary, or Unsplash API params
□ Compression: 80-85% quality for photos, lossless for graphics
□ Thumbnails: blur-up or low-quality-image-placeholders (LQIP)
```

### 19.5 Image Components

```tsx
// src/components/ui/Image.tsx
import { useState } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;  /* true = above-fold, no lazy loading */
  aspectRatio?: string;
}

export function Image({
  src, alt, width, height,
  className = '', priority = false,
  aspectRatio,
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 ${className}`}
      style={{ aspectRatio: aspectRatio || (width && height ? `${width}/${height}` : undefined) }}
    >
      {/* Blur placeholder */}
      <div className={`absolute inset-0 bg-zinc-200 dark:bg-zinc-700 animate-pulse ${loaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`} />

      {error ? (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
          <span>Failed to load image</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}
```

### 19.6 Background Images with Gradient Overlay

```tsx
/* Hero with background image + gradient overlay */

{/* Option 1: CSS background */}
<div
  className="relative bg-cover bg-center bg-no-repeat min-h-[60vh]"
  style={{ backgroundImage: `url(https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&q=80&auto=format)` }}
>
  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
  {/* Content */}
  <div className="relative z-10 flex items-center justify-center min-h-[60vh]">
    <h1 className="text-white text-4xl md:text-6xl font-bold">Hero Title</h1>
  </div>
</div>

{/* Option 2: <img> element (better performance) */}
<div className="relative min-h-[60vh]">
  <img
    src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&q=80&auto=format"
    alt=""
    className="absolute inset-0 h-full w-full object-cover"
    loading="eager"  /* hero should be eager */
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />
  <div className="relative z-10 flex items-center justify-center min-h-[60vh]">
    <h1 className="text-white text-4xl md:text-6xl font-bold">Hero Title</h1>
  </div>
</div>
```

### 19.7 Video Background

```tsx
<section className="relative h-screen overflow-hidden">
  <video
    autoPlay
    muted
    loop
    playsInline
    poster="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80&auto=format"
    className="absolute inset-0 h-full w-full object-cover"
  >
    <source src="https://cdn.example.com/hero-video.mp4" type="video/mp4" />
  </video>
  <div className="absolute inset-0 bg-black/40" />
  <div className="relative z-10 flex h-full items-center justify-center">
    <h1 className="text-white text-5xl font-bold">Welcome</h1>
  </div>
</section>
```

### 19.8 Gallery / Masonry Layout

```tsx
// Simple responsive image gallery
export function ImageGallery({ images }: { images: { src: string; alt: string }[] }) {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {images.map((img, i) => (
        <div key={i} className="break-inside-avoid overflow-hidden rounded-lg">
          <img
            src={`${img.src}?w=600&q=80&auto=format`}
            alt={img.alt}
            loading="lazy"
            className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      ))}
    </div>
  );
}
```

### 19.9 Image Aspect Ratios Reference

| Ratio | Class | Use Case |
|-------|-------|----------|
| 1:1 | aspect-square | Avatar, product, square card |
| 4:3 | aspect-[4/3] | Standard photo, tablet |
| 16:9 | aspect-video | Hero, video, widescreen |
| 3:2 | aspect-[3/2] | Landscape photo, print |
| 2:3 | aspect-[2/3] | Portrait, mobile screenshot |
| 21:9 | aspect-[21/9] | Cinematic hero, ultrawide |
| 9:16 | aspect-[9/16] | Instagram story, Reels |
| Golden | aspect-[1.618/1] | Editorial, premium layout |

### 19.10 Image Loading Strategies

```
Priority (above-fold):
  └─ loading="eager", decoding="sync"
  └─ Preload via <link rel="preload"> in <head>
  └─ Width + height SET (prevents CLS)

Lazy (below-fold):
  └─ loading="lazy", decoding="async"
  └─ IntersectionObserver with 200px rootMargin
  └─ Blur-up placeholder during load

Art Direction (different crops per breakpoint):
  └─ <picture> element with <source media="(max-width: 768px)">
  └─ Different aspect ratios per breakpoint
```

### 19.11 Accessibility for Images

```
□ ALL images MUST have alt text
  └─ Decorative: alt="" (empty string)
  └─ Informative: describe what's VISIBLE in the image
  └─ Functional: describe the function (e.g., "Search")
  └─ Complex: longdesc or adjacent text description

□ Icons with meaning:
  └─ <Icon aria-label="Search" /> or aria-hidden="true" if decorative

□ Background images:
  └─ Must not convey information that isn't available in text
  └─ If they do, add aria-label or sr-only text

□ Video / Animation:
  └─ No auto-play with sound
  └─ Pause button required for auto-play video
  └─ Captions for all video content
```
