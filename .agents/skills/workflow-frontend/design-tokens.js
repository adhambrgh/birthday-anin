/**
 * design-tokens.js — Tool 8: wf_design-tokens
 * 
 * Generate design token CSS/JSON dari parameter.
 * Mengacu ke Section 8 DESIGN SYSTEM.
 */

export function generateDesignTokens(params = {}) {
  const {
    type = 'spacing',
    format = 'css',
    theme = 'light',
    includeDark = false,
    scale = 'default',
    customBase = 16,
  } = params;

  let output = '';

  if (type === 'spacing') {
    const spaces = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64];
    const pxPerRem = customBase;
    
    output += `/* ── Spacing Scale ── */\n`;
    output += `/* Base: ${customBase}px grid | 4px base unit */\n`;
    output += `/* Scale: ${scale} */\n\n`;

    if (format === 'css') {
      output += ':root {\n';
      spaces.forEach(s => {
        const px = s * 4;
        const rem = px / pxPerRem;
        output += `  --space-${s}: ${rem}rem;  /* ${px}px */\n`;
      });
      output += '}\n\n';

      output += '/* CSS usage: margin: var(--space-4); */\n';
      output += '/* Tailwind v4: @theme { --space-* } */\n';
    } else if (format === 'tailwind') {
      output += '@theme {\n';
      spaces.forEach(s => {
        const px = s * 4;
        const rem = px / pxPerRem;
        output += `  --space-${s}: ${rem}rem;\n`;
      });
      output += '}\n';
    } else if (format === 'json') {
      const jsonOutput = {};
      spaces.forEach(s => {
        const px = s * 4;
        const rem = px / pxPerRem;
        jsonOutput[`space-${s}`] = `${rem}rem`;
      });
      output += JSON.stringify(jsonOutput, null, 2);
    }
  }

  if (type === 'typography') {
    const scales = {
      'minor-second': 1.067,
      'major-second': 1.125,
      'minor-third': 1.2,
      'major-third': 1.25,
      'perfect-fourth': 1.333,
      'augmented-fourth': 1.414,
      'perfect-fifth': 1.5,
      'golden-ratio': 1.618,
    };
    const ratio = scales[scale] || scales['major-third'];
    const base = 1; // 1rem = 16px

    if (format === 'css') {
      output += '/* ── Fluid Typography Scale ── */\n';
      output += `/* Ratio: ${scale} (${ratio}) */\n`;
      output += '/* Viewport: 375px → 1440px */\n\n';
      output += ':root {\n';

      const sizes = [
        { name: 'xs', base: 0.75, minRatio: 0.7, maxRatio: 0.25, maxSize: 0.875 },
        { name: 'sm', base: 0.875, minRatio: 0.8, maxRatio: 0.37, maxSize: 1 },
        { name: 'base', base: 1, minRatio: 0.92, maxRatio: 0.39, maxSize: 1.125 },
        { name: 'lg', base: 1.125, minRatio: 1, maxRatio: 0.62, maxSize: 1.25 },
        { name: 'xl', base: 1.25, minRatio: 1.1, maxRatio: 0.75, maxSize: 1.5 },
        { name: '2xl', base: 1.5, minRatio: 1.25, maxRatio: 1.25, maxSize: 2 },
        { name: '3xl', base: 1.875, minRatio: 1.5, maxRatio: 1.87, maxSize: 2.5 },
        { name: '4xl', base: 2.25, minRatio: 1.75, maxRatio: 2.5, maxSize: 3 },
        { name: '5xl', base: 3, minRatio: 2.25, maxRatio: 3.75, maxSize: 4 },
        { name: '6xl', base: 3.75, minRatio: 2.75, maxRatio: 5, maxSize: 5 },
        { name: '7xl', base: 4.5, minRatio: 3, maxRatio: 7.5, maxSize: 6 },
      ];

      sizes.forEach(s => {
        output += `  --text-${s.name}: clamp(${s.base}rem, ${s.minRatio}rem + ${s.maxRatio}vw, ${s.maxSize}rem);\n`;
      });

      output += '\n  /* Line heights */\n';
      output += '  --leading-tight: 1.1;\n';
      output += '  --leading-snug: 1.25;\n';
      output += '  --leading-normal: 1.5;\n';
      output += '  --leading-relaxed: 1.625;\n';
      output += '  --leading-loose: 2;\n';
      output += '}\n';
    } else if (format === 'tailwind') {
      output += '@theme {\n';
      const sizes = [
        { name: 'xs', clamp: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)' },
        { name: 'sm', clamp: 'clamp(0.875rem, 0.8rem + 0.37vw, 1rem)' },
        { name: 'base', clamp: 'clamp(1rem, 0.92rem + 0.39vw, 1.125rem)' },
        { name: 'lg', clamp: 'clamp(1.125rem, 1rem + 0.62vw, 1.25rem)' },
        { name: 'xl', clamp: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)' },
        { name: '2xl', clamp: 'clamp(1.5rem, 1.25rem + 1.25vw, 2rem)' },
        { name: '3xl', clamp: 'clamp(1.875rem, 1.5rem + 1.87vw, 2.5rem)' },
        { name: '4xl', clamp: 'clamp(2.25rem, 1.75rem + 2.5vw, 3rem)' },
        { name: '5xl', clamp: 'clamp(3rem, 2.25rem + 3.75vw, 4rem)' },
        { name: '6xl', clamp: 'clamp(3.75rem, 2.75rem + 5vw, 5rem)' },
        { name: '7xl', clamp: 'clamp(4.5rem, 3rem + 7.5vw, 6rem)' },
      ];
      sizes.forEach(s => {
        output += `  --text-${s.name}: ${s.clamp};\n`;
      });
      output += '}\n';
    } else if (format === 'json') {
      const jsonOutput = { ratio: ratio, scale: scale, sizes: {} };
      const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'];
      sizes.forEach(s => {
        jsonOutput.sizes[s] = `${base * Math.pow(ratio, sizes.indexOf(s))}rem`;
      });
      output += JSON.stringify(jsonOutput, null, 2);
    }
  }

  if (type === 'shadows') {
    if (format === 'css') {
      output += '/* ── Elevation & Shadow System ── */\n\n';
      output += ':root {\n';
      output += '  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.03);\n';
      output += '  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05);\n';
      output += '  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05);\n';
      output += '  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04);\n';
      output += '  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05);\n';
      output += '  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.15);\n';
      output += '  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);\n';
      output += '}\n\n';
      output += '/* Layer usage:\n';
      output += ' * Layer 0 (base): no shadow\n';
      output += ' * Layer 1 (raised): shadow-sm — cards\n';
      output += ' * Layer 2 (elevated): shadow-md — sticky headers\n';
      output += ' * Layer 3 (floating): shadow-lg — dropdowns\n';
      output += ' * Layer 4 (overlay): shadow-xl — modals\n';
      output += ' * Layer 5 (top): shadow-2xl — tooltips, toasts\n';
      output += ' */\n';
    }
  }

  if (type === 'motion') {
    if (format === 'css') {
      output += '/* ── Motion Design Tokens ── */\n\n';
      output += ':root {\n';
      output += '  /* Easing */\n';
      output += '  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);\n';
      output += '  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);\n';
      output += '  --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);\n';
      output += '  --ease-bounce: cubic-bezier(0.68, -0.55, 0.27, 1.55);\n\n';
      output += '  /* Durations */\n';
      output += '  --duration-micro: 100ms;\n';
      output += '  --duration-tiny: 150ms;\n';
      output += '  --duration-fast: 200ms;\n';
      output += '  --duration-normal: 300ms;\n';
      output += '  --duration-slow: 500ms;\n';
      output += '  --duration-epic: 1000ms;\n';
      output += '}\n';
    }
  }

  if (type === 'all') {
    output += '/* ═══════════════════════════════════════ */\n';
    output += '/*  COMPLETE DESIGN TOKEN SYSTEM          */\n';
    output += '/* ═══════════════════════════════════════ */\n\n';

    // Spacing
    output += '/* ── 1. SPACING ── */\n';
    output += ':root {\n';
    [0,1,2,3,4,5,6,8,10,12,14,16,20,24,28,32,40,48,56,64].forEach(s => {
      output += `  --space-${s}: ${(s*4)/16}rem;  /* ${s*4}px */\n`;
    });
    output += '}\n\n';

    // Typography
    output += '/* ── 2. FLUID TYPOGRAPHY ── */\n';
    output += ':root {\n';
    output += '  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);\n';
    output += '  --text-sm: clamp(0.875rem, 0.8rem + 0.37vw, 1rem);\n';
    output += '  --text-base: clamp(1rem, 0.92rem + 0.39vw, 1.125rem);\n';
    output += '  --text-lg: clamp(1.125rem, 1rem + 0.62vw, 1.25rem);\n';
    output += '  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);\n';
    output += '  --text-2xl: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);\n';
    output += '  --text-3xl: clamp(1.875rem, 1.5rem + 1.87vw, 2.5rem);\n';
    output += '  --text-4xl: clamp(2.25rem, 1.75rem + 2.5vw, 3rem);\n';
    output += '  --text-5xl: clamp(3rem, 2.25rem + 3.75vw, 4rem);\n';
    output += '  --text-6xl: clamp(3.75rem, 2.75rem + 5vw, 5rem);\n';
    output += '}\n\n';

    // Shadows
    output += '/* ── 3. SHADOWS ── */\n';
    output += ':root {\n';
    output += '  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);\n';
    output += '  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);\n';
    output += '  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);\n';
    output += '  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);\n';
    output += '  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);\n';
    output += '}\n\n';

    // Radius
    output += '/* ── 4. BORDER RADIUS ── */\n';
    output += ':root {\n';
    output += '  --radius-none: 0px;\n';
    output += '  --radius-sm: 0.125rem;\n';
    output += '  --radius-md: 0.375rem;\n';
    output += '  --radius-lg: 0.5rem;\n';
    output += '  --radius-xl: 0.75rem;\n';
    output += '  --radius-2xl: 1rem;\n';
    output += '  --radius-3xl: 1.5rem;\n';
    output += '  --radius-full: 9999px;\n';
    output += '}\n\n';

    // Motion
    output += '/* ── 5. MOTION ── */\n';
    output += ':root {\n';
    output += '  --duration-fast: 150ms;\n';
    output += '  --duration-normal: 200ms;\n';
    output += '  --duration-slow: 300ms;\n';
    output += '  --ease-out: cubic-bezier(0, 0, 0.2, 1);\n';
    output += '  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);\n';
    output += '}\n\n';

    output += '/* End of Design Token System */\n';
  }

  return output;
}
