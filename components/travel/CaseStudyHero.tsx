import { hexToRgba } from "./utils";
import SystemBadge from "./SystemBadge";
import Link from "next/link";

interface CaseStudyHeroProps {
  accent?: string;
}

export default function CaseStudyHero({ accent = "#0891B2" }: CaseStudyHeroProps) {
  return (
    <div className="mb-12">
      {/* Badge row */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span
          className="rounded-full px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em]"
          style={{
            background: hexToRgba(accent, 0.08),
            border: `1px solid ${hexToRgba(accent, 0.25)}`,
            color: accent,
          }}
        >
          Live Product — In Progress
        </span>
        <span className="rounded-full border border-line bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/45">
          Travel · Live Build
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-semibold text-ink leading-snug mb-4">
        Travel Packs
      </h1>

      {/* Subtitle */}
      <p className="text-base text-ink/65 leading-relaxed mb-5">
        An adaptive, offline-first travel system powered by the HADE Decision Engine—designed to
        help travelers make better decisions in real time without constant phone use.
      </p>

      {/* System badge */}
      <div className="flex items-center gap-3 mb-3">
        <SystemBadge accent={accent} />
      </div>

      <Link 
  href="https://downloadable-travel-packs.vercel.app/"
  target="_blank" 
  rel="noopener noreferrer"
  className="inline-block group"
>
  <p className="text-sm text-ink/80 mt-3 transition-colors group-hover:text-[#316BFF]">
    Live product coming soon. <span className="underline decoration-ink/20 group-hover:decoration-[#316BFF]">Prototype in active development.</span>
  </p>
</Link>
    </div>
  );
}
