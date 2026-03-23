"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export function StickySprintCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.3);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(10px)",
      }}
    >
      <Link
        href="/adaptive-ux-sprint"
        className="cta-button shadow-glow"
        style={{ fontSize: "13px", paddingLeft: "20px", paddingRight: "20px" }}
      >
        Start Sprint
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/85 text-white/50 hover:text-white transition"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
