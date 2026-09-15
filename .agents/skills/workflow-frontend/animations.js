/**
 * animations.js — Tool 3: wf_animation
 * 
 * Generate animation code untuk 10 tipe animasi.
 * Library: GSAP, Framer Motion, atau CSS.
 * WAJIB honor prefers-reduced-motion, GPU-safe (transform + opacity only).
 */

// ─── Main Generator ─────────────────────────────────────────────────────────

/**
 * Generate animation component code berdasarkan parameter.
 * @param {import('./helpers.js').AnimationParams} params
 * @returns {{ component: string, css?: string, description: string }}
 */
export function generateAnimation(params) {
  const {
    type = 'scroll-reveal',
    library = 'gsap',
    options = {},
  } = params;

  const {
    withReducedMotion = true,
    duration = 0.8,
    stagger: staggerVal = 0.08,
  } = options;

  const gen = {
    'sticky-stack': () => genStickyStack(library, duration, staggerVal, withReducedMotion),
    'horizontal-pan': () => genHorizontalPan(library, duration, withReducedMotion),
    'scroll-reveal': () => genScrollReveal(library, duration, staggerVal, withReducedMotion),
    'text-split': () => genTextSplit(library, duration, staggerVal, withReducedMotion),
    'counter': () => genCounter(library, duration, withReducedMotion),
    'marquee': () => genMarquee(library, duration, withReducedMotion),
    'parallax': () => genParallax(library, duration, withReducedMotion),
    'page-transition': () => genPageTransition(library, duration, withReducedMotion),
    'magnetic-hover': () => genMagneticHover(library, duration, withReducedMotion),
    'typewriter': () => genTypewriter(library, duration, withReducedMotion),
  };

  const generator = gen[type];
  if (!generator) {
    return {
      component: `// Error: Unknown animation type "${type}"`,
      description: `Tipe animasi "${type}" tidak dikenal.`,
    };
  }

  return generator();
}

// ─── Animation Generators ────────────────────────────────────────────────────

/**
 * Sticky-Stack Pattern — GSAP canonical skeleton (start: "top top", pin, scrub).
 */
