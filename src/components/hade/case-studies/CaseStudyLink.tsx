"use client";

import { useRouter } from "next/navigation";

export default function CaseStudyLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(href)}
      className="cursor-pointer hover:opacity-95 transition"
    >
      {children}
    </div>
  );
}
