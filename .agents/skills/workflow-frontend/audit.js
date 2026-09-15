/**
 * audit.js — Tool 5: wf_audit
 * 
 * Audit frontend code terhadap 30+ anti-patterns dari workflow-frontend.
 * Output: daftar violations dengan severity, penjelasan Bahasa Indonesia, dan cara fix.
 */

// ─── Main Generator ─────────────────────────────────────────────────────────

/**
 * Audit kode terhadap anti-patterns workflow-frontend.
 * @param {import('./helpers.js').AuditParams} params
 * @returns {{ violations: import('./helpers.js').Violation[], summary: { errors: number, warnings: number, info: number } }}
 */
export function auditCode(params) {
  const { code = '', language = 'tsx' } = params;

  if (!code || code.trim().length === 0) {
    return {
      violations: [{
        line: 0,
        pattern: 'empty-code',
        severity: 'error',
        explanation: 'Tidak ada kode yang diberikan untuk diaudit.',
        fix: 'Berikan kode yang akan diaudit melalui parameter "code".',
      }],
      summary: { errors: 1, warnings: 0, info: 0 },
    };
  }

  const lines = code.split('\n');
  const violations = [];

  // Jalankan semua checker
  const checkers = [
    checkGlassmorphismNavbar,
    checkEmojiAsIcon,
    checkInterDefault,
    checkPureBlack,
    checkPureWhite,
    checkHScreen,
    checkCardInCard,
    checkUseEffectForComputed,
    checkUseEffectForEvents,
    checkContextFrequentState,
    checkAnimatePosition,
    checkWindowScrollListener,
    checkHandrolledIcons,
    checkAICliché,
    checkSerifDefault,
    checkFrauncesInstrument,
    checkMetaLabels,
    checkFakePreciseNumbers,
    checkCenteredHero,
    checkEyebrowEverySection,
    checkDuplicateCTA,
    checkNeonColors,
    checkLucideDefault,
    checkMissingLoadingState,
    checkMissingDarkMode,
    checkMissingReducedMotion,
    checkNoAltText,
    checkDivFakeScreenshots,
    checkCustomCursor,
    checkNoFocusState,
    checkResizeOnNonTextarea,
    checkEmDash,
    checkAIAdvertisingCopy,
    checkVersionHero,
    checkScrollCue,
  ];

  for (const checker of checkers) {
    const result = checker(code, lines);
    if (result) {
      violations.push(result);
    }
  }

  const summary = {
    errors: violations.filter(v => v.severity === 'error').length,
    warnings: violations.filter(v => v.severity === 'warning').length,
    info: violations.filter(v => v.severity === 'info').length,
  };

  return { violations, summary };
}

// ─── Anti-pattern Checkers ──────────────────────────────────────────────────

/**
 * Helper: cari pattern di line tertentu.
 */
function findLine(lines, pattern, startFrom = 0) {
  for (let i = startFrom; i < lines.length; i++) {
    if (lines[i].includes(pattern)) return i + 1;
  }
  return -1;
}

function findRegex(lines, regex, startFrom = 0) {
  for (let i = startFrom; i < lines.length; i++) {
    if (regex.test(lines[i])) return i + 1;
  }
  return -1;
}