function genStickyStack(library, duration, stagger, reducedMotion) {
  const rmGuard = reducedMotion
    ? `const reduce = useReducedMotion();`
    : `const reduce = false;`;

  if (library === 'gsap') {
    return {
      component: `"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

interface StickyStackProps {
  cards?: React.ReactNode[];
  className?: string;
}

export function StickyStack({ cards = [], className = '' }: StickyStackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const defaultCards = [
    { title: '01', content: 'Strategy & Discovery' },
    { title: '02', content: 'Design & Prototyping' },
    { title: '03', content: 'Development & Launch' },
  ];

  const items = cards.length > 0 ? cards : defaultCards;

  useEffect(() => {
    if (reduce || !ref.current) return;

    const ctx = gsap.context(() => {
      const cardEls = gsap.utils.toArray<HTMLElement>('.stack-card');
      cardEls.forEach((card, i) => {
        if (i === cardEls.length - 1) return;

        ScrollTrigger.create({
          trigger: card,
          start: 'top top',
          endTrigger: cardEls[cardEls.length - 1],
          end: 'top top',
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        gsap.to(card, {
          scale: 0.92,
          opacity: 0.55,
          ease: 'none',
          scrollTrigger: {
            trigger: cardEls[i + 1],
            start: 'top bottom',
            end: 'top top',
            scrub: 1.5,
          },
        });
      });
    }, ref);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section ref={ref} className={\`relative \${className}\`}>
      {items.map((card, i) => (
        <div
          key={i}
          className="stack-card sticky top-0 min-h-[100dvh] flex items-center justify-center"
        >
          <div className="max-w-md mx-auto px-4 text-center">
            <p className="text-6xl font-bold text-zinc-200 dark:text-zinc-800">
              {(card as any).title || String(i + 1).padStart(2, '0')}
            </p>
            <p className="mt-4 text-xl font-medium">
              {(card as any).content || \`Card \${i + 1}\`}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}`,
      description: `GSAP Sticky-Stack pattern — canonical skeleton dengan start:"top top", pin:true, scrub. Setiap card kecuali yang terakhir di-pin.`,
    };
  }

  if (library === 'framer-motion') {
    return {
      component: `"use client";

import { motion, useReducedMotion } from 'motion/react';

interface StickyStackProps {
  items?: Array<{ title: string; content: string }>;
  className?: string;
}

export function StickyStack({ items = [
  { title: '01', content: 'Strategy & Discovery' },
  { title: '02', content: 'Design & Prototyping' },
  { title: '03', content: 'Development & Launch' },
], className = '' }: StickyStackProps) {
  const reduce = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className={\`relative \${className}\`}>
      <motion.div
        className="flex flex-col gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="min-h-[60dvh] flex items-center justify-center"
            variants={reduce ? undefined : cardVariants}
          >
            <div className="max-w-md mx-auto px-4 text-center">
              <p className="text-6xl font-bold text-zinc-200 dark:text-zinc-800">
                {item.title}
              </p>
              <p className="mt-4 text-xl font-medium">{item.content}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}`,
      description: `Framer Motion Sticky-Stack — whileInView dengan staggerChildren. Setiap card muncul bergantian.`,
    };
  }

  // CSS version
  return {
    component: `/* Sticky-Stack — CSS only */
/* Note: Full sticky-stack requires JS. CSS provides scroll-driven fallback. */

.stack-container {
  position: relative;
}

.stack-card {
  position: sticky;
  top: 0;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.stack-card + .stack-card {
  margin-top: -100dvh;
}

@supports (animation-timeline: scroll()) {
  .stack-card {
    animation: stackFade linear;
    animation-timeline: scroll(nearest block);
  }

  .stack-card:last-child {
    animation: none;
  }
}

@keyframes stackFade {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0.4; transform: scale(0.92); }
}

@media (prefers-reduced-motion: reduce) {
  .stack-card {
    position: relative;
    min-height: auto;
    animation: none;
  }
  .stack-card + .stack-card {
    margin-top: 0;
  }
}`,
    description: `CSS Sticky-Stack — menggunakan CSS scroll-driven animations sebagai fallback. Reduced motion support.`,
  };
}

/**
 * Horizontal-Pan Pattern — GSAP canonical skeleton.
 */
function genHorizontalPan(library, duration, reducedMotion) {
  if (library === 'gsap') {
    return {
      component: `"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalPanProps {
  children?: React.ReactNode;
  className?: string;
}

export function HorizontalPan({ children, className = '' }: HorizontalPanProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !wrap.current || !track.current) return;

    const ctx = gsap.context(() => {
      const distance = track.current!.scrollWidth - window.innerWidth;

      if (distance <= 0) return;

      gsap.to(track.current, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: () => \`+=\${distance}\`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, [reduce]);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <section ref={wrap} className={\`relative overflow-hidden \${className}\`}>
      <div ref={track} className="flex min-h-[100dvh] items-center">
        {children || (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[80vw] md:w-[60vw] px-8"
              >
                <div className="h-64 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-2xl font-bold">
                  Panel {i}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}`,
      description: `GSAP Horizontal-Pan — horizontal scroll dengan pin. ScrollTrigger start:"top top", end dihitung dari scrollWidth.`,
    };
  }

  return {
    component: `/* Horizontal-Pan — CSS scroll-driven */
.horizontal-pan-wrapper {
  position: relative;
  overflow: hidden;
}

.horizontal-pan-track {
  display: flex;
  min-height: 100dvh;
  align-items: center;
}

.horizontal-pan-item {
  flex-shrink: 0;
  width: 80vw;
  padding: 0 2rem;
}

/* Fallback: without scroll-driven, use basic overflow */
@supports (animation-timeline: scroll()) {
  .horizontal-pan-track {
    animation: panScroll linear;
    animation-timeline: scroll(nearest block);
    animation-range: contain 0% contain 100%;
  }
}

@keyframes panScroll {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-100% + 100vw)); }
}

@media (prefers-reduced-motion: reduce) {
  .horizontal-pan-track {
    min-height: auto;
    flex-wrap: wrap;
    animation: none;
  }
  .horizontal-pan-item {
    width: 100%;
  }
}`,
    description: `CSS Horizontal-Pan — scroll-driven animation. Reduced motion: fallback ke wrap.`,
  };
}

