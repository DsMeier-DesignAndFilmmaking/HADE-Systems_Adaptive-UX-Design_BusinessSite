import { hexToRgba } from "./utils";

interface SystemGridItem {
  title: string;
  body: string;
  tag?: string;
}

interface SystemGridProps {
  items: SystemGridItem[];
  accent?: string;
}

export default function SystemGrid({ items, accent = "#0891B2" }: SystemGridProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {items.map(({ title, body, tag }) => (
        <div
          key={title}
          className="rounded-xl p-5"
          style={{
            background: hexToRgba(accent, 0.04),
            border: `1px solid ${hexToRgba(accent, 0.14)}`,
          }}
        >
          {tag && (
            <p
              className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] mb-2"
              style={{ color: accent, opacity: 0.7 }}
            >
              {tag}
            </p>
          )}
          <p className="text-sm font-semibold text-ink mb-2">{title}</p>
          <p className="text-sm text-ink/60 leading-relaxed">{body}</p>
        </div>
      ))}
    </div>
  );
}
