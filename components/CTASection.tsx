import Link from "next/link";

type CTASectionProps = {
  title: string;
  body: string;
  primaryLabel?: string;
  secondaryLabel?: string;
};

export function CTASection({
  title,
  body,
  primaryLabel = "Get a Free Breakdown",
  secondaryLabel = "View Services",
}: CTASectionProps) {
  return (
    <section
      className="mt-[100px] overflow-hidden rounded-2xl bg-obsidian"
      style={{ border: "0.5px solid rgba(255,255,255,0.07)" }}
    >
      {/* Top strip */}
      <div
        className="flex items-center gap-3 px-8 py-4 md:px-10"
        style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyberLime" />
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">
          Next Step · Conversion
        </p>
      </div>

      {/* Body */}
      <div className="px-8 py-10 md:px-10 md:py-12">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.01em] text-white md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
            {body}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="cta-button">
              {primaryLabel}
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 font-sans text-sm font-semibold text-white/70 transition hover:text-white"
              style={{ border: "0.5px solid rgba(255,255,255,0.15)" }}
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom mono line */}
      <div
        className="px-8 py-4 md:px-10"
        style={{ borderTop: "0.5px solid rgba(255,255,255,0.05)" }}
      >
        <p className="font-mono text-[10px] text-white/20">
          {"> hade.systems · adaptive ux design"}
        </p>
      </div>
    </section>
  );
}
