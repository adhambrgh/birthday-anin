/**
 * css-utils.js — Tool 4: wf_css
 * 
 * Generate CSS/Tailwind utilities untuk 10 tipe efek visual.
 * Output ready to copy-paste.
 */

// ─── Main Generator ─────────────────────────────────────────────────────────

/**
 * Generate CSS/Tailwind code.
 * @param {import('./helpers.js').CSSParams} params
 * @returns {{ code: string, description: string }}
 */
export function generateCSS(params) {
  const {
    type = 'fluid-typography',
    format = 'tailwind',
  } = params;

  const generators = {
    'fluid-typography': () => genFluidTypography(format),
    'custom-scrollbar': () => genCustomScrollbar(format),
    'mesh-gradient': () => genMeshGradient(format),
    'glassmorphism': () => genGlassmorphism(format),
    'grain-overlay': () => genGrainOverlay(format),
    'crt-scanlines': () => genCRTScanlines(format),
    'button-variants': () => genButtonVariants(format),
    'noise-texture': () => genNoiseTexture(format),
    'focus-ring': () => genFocusRing(format),
    'skeleton-loader': () => genSkeletonLoader(format),
  };

  const generator = generators[type];
  if (!generator) {
    return {
      code: `/* Error: Unknown CSS type "${type}" */`,
      description: `Tipe CSS "${type}" tidak dikenal.`,
    };
  }

  return generator();
}

// ─── CSS Generators ─────────────────────────────────────────────────────────

/**
 * Fluid Typography — clamp() based scale.
 */
function genFluidTypography(format) {
  const css = `/* === Fluid Type Scale === */
/* Base: 16px. Scale: Major Third (1.25). Viewport: 375px - 1440px */

:root {
  --text-xs: clamp(0.75rem, 0.17vw + 0.71rem, 0.84rem);
  --text-sm: clamp(0.8rem, 0.17vw + 0.76rem, 0.89rem);
  --text-base: clamp(1rem, 0.34vw + 0.91rem, 1.19rem);
  --text-lg: clamp(1.25rem, 0.61vw + 1.1rem, 1.58rem);
  --text-xl: clamp(1.56rem, 1vw + 1.31rem, 2.11rem);
  --text-2xl: clamp(1.95rem, 1.56vw + 1.56rem, 2.81rem);
  --text-3xl: clamp(2.44rem, 2.38vw + 1.85rem, 3.75rem);
  --text-4xl: clamp(3.05rem, 3.54vw + 2.17rem, 5rem);
  --text-5xl: clamp(3.81rem, 5.18vw + 2.52rem, 6.66rem);
  --text-6xl: clamp(4.77rem, 7.48vw + 2.9rem, 8.88rem);
}

/* Usage */
.fluid-h1 {
  font-size: var(--text-4xl);
  line-height: 1.1;
  letter-spacing: -0.03em;
  font-weight: 700;
}

.fluid-h2 {
  font-size: var(--text-3xl);
  line-height: 1.15;
  letter-spacing: -0.02em;
  font-weight: 600;
}

.fluid-body {
  font-size: var(--text-base);
  line-height: 1.6;
  max-width: 65ch;
}

.fluid-small {
  font-size: var(--text-sm);
  line-height: 1.5;
}

/* === Tailwind v4 Extension === */
/* Add to your CSS file:
@theme {
  --text-fluid-xs: clamp(0.75rem, 0.17vw + 0.71rem, 0.84rem);
  --text-fluid-sm: clamp(0.8rem, 0.17vw + 0.76rem, 0.89rem);
  --text-fluid-base: clamp(1rem, 0.34vw + 0.91rem, 1.19rem);
  --text-fluid-lg: clamp(1.25rem, 0.61vw + 1.1rem, 1.58rem);
  --text-fluid-xl: clamp(1.56rem, 1vw + 1.31rem, 2.11rem);
  --text-fluid-2xl: clamp(1.95rem, 1.56vw + 1.56rem, 2.81rem);
  --text-fluid-3xl: clamp(2.44rem, 2.38vw + 1.85rem, 3.75rem);
  --text-fluid-4xl: clamp(3.05rem, 3.54vw + 2.17rem, 5rem);
}
*/`;

  if (format === 'tailwind') {
    return {
      code: `/* === Fluid Typography — Tailwind v4 === */
/* Add to your app.css or globals.css */

@theme {
  --text-fluid-xs: clamp(0.75rem, 0.17vw + 0.71rem, 0.84rem);
  --text-fluid-sm: clamp(0.8rem, 0.17vw + 0.76rem, 0.89rem);
  --text-fluid-base: clamp(1rem, 0.34vw + 0.91rem, 1.19rem);
  --text-fluid-lg: clamp(1.25rem, 0.61vw + 1.1rem, 1.58rem);
  --text-fluid-xl: clamp(1.56rem, 1vw + 1.31rem, 2.11rem);
  --text-fluid-2xl: clamp(1.95rem, 1.56vw + 1.56rem, 2.81rem);
  --text-fluid-3xl: clamp(2.44rem, 2.38vw + 1.85rem, 3.75rem);
  --text-fluid-4xl: clamp(3.05rem, 3.54vw + 2.17rem, 5rem);
  --text-fluid-5xl: clamp(3.81rem, 5.18vw + 2.52rem, 6.66rem);
  --text-fluid-6xl: clamp(4.77rem, 7.48vw + 2.9rem, 8.88rem);
}

/* Usage: text-fluid-4xl font-bold tracking-tighter */`,
      description: 'Fluid typography scale — clamp() based, viewport 375px-1440px, Major Third ratio. Format: Tailwind v4 @theme.',
    };
  }

  return { code: css, description: 'Fluid typography scale — clamp() based, viewport 375px-1440px, Major Third ratio. Format: CSS custom properties.' };
}

