---
name: human-design
description: Principles and patterns to make UI/UX designs look natural, human-crafted, and not AI-generated. Use this skill when designing interfaces, writing CSS, or reviewing frontend code to avoid common "AI-generated" tell-tale signs.
license: MIT
metadata:
  author: custom
  version: "1.0.0"
  date: July 2026
  abstract: A guide to making digital designs feel authentic, organic, and unmistakably human. Covers typography, color, spacing, layout, imagery, micro-interactions, and content writing patterns that avoid the sterile, over-polished look characteristic of AI-generated designs.
---

# Human Design — Make It Not Look AI-Generated

## Core Philosophy

AI-generated designs tend to be: overly symmetric, perfectly balanced, generically polished, lacking character, and using predictable patterns. Human designs embrace **imperfection**, **character**, and **intentional irregularity**.

## 1. Typography

### DO:
- Pair fonts with contrasting personalities (e.g., serif heading + sans-serif body)
- Use unexpected but readable font combinations
- Vary font weights intentionally, not uniformly
- Limit line length to 60-75 characters for readability
- Use real font weights (400, 500, 600, 700) not arbitrary numbers

### DON'T:
- Use Inter as default font (biggest AI tell)
- Use system font stacks without consideration
- Make all text the same weight
- Use overly geometric fonts everywhere
- Set body text too large (18px+) or too small (under 14px)

### AI Tell Signs to Avoid:
- Inter + system-ui stack
- Perfectly uniform heading hierarchy (every h2, h3 exactly same size)
- Monotone typographic color

## 2. Color Palette

### DO:
- Use 1-2 accent colors max, not 5+ brand colors
- Include at least one "dirty" or muted tone — not everything should be clean
- Use real-world color inspiration (food, nature, architecture)
- Have slightly warm or cool bias, not neutral gray everywhere
- Let some colors be less saturated intentionally