/**
 * Scroll-Reveal — whileInView, IntersectionObserver, or CSS.
 */
function genScrollReveal(library, duration, stagger, reducedMotion) {
  if (library === 'gsap') {
    return {
      component: `"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  items?: string[];
  className?: string;
}

export function ScrollReveal({ items = [
  'Feature one — lightning fast',
  'Feature two — reliable by design',
  'Feature three — built for scale',
  'Feature four — developer first',
], className = '' }: ScrollRevealProps) {
  const ref = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;

    const ctx = gsap.context(() => {
      const cards = ref.current!.querySelectorAll('.reveal-item');

      gsap.from(cards, {
        opacity: 0,
        y: 40,
        duration: ${duration},
        stagger: ${stagger},
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <ul ref={ref} className={\`space-y-4 \${className}\`} role="list">
      {items.map((item, i) => (
        <li
          key={i}
          className="reveal-item p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}`,
      description: `GSAP Scroll-Reveal — stagger items dengan ScrollTrigger. Trigger di 85% viewport.`,
    };
  }

  if (library === 'framer-motion') {
    return {
      component: `"use client";

import { motion, useReducedMotion } from 'motion/react';

interface ScrollRevealProps {
  items?: string[];
  className?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: ${stagger},
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ${duration}, ease: [0.16, 1, 0.3, 1] },
  },
};

export function ScrollReveal({ items = [
  'Feature one — lightning fast',
  'Feature two — reliable by design',
  'Feature three — built for scale',
  'Feature four — developer first',
], className = '' }: ScrollRevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.ul
      className={\`space-y-4 \${className}\`}
      variants={reduce ? undefined : containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      role="list"
    >
      {items.map((item, i) => (
        <motion.li
          key={i}
          variants={reduce ? undefined : itemVariants}
          className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
        >
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}`,
      description: `Framer Motion Scroll-Reveal — whileInView dengan staggerChildren, viewport amount 0.2.`,
    };
  }

  // CSS version
  return {
    component: `/* Scroll-Reveal — CSS keyframes + IntersectionObserver fallback */
.reveal-item {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity ${duration}s ease, transform ${duration}s ease;
}

.reveal-item.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.reveal-item:nth-child(1) { transition-delay: 0s; }
.reveal-item:nth-child(2) { transition-delay: ${stagger}s; }
.reveal-item:nth-child(3) { transition-delay: ${stagger * 2}s; }
.reveal-item:nth-child(4) { transition-delay: ${stagger * 3}s; }

/* Scroll-driven alternative */
@supports (animation-timeline: view()) {
  .reveal-item {
    animation: revealItem linear;
    animation-timeline: view();
    animation-range: entry 0% entry 80%;
  }
}

@keyframes revealItem {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .reveal-item { opacity: 1; transform: none; animation: none; }
}`,
    description: `CSS Scroll-Reveal — transition-based dengan staggered delay, scroll-driven animation fallback, reduced motion guard.`,
  };
}

/**
 * Text-Split — letter-by-letter animation.
 */
