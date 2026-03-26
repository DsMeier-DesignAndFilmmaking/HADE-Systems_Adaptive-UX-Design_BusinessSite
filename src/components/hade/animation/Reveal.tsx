import { type ReactNode } from "react";

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
  return (
    <div data-reveal data-reveal-delay={delay} className={`animate-trigger reveal reveal-init ${className}`.trim()}>
      {children}
    </div>
  );
}