function countOccurrences(code, pattern) {
  return (code.match(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
}

/**
 * 1. Glassmorphism navbar — backdrop-blur di navbar tanpa explicit request.
 */
function checkGlassmorphismNavbar(code, lines) {
  const pattern = /navbar|nav\s*|header/gi;
  const hasNav = pattern.test(code);
  const hasGlass = code.includes('backdrop-blur') || code.includes('bg-white/') || code.includes('bg-black/');

  if (hasNav && hasGlass) {
    const line = findLine(lines, 'backdrop-blur') || findLine(lines, 'bg-white/') || 1;
    return {
      line,
      pattern: 'glassmorphism-navbar',
      severity: 'error',
      explanation: 'Navbar menggunakan glassmorphism (backdrop-blur, bg-white/xx). Ini adalah AI tell yang dilarang. Gunakan solid background dengan warna jelas.',
      fix: 'Hapus backdrop-blur dari navbar. Gunakan bg-white dark:bg-zinc-950 solid. Kecuali klien explicit meminta glass effect.',
    };
  }
  return null;
}

/**
 * 2. Emoji sebagai UI icon.
 */
function checkEmojiAsIcon(code, lines) {
  const emojiPattern = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const linesWithEmoji = [];
  lines.forEach((line, i) => {
    if (emojiPattern.test(line) && !line.trim().startsWith('//') && !line.trim().startsWith('/*') && !line.trim().startsWith('*')) {
      // Skip if in comment
      const isComment = lines.slice(0, i).some(l => l.includes('//') || l.includes('/*'));
      if (!isComment) linesWithEmoji.push(i + 1);
    }
  });

  if (linesWithEmoji.length > 0) {
    return {
      line: linesWithEmoji[0],
      pattern: 'emoji-as-icon',
      severity: 'error',
      explanation: 'Emoji digunakan sebagai icon UI. Emoji hanya untuk content area — bukan untuk button, navbar, menu, cards, features, CTAs, atau form elements.',
      fix: 'Ganti emoji dengan icon dari library resmi: @phosphor-icons/react, @radix-ui/react-icons, atau @tabler/icons-react.',
    };
  }
  return null;
}

/**
 * 3. Inter sebagai default font.
 */
function checkInterDefault(code, lines) {
  if (code.includes('Inter') || code.includes('"Inter"') || code.includes("'Inter'")) {
    const line = findLine(lines, 'Inter') || findLine(lines, '"Inter"') || 1;
    return {
      line,
      pattern: 'inter-default',
      severity: 'warning',
      explanation: 'Inter digunakan sebagai default font. Inter discouraged sebagai default — pilih Geist, Outfit, Cabinet Grotesk, atau Satoshi.',
      fix: 'Ganti Inter dengan Geist, Satoshi, Cabinet Grotesk, atau font brand yang sesuai. Inter hanya acceptable untuk a11y-first atau explicit request.',
    };
  }
  return null;
}

/**
 * 4. Pure black #000000.
 */
function checkPureBlack(code, lines) {
  if (code.includes('#000000') || code.includes('#000')) {
    const line = findLine(lines, '#000000') || findLine(lines, '#000');
    return {
      line,
      pattern: 'pure-black',
      severity: 'error',
      explanation: 'Menggunakan pure black (#000000) atau #000. Ini membunuh depth dan membuat desain terlihat murah.',
      fix: 'Ganti dengan off-black seperti zinc-950 (#0a0a0a), zinc-900 (#18181b), atau charcoal (#1a1a1a).',
    };
  }
  return null;
}

/**
 * 5. Pure white #FFFFFF.
 */
function checkPureWhite(code, lines) {
  if (code.includes('#FFFFFF') || code.includes('#FFF') && !code.includes('#FFFFFF')) {
    const line = findLine(lines, '#FFFFFF') || 1;
    return {
      line,
      pattern: 'pure-white',
      severity: 'warning',
      explanation: 'Menggunakan pure white (#FFFFFF). Gunakan off-white untuk depth.',
      fix: 'Ganti dengan off-white seperti zinc-50 (#fafafa), natural-50, atau warm bone (#f7f6f3).',
    };
  }

  // Check #fff (without matching #ffffff)
  if (/\b#fff\b/i.test(code) && !/#ffffff/i.test(code)) {
    const line = findRegex(lines, /\b#fff\b/i) || 1;
    return {
      line,
      pattern: 'pure-white',
      severity: 'warning',
      explanation: 'Menggunakan pure white (#fff). Gunakan off-white untuk depth.',
      fix: 'Ganti dengan off-white seperti zinc-50 (#fafafa), natural-50, atau warm bone (#f7f6f3).',
    };
  }
  return null;
}

/**
 * 6. h-screen instead of min-h-[100dvh].
 */
function checkHScreen(code, lines) {
  if (code.includes('h-screen')) {
    const line = findLine(lines, 'h-screen') || 1;
    return {
      line,
      pattern: 'h-screen',
      severity: 'error',
      explanation: 'Menggunakan h-screen untuk full-height section. h-screen menyebabkan layout jump di mobile karena tidak menghitung address bar.',
      fix: 'Ganti h-screen dengan min-h-[100dvh]. Contoh: className="min-h-[100dvh] flex items-center"',
    };
  }
  return null;
}

/**
 * 7. Card-inside-card-inside-card.
 */
function checkCardInCard(code, lines) {
  const cardCount = countOccurrences(code, 'Card');
  if (cardCount >= 4) {
    const pattern3 = /rounded-(?:xl|2xl|3xl)[^}]*rounded-(?:xl|2xl|3xl)/;
    if (pattern3.test(code) || cardCount >= 5) {
      return {
        line: findLine(lines, 'rounded-') || 1,
        pattern: 'card-inside-card',
        severity: 'warning',
        explanation: 'Terlalu banyak Card component bersarang (card-inside-card-inside-card). Ini mengurangi hirarki visual.',
        fix: 'Kurangi level nesting. Maksimal 2 level Card. Gunakan border atau spacing untuk group elemen alih-alih Card bersarang.',
      };
    }
  }
  return null;
}

/**
 * 8. useEffect for computed values.
 */
function checkUseEffectForComputed(code, lines) {
  const effectPattern = /useEffect\s*\(\s*\)\s*\{[^}]*set[A-Z]/;
  if (effectPattern.test(code)) {
    // Look for useEffect that does computation
    const line = findLine(lines, 'useEffect') || 1;
    return {
      line,
      pattern: 'useEffect-computed',
      severity: 'error',
      explanation: 'useEffect digunakan untuk nilai computed (setState dari prop). Ini menyebabkan re-render tidak perlu.',
      fix: 'Gunakan useMemo untuk nilai computed. Contoh: const computed = useMemo(() => expensive(value), [value])',
    };
  }
  return null;
}

/**
 * 9. useEffect for event handlers.
 */
function checkUseEffectForEvents(code, lines) {
  // Check for useEffect wrapping addEventListener on window/document
  if (code.includes('addEventListener') && code.includes('useEffect')) {
    const line = findLine(lines, 'useEffect') || 1;
    return {
      line,
      pattern: 'useEffect-events',
      severity: 'warning',
      explanation: 'useEffect digunakan untuk memasang event handler. Ini bisa diganti dengan pendekatan yang lebih deklaratif.',
      fix: 'Untuk event handler sederhana, pasang langsung di JSX (onClick, onSubmit, dll). Untuk window events, pastikan ada cleanup function di useEffect.',
    };
  }
  return null;
}

/**
 * 10. Context for frequently updating state.
 */
function checkContextFrequentState(code, lines) {
  if (code.includes('createContext') || code.includes('React.createContext')) {
    // Check if there's anything animation or interval related near context
    if (code.includes('useEffect') && (code.includes('setInterval') || code.includes('requestAnimationFrame') || code.includes('onMouseMove'))) {
      const line = findLine(lines, 'createContext') || 1;
      return {
        line,
        pattern: 'context-frequent-state',
        severity: 'warning',
        explanation: 'Context digunakan bersamaan dengan state yang sering berubah (animasi, mouse, interval). Context menyebabkan re-render seluruh consumer tree.',
        fix: 'Gunakan Zustand untuk state yang sering berubah. Context cocok untuk state jarang berubah seperti theme, auth, locale.',
      };
    }
  }
  return null;
}

/**
 * 11. Animate width/height/top/left.
 */
function checkAnimatePosition(code, lines) {
  const animProps = ['animate width', 'animate height', 'animate top', 'animate left', 'transition.*width', 'transition.*height', 'transition.*top', 'transition.*left'];
  for (const prop of animProps) {
    if (code.includes(prop) || new RegExp(prop.replace(/\s+/g, '\\s*')).test(code)) {
      const line = findLine(lines, prop.split(' ')[1]) || 1;
      return {
        line,
        pattern: 'animate-position',
        severity: 'error',
        explanation: 'Menganimasi properti yang menyebabkan reflow (width, height, top, left). Ini menyebabkan jank dan layout thrashing.',
        fix: 'Ganti dengan transform: scaleX/scaleY untuk width/height, translateX/translateY untuk top/left. Animate hanya transform dan opacity.',
      };
    }
  }

  // Check CSS for top/left in transition
  if (/transition.*\b(top|left|width|height)\b/i.test(code)) {
    const line = findRegex(lines, /transition.*\b(top|left|width|height)\b/i) || 1;
    return {
      line,
      pattern: 'animate-position',
      severity: 'error',
      explanation: 'CSS transition/animasi menggunakan top, left, width, atau height. Ini GPU-heavy dan menyebabkan jank.',
      fix: 'Ganti dengan transform: translate3d() untuk posisi, scale() untuk ukuran.',
    };
  }
  return null;
}

/**
 * 12. window scroll event listener.
 */
function checkWindowScrollListener(code, lines) {
  if (code.includes("window.addEventListener('scroll") || code.includes('window.addEventListener("scroll') || code.includes('window.onscroll')) {
    const line = findLine(lines, 'addEventListener') || findLine(lines, 'onscroll') || 1;
    return {
      line,
      pattern: 'window-scroll-listener',
      severity: 'error',
      explanation: 'Menggunakan window scroll event listener. Ini jank-prone karena berjalan setiap scroll frame.',
      fix: 'Gunakan IntersectionObserver, GSAP ScrollTrigger, Framer Motion useScroll, atau CSS scroll-driven animations.',
    };
  }
  return null;
}

/**
 * 13. Hand-rolled SVG icons.
 */
function checkHandrolledIcons(code, lines) {
  // Check for inline SVG paths that look like icons (small viewBox, path data)
  const svgIconCount = (code.match(/<svg[^>]*viewBox=["'][^"']*["'][^>]*>/g) || []).length;
  if (svgIconCount > 2) {
    return {
      line: findLine(lines, '<svg') || 1,
      pattern: 'handrolled-icons',
      severity: 'warning',
      explanation: 'Terlalu banyak inline SVG icons. Hand-rolled SVG icons tidak konsisten dan tidak scalable.',
      fix: 'Gunakan icon library resmi: @phosphor-icons/react (default), @radix-ui/react-icons, atau @tabler/icons-react.',
    };
  }
  return null;
}

/**
 * 14. AI cliché copywriting.
 */
function checkAICliché(code, lines) {
  const cliches = [
    'Elevate', 'Seamless', 'Unleash', 'Next-Gen', 'Game-changer',
    'Delve', 'Revolutionize', 'Empower', 'Ultimate', 'Transformative',
    'Innovative', 'Groundbreaking', 'Cutting-edge', 'State-of-the-art',
    'Robust', 'Scalable', 'Best-in-class',
  ];

  for (const word of cliches) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(code)) {
      // Check if in a non-comment string
      const line = findRegex(lines, regex) || 1;
      return {
        line,
        pattern: 'ai-cliche-copy',
        severity: 'warning',
        explanation: `Kata "${word}" terdeteksi — ini adalah AI copywriting cliché. Hindari kata marketing yang generik.`,
        fix: `Ganti "${word}" dengan bahasa yang spesifik dan konkret. Contoh: instead of "Elevate your workflow", gunakan "Ship faster with automated deployments".`,
      };
    }
  }
  return null;
}

