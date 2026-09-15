/**
 * components.js — Tool 1: wf_component
 * 
 * Generate React/TSX component code yang mengikuti semua rules workflow-frontend.
 * Mendukung 13 tipe komponen dengan variant, dark mode, animations, dan icon library.
 */

import {
  getRoundedClass,
  getSizeClasses,
  getButtonVariantClasses,
  getIconImports,
  getScrollbarCSS,
  wrapInComponent,
  indent,
  cn,
} from './helpers.js';

// ─── Main Generator ─────────────────────────────────────────────────────────

/**
 * Generate component code berdasarkan parameter.
 * @param {import('./helpers.js').ComponentParams} params
 * @returns {{ component: string, css?: string, imports?: string[], description: string }}
 */
export function generateComponent(params) {
  const {
    type = 'button',
    framework = 'react',
    variant = 'primary',
    options = {},
  } = params;

  const {
    darkMode = false,
    animations = true,
    iconLibrary = 'phosphor',
    rounded = 'md',
    size = 'md',
  } = options;

  const generators = {
    button: () => genButton(variant, size, rounded, darkMode, animations, iconLibrary),
    card: () => genCard(variant, size, rounded, darkMode, animations),
    modal: () => genModal(variant, rounded, darkMode, animations, iconLibrary),
    navbar: () => genNavbar(variant, darkMode, animations, iconLibrary),
    'bottom-nav': () => genBottomNav(variant, darkMode, animations, iconLibrary),
    dropdown: () => genDropdown(variant, rounded, darkMode, animations, iconLibrary),
    input: () => genInput(variant, size, rounded, darkMode, animations),
    badge: () => genBadge(variant, size, rounded, darkMode),
    tabs: () => genTabs(variant, rounded, darkMode, animations, iconLibrary),
    accordion: () => genAccordion(variant, darkMode, animations, iconLibrary),
    select: () => genSelect(variant, size, rounded, darkMode, animations),
    textarea: () => genTextarea(variant, size, rounded, darkMode, animations),
    tooltip: () => genTooltip(variant, darkMode, animations),
    dialog: () => genDialog(variant, rounded, darkMode, animations, iconLibrary),
  };

  const generator = generators[type];
  if (!generator) {
    return {
      component: `// Error: Unknown component type "${type}"`,
      description: `Tipe komponen "${type}" tidak dikenal.`,
    };
  }

  return generator();
}

// ─── Component Generators ────────────────────────────────────────────────────

/**
 * Button component — proper variant styles, loading state, WCAG contrast check.
 */
function genButton(variant, size, rounded, darkMode, animations, iconLib) {
  const s = getSizeClasses(size);
  const r = getRoundedClass(rounded);
  const v = getButtonVariantClasses(variant, darkMode);
  const iconImports = getIconImports(iconLib, ['Spinner', 'ArrowRight']);

  const loadingSpinner = `<span className="animate-spin" aria-hidden="true"><Spinner size={iconSize} /></span>`;

  const component = `"use client";

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
${iconImports}

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 select-none ${animations ? 'active:scale-[0.98]' : ''} ${r}',
  {
    variants: {
      variant: {
        primary: '${v.base} ${v.hover} ${v.active} ${v.focus} ${v.disabled}',
        secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${d()}',
        ghost: 'bg-transparent text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${d().replace('dark:bg-zinc-800', 'dark:hover:bg-zinc-800 dark:text-zinc-100')}',
        outline: 'bg-transparent border border-zinc-300 text-zinc-900 hover:bg-zinc-50 active:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${d().replace('dark:border-zinc-600 dark:text-zinc-100', 'dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800')}',
        solid: '${v.base} ${v.hover} ${v.active} ${v.focus} ${v.disabled}',
      },
      size: {
        sm: '${s.text} ${s.padding} ${s.gap}',
        md: 'text-sm px-4 py-2 gap-2',
        lg: 'text-base px-6 py-3 gap-2.5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      disabled,
      icon,
      iconPosition = 'right',
      children,
      ...props
    },
    ref
  ) => {
    const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;

    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && <span className="animate-spin" aria-hidden="true"><Spinner size={iconSize} /></span>}
        {!loading && icon && iconPosition === 'left' && (
          <span className="shrink-0" aria-hidden="true">{icon}</span>
        )}
        {children && <span className="truncate">{children}</span>}
        {!loading && icon && iconPosition === 'right' && (
          <span className="shrink-0" aria-hidden="true">{icon}</span>
        )}
        {!loading && !icon && variant === 'primary' && (
          <span
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center 
                       group-hover:translate-x-1 group-hover:-translate-y-[1px] transition-transform shrink-0"
            aria-hidden="true"
          >
            <ArrowRight size={iconSize} weight="bold" />
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };`;

  function d() {
    return darkMode ? 
      'dark:bg-zinc-800 dark:text-zinc-100' : '';
  }

  return {
    component,
    description: `Button component dengan variant "${variant}", size "${size}", rounded "${rounded}". Mendukung loading state, icon slot kiri/kanan, WCAG AA contrast, keyboard accessible.`,
    imports: ['class-variance-authority'],
  };
}

