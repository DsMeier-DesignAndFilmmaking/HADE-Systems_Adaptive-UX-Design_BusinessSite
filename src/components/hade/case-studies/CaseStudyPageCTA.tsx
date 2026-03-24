import Link from "next/link";

export default function CaseStudyPageCTA() {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-surface/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <Link
          href="/adaptive-ux-sprint"
          className="block w-full rounded-lg bg-accent py-2 text-center text-sm font-medium text-white"
        >
          Start Adaptive UX Sprint
        </Link>
      </div>

      <div className="mt-16 hidden md:block">
        <Link
          href="/adaptive-ux-sprint"
          className="inline-flex rounded-lg bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent/90"
        >
          Start Adaptive UX Sprint
        </Link>
      </div>
    </>
  );
}