/**
 * 15. Serif as default font.
 */
function checkSerifDefault(code, lines) {
  const serifFonts = ['serif', 'Georgia', 'Garamond', 'Times New Roman', 'Palatino'];
  for (const font of serifFonts) {
    if (code.includes(font) && !code.includes('font-sans')) {
      // Check if it's in a font-family declaration
      const line = findLine(lines, font) || 1;
      return {
        line,
        pattern: 'serif-default',
        severity: 'warning',
        explanation: 'Serif digunakan sebagai default font. Serif sangat discouraged sebagai default — ini adalah AI tell paling mudah dikenali.',
        fix: 'Ganti dengan sans-serif. Serif hanya acceptable untuk editorial/luxury/publication brief yang explicit menamai serif font.',
      };
    }
  }
  return null;
}

/**
 * 16. Fraunces / Instrument Serif.
 */
function checkFrauncesInstrument(code, lines) {
  if (code.includes('Fraunces') || code.includes('Instrument_Serif') || code.includes('Instrument Serif')) {
    const line = findLine(lines, 'Fraunces') || findLine(lines, 'Instrument');
    return {
      line,
      pattern: 'fraunces-instrument',
      severity: 'error',
      explanation: 'Fraunces atau Instrument Serif terdeteksi. Kedua font ini adalah LLM-favorite display serifs yang specifically BANNED.',
      fix: 'Ganti dengan display sans seperti Geist Display, Cabinet Grotesk, atau jika serif benar-benar justified: GT Sectra, Reckless Neue, atau Cormorant Garamond.',
    };
  }
  return null;
}

