/**
 * HADE Systems — Color Tokens
 *
 * Typed re-export of design token hex values matching tailwind.config.ts.
 * Use these when you need raw hex/rgba values in `style={}` props.
 * For Tailwind class usage, use the token names directly (e.g. `bg-ink`).
 */

export const colors = {
  // Core surfaces
  ink: "#0b0d12",
  surface: "#f6f7f9",
  line: "#d8dce3",
  obsidian: "#080b11",
  slateGlass: "#1c2236",

  // Accent
  accent: "#316BFF",
  accentSoft: "#E7EEFF",
  electricBlue: "#316BFF",

  // Signal / CTA
  cyberLime: "#F59E0B",
} as const;

export type ColorToken = keyof typeof colors;
