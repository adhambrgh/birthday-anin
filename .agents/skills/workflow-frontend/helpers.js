/**
 * helpers.js — Shared utilities untuk workflow-frontend MCP server
 * 
 * Menyediakan fungsi-fungsi umum yang dipakai oleh semua tool modules.
 */

// ─── Type Definitions ────────────────────────────────────────────────────────

/**
 * @typedef {Object} ComponentParams
 * @property {'button'|'card'|'modal'|'navbar'|'dropdown'|'input'|'badge'|'tabs'|'accordion'|'select'|'textarea'|'tooltip'|'dialog'} type
 * @property {'react'|'vue'} [framework='react']
 * @property {'primary'|'secondary'|'ghost'|'outline'|'solid'} [variant='primary']
 * @property {Object} [options]
 * @property {boolean} [options.darkMode]
 * @property {boolean} [options.animations]
 * @property {'phosphor'|'radix'|'tabler'} [options.iconLibrary='phosphor']
 * @property {'sm'|'md'|'lg'|'full'|'none'} [options.rounded='md']
 * @property {'sm'|'md'|'lg'} [options.size='md']
 */

/**
 * @typedef {Object} SectionParams
 * @property {'hero'|'features'|'bento-grid'|'pricing'|'faq'|'cta'|'footer'|'stats'|'testimonials'|'logo-wall'|'sidebar'} type
 * @property {number} [design_variance=6]
 * @property {number} [motion_intensity=5]
 * @property {number} [visual_density=4]
 * @property {Object} [options]
 * @property {boolean} [options.darkMode]
 * @property {1|2|3|4} [options.columns]
 * @property {boolean} [options.withAnimation]
 * @property {boolean} [options.withImages]
 */

/**
 * @typedef {Object} AnimationParams
 * @property {'sticky-stack'|'horizontal-pan'|'scroll-reveal'|'text-split'|'counter'|'marquee'|'parallax'|'page-transition'|'magnetic-hover'|'typewriter'} type
 * @property {'gsap'|'framer-motion'|'css'} [library='gsap']
 * @property {Object} [options]
 * @property {boolean} [options.withReducedMotion=true]
 * @property {number} [options.duration]
 * @property {number} [options.stagger]
 */

/**
 * @typedef {Object} CSSParams
 * @property {'fluid-typography'|'custom-scrollbar'|'mesh-gradient'|'glassmorphism'|'grain-overlay'|'crt-scanlines'|'button-variants'|'noise-texture'|'focus-ring'|'skeleton-loader'} type
 * @property {'css'|'tailwind'} [format='tailwind']
 */

/**
 * @typedef {Object} AuditParams
 * @property {string} code
 * @property {'tsx'|'jsx'|'html'|'css'|'vue'} [language='tsx']
 */

/**
 * @typedef {Object} ScaffoldParams
 * @property {'react-ts'|'vue'|'vanilla'} [stack='react-ts']
 * @property {string[]} [features]
 * @property {Object} [options]
 * @property {'npm'|'yarn'|'pnpm'|'bun'} [options.packageManager='npm']
 * @property {boolean} [options.withGit=true]
 */

/**
 * @typedef {Object} Violation
 * @property {number} line
 * @property {string} pattern
 * @property {'error'|'warning'|'info'} severity
 * @property {string} explanation
 * @property {string} fix
 */

// ─── Utility Functions ───────────────────────────────────────────────────────

/**
 * Indent setiap baris dalam string dengan level tertentu.
 * @param {string} text - Teks yang akan di-indent
 * @param {number} level - Jumlah level indentasi (1 level = 2 spasi)
 * @returns {string}
 */
export function indent(text, level = 1) {
  const spaces = '  '.repeat(level);
  return text
    .split('\n')
    .map(line => (line.trim() ? spaces + line : line))
    .join('\n');
}

