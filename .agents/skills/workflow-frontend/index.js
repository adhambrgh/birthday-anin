/**
 * index.js — MCP Server Entry Point
 * 
 * Server MCP untuk workflow-frontend tools.
 * Menggunakan McpServer dari @modelcontextprotocol/sdk dengan stdio transport.
 * 
 * Tools:
 *   1. wf_component    — Generate React/TSX component code (14 tipe)
 *   2. wf_section      — Generate full page section code (11 tipe)
 *   3. wf_animation    — Generate animation code (GSAP / Framer / CSS)
 *   4. wf_css          — Generate CSS/Tailwind utilities (10 tipe)
 *   5. wf_audit        — Audit frontend code against anti-patterns
 *   6. wf_scaffold     — Generate project setup commands
 *   7. wf_palette      — Generate color palette from seed/industry
 *   8. wf_design-tokens— Generate design token CSS/JSON
 *   9. wf_brainstorm   — Generate brainstorming framework output
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { generateComponent } from './components.js';
import { generateSection } from './sections.js';
import { generateAnimation } from './animations.js';
import { generateCSS } from './css-utils.js';
import { auditCode } from './audit.js';
import { generateScaffold } from './scaffold.js';
import { generatePalette } from './palette.js';
import { generateDesignTokens } from './design-tokens.js';
import { generateBrainstorm } from './brainstorm.js';

// ─── Schema Definitions ──────────────────────────────────────────────────────

const componentParams = {
  type: z.enum([
    'button', 'card', 'modal', 'navbar', 'bottom-nav', 'dropdown', 'input',
    'badge', 'tabs', 'accordion', 'select', 'textarea', 'tooltip', 'dialog',
  ]),
  framework: z.enum(['react', 'vue']).default('react'),
  variant: z.enum(['primary', 'secondary', 'ghost', 'outline', 'solid']).default('primary'),
  options: z.object({
    darkMode: z.boolean().optional(),
    animations: z.boolean().optional(),
    iconLibrary: z.enum(['phosphor', 'radix', 'tabler']).default('phosphor'),
    rounded: z.enum(['sm', 'md', 'lg', 'full', 'none']).default('md'),
    size: z.enum(['sm', 'md', 'lg']).default('md'),
  }).optional().default({}),
};

const sectionParams = {
  type: z.enum([
    'hero', 'features', 'bento-grid', 'pricing', 'faq', 'cta',
    'footer', 'stats', 'testimonials', 'logo-wall', 'sidebar',
  ]),
  design_variance: z.number().min(1).max(10).default(6),
  motion_intensity: z.number().min(1).max(10).default(5),
  visual_density: z.number().min(1).max(10).default(4),
  options: z.object({
    darkMode: z.boolean().optional(),
    columns: z.number().min(1).max(4).optional(),
    withAnimation: z.boolean().optional(),
    withImages: z.boolean().optional(),
  }).optional().default({}),
};

const animationParams = {
  type: z.enum([
    'sticky-stack', 'horizontal-pan', 'scroll-reveal', 'text-split',
    'counter', 'marquee', 'parallax', 'page-transition', 'magnetic-hover', 'typewriter',
  ]),
  library: z.enum(['gsap', 'framer-motion', 'css']).default('gsap'),
  options: z.object({
    withReducedMotion: z.boolean().default(true),
    duration: z.number().optional(),
    stagger: z.number().optional(),
  }).optional().default({}),
};

const cssParams = {
  type: z.enum([
    'fluid-typography', 'custom-scrollbar', 'mesh-gradient', 'glassmorphism',
    'grain-overlay', 'crt-scanlines', 'button-variants', 'noise-texture',
    'focus-ring', 'skeleton-loader',
  ]),
  format: z.enum(['css', 'tailwind']).default('tailwind'),
};

const auditParams = {
  code: z.string().min(1, 'Kode tidak boleh kosong'),
  language: z.enum(['tsx', 'jsx', 'html', 'css', 'vue']).default('tsx'),
};

const scaffoldParams = {
  stack: z.enum(['react-ts', 'vue', 'vanilla']).default('react-ts'),
  features: z.array(z.string()).optional(),
  options: z.object({
    packageManager: z.enum(['npm', 'yarn', 'pnpm', 'bun']).default('npm'),
    withGit: z.boolean().default(true),
  }).optional().default({}),
};

// ─── Server Setup ───────────────────────────────────────────────────────────

const server = new McpServer({
  name: 'workflow-frontend',
  version: '1.0.0',
  description: 'MCP server untuk generate frontend code — supercharged dengan workflow-frontend rules (anti-slop, design taste, Awwwards quality)',
}, {
  capabilities: {
    tools: {
      listChanged: false,
    },
  },
});

// ─── Tool 1: wf_component ───────────────────────────────────────────────────

server.tool(
  'wf_component',
  'Generate React/TSX component code yang mengikuti workflow-frontend rules. Mendukung 14 tipe komponen dengan variant, dark mode, animations, dan icon library.',
  {
    type: componentParams.type.describe('Tipe komponen yang akan di-generate'),
    framework: componentParams.framework.describe('Frontend framework (default: react)'),
    variant: componentParams.variant.describe('Variant komponen (default: primary)'),
    options: componentParams.options.describe('Opsi tambahan untuk komponen'),
  },
  async ({ type, framework, variant, options }) => {
    try {
      const result = generateComponent({ type, framework, variant, options });

      let output = `/* === ${type.charAt(0).toUpperCase() + type.slice(1)} Component === */\n`;
      output += `/* Framework: ${framework} */\n`;
      output += `/* Variant: ${variant} */\n`;
      output += `/* Description: ${result.description} */\n\n`;
      output += result.component;

      if (result.css) {
        output += `\n\n/* === CSS === */\n${result.css}`;
      }

      return {
        content: [{ type: 'text', text: output }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error generating component: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// ─── Tool 2: wf_section ─────────────────────────────────────────────────────

server.tool(
  'wf_section',
  'Generate full page section code. Mendukung 11 tipe section dengan design variance, motion intensity, visual density. Wajib: mobile collapse, proper spacing. Output production-ready React/TSX.',
  {
    type: sectionParams.type.describe('Tipe section yang akan di-generate'),
    design_variance: sectionParams.design_variance.describe('Design variance 1-10 (1 = symmetric, 10 = chaotic)'),
    motion_intensity: sectionParams.motion_intensity.describe('Motion intensity 1-10 (1 = static, 10 = cinematic)'),
    visual_density: sectionParams.visual_density.describe('Visual density 1-10 (1 = airy, 10 = packed)'),
    options: sectionParams.options.describe('Opsi tambahan untuk section'),
  },
  async ({ type, design_variance, motion_intensity, visual_density, options }) => {
    try {
      const result = generateSection({
        type,
        design_variance,
        motion_intensity,
        visual_density,
        options,
      });

      let output = `/* === ${type.charAt(0).toUpperCase() + type.slice(1)} Section === */\n`;
      output += `/* Design Variance: ${design_variance}/10 */\n`;
      output += `/* Motion Intensity: ${motion_intensity}/10 */\n`;
      output += `/* Visual Density: ${visual_density}/10 */\n`;
      output += `/* Description: ${result.description} */\n\n`;
      output += result.component;

      if (result.css) {
        output += `\n\n/* === CSS === */\n${result.css}`;
      }

      return {
        content: [{ type: 'text', text: output }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error generating section: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// ─── Tool 3: wf_animation ───────────────────────────────────────────────────

server.tool(
  'wf_animation',
  'Generate animation code untuk 10 tipe animasi. Library: GSAP, Framer Motion, atau CSS. WAJIB honor prefers-reduced-motion, GPU-safe (transform + opacity only).',
  {
    type: animationParams.type.describe('Tipe animasi yang akan di-generate'),
    library: animationParams.library.describe('Animation library (default: gsap)'),
    options: animationParams.options.describe('Opsi tambahan untuk animasi'),
  },
  async ({ type, library, options }) => {
    try {
      const result = generateAnimation({ type, library, options });

      let output = `/* === ${type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')} Animation === */\n`;
      output += `/* Library: ${library} */\n`;
      output += `/* Description: ${result.description} */\n\n`;
      output += result.component;

      if (result.css) {
        output += `\n\n/* === CSS === */\n${result.css}`;
      }

      return {
        content: [{ type: 'text', text: output }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error generating animation: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// ─── Tool 4: wf_css ─────────────────────────────────────────────────────────

server.tool(
  'wf_css',
  'Generate CSS/Tailwind utilities untuk 10 tipe efek visual. Output ready to copy-paste. Format: CSS atau Tailwind v4.',
  {
    type: cssParams.type.describe('Tipe CSS utility yang akan di-generate'),
    format: cssParams.format.describe('Format output (default: tailwind)'),
  },
  async ({ type, format }) => {
    try {
      const result = generateCSS({ type, format });

      let output = `/* === ${type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')} === */\n`;
      output += `/* Format: ${format} */\n`;
      output += `/* Description: ${result.description} */\n\n`;
      output += result.code;

      return {
        content: [{ type: 'text', text: output }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error generating CSS: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// ─── Tool 5: wf_audit ───────────────────────────────────────────────────────

server.tool(
  'wf_audit',
  'Audit frontend code terhadap 30+ anti-patterns dari workflow-frontend. Cek: glassmorphism navbar, emoji icons, Inter default, dark mode, reduced motion, dan banyak lagi. Output violations dengan severity, penjelasan Bahasa Indonesia, dan cara fix.',
  {
    code: auditParams.code.describe('Kode yang akan diaudit (tsx/jsx/html/css/vue)'),
    language: auditParams.language.describe('Bahasa kode yang diaudit (default: tsx)'),
  },
  async ({ code, language }) => {
    try {
      const result = auditCode({ code, language });

      if (result.violations.length === 0) {
        return {
          content: [{ type: 'text', text: '✅ Tidak ditemukan violations. Kode sudah sesuai workflow-frontend standards.' }],
        };
      }

      let output = `=== Audit Results ===\n`;
      output += `Language: ${language}\n`;
      output += `Total violations: ${result.violations.length}\n`;
      output += `  Errors: ${result.summary.errors}\n`;
      output += `  Warnings: ${result.summary.warnings}\n`;
      output += `  Info: ${result.summary.info}\n\n`;
      output += `─`.repeat(50) + '\n\n';

      result.violations.forEach((v, i) => {
        const severityIcon = v.severity === 'error' ? '🔴' : v.severity === 'warning' ? '🟡' : '🔵';
        output += `Violation #${i + 1}: ${severityIcon} [${v.severity.toUpperCase()}]\n`;
        output += `  Line: ~${v.line}\n`;
        output += `  Pattern: ${v.pattern}\n`;
        output += `  Explanation: ${v.explanation}\n`;
        output += `  Fix: ${v.fix}\n\n`;
      });

      return {
        content: [{ type: 'text', text: output }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error running audit: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// ─── Tool 6: wf_scaffold ────────────────────────────────────────────────────

server.tool(
  'wf_scaffold',
  'Generate project setup commands untuk React TS, Vue, atau vanilla. Output terminal commands lengkap dengan penjelasan setiap step. Termasuk Tailwind v4, routing, state management, testing, animations, form, shadcn/ui.',
  {
    stack: scaffoldParams.stack.describe('Tech stack untuk project (default: react-ts)'),
    features: scaffoldParams.features.describe('Array fitur yang akan diinstal. Default: semua fitur. Opsi: routing, state-management, testing, animations, form-handling, shadcn-ui, pwa'),
    options: scaffoldParams.options.describe('Opsi tambahan untuk scaffolding'),
  },
  async ({ stack, features, options }) => {
    try {
      const effectiveFeatures = features || ['routing', 'state-management', 'testing', 'animations', 'form-handling', 'shadcn-ui', 'pwa'];
      const result = generateScaffold({ stack, features: effectiveFeatures, options });

      let output = `=== Project Scaffold: ${stack} ===\n`;
      output += `Package Manager: ${options?.packageManager || 'npm'}\n`;
      output += `Features: ${effectiveFeatures.join(', ')}\n`;
      output += `Git Init: ${options?.withGit !== false ? 'Yes' : 'No'}\n\n`;
      output += `${result.summary}\n\n`;
      output += `─`.repeat(50) + '\n\n';

      result.steps.forEach((step, i) => {
        const num = String(i + 1).padStart(2, '0');
        output += `Step ${num}: ${step.description}\n`;
        if (step.important) {
          output += `  ⚠️  IMPORTANT\n`;
        }
        output += `  $ ${step.command}\n\n`;
      });

      output += `─`.repeat(50) + '\n';
      output += 'Struktur folder yang akan dibuat:\n';
      output += '  src/\n';
      output += '  ├── components/ui/\n';
      output += '  ├── components/layout/\n';
      output += '  ├── pages/\n';
      output += '  ├── hooks/\n';
      output += '  ├── lib/\n';
      output += '  ├── stores/\n';
      output += '  ├── types/\n';
      output += '  └── tests/\n';

      return {
        content: [{ type: 'text', text: output }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error generating scaffold: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// ─── Tool 7: wf_palette ────────────────────────────────────────────────────

server.tool(
  'wf_palette',
  'Generate color palette dari seed atau industry. Output CSS variables, Tailwind, atau JSON. Mengacu ke Section 16 COLOR PALETTE & PSYCHOLOGY — 15+ palette siap pakai, 15 gradient recipes, WCAG-safe.',
  {
    seed: z.enum(['saas-modern', 'warm-organic', 'dark-luxury', 'health-wellness', 'ecommerce', 'creative-agency', 'minimalist', 'fintech', 'gaming', 'nature', 'cosmic-dark', 'desert-warmth', 'ocean-deep', 'corporate', 'scandinavian']).default('saas-modern').describe('Nama palette yang akan di-generate'),
    industry: z.enum(['fintech', 'healthcare', 'ecommerce', 'food', 'tech', 'luxury', 'wellness', 'creative', 'education', 'gaming', 'realestate', 'fashion']).optional().describe('Industri untuk rekomendasi warna (override seed)'),
    includeGradients: z.boolean().default(false).describe('Sertakan gradient recipes'),
    includeHarmonies: z.boolean().default(false).describe('Sertakan color harmony info'),
    format: z.enum(['css', 'tailwind', 'json', 'preview']).default('css').describe('Format output'),
  },
  async (params) => {
    try {
      const result = generatePalette(params);
      return {
        content: [{ type: 'text', text: result || '// No palette generated' }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error generating palette: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// ─── Tool 8: wf_design-tokens ──────────────────────────────────────────────

server.tool(
  'wf_design-tokens',
  'Generate design token CSS/JSON/Tailwind. Pilih tipe: spacing, typography, shadows, motion, atau all. Output siap pakai. Mengacu ke Section 8 DESIGN SYSTEM.',
  {
    type: z.enum(['spacing', 'typography', 'shadows', 'motion', 'all']).default('spacing').describe('Tipe design token'),
    format: z.enum(['css', 'tailwind', 'json']).default('css').describe('Format output'),
    theme: z.enum(['light', 'dark']).default('light').describe('Theme'),
    includeDark: z.boolean().default(false).describe('Include dark mode overrides'),
    scale: z.enum(['minor-second', 'major-second', 'minor-third', 'major-third', 'perfect-fourth', 'augmented-fourth', 'perfect-fifth', 'golden-ratio']).default('major-third').describe('Typography scale ratio'),
  },
  async (params) => {
    try {
      const result = generateDesignTokens(params);
      return {
        content: [{ type: 'text', text: result || '// No tokens generated' }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error generating tokens: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// ─── Tool 9: wf_brainstorm ────────────────────────────────────────────────

server.tool(
  'wf_brainstorm',
  'Generate brainstorming framework output. Mode: decompose (brief analysis), persona, problem (problem statement), session (agenda), decision-matrix, design-thinking, atau ideation. Mengacu ke Section 17 BRAINSTORMING FRAMEWORK.',
  {
    mode: z.enum(['decompose', 'persona', 'problem', 'session', 'decision-matrix', 'design-thinking', 'ideation']).default('decompose').describe('Mode brainstorming'),
    topic: z.string().optional().describe('Topik atau judul sesi'),
    format: z.enum(['markdown']).default('markdown').describe('Format output'),
  },
  async (params) => {
    try {
      const result = generateBrainstorm(params);
      return {
        content: [{ type: 'text', text: result || '// No brainstorm output' }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error generating brainstorm: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// ─── Start Server ───────────────────────────────────────────────────────────

async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('workflow-frontend MCP server running on stdio');
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

main();
