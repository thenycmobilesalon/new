import Link from "next/link";
import { womensCategories, mensCategories, testimonials, boroughNames } from "@/lib/constants";
import { localBusinessSchema } from "@/lib/seo";
import LeadForm from "@/components/LeadForm";
import StatsCounter from "@/components/StatsCounter";

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

function Stars({ className = "", size = "sm" }: { className?: string; size?: "sm" | "lg" }) {
  const dim = size === "lg" ? "h-6 w-6" : "h-4 w-4";
  return (
    <span className={`flex gap-0.5 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`${dim} text-amber-400`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </span>
  );
}

function Arrow({ className = "text-current" }: { className?: string }) {
  return (
    <svg className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
    </svg>
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
      <section className="bg-white px-4 pb-16 pt-12 md:pb-24 md:pt-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="hero-headline font-display mb-6 text-5xl font-medium leading-[1.05] tracking-tight text-black md:text-6xl lg:text-7xl">
              Beauty that
              <br />
              comes <span className="italic text-sky-500">to you.</span>
            </h1>
            <p className="hero-subtitle mb-8 max-w-md text-lg leading-relaxed text-gray-600">
              Licensed stylists arrive at your door with everything they need.
              Hair, nails, makeup, grooming — wherever you are in NYC.
            </p>
            <div className="hero-badges flex flex-wrap gap-3">
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

          <div className="hero-form">
            <LeadForm id="book-hero" variant="light" />
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <StatsCounter />

      {/* ── Women's Services — Roman K style ── */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          {/* Left: Editorial copy */}
          <div data-reveal="left">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-sky-500">For Her</p>
            <h2 className="font-display mb-6 text-4xl font-medium leading-[1.1] tracking-tight text-black md:text-5xl">
              Women&apos;s Beauty
              <br />
              Services
            </h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              From blowouts before brunch to bridal glam sessions, our licensed
              pros bring the full salon experience to your door — anywhere in NYC.
            </p>
            <p className="mb-8 leading-relaxed text-gray-600">
              Ladies run the show here. Five categories, 30+ services, and every
              single one delivered with care, skill, and a little extra magic.
            </p>
            <Link href="/services" className="btn-blue inline-block rounded-full px-8 py-3.5 text-sm font-semibold">
              Explore All Services
            </Link>
          </div>

          {/* Right: Service list with arrows — staggered */}
          <div data-reveal data-stagger>
            {womensCategories.map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/services#${cat.slug}`}
                className={`group flex items-center justify-between px-6 py-5 transition-colors ${
                  i === 0
                    ? "rounded-lg bg-black text-white"
                    : "border-b border-gray-200 text-black hover:bg-gray-50"
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className={`font-display text-xl md:text-2xl ${i === 0 ? "text-white" : "text-black"}`}>
                    {cat.title}
                  </span>
                  <span className={`text-sm ${i === 0 ? "text-gray-300" : "text-gray-400"}`}>
                    {cat.services.length} services
                  </span>
                </div>
                <Arrow className={i === 0 ? "text-white" : "text-gray-400 group-hover:text-black"} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Men's Services — Dark, reversed layout ── */}
      <section className="bg-slate-900 px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          {/* Left: Service list — staggered */}
          <div data-reveal data-stagger>
            {mensCategories.map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/services#${cat.slug}`}
                className={`group flex items-center justify-between px-6 py-5 transition-colors ${
                  i === 0
                    ? "rounded-lg bg-white text-black"
                    : "border-b border-white/10 text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className={`font-display text-xl md:text-2xl ${i === 0 ? "text-black" : "text-white"}`}>
                    {cat.title}
                  </span>
                  <span className={`text-sm ${i === 0 ? "text-gray-500" : "text-gray-500"}`}>
                    {cat.services.length} services
                  </span>
                </div>
                <Arrow className={i === 0 ? "text-black" : "text-gray-500 group-hover:text-white"} />
              </Link>
            ))}
          </div>

          {/* Right: Copy */}
          <div data-reveal="right">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-sky-400">For Him</p>
            <h2 className="font-display mb-6 text-4xl font-medium leading-[1.1] tracking-tight text-white md:text-5xl">
              Men&apos;s
              <br />
              Grooming
            </h2>
            <p className="mb-4 leading-relaxed text-gray-400">
              We didn&apos;t forget about you, guys. Fresh fades, beard sculpting,
              and full grooming packages — delivered to your couch, your office,
              wherever you need it.
            </p>
            <p className="mb-8 leading-relaxed text-gray-400">
              Same licensed pros. Same door-to-door convenience.
              Just without the cucumber eye masks. Unless you want those too.
            </p>
            <Link href="/services" className="inline-block rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black">
              View Men&apos;s Services
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Testimonial ── */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
          {/* Left: Image placeholder */}
          <div data-reveal="left" className="overflow-hidden rounded-2xl bg-gray-100">
            <div className="flex aspect-[4/5] items-center justify-center text-gray-300">
              <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
          </div>

          {/* Right: Quote */}
          <div data-reveal="right">
            <Stars className="mb-6" size="lg" />
            <blockquote className="font-display mb-8 text-3xl font-medium leading-snug text-black md:text-4xl">
              &ldquo;{testimonials[2].text}&rdquo;
            </blockquote>
            <div>
              <p className="text-lg font-semibold text-black">{testimonials[2].name}</p>
              <p className="text-gray-500">{testimonials[2].borough}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-gray-50 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center" data-reveal>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-sky-500">How It Works</p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-black md:text-4xl">
              Three simple steps
            </h2>
          </div>

          <div className="grid gap-10 md:grid-cols-3" data-reveal data-stagger>
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

      {/* ── More Reviews ── */}
      <section className="bg-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center" data-reveal>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-sky-500">Testimonials</p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-black md:text-4xl">
              What our clients say
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3" data-reveal data-stagger>
            {testimonials.map((t) => (
              <div key={t.name} className="card-hover rounded-xl border border-gray-200 p-6 md:p-8">
                <Stars className="mb-4" />
                <p className="mb-6 leading-relaxed text-gray-600">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-900">
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

          <div className="mt-10 text-center" data-reveal>
            <Link href="/reviews" className="inline-flex items-center gap-1.5 text-sm font-semibold text-black hover:text-gray-600">
              Read all reviews
              <Arrow className="!h-4 !w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-gray-50 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center" data-reveal>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-sky-500">FAQ</p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-black md:text-4xl">
              Common questions
            </h2>
          </div>

          <div className="divide-y divide-gray-200" data-reveal data-stagger>
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

      {/* ── Locations ── */}
      <section className="bg-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center" data-reveal>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-sky-500">Coverage</p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-black md:text-4xl">
              All five boroughs
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5" data-reveal data-stagger>
            {Object.entries(boroughNames).map(([slug, name]) => (
              <Link
                key={slug}
                href={`/locations/${slug}`}
                className="card-hover rounded-xl border border-gray-200 p-6 text-center"
              >
                <p className="text-lg font-semibold text-black">{name}</p>
                <p className="mt-1 text-xs text-gray-500">View areas &rarr;</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-black px-4 py-20 text-white md:py-28">
        <div className="mx-auto max-w-xl text-center" data-reveal>
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
