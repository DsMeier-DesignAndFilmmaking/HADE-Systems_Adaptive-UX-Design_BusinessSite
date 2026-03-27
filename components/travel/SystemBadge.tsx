import { hexToRgba } from "./utils";

interface SystemBadgeProps {
  accent?: string;
}

export default function SystemBadge({ accent = "#0891B2" }: SystemBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em]"
      style={{
        background: hexToRgba(accent, 0.08),
        border: `1px solid ${hexToRgba(accent, 0.25)}`,
        color: accent,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: accent, opacity: 0.7 }}
      />
      HADE Integration: Build In Progress
    </span>
  );
}