/**
 * 17. Meta-labels (00 / INDEX, 001 · Capabilities).
 */
function checkMetaLabels(code, lines) {
  const pattern = /\d{2,3}\s*[/·–—]\s*(INDEX|Capabilities|Features|Services|About|Work|How|What|Our)/i;
  if (pattern.test(code)) {
    const line = findRegex(lines, pattern) || 1;
    return {
      line,
      pattern: 'meta-labels',
      severity: 'warning',
      explanation: 'Section-numbering eyebrows seperti "00 / INDEX" atau "001 · Capabilities" terdeteksi. Ini adalah AI tell.',
      fix: 'Hapus numbering. Gunakan eyebrow yang natural atau langsung headline tanpa angka.',
    };
  }
  return null;
}

/**
 * 18. Fake-precise numbers.
 */
function checkFakePreciseNumbers(code, lines) {
  const patterns = [
    /\b99\.99%\b/, /\b50%\b/, /\b1234567\b/, /\b10,000\+\b/,
    /\b10x\b/, /\b100x\b/, /\b4.9\/5\b/,
  ];

  for (const pattern of patterns) {
    if (pattern.test(code)) {
      const line = findRegex(lines, pattern) || 1;
      return {
        line,
        pattern: 'fake-precise-numbers',
        severity: 'warning',
        explanation: 'Angka fake-precise terdeteksi (99.99%, 10x, 10,000+). Angka tanpa sumber terpercaya adalah AI tell.',
        fix: 'Gunakan angka riil dengan sumber, atau gunakan bahasa yang lebih umum. Contoh: "Thousands of users" instead of "10,000+ users".',
      };
    }
  }
  return null;
}