/**
 * Custom scrollbar — light + dark mode.
 */
function genCustomScrollbar(format) {
  const css = `/* === Custom Scrollbar === */
/* Light mode */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: hsl(0 0% 60%);
  border-radius: 999px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(0 0% 40%);
}

/* Dark mode */
.dark ::-webkit-scrollbar-thumb {
  background: hsl(0 0% 40%);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: hsl(0 0% 60%);
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: hsl(0 0% 60%) transparent;
}

.dark * {
  scrollbar-color: hsl(0 0% 40%) transparent;
}`;

  if (format === 'tailwind') {
    return {
      code: `/* === Custom Scrollbar — Tailwind v4 === */
/* Tambahkan di file CSS utama Anda */

@layer base {
  * {
    scrollbar-width: thin;
    scrollbar-color: hsl(0 0% 60%) transparent;
  }

  .dark * {
    scrollbar-color: hsl(0 0% 40%) transparent;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: hsl(0 0% 60%);
    border-radius: 999px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: hsl(0 0% 40%);
  }

  .dark ::-webkit-scrollbar-thumb {
    background: hsl(0 0% 40%);
  }

  .dark ::-webkit-scrollbar-thumb:hover {
    background: hsl(0 0% 60%);
  }
}`,
      description: 'Custom scrollbar — 6px, rounded full, transparent track. Light + dark mode. Firefox support via scrollbar-width.',
    };
  }

  return { code: css, description: 'Custom scrollbar — 6px, rounded full, transparent track. Light + dark mode. Firefox support.' };
}

/**
 * Mesh gradient — animated radial gradients.
 */