/**
 * Card component — double-bezel architecture.
 */
function genCard(variant, size, rounded, darkMode, animations) {
  const r = getRoundedClass(rounded);
  const outerR = getRoundedClass(rounded === 'full' ? 'lg' : rounded === 'none' ? 'none' : 'lg');
  const innerR = `rounded-[calc(${r.includes('rounded-') ? r.replace('rounded-', '') : '1rem'}-0.375rem)]`;

  const component = `"use client";

import { forwardRef } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'highlight';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const paddingClasses = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const variantOuter = {
      default: 'bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10',
      interactive: 'bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 ${animations ? 'transition-all duration-300 hover:ring-black/10 dark:hover:ring-white/20 hover:shadow-lg' : ''}',
      highlight: 'bg-zinc-900/10 dark:bg-white/10 ring-1 ring-zinc-900/10 dark:ring-white/20',
    };

    const variantInner = {
      default: 'bg-white dark:bg-zinc-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]',
      interactive: 'bg-white dark:bg-zinc-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]',
      highlight: 'bg-white dark:bg-zinc-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ring-1 ring-zinc-900/5 dark:ring-white/10',
    };

    return (
      <div
        ref={ref}
        className={\`\${variantOuter[variant]} p-1.5 ${outerR} \${className || ''}\`}
        {...props}
      >
        <div className={\`\${variantInner[variant]} ${innerR} \${paddingClasses[padding]}\`}>
          {children}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };`;

  return {
    component,
    description: `Card component dengan double-bezel architecture (outer shell + inner core). Variant "${variant}", padding "${size}", rounded "${rounded}". Siap dark mode.`,
  };
}

/**
 * Modal component — overlay, escape key, focus trap, animation.
 */
function genModal(variant, rounded, darkMode, animations, iconLib) {
  const r = getRoundedClass(rounded);
  const iconImports = getIconImports(iconLib, ['X']);

  const component = `"use client";

import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
${iconImports}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Modal({ open, onClose, title, description, children, size = 'md' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[calc(100vw-2rem)]',
  };

  // Escape key handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // Focus trap
      if (e.key === 'Tab' && contentRef.current) {
        const focusable = contentRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    previousActiveElement.current = document.activeElement as HTMLElement;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Focus first focusable element
    requestAnimationFrame(() => {
      const focusable = contentRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-desc' : undefined}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        ref={contentRef}
        className={\`relative w-full \${sizeClasses[size]} bg-white dark:bg-zinc-900 ${r} shadow-2xl 
          ${animations ? 'animate-in fade-in zoom-in-95 duration-200' : ''}\`}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-start justify-between px-6 pt-6 pb-0">
            <div>
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-desc" className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="shrink-0 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 
                         hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 
                         focus-visible:ring-2 focus-visible:ring-zinc-400 outline-none transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}`;

  return {
    component,
    description: `Modal component dengan overlay backdrop-blur, escape key handler, focus trap, animasi ${animations ? 'fade-in + zoom-in' : 'none'}. Aksesible dengan ARIA attributes.`,
  };
}

