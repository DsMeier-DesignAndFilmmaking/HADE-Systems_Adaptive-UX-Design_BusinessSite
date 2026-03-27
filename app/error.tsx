"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-16">
      <div className="rounded-2xl border border-line bg-white/85 p-8 text-center shadow-soft backdrop-blur">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50">HADE Systems</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Something went wrong</h1>
        <p className="mt-3 text-sm text-ink/65">An unexpected error occurred.</p>
        <button onClick={reset} className="mt-6 rounded-full border border-ink/10 px-6 py-2 text-xs font-bold uppercase tracking-widest text-ink/60 hover:text-ink transition">
          Try again
        </button>
      </div>
    </main>
  );
}
