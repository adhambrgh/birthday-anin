/**
 * scaffold.js — Tool 6: wf_scaffold
 * 
 * Generate project setup commands untuk React TS, Vue, atau vanilla.
 * Output: terminal commands + penjelasan setiap step.
 */

// ─── Default Features ───────────────────────────────────────────────────────

const ALL_FEATURES = [
  'routing',
  'state-management',
  'testing',
  'animations',
  'form-handling',
  'shadcn-ui',
  'pwa',
];

// ─── Main Generator ─────────────────────────────────────────────────────────

/**
 * Generate scaffold commands.
 * @param {import('./helpers.js').ScaffoldParams} params
 * @returns {{ steps: Array<{ command: string, description: string, important?: boolean }>, summary: string }}
 */
export function generateScaffold(params) {
  const {
    stack = 'react-ts',
    features = ALL_FEATURES,
    options = {},
  } = params;

  const {
    packageManager = 'npm',
    withGit = true,
  } = options;

  const pm = packageManager;
  const pmRun = pm === 'npm' ? 'npm run' : pm === 'yarn' ? 'yarn' : pm === 'pnpm' ? 'pnpm' : 'bun';

  const steps = [];

  // ── Step 1: Create project ──
  if (stack === 'react-ts') {
    steps.push({
      command: `${pm === 'npm' ? 'npm create' : pm === 'yarn' ? 'yarn create' : pm === 'pnpm' ? 'pnpm create' : 'bun create'} vite@latest my-app -- --template react-ts`,
      description: 'Buat project Vite + React + TypeScript. Vite adalah build tool tercepat untuk React SPA.',
      important: true,
    });
  } else if (stack === 'vue') {
    steps.push({
      command: `${pm === 'npm' ? 'npm create' : pm === 'yarn' ? 'yarn create' : pm === 'pnpm' ? 'pnpm create' : 'bun create'} vite@latest my-app -- --template vue-ts`,
      description: 'Buat project Vite + Vue + TypeScript dengan Vue Router dan Pinia siap pakai.',
      important: true,
    });
  } else {
    steps.push({
      command: `${pm === 'npm' ? 'npm create' : pm === 'yarn' ? 'yarn create' : pm === 'pnpm' ? 'pnpm create' : 'bun create'} vite@latest my-app -- --template vanilla-ts`,
      description: 'Buat project Vite + Vanilla TypeScript. Cocok untuk landing page atau portfolio sederhana.',
      important: true,
    });
  }

  // ── Step 2: Enter project directory ──
  steps.push({
    command: 'cd my-app',
    description: 'Masuk ke direktori project.',
  });

  // ── Step 3: Install dependencies ──
  const baseDeps = [];

  if (stack === 'react-ts' || stack === 'vue') {
    // Tailwind CSS v4
    steps.push({
      command: `${pm} install tailwindcss @tailwindcss/vite`,
      description: 'Install Tailwind CSS v4 — utility-first CSS framework. Konfigurasi via Vite plugin, bukan PostCSS.',
      important: true,
    });
  } else {
    steps.push({
      command: `${pm} install tailwindcss @tailwindcss/vite`,
      description: 'Install Tailwind CSS v4 untuk styling.',
      important: true,
    });
  }

  // ── Feature-based installations ──
  const featureSteps = [];

  if (features.includes('routing') && stack === 'react-ts') {
    featureSteps.push({
      command: `${pm} install react-router-dom`,
      description: 'React Router DOM — routing untuk React SPA. Mendukung nested routes, loaders, dan error boundaries.',
      important: true,
    });
  }

  if (features.includes('state-management')) {
    if (stack === 'react-ts') {
      featureSteps.push({
        command: `${pm} install zustand`,
        description: 'Zustand — state management ringan untuk React. Lebih sederhana dari Redux, tanpa boilerplate.',
      });
      featureSteps.push({
        command: `${pm} install @tanstack/react-query`,
        description: 'TanStack Query — server state management. Handle caching, loading, error states untuk API calls.',
        important: true,
      });
    } else if (stack === 'vue') {
      featureSteps.push({
        command: `${pm} install pinia`,
        description: 'Pinia — state management untuk Vue. Intuitive, type-safe, Vue DevTools support.',
      });
    }
  }

  if (features.includes('testing')) {
    featureSteps.push({
      command: `${pm} install -D vitest @testing-library/react @testing-library/jest-dom jsdom`,
      description: 'Vitest + Testing Library — unit testing framework. Vitest kompatibel dengan Vite, lebih cepat dari Jest.',
    });
    featureSteps.push({
      command: `${pm} install -D @playwright/test`,
      description: 'Playwright — E2E testing. Test di Chromium, Firefox, WebKit secara paralel.',
    });
  }

  if (features.includes('animations')) {
    if (stack === 'react-ts') {
      featureSteps.push({
        command: `${pm} install motion`,
        description: 'Motion (sebelumnya Framer Motion) — animations library untuk React. Untuk scroll-reveal, gestur, page transitions.',
        important: true,
      });
    }
    featureSteps.push({
      command: `${pm} install gsap`,
      description: 'GSAP — professional animations library. Untuk scroll-triggered, timeline, dan complex animations.',
    });
    featureSteps.push({
      command: `${pm} install lenis`,
      description: 'Lenis — smooth scroll library. Integrasi dengan GSAP ScrollTrigger untuk scroll yang mulus.',
    });
  }

  if (features.includes('form-handling') && stack === 'react-ts') {
    featureSteps.push({
      command: `${pm} install react-hook-form @hookform/resolvers zod`,
      description: 'React Hook Form + Zod — performant form handling dengan validasi schema. Minimal re-render, type-safe.',
      important: true,
    });
  }

  if (features.includes('shadcn-ui') && stack === 'react-ts') {
    featureSteps.push({
      command: `npx shadcn@latest init`,
      description: 'shadcn/ui — component library yang bisa di-customize penuh. Bukan npm package — kode di-copy ke project Anda.',
      important: true,
    });
    featureSteps.push({
      command: `npx shadcn@latest add button card badge separator input form dialog dropdown-menu`,
      description: 'Add komponen shadcn/ui yang paling sering digunakan. Komponen berbasis Radix UI, accessible by default.',
    });
  }

  if (features.includes('pwa')) {
    featureSteps.push({
      command: `${pm} install -D vite-plugin-pwa`,
      description: 'vite-plugin-pwa — PWA support untuk Vite. Service worker, manifest, offline support.',
    });
  }

  // Add feature steps after base installs
  steps.push(...featureSteps);

  // ── Install all dependencies ──
  steps.push({
    command: `${pm} install`,
    description: 'Install semua dependencies yang sudah ditambahkan.',
    important: true,
  });

  // ── Git init ──
  if (withGit) {
    steps.push({
      command: 'git init && git add -A && git commit -m "Initial commit: Vite + Tailwind v4 setup"',
      description: 'Inisialisasi Git repository dan commit pertama.',
    });
  }

  // ── Tailwind config for Vite ──
  if (stack === 'react-ts') {
    steps.push({
      command: '// Tambahkan di vite.config.ts:\nimport tailwindcss from "@tailwindcss/vite"\n\nexport default defineConfig({\n  plugins: [tailwindcss()],\n})',
      description: 'Konfigurasi Tailwind v4 Vite plugin. Tailwind v4 menggunakan Vite plugin, BUKAN PostCSS plugin.',
      important: true,
    });

    steps.push({
      command: '// Tambahkan di src/index.css:\n@import "tailwindcss";',
      description: 'Import Tailwind CSS di entry CSS file.',
    });
  }

  // ── Project structure ──
  steps.push({
    command: `mkdir -p src/components/ui src/components/layout src/hooks src/lib src/types src/stores src/pages`,
    description: 'Buat struktur folder project sesuai workflow-frontend standard.',
    important: true,
  });

  // ── Custom scrollbar CSS ──
  steps.push({
    command: `// Tambahkan di src/index.css setelah @import "tailwindcss":\n\n/* Custom scrollbar */\n* { scrollbar-width: thin; scrollbar-color: hsl(0 0% 60%) transparent; }\n::-webkit-scrollbar { width: 6px; height: 6px; }\n::-webkit-scrollbar-track { background: transparent; }\n::-webkit-scrollbar-thumb { background: hsl(0 0% 60%); border-radius: 999px; }\n\n/* Reduced motion */\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }\n}`,
    description: 'Tambahkan custom scrollbar dan reduced motion reset di stylesheet global.',
    important: true,
  });

  // ── Run dev server ──
  steps.push({
    command: `${pmRun} dev`,
    description: 'Jalankan development server. Biasanya di http://localhost:5173',
    important: true,
  });

  return {
    steps,
    summary: `Scaffold untuk project ${stack} dengan ${features.length} fitur. Total ${steps.length} langkah. Gunakan ${packageManager} sebagai package manager.`,
  };
}
