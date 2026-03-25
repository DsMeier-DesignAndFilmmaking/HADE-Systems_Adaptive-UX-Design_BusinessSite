import { hexToRgba } from "./utils";

interface PrincipleBlockProps {
  statement: string;
  supporting: string;
  accent?: string;
}

export default function PrincipleBlock({
  statement,
  supporting,
  accent = "#0891B2",
}: PrincipleBlockProps) {
  return (
    <blockquote
      className="rounded-xl px-6 py-6"
      style={{
        background: hexToRgba(accent, 0.04),
        borderLeft: `3px solid ${hexToRgba(accent, 0.35)}`,
      }}
    >
      <p className="text-base md:text-lg font-semibold text-ink leading-snug mb-3 italic">
        &ldquo;{statement}&rdquo;
      </p>
      <p className="text-sm text-ink/60 leading-relaxed">{supporting}</p>
    </blockquote>
  );
}
