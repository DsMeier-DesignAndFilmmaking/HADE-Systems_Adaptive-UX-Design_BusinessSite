import { BrandLibrary } from "@/components/BrandLibrary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Library · HADE Systems",
  description: "Living style guide — typography, color tokens, adaptive components, and card patterns for the HADE Systems design system.",
};

export default function BrandPage() {
  return <BrandLibrary />;
}