function genTextSplit(library, duration, stagger, reducedMotion) {
  return {
    component: library === 'gsap' ? `"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

interface TextSplitProps {
  text?: string;
  className?: string;
}

export function TextSplit({ text = 'Animate with purpose', className = '' }: TextSplitProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;

    // Split text into individual characters
    const chars = ref.current.textContent!.split('');
    ref.current.innerHTML = chars
      .map((c) => (c === ' ' ? ' ' : \`<span class="split-char" style="display:inline-block">\${c}</span>\`))
      .join('');

    const ctx = gsap.context(() => {
      gsap.from('.split-char', {
        y: '100%',
        opacity: 0,
        rotateZ: 8,
        duration: ${duration},
        stagger: ${stagger},
        ease: 'power4.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [reduce]);

  const Tag = ref.current ? 'h1' : ('h1' as any);

  return (
    <h1 ref={ref as any} className={\`text-4xl md:text-6xl font-bold tracking-tighter overflow-hidden \${className}\`}>
      {text}
    </h1>
  );
}` : `"use client";

import { motion, useReducedMotion } from 'motion/react';

interface TextSplitProps {
  text?: string;
  className?: string;
}

export function TextSplit({ text = 'Animate with purpose', className = '' }: TextSplitProps) {
  const reduce = useReducedMotion();

  const chars = text.split('');

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: ${stagger} },
    },
  };

  const child = {
    hidden: { opacity: 0, y: '100%', rotateZ: 6 },
    visible: {
      opacity: 1,
      y: 0,
      rotateZ: 0,
      transition: { duration: ${duration}, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.h1
      className={\`text-4xl md:text-6xl font-bold tracking-tighter overflow-hidden \${className}\`}
      variants={reduce ? undefined : container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          variants={reduce ? undefined : child}
          className="inline-block"
          aria-hidden="true"
        >
          {char === ' ' ? '\\u00A0' : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}`,
    description: `Text-Split animation — letter-by-letter reveal dengan rotate dan stagger. ${library === 'gsap' ? 'GSAP SplitText pattern manual' : 'Framer Motion stagger'}.`,
  };
}

/**
 * Counter animation — angka yang naik saat scroll.
 */
function genCounter(library, duration, reducedMotion) {
  return {
    component: `"use client";

import { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

interface CounterProps {
  from?: number;
  to?: number;
  duration?: number;
  format?: boolean;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function Counter({
  from = 0,
  to = 100,
  duration: dur = ${duration},
  format = true,
  suffix = '',
  prefix = '',
  className = '',
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? to : from);

  useEffect(() => {
    if (reduce) {
      setCount(to);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const startTime = performance.now();
        const range = to - from;

        function animate(currentTime: number) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / (dur * 1000), 1);

          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(from + range * eased);

          setCount(current);

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        }

        requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [from, to, dur, reduce]);

  const display = format ? count.toLocaleString() : String(count);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}`,
    description: `Counter animation — angka naik dari from ke to saat terlihat di viewport. IntersectionObserver-based, ease-out cubic, honor reduced motion.`,
  };
}

/**
 * Marquee — infinite scroll.
 */
function genMarquee(library, duration, reducedMotion) {
  return {
    component: `"use client";

import { useRef, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';

interface MarqueeProps {
  items?: string[];
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
}

export function Marquee({
  items = ['Design', 'Develop', 'Deploy', 'Deliver', 'Design', 'Develop', 'Deploy'],
  direction = 'left',
  speed = 30,
  className = '',
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !trackRef.current) return;

    const track = trackRef.current;
    let animationId: number;

    const animate = () => {
      const step = direction === 'left' ? -1 : 1;
      const current = parseFloat(getComputedStyle(track).transform.split(',')[4] || '0');

      if (Math.abs(current) >= track.scrollWidth / 2) {
        track.style.transform = 'translateX(0)';
      } else {
        track.style.transform = \`translateX(\${current + step}px)\`;
      }

      animationId = requestAnimationFrame(animate);
    };

    // Duplicate content for seamless loop
    track.innerHTML += track.innerHTML;

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [reduce, direction]);

  if (reduce) {
    return (
      <div className={\`flex flex-wrap gap-4 \${className}\`}>
        {items.map((item, i) => (
          <span key={i} className="text-lg font-medium px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={\`overflow-hidden \${className}\`}>
      <div
        ref={trackRef}
        className="flex gap-8 w-max"
        style={{ willChange: 'transform' }}
      >
        {items.map((item, i) => (
          <span key={i} className="text-lg font-medium whitespace-nowrap px-4">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}`,
    description: `Marquee — infinite scroll animation dengan requestAnimationFrame. Duplicate content untuk seamless loop. Reduced motion fallback ke flex-wrap.`,
  };
}

