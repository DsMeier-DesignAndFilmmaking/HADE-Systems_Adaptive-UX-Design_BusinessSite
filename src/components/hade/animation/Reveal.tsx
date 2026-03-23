"use client";

import { type ReactNode, useEffect, useState } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export default function Reveal({
  children,
  delay = 0,
  className = "",
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`
        transform-gpu transition-all duration-500 ease-out
        ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-100 translate-y-2 scale-[0.98]"}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
