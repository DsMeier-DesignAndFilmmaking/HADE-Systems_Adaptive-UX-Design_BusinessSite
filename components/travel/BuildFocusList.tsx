import { hexToRgba } from "./utils";

interface BuildFocusItem {
  label: string;
  detail: string;
}

interface BuildFocusListProps {
  items: BuildFocusItem[];
  label?: string;
  accent?: string;
}

export default function BuildFocusList({
  items,
  label = "Current Build Focus",
  accent = "#0891B2",
}: BuildFocusListProps) {
  return (
    <section>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-5">
        {label}
      </p>
      <div className="space-y-2">
        {items.map(({ label: itemLabel, detail }) => (
          <div
            key={itemLabel}
            className="flex items-start gap-4 rounded-lg px-4 py-3"
            style={{
              background: hexToRgba(accent, 0.04),
              border: `1px solid ${hexToRgba(accent, 0.14)}`,
            }}
          >
            <span
              className="mt-1.5 w-2 h-2 rounded-full shrink-0"
              style={{ background: accent, opacity: 0.55 }}
            />
            <div>
              <p className="text-base font-semibold tracking-tight text-ink mb-1">{itemLabel}</p>
              <p className="text-sm text-ink/60 leading-relaxed">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