### DON'T:
- Use the exact Tailwind default palette without modification
- Use pure black (#000) or pure white (#fff) backgrounds
- Use more than 3 brand colors
- Make everything perfectly accessible (sometimes low-contrast elements add depth)
- Use identical saturation across all colors

### AI Tell Signs to Avoid:
- Exact Tailwind color scale usage (blue-500, gray-100 pattern)
- Perfect WCAG AAA compliance on every element
- Overuse of indigo/purple as primary (ChatGPT palette)
- All colors at same saturation level

## 3. Spacing & Layout

### DO:
- Use asymmetrical layouts intentionally
- Break the grid sometimes — let elements overflow or misalign slightly
- Vary section padding (not every section has py-24)
- Use negative space unevenly
- Let some elements be closer together, others farther apart

### DON'T:
- Use consistent spacing everywhere (8px/16px/24px/32px rhythm is too perfect)
- Center-align everything
- Make all cards the exact same size
- Use symmetrical page layouts without variation
- Perfectly align every element on a grid

### AI Tell Signs to Avoid:
- Tailwind `space-y-*` on everything
- Equal padding on all sides of cards/sections
- Perfect 50/50 split layouts
- Every section follows exact same structure

## 4. Borders, Shadows & Surfaces

### DO:
- Use subtle, organic shadows (multiple shadow layers for depth)
- Vary border radius intentionally (not all `rounded-lg`)
- Use texture or grain overlays
- Mix flat and elevated surfaces
- Use colored shadows matching the accent

### DON'T:
- Use glassmorphism (frosted glass) — biggest AI trend red flag
- Apply identical border-radius to all components
- Use heavy box-shadows
- Use `backdrop-blur` excessively
- Outline everything

### AI Tell Signs to Avoid:
- Glassmorphism cards with `backdrop-blur-xl bg-white/30`
- `rounded-2xl` on every card
- Overuse of `shadow-lg` or `shadow-xl`
- Gradient borders on everything

## 5. Imagery & Icons

### DO:
- Use authentic photography, not generic stock photos
- Mix illustration styles if there's a unifying element
- Use inconsistent icon styles (outline + filled mix) intentionally
- Add grain, noise, or film texture to images
- Use real screenshots or mockups

### DON'T:
- Use Lucide icons exclusively (AI favorite)
- Use the same icon style throughout
- Use perfectly uniform icon sizes
- Use illustration that looks like it came from an illustration kit
- Overuse SVG animations

### AI Tell Signs to Avoid:
- Lucide icons only, all same weight
- Heroicons-style illustrations
- Undraw or generic illustration style
- Perfect icon grid

## 6. Micro-Interactions & Motion

### DO:
- Use staggered, organic timing (not everything 300ms ease-out)
- Add subtle random delays
- Use spring physics for natural feel
- Make transitions slightly imperfect
- Let some elements be static while others move

### DON'T:
- Animate everything on scroll (AOS pattern)
- Use the exact same animation for every element
- Make all hover effects identical
- Use fade-up + fade-up for every section
- Use the same ease function everywhere

### AI Tell Signs to Avoid:
- Framer Motion `initial={{ opacity: 0, y: 20 }}` on everything
- `whileInView={{ opacity: 1, y: 0 }}` identical for all elements
- Exact 0.3s duration on all animations
- StaggerChildren with identical intervals

## 7. Content & Copy

### DO:
- Write in a consistent brand voice (not generic startup speak)
- Use contractions ("we're" not "we are")
- Vary sentence length
- Include personality and specific details
- Use cultural references relevant to audience

### DON'T:
- Use phrases like "unlock your potential", "revolutionize", "transform"
- Start every sentence the same way
- Use perfectly structured paragraphs (same length)
- Write overly formal or overly casual without reason
- Use generic placeholder content

### AI Tell Signs to Avoid:
- "Welcome to our platform"
- "Empowering businesses to..."
- "Seamless experience"
- "Cutting-edge solutions"
- Bullet points for everything

## 8. Buttons & Interactive Elements

### DO:
- Vary button styles by context (not all same variant)
- Use text that describes action specifically
- Add micro-personality to hover states
- Let some buttons be wider, some narrower naturally
- Use real shadow depth on press

### DON'T:
- Use same button style everywhere
- Make all buttons perfectly rounded
- Use identical padding on all buttons
- Gradient buttons on everything
- Icon + text on every button

### AI Tell Signs to Avoid:
- "Get Started" / "Learn More" / "Sign Up Now"
- All buttons `rounded-full` or all `rounded-lg`
- Primary button uses brand gradient
- Every card has same CTA pattern

## 9. The "Human Check" List

Before considering a design done, audit for these AI tells:

- [ ] Am I using Inter font? → Replace with something with more character
- [ ] Are all my cards the same size? → Vary them
- [ ] Is everything centered? → Try asymmetric alignment
- [ ] Do all sections have same padding? → Break the rhythm
- [ ] Do I have glassmorphism anywhere? → Remove it
- [ ] Are my icons all the same style? → Intentionally mix
- [ ] Is every hover effect identical? → Add variation
- [ ] Is my color palette too clean? → Add a dirty tone
- [ ] Do all animations start the same way? → Randomize
- [ ] Is my copy full of buzzwords? → Rewrite with personality

## 10. Anti-Patterns Directory

| Anti-Pattern | Replace With |
|---|---|
| Glassmorphism navbar | Solid background with subtle shadow |
| Inter font + system-ui | Font pairing with personality (e.g., Satoshi + Instrument Serif) |
| Tailwind default palette | Custom colors with intentional imperfection |
| `space-y-6` everywhere | Varied spacing, sometimes 4, sometimes 10 |
| `rounded-2xl` on everything | Mix rounded and sharp corners |
| Indigo primary color | Unique color specific to brand identity |
| `fade-up` scroll animations | Targeted, purposeful motion |
| Lucide icons only | Mix icon sets or custom icons |
| Centered everything | Asymmetric layouts |
| "Get Started" button | Specific action-driven CTAs |