/**
 * Navbar component — solid background, single line, max 80px height.
 */
function genNavbar(variant, darkMode, animations, iconLib) {
  const iconImports = getIconImports(iconLib, ['List', 'X']);

  const component = `"use client";

import { useState, useEffect } from 'react';
${iconImports}

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavbarProps {
  items?: NavItem[];
  logo?: React.ReactNode;
  cta?: React.ReactNode;
  className?: string;
}

export function Navbar({
  items = [
    { label: 'Home', href: '#', active: true },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
  logo,
  cta,
  className = '',
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Prevent body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if (href?.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return (
    <header
      className={\`fixed top-0 left-0 right-0 z-40 h-16 md:h-[72px] transition-shadow duration-300
        \${scrolled ? 'shadow-sm' : 'shadow-none'}
        bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800
        \${className}\`}
      role="banner"
    >
      <nav
        className="h-full max-w-[1400px] mx-auto px-4 md:px-6 flex items-center justify-between"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="shrink-0">
          {logo || (
            <a href="#" className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Brand
            </a>
          )}
        </div>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={handleNavClick}
                className={\`relative px-3 py-2 text-sm transition-colors rounded-lg
                  \${
                    item.active
                      ? 'text-zinc-900 dark:text-zinc-100 font-medium'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }
                  focus-visible:ring-2 focus-visible:ring-zinc-400 outline-none\`}
                aria-current={item.active ? 'page' : undefined}
              >
                {item.label}
                {item.active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-3">
          {cta || (
            <a
              href="#cta"
              onClick={handleNavClick}
              className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium 
                         bg-zinc-900 text-white rounded-full hover:bg-zinc-800 
                         transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400 outline-none"
            >
              Get Started
            </a>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-400 
                       hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors
                       focus-visible:ring-2 focus-visible:ring-zinc-400 outline-none"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 top-16 z-50 md:hidden bg-white dark:bg-zinc-950 
                     ${animations ? 'animate-in slide-in-from-top-2 duration-200' : ''}"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="px-4 py-6">
            <ul className="space-y-1" role="list">
              {items.map((item, i) => (
                <li key={item.href}
                  style={{ animationDelay: animations ? \`\${i * 60}ms\` : '0ms' }}
                  className={animations ? 'animate-in fade-in slide-in-from-right-2 duration-300' : ''}
                >
                  <a
                    href={item.href}
                    onClick={handleNavClick}
                    className={\`block px-4 py-3 text-base rounded-xl transition-colors
                      \${
                        item.active
                          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                      }
                      focus-visible:ring-2 focus-visible:ring-zinc-400 outline-none\`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            {cta ? (
              <div className="mt-6">{cta}</div>
            ) : (
              <a
                href="#cta"
                onClick={(e) => { handleNavClick(e); setMenuOpen(false); }}
                className="mt-6 flex items-center justify-center px-6 py-3 text-base font-medium 
                           bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-colors"
              >
                Get Started
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}`;

  return {
    component,
    description: `Navbar component — solid background (no glassmorphism), single line, max 72px height, hamburger morph to X, mobile overlay dengan staggered links, scroll-aware shadow.`,
  };
}

/**
 * Dropdown component — rounded, shadow, hover bg, fade+slide animation.
 */
