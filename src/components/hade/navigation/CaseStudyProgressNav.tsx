"use client";

import { useEffect, useRef, useState } from "react";

export type ProgressNavSection = {
  id: string;
  label: string;
};

const SCROLL_OFFSET = -100;

export default function CaseStudyProgressNav({
  sections,
}: {
  sections: ProgressNavSection[];
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [progress, setProgress] = useState(0);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto-center active pill
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  // Scroll listener: progress + section detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      setProgress(Math.min(Math.max(scrollTop / scrollHeight, 0), 1));

      // Walk sections in reverse — last one whose top has passed 120px wins
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset + SCROLL_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div
      className="md:hidden sticky top-16 z-[60] bg-obsidian/92 backdrop-blur-md"
      style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.06)" }}
    >
      {/* ── Progress bar ─────────────────────────────────────── */}
      <div className="h-[2px] bg-white/[0.08]">
        <div
          className="h-full bg-[#316BFF] transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* ── Navigation pills ─────────────────────────────────── */}
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2 px-4 py-2.5 min-w-max">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              ref={active === id ? activeRef : null}
              onClick={() => scrollToSection(id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                active === id
                  ? "bg-white text-ink shadow-[0_0_0_2px_rgba(49,107,255,0.3)]"
                  : "bg-white/[0.07] text-white/55 hover:bg-white/[0.12] hover:text-white/80"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
