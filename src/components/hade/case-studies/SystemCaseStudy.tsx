import { FlagshipCaseStudyCard } from "@/components/FlagshipCaseStudyCard";
import { systemLabCaseStudy } from "@/lib/site-data";

export default function SystemCaseStudy() {
  return <FlagshipCaseStudyCard study={systemLabCaseStudy} href="/case-studies/system" />;
}
