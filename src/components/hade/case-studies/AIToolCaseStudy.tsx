import { FlagshipCaseStudyCard } from "@/components/FlagshipCaseStudyCard";
import { aiToolCaseStudy } from "@/lib/site-data";

export default function AIToolCaseStudy() {
  return <FlagshipCaseStudyCard study={aiToolCaseStudy} href="/case-studies/ai-tool" />;
}