/**
 * Parallax — GSAP ScrollTrigger + transform.
 */
function genParallax(library, duration, reducedMotion) {
  return {
    component: `"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxProps {
  children?: React.ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ children, speed = 0.3, className = '' }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: () => window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [reduce, speed]);

  return (
    <div ref={ref} className={className}>
      {children || (
        <div className="w-full h-64 bg-zinc-200 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500">
          Parallax Layer
        </div>
      )}
    </div>
  );
}`,
    description: `Parallax animation — GSAP ScrollTrigger with scrub, bergerak lebih lambat dari scroll. GPU-safe (transform only).`,
  };
}

/**
 * Page-Transition — AnimatePresence / Barba pattern.
 */
function genPageTransition(library, duration, reducedMotion) {
  if (library === 'gsap') {
    return {
      component: `// Page Transition — Barba.js + GSAP
// Install: npm install @barba/core gsap

/*
import barba from '@barba/core';
import gsap from 'gsap';

barba.init({
  transitions: [
    {
      name: 'slide-reveal',
      leave(data) {
        const done = this.async();
        gsap.timeline()
          .to(data.current.container, {
            y: '-100%',
            duration: ${duration},
            ease: 'power4.in',
          })
          .set(data.current.container, { display: 'none' })
          .call(done);
      },
      enter(data) {
        gsap.from(data.next.container, {
          y: '100%',
          duration: ${duration},
          ease: 'power4.out',
          onComplete: () => window.scrollTo(0, 0),
        });
      },
    },
  ],
});
*/`,
      description: `Page Transition — Barba.js + GSAP. Leave: slide up. Enter: slide from bottom.`,
    };
  }

  return {
    component: `"use client";

import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  if (reduce) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: ${duration}, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}`,
    description: `Page Transition — Framer Motion AnimatePresence with mode="wait". Key diubah berdasarkan pathname untuk trigger re-animasi.`,
  };
}

/**
 * Magnetic-Hover — button yang mendekati cursor.
 */
function genMagneticHover(library, duration, reducedMotion) {
  return {
    component: `"use client";

import { useRef, useCallback } from 'react';
import { useReducedMotion } from 'motion/react';

interface MagneticHoverProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticHover({
  children,
  strength = 0.3,
  className = '',
}: MagneticHoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduce || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      ref.current.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
    },
    [reduce, strength]
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate3d(0, 0, 0)';
    ref.current.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transition = 'transform 0.2s ease-out';
  }, []);

  return (
    <div
      ref={ref}
      className={\`inline-block cursor-pointer \${className}\`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  );
}`,
    description: `Magnetic Hover — elemen mendekati cursor dengan transform3d. Smooth transition on leave. Reduced motion: nonaktif.`,
  };
}

/**
 * Typewriter — sequential typing effect.
 */
function genTypewriter(library, duration, reducedMotion) {
  return {
    component: `"use client";

import { useState, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';

interface TypewriterProps {
  words?: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export function Typewriter({
  words = ['Design.', 'Build.', 'Ship.', 'Scale.'],
  speed = 80,
  deleteSpeed = 40,
  pauseDuration = 2000,
  className = '',
}: TypewriterProps) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setText(words[0] || '');
      return;
    }

    const current = words[wordIndex % words.length];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(current.slice(0, text.length + 1));
          if (text.length === current.length) {
            setTimeout(() => setIsDeleting(true), pauseDuration);
            return;
          }
        } else {
          setText(current.slice(0, text.length - 1));
          if (text.length === 0) {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
            return;
          }
        }
      },
      isDeleting ? deleteSpeed : speed
    );

    return () => clearTimeout(timeout);
  }, [text, wordIndex, isDeleting, words, speed, deleteSpeed, pauseDuration, reduce]);

  return (
    <span className={className}>
      {text}
      <span className="animate-pulse ml-0.5 text-zinc-400">|</span>
    </span>
  );
}`,
    description: `Typewriter — sequential typing dengan delete cycle. Configurable speed, pause, dan word list. Cursor blink. Reduced motion: static.`,
  };
}