function genMeshGradient(format) {
  const css = `/* === Animated Mesh Gradient === */
.mesh-gradient {
  background:
    radial-gradient(ellipse 80% 50% at 0% 0%, rgba(79, 70, 229, 0.4), transparent),
    radial-gradient(ellipse 50% 50% at 100% 0%, rgba(236, 72, 153, 0.3), transparent),
    radial-gradient(ellipse 50% 80% at 50% 100%, rgba(251, 146, 60, 0.3), transparent),
    radial-gradient(ellipse 50% 50% at 0% 100%, rgba(6, 182, 212, 0.3), transparent);
  animation: meshShift 15s ease infinite;
  background-size: 200% 200%;
}

@keyframes meshShift {
  0% { background-position: 0% 0%; }
  25% { background-position: 100% 0%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
  100% { background-position: 0% 0%; }
}

/* Dark mode variant */
.dark .mesh-gradient {
  background:
    radial-gradient(ellipse 80% 50% at 0% 0%, rgba(99, 102, 241, 0.25), transparent),
    radial-gradient(ellipse 50% 50% at 100% 0%, rgba(168, 85, 247, 0.2), transparent),
    radial-gradient(ellipse 50% 80% at 50% 100%, rgba(236, 72, 153, 0.15), transparent),
    radial-gradient(ellipse 50% 50% at 0% 100%, rgba(14, 165, 233, 0.2), transparent);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .mesh-gradient {
    animation: none;
  }
}`;

  return {
    code: css,
    description: 'Animated mesh gradient — 4 radial gradients with slow shift animation. Dark mode variant. Reduced motion safe.',
  };
}

/**
 * Glassmorphism — proper frosted glass.
 */
function genGlassmorphism(format) {
  const css = `/* === Glassmorphism === */
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1rem;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.12);
}

/* Dark glass */
.dark .glass {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Solid fallback for reduced transparency */
@media (prefers-reduced-transparency: reduce) {
  .glass {
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .dark .glass {
    background: rgba(0, 0, 0, 0.96);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
}`;

  return {
    code: css,
    description: 'Glassmorphism — backdrop-filter blur, saturate, inner highlight, dark mode, prefers-reduced-transparency solid fallback.',
  };
}

/**
 * Grain overlay — fixed, pointer-events-none.
 */
function genGrainOverlay(format) {
  const css = `/* === Grain / Noise Overlay === */
.grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  opacity: 0.03;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 200px 200px;
}

/* Dark mode: ubah opacity */
.dark .grain-overlay {
  opacity: 0.04;
  mix-blend-mode: screen;
}

/* Reduced motion: tetap static (tidak ada animasi grain) */`;

  return {
    code: css,
    description: 'Grain overlay — SVG noise sebagai base64, fixed position, pointer-events-none, z-index 9998. Dark mode support.',
  };
}

/**
 * CRT Scanlines — industrial effect.
 */
function genCRTScanlines(format) {
  const css = `/* === CRT Scanlines (Industrial) === */
.crt-scanlines {
  position: relative;
  overflow: hidden;
}

.crt-scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.08) 2px,
    rgba(0, 0, 0, 0.08) 4px
  );
}

/* Dark mode scanlines */
.dark .crt-scanlines::after {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.03) 2px,
    rgba(255, 255, 255, 0.03) 4px
  );
}

/* Inner glow (CRT bloom) */
.crt-glow {
  box-shadow:
    inset 0 0 60px rgba(0, 0, 0, 0.1),
    inset 0 0 100px rgba(0, 0, 0, 0.05);
}

.dark .crt-glow {
  box-shadow:
    inset 0 0 60px rgba(0, 0, 0, 0.3),
    inset 0 0 100px rgba(0, 0, 0, 0.2);
}

/* Reduced motion: tetap static */`;

  return {
    code: css,
    description: 'CRT Scanlines — repeating-linear-gradient scanlines via ::after pseudo-element. Dark mode. Industrial / retro effect.',
  };
}

/**
 * Button variants — comprehensive CSS.
 */