/**
 * 19. Centered hero with high variance.
 */
function checkCenteredHero(code, lines) {
  // This is contextual — just flag if there's text-center in hero-like section
  if (code.includes('text-center') && (code.includes('hero') || code.includes('Hero') || code.includes('HERO'))) {
    return {
      line: findLine(lines, 'text-center') || 1,
      pattern: 'centered-hero',
      severity: 'info',
      explanation: 'Hero section menggunakan centered text. Centered hero dihindari ketika DESIGN_VARIANCE > 4.',
      fix: 'Pertimbangkan split layout (50/50), left-aligned content dengan right asset, atau asymmetric whitespace.',
    };
  }
  return null;
}

/**
 * 20. Eyebrow on every section.
 */
function checkEyebrowEverySection(code, lines) {
  const eyebrowCount = countOccurrences(code, 'tracking-wider') + countOccurrences(code, 'tracking-wide') + countOccurrences(code, 'uppercase');
  const sectionCount = countOccurrences(code, '<section') + countOccurrences(code, '<Section');

  if (sectionCount >= 3 && eyebrowCount >= sectionCount) {
    return {
      line: findLine(lines, 'tracking') || 1,
      pattern: 'eyebrow-every-section',
      severity: 'warning',
      explanation: 'Setiap section memiliki eyebrow (uppercase tracking label). Eyebrow restraint: maksimal 1 eyebrow per 3 sections.',
      fix: 'Kurangi eyebrow. Hero counts as 1. Jika section A punya eyebrow, 2 section berikutnya tidak boleh.',
    };
  }
  return null;
}

/**
 * 21. Duplicate CTA intent.
 */
