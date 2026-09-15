/**
 * sections.js — Tool 2: wf_section
 * 
 * Generate full page section code untuk 11 tipe section.
 * Wajib: mobile collapse, proper spacing, design variance, motion intensity.
 */

import { clamp } from './helpers.js';

// ─── Main Generator ─────────────────────────────────────────────────────────

/**
 * Generate section code berdasarkan parameter.
 * @param {import('./helpers.js').SectionParams} params
 * @returns {{ component: string, css?: string, description: string }}
 */
export function generateSection(params) {
  const {
    type = 'hero',
    design_variance = 6,
    motion_intensity = 5,
    visual_density = 4,
    options = {},
  } = params;

  const {
    darkMode = false,
    columns,
    withAnimation = true,
    withImages = false,
  } = options;

  // Clamp all dials
  const dv = clamp(design_variance, 1, 10, 6);
  const mi = clamp(motion_intensity, 1, 10, 5);
  const vd = clamp(visual_density, 1, 10, 4);

  const densityPadding = vd <= 3 ? 'py-32 md:py-40' : vd <= 7 ? 'py-16 md:py-24' : 'py-12 md:py-16';

  const generators = {
    'hero': () => genHero(dv, mi, vd, darkMode, withAnimation, withImages),
    'features': () => genFeatures(dv, mi, vd, darkMode, withAnimation, withImages, columns),
    'bento-grid': () => genBentoGrid(dv, mi, vd, darkMode, withAnimation, withImages, columns),
    'pricing': () => genPricing(dv, mi, vd, darkMode, withAnimation, columns),
    'faq': () => genFAQ(dv, mi, vd, darkMode, withAnimation),
    'cta': () => genCTA(dv, mi, vd, darkMode, withAnimation),
    'footer': () => genFooter(dv, mi, vd, darkMode),
    'stats': () => genStats(dv, mi, vd, darkMode, withAnimation, columns),
    'testimonials': () => genTestimonials(dv, mi, vd, darkMode, withAnimation, columns),
    'logo-wall': () => genLogoWall(dv, mi, vd, darkMode, withAnimation),
    'sidebar': () => genSidebar(dv, mi, vd, darkMode, withAnimation),
  };

  const generator = generators[type];
  if (!generator) {
    return {
      component: `// Error: Unknown section type "${type}"`,
      description: `Tipe section "${type}" tidak dikenal.`,
    };
  }

  return generator();
}

// ─── Helper ─────────────────────────────────────────────────────────────────

function motionClasses(mi, darkMode) {
  if (mi <= 3) return '';
  const base = 'transition-all duration-700 ease-out';
  const reveal = 'opacity-0 translate-y-8';
  const visible = 'opacity-100 translate-y-0';
  return base;
}

function sectionId(type) {
  return `section-${type}-${Date.now().toString(36)}`;
}

// ─── Section Generators ─────────────────────────────────────────────────────

/**
 * Hero section — max 2 line headline, max 20 words subtext, CTA visible.
 */
