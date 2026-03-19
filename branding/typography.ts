/**
 * HADE Systems — Typography Tokens
 *
 * Typed constants for the full type scale.
 * Use these when you need precise values in `style={}` props.
 * For Tailwind class usage, use standard utility classes (e.g. `text-sm font-semibold`).
 */

export const fontFamily = {
  sans: "var(--font-inter), system-ui, sans-serif",
  mono: "var(--font-jetbrains), Menlo, monospace",
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
} as const;

/**
 * Font size scale — maps to Tailwind size utilities.
 * label (10px) is the mono eyebrow/label size used throughout.
 */
export const fontSize = {
  label: "10px",   // mono-label, eyebrow — font-mono text-[10px]
  xs: "11px",      // text-xs (approx)
  sm: "14px",      // text-sm
  base: "16px",    // text-base
  lg: "18px",      // text-lg
  xl: "20px",      // text-xl
  "2xl": "24px",   // text-2xl
  "3xl": "30px",   // text-3xl
  "4xl": "36px",   // text-4xl (section titles)
  "5xl": "48px",   // text-5xl (page h1 on desktop)
} as const;

/**
 * Letter spacing — maps to Tailwind tracking utilities.
 * label (0.2em) is used for uppercase eyebrow/label text.
 * widest (0.18em) is used for mono system labels (logo, footer).
 */
export const letterSpacing = {
  tight: "-0.01em",  // tracking-[-0.01em] — headings
  normal: "0",
  wide: "0.1em",
  wider: "0.14em",
  widest: "0.18em",  // tracking-[0.18em] — mono system labels (HADE SYSTEMS)
  label: "0.2em",    // tracking-[0.2em] — uppercase eyebrow labels
} as const;

/**
 * Line height — maps to Tailwind leading utilities.
 */
export const lineHeight = {
  tight: "1.1",     // leading-tight (headings on large sizes)
  snug: "1.3",      // leading-snug
  normal: "1.5",    // leading-normal
  relaxed: "1.6",   // leading-relaxed (body copy)
} as const;