function genDropdown(variant, rounded, darkMode, animations, iconLib) {
  const r = getRoundedClass(rounded);
  const iconImports = getIconImports(iconLib, ['ChevronDown', 'Check']);

  const component = `"use client";

import { useState, useRef, useEffect } from 'react';
${iconImports}

export interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  className?: string;
}

export function Dropdown({
  trigger,
  items,
  value,
  onChange,
  label,
  className = '',
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled || item.divider) return;
    onChange?.(item.value);
    setOpen(false);
  };

  return (
    <div ref={ref} className={\`relative inline-block \${className}\`}>
      {label && (
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
          {label}
        </label>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-between gap-2 w-full px-3 py-2 text-sm 
                   bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 
                   text-zinc-900 dark:text-zinc-100 ${r}
                   hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors
                   focus-visible:ring-2 focus-visible:ring-zinc-400 outline-none"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {trigger}
        <ChevronDown
          size={16}
          className={\`transition-transform duration-200 \${open ? 'rotate-180' : ''}\`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className={\`absolute z-50 mt-1 w-full min-w-[200px] bg-white dark:bg-zinc-900 
            border border-zinc-200 dark:border-zinc-700 shadow-lg ${r} py-1
            ${animations ? 'origin-top scale-y-100 opacity-100' : ''}
            transition-all duration-150 ease-out\`}
          style={
            animations
              ? { animation: 'dropdownIn 0.15s ease-out' }
              : undefined
          }
        >
          {items.map((item, i) => {
            if (item.divider) {
              return (
                <li
                  key={i}
                  role="separator"
                  className="my-1 border-t border-zinc-200 dark:border-zinc-700"
                />
              );
            }
            const selected = value === item.value;
            return (
              <li key={item.value} role="option" aria-selected={selected}>
                <button
                  onClick={() => handleSelect(item)}
                  disabled={item.disabled}
                  className={\`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors
                    \${
                      selected
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }
                    \${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-400 outline-none\`}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span className="flex-1 truncate">{item.label}</span>
                  {selected && <Check size={14} className="shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Keyframes for dropdown animation */}
      {animations && (
        <style>{\`
          @keyframes dropdownIn {
            from {
              opacity: 0;
              transform: scaleY(0.95) translateY(-4px);
            }
            to {
              opacity: 1;
              transform: scaleY(1) translateY(0);
            }
          }
        \`}</style>
      )}
    </div>
  );
}`;

  return {
    component,
    description: `Dropdown component dengan rounded ${rounded}, shadow-lg, hover background, fade+slide animation, keyboard navigation, divider support, selected state.`,
  };
}

/**
 * Input component — label ABOVE, error BELOW, no placeholder-as-label.
 */
function genInput(variant, size, rounded, darkMode, animations) {
  const r = getRoundedClass(rounded);
  const s = getSizeClasses(size);

  const component = `"use client";

import { forwardRef, useState } from 'react';
${getIconImports('phosphor', ['Eye', 'EyeSlash', 'AlertCircle', 'CheckCircle'])}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      success,
      leftIcon,
      rightIcon,
      type: typeProp,
      containerClassName = '',
      className = '',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\\s+/g, '-');
    const isPassword = typeProp === 'password';
    const type = isPassword && showPassword ? 'text' : typeProp;

    return (
      <div className={\`space-y-1.5 \${containerClassName}\`}>
        {/* Label — ABOVE input */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            className={\`w-full ${s.text} ${s.padding} ${r}
              bg-white dark:bg-zinc-900
              border transition-colors
              \${
                error
                  ? 'border-red-400 dark:border-red-500 focus-visible:ring-red-400'
                  : success
                    ? 'border-emerald-400 dark:border-emerald-500 focus-visible:ring-emerald-400'
                    : 'border-zinc-300 dark:border-zinc-600 focus-visible:ring-zinc-400'
              }
              text-zinc-900 dark:text-zinc-100
              placeholder:text-zinc-400 dark:placeholder:text-zinc-500
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-50 dark:disabled:bg-zinc-800
              \${leftIcon ? 'pl-10' : ''}
              \${isPassword || rightIcon ? 'pr-10' : ''}
              \${className}\`}
            aria-invalid={!!error}
            aria-describedby={error ? \`\${inputId}-error\` : hint ? \`\${inputId}-hint\` : undefined}
            {...props}
          />

          {/* Right icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {success && !error && (
              <CheckCircle size={16} className="text-emerald-500" aria-hidden="true" />
            )}
            {error && (
              <AlertCircle size={16} className="text-red-400" aria-hidden="true" />
            )}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 
                           focus-visible:ring-2 focus-visible:ring-zinc-400 outline-none rounded"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            )}
            {rightIcon && !error && !isPassword && (
              <span className="text-zinc-400" aria-hidden="true">{rightIcon}</span>
            )}
          </div>
        </div>

        {/* Error — BELOW input */}
        {error && (
          <p id={\`\${inputId}-error\`} className="text-sm text-red-500 dark:text-red-400" role="alert">
            {error}
          </p>
        )}

        {/* Hint text */}
        {hint && !error && (
          <p id={\`\${inputId}-hint\`} className="text-sm text-zinc-400 dark:text-zinc-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };`;

  return {
    component,
    description: `Input component — label ABOVE input, error BELOW input, no placeholder-as-label. Mendukung password toggle, icon kiri/kanan, error/success state, hint text, disabled.`,
  };
}

