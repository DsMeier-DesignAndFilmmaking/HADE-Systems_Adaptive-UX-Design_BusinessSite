import { FlagshipCaseStudyCard } from "@/components/FlagshipCaseStudyCard";
import { retentionCaseStudy } from "@/lib/site-data";

export default function RetentionCaseStudy() {
  return <FlagshipCaseStudyCard study={retentionCaseStudy} href="/case-studies/saas" />;
}
