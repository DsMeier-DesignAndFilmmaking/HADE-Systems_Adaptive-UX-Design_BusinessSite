import { FlagshipCaseStudyCard } from "@/components/FlagshipCaseStudyCard";
import { travelCaseStudy } from "@/lib/site-data";

export default function TravelCaseStudy() {
  return <FlagshipCaseStudyCard study={travelCaseStudy} href="/case-studies/travel" />;
}