function genHero(dv, mi, vd, darkMode, withAnimation, withImages) {
  const id = sectionId('hero');
  const isCentered = dv <= 4;
  const pad = 'pt-20 md:pt-24 pb-16 md:pb-20';
  const gap = vd <= 3 ? 'gap-12' : 'gap-8';

  let layout;
  if (isCentered) {
    layout = `text-center items-center`;
  } else if (dv <= 7) {
    layout = `md:grid md:grid-cols-2 md:items-center ${gap}`;
  } else {
    layout = `md:grid md:grid-cols-[1fr_1.5fr] md:items-center ${gap}`;
  }

  const animationAttr = withAnimation && mi > 3
    ? `data-aos="fade-up" data-aos-duration="800"`
    : '';

  const component = `"use client";

import { useEffect, useRef } from 'react';

export function HeroSection({ className = '' }: { className?: string }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="${id}"
      className="relative overflow-hidden ${pad} ${motionClasses(mi, darkMode)} ${darkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'} ${layout} max-w-[1400px] mx-auto px-4 md:px-6"
    >
      <div className={\`\${${isCentered} ? 'mx-auto max-w-3xl' : ''}\`}>
        {/* Eyebrow — hanya jika dv >= 7 */}
        ${dv >= 7 ? `<p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 tracking-wider uppercase mb-4 ${withAnimation && mi > 3 ? 'motion-safe:animate-in fade-in slide-in-from-bottom-4 duration-700' : ''}">
          Built for performance
        </p>` : ''}

        {/* Headline — max 2 lines */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-none text-balance">
          Build products that
          <br />
          <span className="text-zinc-500 dark:text-zinc-400">people love</span>
        </h1>

        {/* Subtext — max 20 words */}
        <p className="mt-6 text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[65ch] text-balance">
          A modern platform for teams to design, build, and ship digital products faster than ever before.
        </p>

        {/* CTAs — 1 primary + max 1 secondary */}
        <div className="flex flex-wrap items-center gap-4 mt-8">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-medium rounded-full hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400"
          >
            Get Started
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400"
          >
            Learn more
          </a>
        </div>
      </div>

      {/* Right side asset — untuk non-centered layout */}
      ${!isCentered ? `
      <div className="relative mt-8 md:mt-0">
        <div className="aspect-[4/3] ${darkMode ? 'bg-zinc-800' : 'bg-zinc-100'} rounded-2xl overflow-hidden">
          ${withImages
            ? `<img src="https://picsum.photos/seed/hero-${id}/800/600" alt="Product showcase" className="w-full h-full object-cover" loading="eager" />`
            : `<div className="w-full h-full flex items-center justify-center text-zinc-400">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              </div>`
          }
        </div>
        ${withAnimation && mi >= 6 ? `
        <div className="absolute -bottom-4 -right-4 w-24 h-24 ${darkMode ? 'bg-zinc-800' : 'bg-zinc-100'} rounded-2xl -z-10" />` : ''}
      </div>` : ''}
    </section>
  );
}`;

  return {
    component,
    description: `Hero section — ${isCentered ? 'centered' : 'split'} layout, headline max 2 lines, subtext max 20 words, CTA visible tanpa scroll. Design variance: ${dv}/10.`,
  };
}

/**
 * Features section — varied layout, bukan 3 cards sama.
 */