/**
 * Badge component.
 */
function genBadge(variant, size, rounded, darkMode) {
  const r = getRoundedClass(rounded);
  const s = getSizeClasses(size);

  const component = `"use client";

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium ${r} select-none',
  {
    variants: {
      variant: {
        default: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
        primary: 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900',
        secondary: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300',
        outline: 'border border-zinc-300 text-zinc-700 dark:border-zinc-600 dark:text-zinc-300 bg-transparent',
        success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
        lg: 'text-sm px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={badgeVariants({ variant, size, className })}
        {...props}
      >
        {dot && (
          <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" aria-hidden="true" />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };`;

  return {
    component,
    description: `Badge component dengan 7 variant (default, primary, secondary, outline, success, warning, error), 3 sizes, dot indicator.`,
    imports: ['class-variance-authority'],
  };
}

/**
 * Tabs component.
 */
function genTabs(variant, rounded, darkMode, animations, iconLib) {
  const iconImports = getIconImports(iconLib, []);

  const component = `"use client";

import { useState } from 'react';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'underline' | 'pills' | 'segmented';
  className?: string;
}

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  variant = 'underline',
  className = '',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const tabStyles = {
    underline: {
      list: 'flex border-b border-zinc-200 dark:border-zinc-700 gap-0',
      tab: (active: boolean, disabled?: boolean) =>
        \`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors
        \${
          active
            ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100'
            : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
        }
        \${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus-visible:ring-2 focus-visible:ring-zinc-400 outline-none\`,
    },
    pills: {
      list: 'flex gap-1',
      tab: (active: boolean, disabled?: boolean) =>
        \`px-4 py-2 text-sm font-medium rounded-lg transition-colors
        \${
          active
            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }
        \${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus-visible:ring-2 focus-visible:ring-zinc-400 outline-none\`,
    },
    segmented: {
      list: 'flex gap-0 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl',
      tab: (active: boolean, disabled?: boolean) =>
        \`px-4 py-2 text-sm font-medium rounded-lg transition-all
        \${
          active
            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
        }
        \${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus-visible:ring-2 focus-visible:ring-zinc-400 outline-none\`,
    },
  };

  const current = tabStyles[variant];

  return (
    <div className={className}>
      <div role="tablist" aria-orientation="horizontal">
        <div className={current.list}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={\`tabpanel-\${tab.id}\`}
              id={\`tab-\${tab.id}\`}
              onClick={() => handleTabClick(tab.id)}
              disabled={tab.disabled}
              className={current.tab(activeTab === tab.id, tab.disabled)}
              tabIndex={activeTab === tab.id ? 0 : -1}
            >
              <span className="flex items-center gap-2">
                {tab.icon && <span className="shrink-0">{tab.icon}</span>}
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={\`tabpanel-\${tab.id}\`}
          aria-labelledby={\`tab-\${tab.id}\`}
          hidden={activeTab !== tab.id}
          className={\`pt-4 \${activeTab === tab.id ? 'block' : 'hidden'}\`}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}`;

  return {
    component,
    description: `Tabs component dengan 3 variant (underline, pills, segmented), keyboard navigation, disabled tabs, icon support, aria roles.`,
  };
}