/**
 * Bungkus kode dalam komponen React/TSX.
 * @param {string} code - Kode internal komponen
 * @param {string} name - Nama komponen (PascalCase)
 * @param {Object} [opts]
 * @param {boolean} [opts.useClient=false] - Tambahkan 'use client' directive
 * @param {string[]} [opts.imports=[]] - Import statements tambahan
 * @returns {string}
 */
export function wrapInComponent(code, name, opts = {}) {
  const { useClient = false, imports = [] } = opts;
  const parts = [];

  if (useClient) {
    parts.push(`"use client";\n`);
  }

  if (imports.length > 0) {
    parts.push(imports.join('\n'));
    parts.push('');
  }

  parts.push(`export function ${name}({ className, ...props }: { className?: string; [key: string]: any }) {`);
  parts.push(indent(code, 1));
  parts.push('}');

  return parts.join('\n');
}

/**
 * Escape HTML special characters.
 * @param {string} text
 * @returns {string}
 */
export function escapeHTML(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generate class name string dari Tailwind classes.
 * @param {Record<string, boolean|undefined>} classes
 * @returns {string}
 */
export function cn(classes) {
  return Object.entries(classes)
    .filter(([, val]) => val)
    .map(([key]) => key)
    .join(' ');
}

/**
 * Konversi icon library name ke import path.
 * @param {'phosphor'|'radix'|'tabler'} lib
 * @returns {{ pkg: string, prefix: string }}
 */
export function getIconLibrary(lib = 'phosphor') {
  const libs = {
    phosphor: { pkg: '@phosphor-icons/react', prefix: '' },
    radix: { pkg: '@radix-ui/react-icons', prefix: '' },
    tabler: { pkg: '@tabler/icons-react', prefix: 'Icon' },
  };
  return libs[lib] || libs.phosphor;
}

/**
 * Dapatkan Tailwind classes untuk rounded berdasarkan ukuran.
 * @param {'sm'|'md'|'lg'|'full'|'none'} rounded
 * @returns {string}
 */
export function getRoundedClass(rounded = 'md') {
  const map = { sm: 'rounded-lg', md: 'rounded-xl', lg: 'rounded-2xl', full: 'rounded-full', none: 'rounded-none' };
  return map[rounded] || map.md;
}

/**
 * Dapatkan Tailwind classes untuk size variant.
 * @param {'sm'|'md'|'lg'} size
 * @returns {{ padding: string, text: string, gap: string }}
 */
export function getSizeClasses(size = 'md') {
  const sizes = {
    sm: { padding: 'px-3 py-1.5', text: 'text-sm', gap: 'gap-1.5' },
    md: { padding: 'px-4 py-2', text: 'text-sm', gap: 'gap-2' },
    lg: { padding: 'px-6 py-3', text: 'text-base', gap: 'gap-2.5' },
  };
  return sizes[size] || sizes.md;
}

/**
 * Dapatkan variant-specific Tailwind classes untuk button.
 * @param {'primary'|'secondary'|'ghost'|'outline'|'solid'} variant
 * @param {boolean} darkMode
 * @returns {{ base: string, hover: string, active: string, focus: string, disabled: string }}
 */
export function getButtonVariantClasses(variant = 'primary', darkMode = false) {
  const d = darkMode;
  const variants = {
    primary: {
      base: `bg-zinc-900 text-white ${d ? 'dark:bg-white dark:text-zinc-900' : ''}`,
      hover: `hover:bg-zinc-800 ${d ? 'dark:hover:bg-zinc-200' : ''}`,
      active: `active:bg-zinc-950 ${d ? 'dark:active:bg-zinc-300' : ''} active:scale-[0.98]`,
      focus: `focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${d ? 'dark:focus-visible:ring-white' : ''}`,
      disabled: `disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-900`,
    },
    secondary: {
      base: `bg-zinc-100 text-zinc-900 ${d ? 'dark:bg-zinc-800 dark:text-zinc-100' : ''}`,
      hover: `hover:bg-zinc-200 ${d ? 'dark:hover:bg-zinc-700' : ''}`,
      active: `active:bg-zinc-300 ${d ? 'dark:active:bg-zinc-600' : ''} active:scale-[0.98]`,
      focus: `focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2`,
      disabled: `disabled:opacity-50 disabled:cursor-not-allowed`,
    },
    ghost: {
      base: `bg-transparent text-zinc-900 ${d ? 'dark:text-zinc-100' : ''}`,
      hover: `hover:bg-zinc-100 ${d ? 'dark:hover:bg-zinc-800' : ''}`,
      active: `active:bg-zinc-200 ${d ? 'dark:active:bg-zinc-700' : ''}`,
      focus: `focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2`,
      disabled: `disabled:opacity-50 disabled:cursor-not-allowed`,
    },
    outline: {
      base: `bg-transparent border border-zinc-300 text-zinc-900 ${d ? 'dark:border-zinc-600 dark:text-zinc-100' : ''}`,
      hover: `hover:bg-zinc-50 ${d ? 'dark:hover:bg-zinc-800' : ''}`,
      active: `active:bg-zinc-100 ${d ? 'dark:active:bg-zinc-700' : ''} active:scale-[0.98]`,
      focus: `focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2`,
      disabled: `disabled:opacity-50 disabled:cursor-not-allowed`,
    },
    solid: {
      base: `bg-zinc-900 text-white ${d ? 'dark:bg-white dark:text-zinc-900' : ''}`,
      hover: `hover:bg-zinc-800 ${d ? 'dark:hover:bg-zinc-200' : ''}`,
      active: `active:bg-zinc-950 ${d ? 'dark:active:bg-zinc-300' : ''} active:scale-[0.98]`,
      focus: `focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2`,
      disabled: `disabled:opacity-50 disabled:cursor-not-allowed`,
    },
  };
  return variants[variant] || variants.primary;
}

/**
 * Dapatkan import statements untuk icon library.
 * @param {'phosphor'|'radix'|'tabler'} lib
 * @param {string[]} icons
 * @returns {string}
 */
export function getIconImports(lib, icons) {
  const info = getIconLibrary(lib);
  const iconNames = icons.map(name => `${info.prefix}${name}`);
  return `import { ${iconNames.join(', ')} } from '${info.pkg}';`;
}

/**
 * Generate custom scrollbar CSS — wajib di setiap project.
 * @param {boolean} darkMode
 * @returns {string}
 */
export function getScrollbarCSS(darkMode = false) {
  if (darkMode) {
    return `/* Custom scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: hsl(0 0% 40%); border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: hsl(0 0% 60%); }`;
  }
  return `/* Custom scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: hsl(0 0% 60%); border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: hsl(0 0% 40%); }`;
}

/**
 * Generate skeleton loader CSS.
 * @returns {string}
 */
export function getSkeletonCSS() {
  return `@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, 
    hsl(0 0% 90%) 25%, 
    hsl(0 0% 95%) 50%, 
    hsl(0 0% 90%) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 0.5rem;
}
.dark .skeleton {
  background: linear-gradient(90deg, 
    hsl(0 0% 20%) 25%, 
    hsl(0 0% 30%) 50%, 
    hsl(0 0% 20%) 75%
  );
  background-size: 200% 100%;
}`;
}

/**
 * Generate focus ring CSS utility.
 * @returns {string}
 */
export function getFocusRingCSS() {
  return `/* Focus ring utility — WCAG compliant */
.focus-ring {
  outline: none;
}
.focus-ring:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`;
}

/**
 * Validate numeric param with range.
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @param {number} fallback
 * @returns {number}
 */
export function clamp(val, min, max, fallback) {
  const num = Number(val);
  if (isNaN(num)) return fallback;
  return Math.max(min, Math.min(max, num));
}
