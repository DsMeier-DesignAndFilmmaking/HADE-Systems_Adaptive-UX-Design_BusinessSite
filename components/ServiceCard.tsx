import Link from "next/link";

type ServiceCardProps = {
  title: string;
  priceRange: string;
  description: string;
  ctaLabel: string;
};

export function ServiceCard({ title, priceRange, description, ctaLabel }: ServiceCardProps) {
  return (
    <article
      className="flex h-full flex-col rounded-2xl bg-white/90 backdrop-blur"
      style={{ border: "0.5px solid rgba(216, 220, 227, 0.75)" }}
    >
      {/* Price strip */}
      <div
        className="px-6 py-4"
        style={{ borderBottom: "0.5px solid rgba(216, 220, 227, 0.6)" }}
      >
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/40">
          {priceRange}
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 py-5">
        <h3 className="text-lg font-semibold leading-snug text-ink">{title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/60">{description}</p>
        <Link
          href="/contact"
          className="mt-6 inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-electricBlue transition hover:text-ink"
        >
          {ctaLabel}
          <span className="text-[10px]">→</span>
        </Link>
      </div>
    </article>
  );
}
