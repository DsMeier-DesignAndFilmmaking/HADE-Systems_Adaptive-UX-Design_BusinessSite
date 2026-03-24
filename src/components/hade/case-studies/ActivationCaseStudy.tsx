import { FlagshipCaseStudyCard } from "@/components/FlagshipCaseStudyCard";
import { flagshipCaseStudy } from "@/lib/site-data";

export default function ActivationCaseStudy() {
  return (
    <div className="relative">
      <div
        className="absolute -inset-[1px] rounded-[22px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(49,107,255,0.22) 0%, transparent 55%)",
          opacity: 0.7,
        }}
        aria-hidden
      />
      <FlagshipCaseStudyCard study={flagshipCaseStudy} href="/case-studies/activation" />
    </div>
  );
}