function genFeatures(dv, mi, vd, darkMode, withAnimation, withImages, columns) {
  const id = sectionId('features');
  const col = columns || (dv <= 4 ? 3 : dv <= 7 ? 2 : 3);
  const pad = vd <= 3 ? 'py-32 md:py-40' : vd <= 7 ? 'py-20 md:py-28' : 'py-16';

  // Varied layouts based on design variance
  const useAlternating = dv > 4 && dv <= 7;
  const useMasonry = dv > 7;

  const component = `"use client";

import { useEffect, useRef } from 'react';

const features = [
  {
    title: 'Lightning-fast performance',
    description: 'Built on a modern stack that delivers sub-second page loads and smooth interactions.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    ${withImages ? `image: 'https://picsum.photos/seed/feature-1/600/400',` : ''}
  },
  {
    title: 'Seamless collaboration',
    description: 'Work together in real-time with built-in sharing, comments, and version control.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    ${withImages ? `image: 'https://picsum.photos/seed/feature-2/600/400',` : ''}
  },
  {
    title: 'Enterprise-grade security',
    description: 'SOC 2 compliant with end-to-end encryption, audit logs, and role-based access control.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
    ),
    ${withImages ? `image: 'https://picsum.photos/seed/feature-3/600/400',` : ''}
  },
  ${dv >= 7 ? `{
    title: 'Powerful analytics',
    description: 'Deep insights into usage patterns, user behavior, and growth metrics.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },` : ''}
];

export function FeaturesSection({ className = '' }: { className?: string }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  ${useAlternating ? `
  // Alternating layout — image + text bergantian
  return (
    <section
      ref={sectionRef}
      id="${id}"
      className={\`relative overflow-hidden ${pad} ${darkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'} \${className}\`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
            Everything you need to scale
          </h2>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[65ch] mx-auto">
            Powerful features that grow with your team, from startup to enterprise.
          </p>
        </div>

        <div className="space-y-20 md:space-y-28">
          {features.map((feature, i) => (
            <div
              key={i}
              className={\`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center
                \${i % 2 === 1 ? 'md:[direction:rtl]' : ''}\`}
            >
              <div className={\`\${i % 2 === 1 ? 'md:[direction:ltr]' : ''}\`}>
                <div className="w-12 h-12 rounded-xl ${darkMode ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-100 text-zinc-900'} flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-3 text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[55ch]">
                  {feature.description}
                </p>
              </div>
              <div className={\`\${i % 2 === 1 ? 'md:[direction:ltr]' : ''}\`}>
                ${withImages
                  ? `<img src={feature.image} alt={feature.title} className="w-full rounded-2xl ${darkMode ? 'bg-zinc-800' : 'bg-zinc-100'}" />`
                  : `<div className="aspect-[4/3] ${darkMode ? 'bg-zinc-800' : 'bg-zinc-100'} rounded-2xl flex items-center justify-center text-zinc-400">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  </div>`
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );` : useMasonry ? `
  // Masonry / asymmetric grid
  return (
    <section
      ref={sectionRef}
      id="${id}"
      className={\`relative overflow-hidden ${pad} ${darkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'} \${className}\`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl mb-16 md:mb-20">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 tracking-wider uppercase mb-4">Features</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
            Powerful capabilities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">
          {features.map((feature, i) => (
            <div
              key={i}
              className={\`\${i === 0 ? 'md:col-span-2 md:row-span-2' : i === 1 ? 'md:col-span-1' : ''} 
                ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} border rounded-2xl p-6 md:p-8
                ${withAnimation && mi > 3 ? 'transition-all duration-500 hover:shadow-lg hover:-translate-y-1' : ''}\`}
            >
              <div className={\`w-12 h-12 rounded-xl ${darkMode ? 'bg-zinc-800' : 'bg-zinc-200'} flex items-center justify-center mb-4\`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold tracking-tight">{feature.title}</h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );` : `
  // Standard grid
  return (
    <section
      ref={sectionRef}
      id="${id}"
      className={\`relative overflow-hidden ${pad} ${darkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'} \${className}\`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
            Everything you need to scale
          </h2>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[65ch] mx-auto">
            Powerful features that grow with your team, from startup to enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-${col} gap-6 md:gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} border rounded-2xl p-6 md:p-8
                ${withAnimation && mi > 3 ? 'transition-all duration-500 hover:shadow-lg hover:-translate-y-1' : ''}"
              ${withAnimation && mi > 3 ? `style={{ transitionDelay: \`\${i * 80}ms\` }}` : ''}
            >
              <div className="w-12 h-12 rounded-xl ${darkMode ? 'bg-zinc-800' : 'bg-zinc-200'} flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold tracking-tight">{feature.title}</h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );`}
}`;

  return {
    component,
    description: `Features section — ${useAlternating ? 'alternating zigzag layout' : useMasonry ? 'asymmetric/masonry grid' : `${col}-column grid`}. Design variance: ${dv}/10.`,
  };
}

/**
 * Bento grid — grid-flow-dense, zero empty cells.
 */
function genBentoGrid(dv, mi, vd, darkMode, withAnimation, withImages, columns) {
  const id = sectionId('bento');
  const pad = vd <= 3 ? 'py-32' : vd <= 7 ? 'py-20' : 'py-16';

  const component = `"use client";

export function BentoGridSection({ className = '' }: { className?: string }) {
  const items = [
    {
      title: 'Real-time sync',
      desc: 'Changes propagate instantly across your entire team.',
      size: 'md:col-span-2 md:row-span-1',
      ${withImages ? "image: 'https://picsum.photos/seed/bento-1/600/300'," : ''}
    },
    {
      title: 'Smart automation',
      desc: 'Reduce manual work with powerful workflow automations.',
      size: 'md:col-span-1 md:row-span-2',
      ${withImages ? "image: 'https://picsum.photos/seed/bento-2/300/600'," : ''}
    },
    {
      title: 'Version control',
      desc: 'Every change tracked, every version recoverable.',
      size: 'md:col-span-1 md:row-span-1',
    },
    {
      title: 'Analytics',
      desc: 'Understand usage with detailed dashboards.',
      size: 'md:col-span-1 md:row-span-1',
    },
    {
      title: 'API-first',
      desc: 'Integrate with your existing toolchain.',
      size: 'md:col-span-2 md:row-span-1',
    },
  ];

  return (
    <section
      id="${id}"
      className={\`relative overflow-hidden ${pad} ${darkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'} \${className}\`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
            A better way to work
          </h2>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Everything in one place, designed for modern teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-auto grid-flow-dense">
          {items.map((item, i) => (
            <div
              key={i}
              className={\`\${item.size} ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} border rounded-2xl p-6 md:p-8 overflow-hidden
                ${withAnimation && mi > 3 ? 'transition-all duration-500 hover:shadow-lg' : ''}\`}
            >
              ${withImages && item.image ? `
              <img src={item.image} alt="" className="w-full h-48 object-cover rounded-xl mb-4" loading="lazy" />
              ` : ''}
              <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`;

  return {
    component,
    description: `Bento grid section — grid-flow-dense, ${columns || 3} columns, zero empty cells, varied cell sizes. Mobile collapse ke single column.`,
  };
}

/**
 * Pricing section — clear tier hierarchy, CTA per tier.
 */
function genPricing(dv, mi, vd, darkMode, withAnimation, columns) {
  const id = sectionId('pricing');
  const col = columns || 3;
  const pad = vd <= 3 ? 'py-32' : vd <= 7 ? 'py-20' : 'py-16';

  const component = `"use client";

const tiers = [
  {
    name: 'Starter',
    price: '19',
    description: 'Perfect for individuals and small projects.',
    features: ['5 projects', '10GB storage', 'Basic analytics', 'Email support'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '49',
    description: 'For growing teams that need more power.',
    features: ['Unlimited projects', '100GB storage', 'Advanced analytics', 'Priority support', 'Custom integrations'],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '99',
    description: 'For organizations with advanced needs.',
    features: ['Everything in Pro', 'Unlimited storage', 'Dedicated support', 'SLA guarantee', 'SSO & audit logs', 'Custom contract'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export function PricingSection({ className = '' }: { className?: string }) {
  return (
    <section
      id="${id}"
      className={\`relative overflow-hidden ${pad} ${darkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'} \${className}\`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400 leading-relaxed">
            No hidden fees. Start free, upgrade when you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-${col} gap-6 md:gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={\`relative flex flex-col rounded-2xl p-6 md:p-8 border
                \${
                  tier.highlighted
                    ? '${darkMode ? 'bg-zinc-900 border-zinc-600 ring-2 ring-zinc-500' : 'bg-white border-zinc-900 ring-2 ring-zinc-900'}'
                    : '${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}'
                }
                \${withAnimation && mi > 3 ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg' : ''}\`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium 
                                bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{tier.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">\${tier.price}</span>
                  <span className="text-sm text-zinc-400">/month</span>
                </div>
              </div>
              <ul className="mt-6 space-y-3 flex-1" role="list">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-zinc-900 dark:text-zinc-100">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={\`mt-8 flex items-center justify-center px-6 py-3 text-sm font-medium rounded-full transition-colors
                  \${
                    tier.highlighted
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200'
                      : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }
                  focus-visible:ring-2 focus-visible:ring-zinc-400\`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`;

  return {
    component,
    description: `Pricing section — ${col} columns, clear tier hierarchy (highlighted middle tier), CTA per tier, feature list with checkmarks, responsive mobile collapse.`,
  };
}

/**
 * FAQ section — accordion pattern, no container box.
 */
function genFAQ(dv, mi, vd, darkMode, withAnimation) {
  const id = sectionId('faq');
  const pad = vd <= 3 ? 'py-32' : vd <= 7 ? 'py-20' : 'py-16';

  const component = `"use client";

import { useState } from 'react';

const faqs = [
  { q: 'How does the free trial work?', a: 'You get full access to all Pro features for 14 days, no credit card required. Cancel anytime.' },
  { q: 'Can I change my plan later?', a: 'Yes, you can upgrade or downgrade at any time. Changes take effect immediately.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.' },
  { q: 'Is my data secure?', a: 'Absolutely. We use end-to-end encryption, SOC 2 compliance, and regular security audits.' },
  { q: 'Do you offer custom enterprise plans?', a: 'Yes, contact our sales team for custom pricing, dedicated support, and tailored solutions.' },
];

export function FAQSection({ className = '' }: { className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="${id}"
      className={\`relative overflow-hidden ${pad} ${darkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'} \${className}\`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
            Frequently asked questions
          </h2>
        </div>

        <div className="mx-auto max-w-2xl divide-y divide-zinc-200 dark:divide-zinc-700">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="py-0">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left 
                             text-base font-medium transition-colors
                             hover:text-zinc-600 dark:hover:text-zinc-300
                             focus-visible:ring-2 focus-visible:ring-zinc-400 outline-none rounded"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <span className={\`shrink-0 ml-4 text-zinc-400 transition-transform duration-300 \${isOpen ? 'rotate-45' : ''}\`} aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </span>
                </button>
                <div
                  className={\`overflow-hidden transition-all duration-300 ease-out
                    \${isOpen ? 'max-h-[300px] pb-5' : 'max-h-0'}\`}
                >
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}`;

  return {
    component,
    description: `FAQ section — accordion pattern, NO container box, hanya border-bottom separator. Plus-to-X icon rotation, animasi max-height.`,
  };
}

/**
 * CTA section — high contrast, one intent.
 */
function genCTA(dv, mi, vd, darkMode, withAnimation) {
  const id = sectionId('cta');
  const pad = vd <= 3 ? 'py-32' : vd <= 7 ? 'py-20' : 'py-16';

  const component = `"use client";

export function CTASection({ className = '' }: { className?: string }) {
  return (
    <section
      id="${id}"
      className={\`relative overflow-hidden ${pad} ${darkMode ? 'dark bg-zinc-900 text-zinc-100' : 'bg-zinc-900 text-white'} \${className}\`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter max-w-3xl mx-auto text-balance">
          Ready to transform your workflow?
        </h2>
        <p className="mt-4 text-base md:text-lg ${darkMode ? 'text-zinc-400' : 'text-zinc-300'} leading-relaxed max-w-xl mx-auto">
          Join thousands of teams already building better products.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 ${darkMode ? 'bg-white text-zinc-900 hover:bg-zinc-200' : 'bg-white text-zinc-900 hover:bg-zinc-200'} text-sm font-medium rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-white"
          >
            Get started free
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 text-sm font-medium ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-300 hover:text-white'} rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-white"
          >
            Talk to sales
          </a>
        </div>
      </div>
    </section>
  );
}`;

  return {
    component,
    description: `CTA section — high contrast (dark background), satu primary intent (Get started free), satu secondary CTA (Talk to sales). Responsive.`,
  };
}

/**
 * Footer section — minimal, large type, no clutter.
 */
function genFooter(dv, mi, vd, darkMode) {
  const pad = 'py-16 md:py-20';

  const component = `"use client";

const footerLinks = [
  { label: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Changelog'] },
  { label: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
  { label: 'Resources', links: ['Documentation', 'Help Center', 'Community', 'Status'] },
  { label: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] },
];

export function FooterSection({ className = '' }: { className?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={\`relative ${pad} ${darkMode ? 'dark bg-zinc-950 text-zinc-100 border-t border-zinc-800' : 'bg-white text-zinc-900 border-t border-zinc-200'} \${className}\`}
      role="contentinfo"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {footerLinks.map((group) => (
            <div key={group.label}>
              <h3 className="text-sm font-semibold tracking-wider uppercase ${darkMode ? 'text-zinc-400' : 'text-zinc-500'} mb-4">
                {group.label}
              </h3>
              <ul className="space-y-3" role="list">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm ${darkMode ? 'text-zinc-400 hover:text-zinc-100' : 'text-zinc-500 hover:text-zinc-900'} transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400 outline-none rounded"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 pt-8 border-t ${darkMode ? 'border-zinc-800' : 'border-zinc-200'} flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}">
            &copy; {year} Brand, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm ${darkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'} transition-colors" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="text-sm ${darkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'} transition-colors" aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="#" className="text-sm ${darkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'} transition-colors" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}`;

  return {
    component,
    description: `Footer section — minimal, 4-column link grid, large type, social icons, copyright. No clutter. Mobile: 2 columns.`,
  };
}

/**
 * Stats section — numbers with context.
 */
function genStats(dv, mi, vd, darkMode, withAnimation, columns) {
  const id = sectionId('stats');
  const col = columns || 4;
  const pad = vd <= 3 ? 'py-24' : vd <= 7 ? 'py-16' : 'py-12';

  const component = `"use client";

const stats = [
  { value: '10K+', label: 'Active users' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '150+', label: 'Countries served' },
  { value: '50M+', label: 'Requests processed' },
];

export function StatsSection({ className = '' }: { className?: string }) {
  return (
    <section
      id="${id}"
      className={\`relative overflow-hidden ${pad} ${darkMode ? 'dark bg-zinc-950 text-zinc-100 border-y border-zinc-800' : 'bg-zinc-50 text-zinc-900 border-y border-zinc-200'} \${className}\`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-${col} gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                {stat.value}
              </p>
              <p className="mt-2 text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`;

  return {
    component,
    description: `Stats section — ${col} columns, large angka, context label, border-y separator. Mobile: 2 columns.`,
  };
}

/**
 * Testimonials section.
 */
function genTestimonials(dv, mi, vd, darkMode, withAnimation, columns) {
  const id = sectionId('testimonials');
  const col = columns || 3;
  const pad = vd <= 3 ? 'py-32' : vd <= 7 ? 'py-20' : 'py-16';

  const component = `"use client";

const testimonials = [
  {
    quote: 'This platform fundamentally changed how our team collaborates. The speed and reliability are unmatched.',
    author: 'Sarah Chen',
    role: 'CTO, TechFlow',
    avatar: 'SC',
  },
  {
    quote: 'We tried six other solutions before this one. Nothing comes close to the feature set and developer experience.',
    author: 'Marcus Johnson',
    role: 'Lead Engineer, DataSync',
    avatar: 'MJ',
  },
  {
    quote: 'The onboarding was incredibly smooth. Our team was fully productive within the first week.',
    author: 'Elena Rodriguez',
    role: 'VP Product, CloudScale',
    avatar: 'ER',
  },
];

export function TestimonialsSection({ className = '' }: { className?: string }) {
  return (
    <section
      id="${id}"
      className={\`relative overflow-hidden ${pad} ${darkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'} \${className}\`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
            Trusted by teams worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-${col} gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} border rounded-2xl p-6 md:p-8"
            >
              <svg className="w-8 h-8 ${darkMode ? 'text-zinc-600' : 'text-zinc-300'} mb-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z"/>
              </svg>
              <blockquote className="text-sm md:text-base ${darkMode ? 'text-zinc-300' : 'text-zinc-700'} leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full ${darkMode ? 'bg-zinc-700' : 'bg-zinc-200'} flex items-center justify-center text-sm font-semibold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.author}</p>
                  <p className="text-xs ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`;

  return {
    component,
    description: `Testimonials section — ${col} columns, quote cards, avatar initials, author info. Responsive: single column on mobile.`,
  };
}

/**
 * Logo wall section — logos only, no industry labels.
 */
function genLogoWall(dv, mi, vd, darkMode, withAnimation) {
  const pad = vd <= 3 ? 'py-20' : 'py-12';

  const component = `"use client";

const logos = [
  'Vercel', 'Linear', 'Raycast', 'Supabase', 'Cal.com',
  'Notion', 'Figma', 'Railway', 'Hugging Face', 'T3',
];

export function LogoWallSection({ className = '' }: { className?: string }) {
  return (
    <section
      className={\`relative overflow-hidden ${pad} ${darkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'} \${className}\`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <p className="text-center text-sm ${darkMode ? 'text-zinc-500' : 'text-zinc-400'} tracking-wider uppercase font-medium mb-8">
          Trusted by industry leaders
        </p>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-8 md:gap-12 items-center justify-items-center">
          {logos.map((name, i) => (
            <div
              key={i}
              className="text-sm md:text-base font-semibold ${darkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'} transition-colors"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`;

  return {
    component,
    description: `Logo wall section — logos only (no industry labels), 5 column grid, "Trusted by" header. Mobile: 3 columns.`,
  };
}

/**
 * Sidebar section — for dashboards / app layouts.
 */
function genSidebar(dv, mi, vd, darkMode, withAnimation) {
  const component = `"use client";

import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', icon: 'grid', active: true },
  { label: 'Analytics', icon: 'chart' },
  { label: 'Projects', icon: 'folder' },
  { label: 'Team', icon: 'users' },
  { label: 'Settings', icon: 'settings' },
];

function SidebarIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    grid: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    chart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    folder: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
    users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  };
  return <span className="shrink-0">{icons[name] || null}</span>;
}

export function SidebarSection({ className = '' }: { className?: string }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={\`h-full ${darkMode ? 'dark bg-zinc-950 text-zinc-100 border-r border-zinc-800' : 'bg-white text-zinc-900 border-r border-zinc-200'}
        \${collapsed ? 'w-16' : 'w-56'} transition-all duration-300 flex flex-col \${className}\`}
      aria-label="Sidebar navigation"
    >
      <div className="flex items-center justify-between px-4 h-14 border-b ${darkMode ? 'border-zinc-800' : 'border-zinc-200'}">
        {!collapsed && <span className="text-sm font-semibold">Menu</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'} transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400 outline-none"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={\`transition-transform \${collapsed ? 'rotate-180' : ''}\`}>
            <line x1="3" y1="3" x2="3" y2="21"/><polyline points="15 3 21 12 15 21"/>
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1" role="list">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                className={\`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors
                  \${
                    item.active
                      ? '${darkMode ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-100 text-zinc-900'} font-medium'
                      : '${darkMode ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}'
                  }
                  focus-visible:ring-2 focus-visible:ring-zinc-400 outline-none\`}
                aria-current={item.active ? 'page' : undefined}
                title={collapsed ? item.label : undefined}
              >
                <SidebarIcon name={item.icon} />
                {!collapsed && <span>{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-2 py-4 border-t ${darkMode ? 'border-zinc-800' : 'border-zinc-200'}">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${darkMode ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'} transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400 outline-none"
          title={collapsed ? 'Logout' : undefined}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          {!collapsed && <span>Logout</span>}
        </a>
      </div>
    </aside>
  );
}`;

  return {
    component,
    description: `Sidebar component — collapsible, nav items with SVG icons, active state, user section, dark mode support.`,
  };
}