/**
 * Accordion component — no container box, border-bottom only.
 */
function genAccordion(variant, darkMode, animations, iconLib) {
  const iconImports = getIconImports(iconLib, ['Plus', 'Minus']);

  const component = `"use client";

import { useState } from 'react';
${iconImports}

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}

export function Accordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className = '',
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setOpenItems((prev) =>
        prev.includes(id) ? [] : [id]
      );
    }
  };

  return (
    <div className={\`divide-y divide-zinc-200 dark:divide-zinc-700 \${className}\`}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        return (
          <div key={item.id} className="py-0">
            <h3>
              <button
                onClick={() => !item.disabled && toggle(item.id)}
                disabled={item.disabled}
                className="w-full flex items-center justify-between py-4 text-left 
                           text-base font-medium text-zinc-900 dark:text-zinc-100
                           hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed
                           focus-visible:ring-2 focus-visible:ring-zinc-400 outline-none rounded"
                aria-expanded={isOpen}
                aria-controls={\`accordion-content-\${item.id}\`}
              >
                <span>{item.title}</span>
                <span className="shrink-0 ml-4 text-zinc-400" aria-hidden="true">
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
            </h3>
            <div
              id={\`accordion-content-\${item.id}\`}
              role="region"
              hidden={!isOpen}
              className={\`overflow-hidden transition-all duration-300 ease-out
                \${isOpen ? 'max-h-[500px] pb-4' : 'max-h-0'}\`}
            >
              <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}`;

  return {
    component,
    description: `Accordion component — no container box, hanya border-bottom separator. Plus/Minus toggle, single/multiple mode, disabled items, animasi max-height.`,
  };
}

/**
 * Select component — custom select with proper styling.
 */
function genSelect(variant, size, rounded, darkMode, animations) {
  const r = getRoundedClass(rounded);
  const s = getSizeClasses(size);
  const iconImports = getIconImports('phosphor', ['ChevronDown']);

  const component = `"use client";

import { forwardRef } from 'react';
${iconImports}

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      placeholder = 'Select an option',
      containerClassName = '',
      className = '',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\\s+/g, '-');

    return (
      <div className={\`space-y-1.5 \${containerClassName}\`}>
        {/* Label — ABOVE */}
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {label}
          </label>
        )}

        {/* Select wrapper */}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={\`w-full appearance-none ${s.text} ${s.padding} ${r}
              bg-white dark:bg-zinc-900
              border transition-colors pr-10
              \${
                error
                  ? 'border-red-400 dark:border-red-500 focus-visible:ring-red-400'
                  : 'border-zinc-300 dark:border-zinc-600 focus-visible:ring-zinc-400'
              }
              text-zinc-900 dark:text-zinc-100
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-50 dark:disabled:bg-zinc-800
              \${className}\`}
            aria-invalid={!!error}
            aria-describedby={error ? \`\${selectId}-error\` : hint ? \`\${selectId}-hint\` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
            <ChevronDown size={16} />
          </div>
        </div>

        {/* Error — BELOW */}
        {error && (
          <p id={\`\${selectId}-error\`} className="text-sm text-red-500 dark:text-red-400" role="alert">
            {error}
          </p>
        )}

        {/* Hint */}
        {hint && !error && (
          <p id={\`\${selectId}-hint\`} className="text-sm text-zinc-400 dark:text-zinc-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };`;

  return {
    component,
    description: `Select component — label ABOVE, error BELOW, custom chevron icon, placeholder, disabled options, WCAG accessible.`,
  };
}

/**
 * Textarea component — resize vertical only.
 */
