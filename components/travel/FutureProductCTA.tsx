import { hexToRgba } from "./utils";
import Link from "next/link";

interface FutureProductCTAProps {
  heading?: string;
  description?: string;
  subtext?: string;
  buttonLabel?: string;
  accent?: string;
}

export default function FutureProductCTA({
  heading = "Field Notes — Working Now",
  description = "The offline-first PWA is deployed and functional. The HADE integration layer is what gets built next — turning content delivery into real-time decision support.",
  subtext = "11 city packs. Arrival intelligence. Live environmental data. No HADE yet.",
  buttonLabel = "View Live Product",
  accent = "#316BFF",
}: FutureProductCTAProps) {
  return (
    <div
      className="rounded-2xl px-7 py-8"
      style={{
        background: hexToRgba(accent, 0.03),
        border: `1px dashed ${hexToRgba(accent, 0.28)}`,
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
        {/* Left: text */}
        <div className="flex-1">
          <p
            className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3"
            style={{ color: accent }}
          >
            Live Product · HADE Integration Pending
          </p>
          <h2 className="text-base font-semibold text-ink mb-2">{heading}</h2>
          <p className="text-sm text-ink/55 leading-relaxed mb-2">{description}</p>
          <p className="text-xs text-ink/40">{subtext}</p>
        </div>

        {/* Right: Active CTA Link */}
        <div className="sm:shrink-0 sm:pt-7">
          <Link
            href="https://downloadable-travel-packs.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-bold transition-all hover:brightness-95 active:scale-95"
            style={{
              background: hexToRgba(accent, 0.1),
              border: `1px solid ${hexToRgba(accent, 0.3)}`,
              color: accent,
            }}
          >
            {buttonLabel}
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
