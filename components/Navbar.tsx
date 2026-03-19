import Link from "next/link";
import { navLinks } from "@/lib/site-data";

export function Navbar() {
  return (
    <header
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl"
      style={{ borderBottom: "0.5px solid rgba(216, 220, 227, 0.8)" }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4 md:px-8">
        <Link href="/" className="font-mono text-sm font-semibold tracking-[0.18em] text-ink">
          HADE SYSTEMS
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-sm text-ink/55 transition hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/contact" className="cta-button hidden text-xs md:inline-flex">
          Get a Free Breakdown
        </Link>
      </div>
    </header>
  );
}