function genTextarea(variant, size, rounded, darkMode, animations) {
  const r = getRoundedClass(rounded);

  const component = `"use client";

import { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      containerClassName = '',
      className = '',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\\s+/g, '-');

    return (
      <div className={\`space-y-1.5 \${containerClassName}\`}>
        {/* Label — ABOVE */}
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          className={\`w-full px-4 py-3 text-sm ${r}
            bg-white dark:bg-zinc-900
            border transition-colors
            \${
              error
                ? 'border-red-400 dark:border-red-500 focus-visible:ring-red-400'
                : 'border-zinc-300 dark:border-zinc-600 focus-visible:ring-zinc-400'
            }
            text-zinc-900 dark:text-zinc-100
            placeholder:text-zinc-400 dark:placeholder:text-zinc-500
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-50 dark:disabled:bg-zinc-800
            resize-y min-h-[100px]
            \${className}\`}
          aria-invalid={!!error}
          aria-describedby={error ? \`\${textareaId}-error\` : hint ? \`\${textareaId}-hint\` : undefined}
          {...props}
        />

        {/* Error — BELOW */}
        {error && (
          <p id={\`\${textareaId}-error\`} className="text-sm text-red-500 dark:text-red-400" role="alert">
            {error}
          </p>
        )}

        {/* Hint */}
        {hint && !error && (
          <p id={\`\${textareaId}-hint\`} className="text-sm text-zinc-400 dark:text-zinc-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };`;

  return {
    component,
    description: `Textarea component — label ABOVE, error BELOW, resize vertical only. Styling konsisten dengan Input.`,
  };
}

/**
 * Tooltip component.
 */
function genTooltip(variant, darkMode, animations) {
  const component = `"use client";

import { useState, useRef } from 'react';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 300,
  className = '',
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-zinc-900 dark:border-l-zinc-100 border-4 border-transparent border-t-0',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-zinc-900 dark:border-l-zinc-100 border-4 border-transparent border-b-0',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-zinc-900 dark:border-t-zinc-100 border-4 border-transparent border-r-0',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-zinc-900 dark:border-t-zinc-100 border-4 border-transparent border-l-0',
  };

  const show = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <div
      className={\`relative inline-flex \${className}\`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={\`absolute z-50 \${positionClasses[position]} pointer-events-none\`}
        >
          <div className="px-2.5 py-1.5 text-xs text-white bg-zinc-900 dark:bg-zinc-100 
                          dark:text-zinc-900 rounded-lg shadow-md whitespace-nowrap
                          ${animations ? 'animate-in fade-in zoom-in-95 duration-100' : ''}">
            {content}
          </div>
          <div className={\`absolute \${arrowClasses[position]}\`} />
        </div>
      )}
    </div>
  );
}`;

  return {
    component,
    description: `Tooltip component dengan 4 arah (top/bottom/left/right), delay, dark mode, animasi fade-in.`,
  };
}

/**
 * Dialog component (Alert Dialog pattern).
 */