function checkDuplicateCTA(code, lines) {
  const ctas = [
    { text: 'Get started', intent: 'start' },
    { text: 'Get Started', intent: 'start' },
    { text: 'Sign up', intent: 'signup' },
    { text: 'Sign Up', intent: 'signup' },
    { text: 'Contact', intent: 'contact' },
    { text: 'Get in touch', intent: 'contact' },
    { text: 'Let\'s talk', intent: 'contact' },
    { text: 'Contact us', intent: 'contact' },
  ];

  const foundIntents = new Map();
  for (const cta of ctas) {
    if (code.includes(cta.text)) {
      const count = countOccurrences(code, cta.text);
      if (!foundIntents.has(cta.intent)) {
        foundIntents.set(cta.intent, { text: cta.text, count });
      } else {
        foundIntents.get(cta.intent).count += count;
      }
    }
  }

  for (const [intent, info] of foundIntents) {
    if (info.count > 1) {
      return {
        line: findLine(lines, info.text) || 1,
        pattern: 'duplicate-cta',
        severity: 'warning',
        explanation: `CTA dengan intent "${intent}" muncul ${info.count} kali ("${info.text}"). Duplicate CTA intent adalah Pre-Flight Fail.`,
        fix: `Pilih SATU label untuk intent "${intent}" dan gunakan di semua tempat. Hapus CTA lain dengan intent yang sama.`,
      };
    }
  }
  return null;
}

/**
 * 22. Neon colors / outer glows.
 */
function checkNeonColors(code, lines) {
  const neonPatterns = [
    /box-shadow[^}]*0\s+0\s+\d+px\s+#/i,
    /text-shadow[^}]*0\s+0\s+\d+px\s+#/i,
    /#(?:00)?(?:ff|00)[0]?(?:ff|00)/i,  // neon green/magenta
  ];

  for (const pattern of neonPatterns) {
    if (pattern.test(code)) {
      const line = findRegex(lines, pattern) || 1;
      return {
        line,
        pattern: 'neon-colors',
        severity: 'warning',
        explanation: 'Neon colors atau outer glows terdeteksi. NO neon / outer glows by default — gunakan inner borders atau subtle tinted shadows.',
        fix: 'Hapus outer glow. Gunakan inner border subtle atau box-shadow dengan warna tinted, bukan neon.',
      };
    }
  }
  return null;
}

/**
 * 23. Lucide icons as default.
 */
function checkLucideDefault(code, lines) {
  if (code.includes('lucide-react') || code.includes('from \'lucide\'') || code.includes('from "lucide"')) {
    return {
      line: findLine(lines, 'lucide') || 1,
      pattern: 'lucide-default',
      severity: 'info',
      explanation: 'Lucide icons terdeteksi. Lucide hanya untuk explicit request — default icon library adalah Phosphor, Radix, atau Tabler.',
      fix: 'Ganti dengan @phosphor-icons/react (default) atau @radix-ui/react-icons. Lucide acceptable jika user explicit minta.',
    };
  }
  return null;
}

/**
 * 24. Missing loading/error/empty states.
 */
function checkMissingLoadingState(code, lines) {
  // Simple heuristic: if there's async/await or fetch, check for loading state
  if (code.includes('async') || code.includes('fetch(') || code.includes('axios')) {
    if (!code.includes('loading') && !code.includes('isLoading') && !code.includes('is_loading') && !code.includes('isPending')) {
      return {
        line: findLine(lines, 'async') || findLine(lines, 'fetch') || 1,
        pattern: 'missing-loading-state',
        severity: 'warning',
        explanation: 'Komponen menggunakan async/fetch tapi tidak memiliki loading state. User tidak mendapat feedback selama loading.',
        fix: 'Tambahkan loading state: skeleton loader yang match layout, bukan circular spinner.',
      };
    }
  }

  // Check for error state
  if (code.includes('catch') || code.includes('error')) {
    if (!code.includes('error') && !code.includes('Error')) {
      return null; // error variable likely exists
    }
  }
  return null;
}

/**
 * 25. Missing dark mode.
 */
