export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-16">
      <div className="rounded-2xl border border-line bg-white/85 p-8 text-center shadow-soft backdrop-blur">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50">HADE Systems</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Page Not Found</h1>
        <p className="mt-3 text-sm text-ink/65">Error 404 — this node does not exist.</p>
      </div>
    </main>
  );
}
