"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "activation", label: "Activation" },
  { id: "retention", label: "Retention" },
  { id: "system", label: "System" },
];

const SCROLL_OFFSET = -100;

export default function CaseStudySubnav() {
  const [active, setActive] = useState("activation");
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto-center active pill in the scrollable strip
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  // Section detection
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-30% 0px -55% 0px", threshold: 0.2 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset + SCROLL_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div
      className="md:hidden sticky top-16 z-[60] bg-obsidian/90 backdrop-blur-md"
      style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.06)" }}
    >
      {/* overflow-x scroll with hidden scrollbar */}
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2 px-4 py-2.5 min-w-max">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              ref={active === id ? activeRef : null}
              onClick={() => scrollToSection(id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                active === id
                  ? "bg-white text-ink"
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
