"use client";

import { useEffect, useState } from "react";
import { Activity, Layers3, RotateCcw } from "lucide-react";

export type VerticalNavSection = {
  id: string;
  label: string;
  color: string;
};

const SCROLL_OFFSET = -80;

export default function VerticalCaseStudyNav({
  sections,
}: {
  sections: VerticalNavSection[];
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i].id);
          if (el && el.getBoundingClientRect().top <= 150) {
            setActive((prev) =>
              prev === sections[i].id ? prev : sections[i].id
            );
            break;
          }
        }
        ticking = false;
      });
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
    <div className="md:hidden fixed right-2.5 top-1/4 z-[60] flex flex-col gap-2">
      {sections.map(({ id, label, color }) => {
        const isActive = active === id;
        const Icon =
          id === "activation" ? Activity : id === "retention" ? RotateCcw : Layers3;

        return (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            aria-current={isActive ? "true" : undefined}
            title={label}
            style={{
              border: isActive ? `2px solid ${color}` : "2px solid transparent",
              willChange: "transform",
            }}
            className={`
              flex items-center justify-start gap-2 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap
              bg-white text-ink shadow-sm
              transition-all duration-200 ease-out
              ${isActive ? "scale-105" : "hover:opacity-80"}
            `}
          >
            <span className="flex-shrink-0 flex items-center justify-center w-5 h-5">
              <Icon className="w-full h-full" />
            </span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
