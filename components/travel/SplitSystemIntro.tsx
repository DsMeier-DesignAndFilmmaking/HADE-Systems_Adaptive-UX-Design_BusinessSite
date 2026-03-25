import { hexToRgba } from "./utils";

interface SplitColumn {
  label: string;
  heading: string;
  body: string;
}

interface SplitSystemIntroProps {
  left: SplitColumn;
  right: SplitColumn;
  accent?: string;
}

export default function SplitSystemIntro({
  left,
  right,
  accent = "#0891B2",
}: SplitSystemIntroProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {/* Left — neutral */}
      <div
        className="rounded-xl p-5"
        style={{
          background: "rgba(11,13,18,0.03)",
          border: "1px solid rgba(11,13,18,0.08)",
        }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-2">
          {left.label}
        </p>
        <p className="text-sm font-semibold text-ink mb-2">{left.heading}</p>
        <p className="text-sm text-ink/60 leading-relaxed">{left.body}</p>
      </div>

      {/* Right — accent tinted */}
      <div
        className="rounded-xl p-5"
        style={{
          background: hexToRgba(accent, 0.04),
          border: `1px solid ${hexToRgba(accent, 0.14)}`,
        }}
      >
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-2"
          style={{ color: accent }}
        >
          {right.label}
        </p>
        <p className="text-sm font-semibold text-ink mb-2">{right.heading}</p>
        <p className="text-sm text-ink/60 leading-relaxed">{right.body}</p>
      </div>
    </div>
  );
}