function checkMissingDarkMode(code, lines) {
  if (code.includes('bg-') || code.includes('text-') || code.includes('border-')) {
    // Check if any color classes exist without dark: variant
    const colorClasses = code.match(/\b(bg|text|border|ring)-(?:white|black|zinc|gray|slate|stone|neutral|red|blue|green|emerald|amber|purple|pink|indigo|teal|cyan|orange|rose|violet)-/g);
    if (colorClasses && colorClasses.length > 0) {
      const hasDark = code.includes('dark:');
      if (!hasDark) {
        return {
          line: 1,
          pattern: 'missing-dark-mode',
          severity: 'warning',
          explanation: 'Komponen menggunakan Tailwind color classes tanpa dark: variant. Dark mode belum diimplementasikan.',
          fix: 'Tambahkan dark: prefix untuk setiap color utility. Contoh: bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100',
        };
      }
    }
  }
  return null;
}

/**
 * 26. Missing reduced motion.
 */
function checkMissingReducedMotion(code, lines) {
  if (code.includes('animate') || code.includes('transition') || code.includes('@keyframes') || code.includes('motion') || code.includes('framer')) {
    if (!code.includes('prefers-reduced-motion') && !code.includes('useReducedMotion') && !code.includes('reduceMotion')) {
      return {
        line: findLine(lines, 'animate') || findLine(lines, 'transition') || 1,
        pattern: 'missing-reduced-motion',
        severity: 'error',
        explanation: 'Animasi/transisi terdeteksi tanpa prefers-reduced-motion guard. Setiap animasi WAJIB honor reduced motion.',
        fix: 'Bungkus animasi dengan @media (prefers-reduced-motion: no-preference) di CSS, atau useReducedMotion() di Motion.',
      };
    }
  }
  return null;
}

/**
 * 27. No alt text on images.
 */
function checkNoAltText(code, lines) {
  const imgTags = code.match(/<img[^>]*>/g) || [];
  for (const img of imgTags) {
    if (!img.includes('alt=')) {
      const line = findLine(lines, '<img') || 1;
      return {
        line,
        pattern: 'no-alt-text',
        severity: 'error',
        explanation: 'Tag <img> tanpa alt attribute. Alt text WAJIB untuk aksesibilitas.',
        fix: 'Tambahkan alt="Deskripsi gambar" pada setiap <img>. Untuk gambar dekoratif: alt="".',
      };
    }
  }
  return null;
}

/**
 * 28. Div-based fake screenshots.
 */
function checkDivFakeScreenshots(code, lines) {
  if ((code.includes('fake-screenshot') || code.includes('fakeScreenshot') || code.includes('mockup')) &&
      (code.includes('<div') && code.includes('terminal') || code.includes('dashboard'))) {
    return {
      line: findLine(lines, 'fake-screenshot') || findLine(lines, 'mockup') || 1,
      pattern: 'div-fake-screenshots',
      severity: 'warning',
      explanation: 'Div-based fake screenshots (terminal, dashboard, task list) terdeteksi. Ini adalah AI tell.',
      fix: 'Gunakan real screenshots, generated images, atau skip preview entirely. Div-based fake screenshots banned.',
    };
  }
  return null;
}

/**
 * 29. Custom cursor without ask.
 */
function checkCustomCursor(code, lines) {
  if (code.includes('cursor-') && (code.includes('pointer-events') || code.includes('cursor'))) {
    if (code.includes('mix-blend-mode') || code.includes('custom-cursor') || code.includes('customCursor')) {
      return {
        line: findLine(lines, 'cursor') || 1,
        pattern: 'custom-cursor',
        severity: 'warning',
        explanation: 'Custom cursor terdeteksi. Custom mouse cursors adalah outdated, a11y-hostile, dan perf-hostile.',
        fix: 'Hapus custom cursor. Gunakan cursor default browser. Custom cursor hanya jika user explicit meminta.',
      };
    }
  }
  return null;
}

/**
 * 30. No focus state.
 */