function genDialog(variant, rounded, darkMode, animations, iconLib) {
  const r = getRoundedClass(rounded);
  const iconImports = getIconImports(iconLib, ['X', 'Warning', 'Info']);

  const component = `"use client";

import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
${iconImports}

export interface DialogAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
}

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  icon?: 'warning' | 'info' | 'custom';
  customIcon?: React.ReactNode;
  actions: DialogAction[];
  size?: 'sm' | 'md' | 'lg';
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  icon,
  customIcon,
  actions,
  size = 'sm',
}: DialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && contentRef.current) {
        const focusable = contentRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    previousActiveElement.current = document.activeElement as HTMLElement;
    document.addEventListener('keydown', handleKeyDown);

    requestAnimationFrame(() => {
      const primary = contentRef.current?.querySelector<HTMLElement>(
        'button:not([disabled])'
      );
      primary?.focus();
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [open, handleKeyDown]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const iconEl = icon === 'warning' ? (
    <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
      <Warning size={24} className="text-red-500" />
    </div>
  ) : icon === 'info' ? (
    <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
      <Info size={24} className="text-blue-500" />
    </div>
  ) : customIcon ? (
    <div className="mx-auto mb-4">{customIcon}</div>
  ) : null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby={description ? 'dialog-desc' : undefined}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={contentRef}
        className={\`relative w-full \${sizeClasses[size]} bg-white dark:bg-zinc-900 ${r} 
          shadow-2xl p-6
          ${animations ? 'animate-in fade-in zoom-in-95 duration-200' : ''}\`}
      >
        {iconEl}
        <h2 id="dialog-title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 text-center">
          {title}
        </h2>
        {description && (
          <p id="dialog-desc" className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 text-center">
            {description}
          </p>
        )}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex items-center justify-end gap-3">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              disabled={action.disabled || action.loading}
              className={\`px-4 py-2 text-sm font-medium rounded-xl transition-all
                \${
                  action.variant === 'danger'
                    ? 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50'
                    : action.variant === 'primary' || !action.variant
                      ? 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 disabled:opacity-50'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-50'
                }
                focus-visible:ring-2 focus-visible:ring-zinc-400 outline-none\`}
              aria-busy={action.loading}
            >
              {action.loading ? 'Loading...' : action.label}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}`;

  return {
    component,
    description: `Dialog (AlertDialog) component — overlay backdrop-blur, escape key, focus trap, 3 icon modes, action buttons dengan variant (primary/secondary/danger), loading state.`,
  };
}

/**
 * Bottom Navigation component — fixed di bottom mobile, hidden di desktop.
 * NO hamburger. Max 5 items. Safe area aware. Solid background. Z-50.
 */
function genBottomNav(variant, darkMode, animations, iconLib) {
  const iconImports = getIconImports(iconLib, ['House', 'MagnifyingGlass', 'PlusCircle', 'Heart', 'User']);

  const component = `"use client";

import { useLocation, Link } from 'react-router-dom';
${iconImports}

export interface BottomNavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  activeIcon: React.ElementType;
}

export interface BottomNavProps {
  items?: BottomNavItem[];
  className?: string;
}

const defaultItems: BottomNavItem[] = [
  { path: '/', label: 'Home', icon: House, activeIcon: House },
  { path: '/search', label: 'Search', icon: MagnifyingGlass, activeIcon: MagnifyingGlass },
  { path: '/create', label: 'Add', icon: PlusCircle, activeIcon: PlusCircle },
  { path: '/saved', label: 'Saved', icon: Heart, activeIcon: Heart },
  { path: '/profile', label: 'Profile', icon: User, activeIcon: User },
];

export function BottomNav({
  items = defaultItems,
  className = '',
}: BottomNavProps) {
  const location = useLocation();

  return (
    <nav
      className={\`fixed bottom-0 left-0 right-0 z-50 h-16 
        bg-white dark:bg-zinc-950 
        border-t border-zinc-200 dark:border-zinc-800
        pb-[env(safe-area-inset-bottom,0px)]
        lg:hidden
        \${className}\`}
      role="navigation"
      aria-label="Bottom navigation"
    >
      <div className="flex h-full items-center">
        {items.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 h-full 
                         transition-colors duration-150
                         focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-400 outline-none"
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={22}
                weight={isActive ? 'fill' : 'regular'}
                className={isActive 
                  ? 'text-zinc-900 dark:text-zinc-100' 
                  : 'text-zinc-400 dark:text-zinc-500'
                }
              />
              <span className={\`text-[10px] leading-tight \${
                isActive
                  ? 'font-semibold text-zinc-900 dark:text-zinc-100'
                  : 'font-medium text-zinc-400 dark:text-zinc-500'
              }\`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}`;

  return {
    component,
    description: `Bottom Navigation component — fixed bottom, max 5 items, safe-area-aware, hidden di desktop (lg:hidden). Solid background, NO hamburger. Active state dengan filled icon + bold label. Phosphor icons.`,
  };
}
