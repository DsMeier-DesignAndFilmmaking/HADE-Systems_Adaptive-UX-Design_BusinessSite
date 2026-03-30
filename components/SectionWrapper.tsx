type SectionWrapperProps = {
  children: React.ReactNode;
  id?: string;
  eyebrow?: string;
  title: React.ReactNode; // Change from string to React.ReactNode
  intro?: React.ReactNode; // Change from string to React.ReactNode
  className?: string;
};

export function SectionWrapper({ children, id, eyebrow, title, intro, className = "" }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`mt-[100px] ${className}`.trim()}
    >
      {(eyebrow || title || intro) && (
        <div className="mb-8 max-w-3xl">
          {eyebrow && (
            <div className="flex items-center gap-2">
              <span className="h-px w-4 bg-ink/20" />
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink/45">
                {eyebrow}
              </p>
            </div>
          )}
          {title && (
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.01em] text-ink md:text-4xl">
              {title}
            </h2>
          )}
          {intro && (
            <p className="mt-4 text-base leading-relaxed text-ink/60 md:text-lg">{intro}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
