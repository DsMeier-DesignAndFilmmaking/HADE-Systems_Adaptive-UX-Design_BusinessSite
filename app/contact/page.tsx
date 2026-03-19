import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Contact | HADE Systems",
  description: "Request a free product breakdown and receive specific adaptive UX opportunities for your product."
};

type ContactPageProps = {
  searchParams: Promise<{
    submitted?: string;
  }>;
};

async function requestBreakdown(formData: FormData) {
  "use server";

  const lead = {
    name: String(formData.get("name") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    productLink: String(formData.get("productLink") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
    receivedAt: new Date().toISOString()
  };

  console.log("HADE contact lead", lead);
  redirect("/contact?submitted=1");
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const isSubmitted = params.submitted === "1";

  return (
    <section className="pt-6 md:pt-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Contact</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-ink md:text-5xl">
        I&apos;ll send you 2-3 specific opportunities to improve your product.
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/75">
        Share your product link, current goals, and where you suspect users are dropping off. You&apos;ll receive a focused breakdown with practical next steps.
      </p>

      {isSubmitted && (
        <div className="mt-6 rounded-xl border border-accent/30 bg-accentSoft p-4 text-sm font-medium text-ink/85">
          Request received. You will get your focused breakdown within 1 business day.
        </div>
      )}

      <div className="mt-[72px] grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form className="panel space-y-5 p-7 md:p-8" action={requestBreakdown}>
          <div>
            <label htmlFor="name" className="text-sm font-medium text-ink/80">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="company" className="text-sm font-medium text-ink/80">
              Company
            </label>
            <input
              id="company"
              name="company"
              type="text"
              required
              className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="productLink" className="text-sm font-medium text-ink/80">
              Link to Product
            </label>
            <input
              id="productLink"
              name="productLink"
              type="url"
              required
              placeholder="https://yourproduct.com"
              className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="message" className="text-sm font-medium text-ink/80">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              placeholder="What are you trying to improve right now?"
              className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
            />
          </div>

          <button type="submit" className="cta-button w-full sm:w-auto">
            Request My Free Breakdown
          </button>
          <p className="text-xs text-ink/60">Response target: within 1 business day.</p>
        </form>

        <aside className="panel p-7 md:p-8">
          <h2 className="text-2xl font-semibold text-ink">What happens next</h2>
          <div className="mt-5 space-y-4">
            {[
              "You submit your product context and goals.",
              "I review your journey for friction and missed adaptive opportunities.",
              "You receive 2-3 focused recommendations with suggested service path."
            ].map((line, index) => (
              <div key={line} className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-accentSoft text-xs font-semibold text-accent">
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed text-ink/75">{line}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-line bg-white/80 p-4 text-sm text-ink/70">
            Need immediate detail first? Browse the full <Link href="/services" className="font-semibold text-accent hover:text-ink">services scope</Link>.
          </div>
        </aside>
      </div>
    </section>
  );
}
