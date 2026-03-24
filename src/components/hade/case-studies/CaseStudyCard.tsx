import Link from "next/link";

type Props = {
  title: string;
  description: string;
  metric: string;
  tag: string;
  href: string;
};

export default function CaseStudyCard({
  title,
  description,
  metric,
  tag,
  href,
}: Props) {
  return (
    <Link
      href={href}
      /* 'flex-1' and 'h-full' ensure the link fills the entire card.
         'group' allows the arrow to animate on hover.
      */
      className="group flex flex-1 flex-col h-full rounded-xl p-5 hover:bg-surface/50 transition"
    >
      {/* Wrapper for top content */}
      <div className="flex-1">
        <p className="text-xs uppercase tracking-widest text-muted mb-2">
          {tag}
        </p>

        <h3 className="text-lg font-semibold mb-2 text-ink">
          {title}
        </h3>

        <p className="text-sm text-muted mb-4 max-w-md">
          {description}
        </p>

        <p className="text-sm font-medium mb-4 text-ink/80">
          {metric}
        </p>
      </div>

      {/* 'mt-auto' pins this to the bottom. 
         '!text-[#316BFF]' forces the HADE primary brand color.
      */}
      <span className="inline-flex items-center text-sm font-bold mt-auto pt-6 !text-[#316BFF]">
        View Case Study 
        <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}