import Link from "next/link";
import { womensCategories, mensCategories, testimonials, boroughNames } from "@/lib/constants";
import { localBusinessSchema } from "@/lib/seo";
import LeadForm from "@/components/LeadForm";

const howItWorks = [
  {
    step: "01",
    title: "Tell Us What You Need",
    description: "Pick your services, choose your borough, and select a time that works for you.",
  },
  {
    step: "02",
    title: "Get Matched With a Pro",
    description: "We pair you with a licensed stylist who specializes in exactly what you're looking for.",
  },
  {
    step: "03",
    title: "Relax & Enjoy",
    description: "Your pro arrives at your door with everything needed. Sit back and get pampered.",
  },
];

const faqs = [
  {
    q: "What areas do you serve?",
    a: "We serve all five NYC boroughs — Manhattan, Brooklyn, Queens, Bronx, and Staten Island. Our licensed pros travel to you wherever you are.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend booking at least 48 hours in advance for standard appointments. Same-day availability is sometimes possible — just ask!",
  },
  {
    q: "What do I need to provide?",
    a: "Nothing! Our stylists arrive with all the tools, products, and equipment needed. Just have a comfortable chair and good lighting, and we handle the rest.",
  },
  {
    q: "Are your stylists licensed and insured?",
    a: "Absolutely. Every professional on our team is fully licensed by the State of New York and carries liability insurance. Your safety is non-negotiable.",
  },
  {
    q: "Can I book for a group or event?",
    a: "Yes! We love bridal parties, birthdays, corporate events, and more. We can send multiple stylists to handle large groups simultaneously.",
  },
];

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`flex gap-0.5 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </span>
  );
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
      />

      {/* ── Hero ── */}
      <section className="bg-white px-4 pb-20 pt-12 md:pb-28 md:pt-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="font-display mb-6 text-5xl font-medium leading-[1.1] tracking-tight text-black md:text-6xl lg:text-7xl">
              Beauty that comes
              <br />
              <span className="italic text-sky-500">to you.</span>
            </h1>
            <p className="mb-8 max-w-md text-lg leading-relaxed text-gray-600">
              Licensed stylists arrive at your door with everything they need.
              Hair, nails, makeup, grooming — wherever you are in NYC.
            </p>
            <div className="mb-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700">
                <svg className="h-4 w-4 text-sky-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                All 5 Boroughs
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700">
                <svg className="h-4 w-4 text-sky-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Licensed &amp; Insured
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700">
                <svg className="h-4 w-4 text-sky-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                From $49
              </span>
            </div>
          </div>

          <div>
            <LeadForm id="book-hero" variant="light" />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-gray-50 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-sky-500">How It Works</p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-black md:text-4xl">
              Three simple steps
            </h2>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {howItWorks.map((step) => (
              <div key={step.step} className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-black text-lg font-semibold text-black">
                  {step.step}
                </div>
                <h3 className="mb-3 text-lg font-semibold text-black">{step.title}</h3>
                <p className="leading-relaxed text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Teaser ── */}
      <section className="bg-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-sky-500">Transparent Pricing</p>
          <h2 className="font-display mb-4 text-3xl font-medium tracking-tight text-black md:text-4xl">
            Premium services, starting at <span className="text-sky-500">$49</span>
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            No hidden fees. No travel surcharges. Just honest pricing for exceptional service at your door.
          </p>
          <Link href="/pricing" className="btn-primary inline-block rounded-full px-8 py-3.5 text-sm font-semibold">
            View Full Pricing
          </Link>
        </div>
      </section>

      {/* ── Services: Women's (3/4) + Men's (1/4) ── */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-sky-500">Our Services</p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-black md:text-4xl">
              Ladies lead the way
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-gray-600">
              Our queens get top billing around here — but fellas, we&apos;ve absolutely got you covered too.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {/* Women's — 3/4 */}
            <div className="rounded-2xl bg-sky-50 p-8 md:col-span-3 md:p-10">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-sky-500">For Her</p>
              <h3 className="font-display mb-6 text-2xl font-medium text-black">Women&apos;s Services</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {womensCategories.map((cat) => (
                  <div key={cat.slug} className="card-hover rounded-xl bg-white p-5">
                    <h4 className="font-semibold text-black">{cat.title}</h4>
                    <p className="text-sm text-gray-500">{cat.services.length} services</p>
                  </div>
                ))}
              </div>
              <Link href="/services" className="btn-blue mt-8 inline-block rounded-full px-8 py-3 text-sm font-semibold">
                Explore Women&apos;s Services
              </Link>
            </div>

            {/* Men's — 1/4 */}
            <div className="rounded-2xl bg-slate-900 p-8 md:col-span-1 md:p-10">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-sky-400">For Him</p>
              <h3 className="font-display mb-6 text-2xl font-medium text-white">Men&apos;s</h3>
              <div className="space-y-4">
                {mensCategories.map((cat) => (
                  <div key={cat.slug} className="rounded-xl bg-white/10 p-4">
                    <h4 className="font-semibold text-white">{cat.title}</h4>
                    <p className="text-sm text-gray-400">{cat.services.length} services</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm italic text-gray-400">
                Don&apos;t worry guys — we didn&apos;t forget about you.
              </p>
              <Link href="/services" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-400 hover:text-sky-300">
                Explore men&apos;s services
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-sky-500">FAQ</p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-black md:text-4xl">
              Common questions
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between text-left font-semibold text-black">
                  {faq.q}
                  <svg className="ml-4 h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <p className="mt-3 leading-relaxed text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="bg-gray-50 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-sky-500">Testimonials</p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-black md:text-4xl">
              What our clients say
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card-hover rounded-xl border border-gray-200 bg-white p-6 md:p-8">
                <Stars className="mb-4" />
                <p className="mb-6 leading-relaxed text-gray-600">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-600">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.borough}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/reviews" className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-500 hover:text-sky-600">
              Read all reviews
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Locations ── */}
      <section className="bg-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-sky-500">Coverage</p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-black md:text-4xl">
              All five boroughs
            </h2>
            <p className="mx-auto mt-4 max-w-md text-gray-600">
              No matter where you are in NYC, we come to you.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {Object.entries(boroughNames).map(([slug, name]) => (
              <Link
                key={slug}
                href={`/locations/${slug}`}
                className="card-hover rounded-xl border border-gray-200 bg-white p-6 text-center"
              >
                <p className="text-lg font-semibold text-black">{name}</p>
                <p className="mt-1 text-xs text-sky-500">View neighborhoods &rarr;</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Thank You / CTA ── */}
      <section className="bg-black px-4 py-20 text-white md:py-28">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display mb-4 text-3xl font-medium tracking-tight md:text-4xl">
            Ready to get <span className="italic text-sky-400">pampered?</span>
          </h2>
          <p className="mb-10 text-gray-400">
            Book your appointment in under a minute. We&apos;ll handle the rest.
          </p>
          <LeadForm id="book-bottom" variant="dark" />
        </div>
      </section>
    </>
  );
}