function checkNoFocusState(code, lines) {
  // Check interactive elements for focus-visible
  const interactiveTags = code.match(/<(button|a|input|select|textarea)[^>]*>/g) || [];
  const hasFocusVisible = code.includes('focus-visible') || code.includes(':focus');

  if (interactiveTags.length > 0 && !hasFocusVisible) {
    return {
      line: findLine(lines, '<button') || findLine(lines, '<a') || 1,
      pattern: 'no-focus-state',
      severity: 'error',
      explanation: 'Elemen interaktif tidak memiliki focus state. Keyboard navigation tidak bisa melihat elemen mana yang aktif.',
      fix: 'Tambahkan focus-visible:ring-2 focus-visible:ring-zinc-400 outline-none pada semua elemen interaktif.',
    };
  }
  return null;
}

/**
 * 31. Resize on non-textarea.
 */
function checkResizeOnNonTextarea(code, lines) {
  if (code.includes('resize') && !code.includes('textarea') && !code.includes('<textarea')) {
    const line = findLine(lines, 'resize') || 1;
    return {
      line,
      pattern: 'resize-non-textarea',
      severity: 'info',
      explanation: 'Properti resize terdeteksi di non-textarea element. Resize hanya untuk textarea.',
      fix: 'Pastikan resize: none pada semua div, button, section. Hanya textarea yang boleh resize: vertical.',
    };
  }
  return null;
}

/**
 * 32. Em-dash (—) usage.
 */
function checkEmDash(code, lines) {
  if (code.includes('—') || code.includes('\u2014')) {
    const line = findLine(lines, '—') || 1;
    return {
      line,
      pattern: 'em-dash',
      severity: 'error',
      explanation: 'Em-dash (—) atau en-dash (–) terdeteksi. Banned total di headlines, eyebrows, pills, body copy, quotes, attribution, captions, buttons, alt text.',
      fix: 'Ganti semua em-dash dengan regular hyphen (-).',
    };
  }
  return null;
}

/**
 * 33. AI advertising copy.
 */
function checkAIAdvertisingCopy(code, lines) {
  const ads = [
    'Quietly in use at', 'Quietly trusted by', 'Trusted by industry leaders',
    'Trusted by teams', 'Join thousands', 'Supercharge',
  ];

  for (const phrase of ads) {
    if (code.includes(phrase)) {
      const line = findLine(lines, phrase) || 1;
      return {
        line,
        pattern: 'ai-advertising-copy',
        severity: 'info',
        explanation: `Frase "${phrase}" terdeteksi — ini adalah AI advertising cliché.`,
        fix: 'Ganti dengan copy yang lebih spesifik dan natural. Contoh: spesifikasikan industri, jumlah real, atau use case konkret.',
      };
    }
  }
  return null;
}

/**
 * 34. Version labels in hero.
 */
function checkVersionHero(code, lines) {
  const versionPatterns = [
    /\bv\d+\.\d+\b/, /\bBETA\b/, /\bINVITE-ONLY\b/, /\bALPHA\b/,
    /\bEARLY ACCESS\b/, /\bSoon\b/,
  ];

  // Only check if near hero area
  if (code.includes('hero') || code.includes('Hero') || code.includes('HERO')) {
    for (const pattern of versionPatterns) {
      if (pattern.test(code)) {
        const line = findRegex(lines, pattern) || 1;
        return {
          line,
          pattern: 'version-hero',
          severity: 'warning',
          explanation: 'Version labels (v1.0, BETA, EARLY ACCESS) di hero section. Ini adalah AI tell dan mengurangi kredibilitas.',
          fix: 'Hapus semua version labels dari hero. Jika perlu menunjukkan status, gunakan badge di bagian lain halaman.',
        };
      }
    }
  }
  return null;
}

/**
 * 35. Scroll cues.
 */
function checkScrollCue(code, lines) {
  const cues = ['Scroll', '↓ scroll', 'Scroll to explore', 'Scroll down'];
  for (const cue of cues) {
    if (code.includes(cue)) {
      const line = findLine(lines, cue) || 1;
      return {
        line,
        pattern: 'scroll-cue',
        severity: 'warning',
        explanation: `Scroll cue "${cue}" terdeteksi. Scroll cues, animated mouse-wheel icons dilarang.`,
        fix: 'Hapus scroll cue. Biarkan user men-scroll secara alami.',
      };
    }
  }
  return null;
}