function genButtonVariants(format) {
  const css = `/* === Button Variants === */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  white-space: nowrap;
  outline: none;
}

/* Sizes */
.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8rem;
  border-radius: 0.5rem;
}

.btn-md {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: 0.75rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.875rem;
}

/* Variants */
.btn-primary {
  background: #111111;
  color: white;
}
.btn-primary:hover {
  background: #272727;
}
.btn-primary:active {
  background: #000000;
  transform: scale(0.98);
}

.btn-secondary {
  background: #f4f4f5;
  color: #111111;
}
.btn-secondary:hover {
  background: #e4e4e7;
}
.btn-secondary:active {
  background: #d4d4d8;
  transform: scale(0.98);
}

.btn-ghost {
  background: transparent;
  color: #111111;
}
.btn-ghost:hover {
  background: #f4f4f5;
}

.btn-outline {
  background: transparent;
  border: 1px solid #d4d4d8;
  color: #111111;
}
.btn-outline:hover {
  background: #fafafa;
}

/* States */
.btn:focus-visible {
  ring: 2px solid #111111;
  ring-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Loading */
.btn-loading {
  position: relative;
  color: transparent;
  pointer-events: none;
}
.btn-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: btn-spin 0.6s linear infinite;
}
@keyframes btn-spin {
  to { transform: rotate(360deg); }
}

/* Dark mode */
.dark .btn-primary {
  background: white;
  color: #111111;
}
.dark .btn-primary:hover {
  background: #e4e4e7;
}
.dark .btn-secondary {
  background: #272727;
  color: white;
}
.dark .btn-secondary:hover {
  background: #3f3f46;
}`;

  return {
    code: css,
    description: 'Button variants — primary, secondary, ghost, outline. Sizes sm/md/lg. Loading spinner, disabled, focus-visible, dark mode.',
  };
}

/**
 * Noise texture — base64 SVG noise untuk background.
 */
function genNoiseTexture(format) {
  const css = `/* === Noise Texture === */
.noise-texture {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
  opacity: 0.035;
  mix-blend-mode: overlay;
  pointer-events: none;
}

/* As a fixed overlay */
.noise-fixed {
  position: fixed;
  inset: 0;
  z-index: 9997;
  pointer-events: none;
  opacity: 0.025;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}

/* Dark mode — adjust opacity */
.dark .noise-fixed {
  opacity: 0.04;
  mix-blend-mode: screen;
}`;

  return {
    code: css,
    description: 'Noise texture — SVG fractal noise sebagai background. Tersedia sebagai texture dan fixed overlay. Dark mode support.',
  };
}

/**
 * Focus ring — WCAG compliant.
 */
function genFocusRing(format) {
  const css = `/* === Focus Ring (WCAG AA) === */
/* Apply to interactive elements: buttons, links, inputs, etc. */

.focus-ring {
  outline: none;
}

.focus-ring:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Variant: dark background */
.focus-ring-light:focus-visible {
  outline: 2px solid white;
  outline-offset: 2px;
}

/* Variant: offset ring with box-shadow (for inputs, etc) */
.focus-ring-shadow:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px white, 0 0 0 4px currentColor;
  border-radius: 4px;
}

/* Tailwind v4 focus ring (default) */
/* Use: focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 outline-none */

/* Respect reduced motion — focus ring tetap penting untuk aksesibilitas */
/* JANGAN nonaktifkan focus ring di prefers-reduced-motion */`;

  return {
    code: css,
    description: 'Focus ring — WCAG AA compliant. Multiple variants (default, light background, shadow-based). JANGAN dinonaktifkan untuk reduced motion.',
  };
}

/**
 * Skeleton loader — shimmer effect.
 */
function genSkeletonLoader(format) {
  const css = `/* === Skeleton Loader === */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    hsl(0 0% 90%) 25%,
    hsl(0 0% 96%) 50%,
    hsl(0 0% 90%) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 0.5rem;
}

/* Dark mode */
.dark .skeleton {
  background: linear-gradient(
    90deg,
    hsl(0 0% 20%) 25%,
    hsl(0 0% 28%) 50%,
    hsl(0 0% 20%) 75%
  );
  background-size: 200% 100%;
}

/* Skeleton shapes */
.skeleton-text {
  height: 1em;
  width: 100%;
  margin-bottom: 0.5em;
}

.skeleton-text:last-child {
  width: 60%;
}

.skeleton-heading {
  height: 1.5em;
  width: 60%;
  margin-bottom: 1em;
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 999px;
}

.skeleton-thumbnail {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 0.75rem;
}

.skeleton-button {
  height: 2.5rem;
  width: 8rem;
  border-radius: 0.75rem;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
    background: hsl(0 0% 90%);
  }
  .dark .skeleton {
    background: hsl(0 0% 22%);
  }
}`;

  return {
    code: css,
    description: 'Skeleton loader — shimmer animation, dark mode, common shapes (text, heading, avatar, thumbnail, button). Reduced motion safe.',
  };
}
