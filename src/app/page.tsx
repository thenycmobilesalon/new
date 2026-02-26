import Link from "next/link";
import { womensCategories, mensCategories, eventCategories, classCategories, stats, testimonials } from "@/lib/constants";
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

const serviceHighlights = [
  { icon: "scissors", label: "Hair", count: 14 },
  { icon: "hand", label: "Nails", count: 7 },
  { icon: "sparkle", label: "Makeup", count: 3 },
  { icon: "droplet", label: "Skin", count: 4 },
  { icon: "zap", label: "Waxing", count: 6 },
  { icon: "user", label: "Men's", count: 13 },
];

function ServiceIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    scissors: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    ),
    hand: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075-5.925v3m0-3a1.575 1.575 0 013.15 0v3m-3.15 0l.075 5.925M14.25 7.575v3m0-3a1.575 1.575 0 013.15 0v3m-3.15 0l.075 4.425m3.075-4.425v4.425m0-4.425a1.575 1.575 0 013.15 0v4.425M6.9 7.575a1.575 1.575 0 10-3.15 0v6.6a8.25 8.25 0 008.25 8.25h2.25a8.25 8.25 0 008.25-8.25v-1.5" />
      </svg>
    ),
    sparkle: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    droplet: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c0 0-6.75 8.25-6.75 12a6.75 6.75 0 0013.5 0c0-3.75-6.75-12-6.75-12z" />
      </svg>
    ),
    zap: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    user: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  };
  return icons[type] || null;
}

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
      <section className="px-4 pb-20 pt-12 md:pb-28 md:pt-20">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
              Mobile Beauty — All 5 Boroughs
            </p>
            <h1 className="font-display mb-6 text-5xl font-medium leading-[1.1] tracking-tight text-charcoal md:text-6xl lg:text-7xl">
              Beauty that comes
              <br />
              <span className="italic text-accent">to you.</span>
            </h1>
            <p className="mb-8 max-w-md text-lg leading-relaxed text-gray-500">
              Licensed stylists arrive at your door with everything they need.
              Hair, nails, makeup, grooming — wherever you are in NYC.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/book" className="btn-primary inline-block rounded-full px-8 py-3.5 text-sm font-semibold">
                Book Appointment
              </Link>
              <Link href="/services" className="btn-outline inline-block rounded-full px-8 py-3.5 text-sm font-semibold">
                View Services
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-sage-light/40 p-3">
            <div className="overflow-hidden rounded-xl bg-warm-gray">
              <div className="flex aspect-[4/3] items-center justify-center text-gray-300">
                <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="section-divider px-4 py-16">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-4xl font-semibold text-charcoal md:text-5xl">
                {stat.value}
                {stat.label === "Average Rating" && (
                  <span className="ml-1 text-amber-400">&#9733;</span>
                )}
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About / Intro ── */}
      <section className="section-divider px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-warm-gray">
            <div className="flex aspect-square items-center justify-center text-gray-300">
              <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">About Us</p>
            <h2 className="font-display mb-6 text-3xl font-medium tracking-tight text-charcoal md:text-4xl">
              The salon experience,
              <br />
              <span className="italic text-accent">reimagined.</span>
            </h2>
            <p className="mb-6 leading-relaxed text-gray-500">
              No more cramped waiting rooms or rushed appointments.
              The NYC Mobile Salon brings licensed, vetted beauty professionals
              directly to your home, office, or event — anywhere across all five boroughs.
            </p>
            <p className="leading-relaxed text-gray-500">
              Whether it&apos;s a blowout before brunch, a bridal party glam session,
              or a fresh fade at your apartment — we make it effortless.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="font-display text-3xl font-semibold text-charcoal">43+</p>
                <p className="mt-1 text-sm text-gray-400">Services offered</p>
              </div>
              <div>
                <p className="font-display text-3xl font-semibold text-charcoal">204</p>
                <p className="mt-1 text-sm text-gray-400">Neighborhoods covered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="bg-warm-gray px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">What We Offer</p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-charcoal md:text-4xl">
              Services that <span className="italic text-accent">come to you</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {serviceHighlights.map((svc) => (
              <div key={svc.label} className="card-hover flex items-center gap-5 rounded-xl bg-white p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-light text-sage">
                  <ServiceIcon type={svc.icon} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-charcoal">{svc.label}</h3>
                  <p className="text-sm text-gray-400">{svc.count} services</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/services" className="btn-primary rounded-full px-8 py-3.5 text-sm font-semibold">
              View All Services
            </Link>
            <Link href="/events" className="btn-outline rounded-full px-8 py-3.5 text-sm font-semibold">
              Events & Groups
            </Link>
          </div>
        </div>
      </section>

      {/* ── Women's & Men's ── */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Women's */}
            <div className="rounded-2xl border border-gray-100 p-8 md:p-10">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sage">For Her</p>
              <h3 className="font-display mb-6 text-2xl font-medium text-charcoal">Women&apos;s Services</h3>
              <div className="space-y-3">
                {womensCategories.map((cat) => (
                  <div key={cat.slug} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
                    <span className="font-medium text-charcoal">{cat.title}</span>
                    <span className="text-sm text-gray-400">{cat.services.length} services</span>
                  </div>
                ))}
              </div>
              <Link href="/services" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-sage hover:text-sage-dark">
                Explore women&apos;s services
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>

            {/* Men's */}
            <div className="rounded-2xl border border-gray-100 p-8 md:p-10">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sage">For Him</p>
              <h3 className="font-display mb-6 text-2xl font-medium text-charcoal">Men&apos;s Services</h3>
              <div className="space-y-3">
                {mensCategories.map((cat) => (
                  <div key={cat.slug} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
                    <span className="font-medium text-charcoal">{cat.title}</span>
                    <span className="text-sm text-gray-400">{cat.services.length} services</span>
                  </div>
                ))}
              </div>
              <Link href="/services" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-sage hover:text-sage-dark">
                Explore men&apos;s services
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-charcoal px-4 py-20 text-white md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-sage-light">How It Works</p>
            <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
              Three simple steps
            </h2>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {howItWorks.map((step) => (
              <div key={step.step} className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 text-lg font-semibold text-sage-light">
                  {step.step}
                </div>
                <h3 className="mb-3 text-lg font-semibold">{step.title}</h3>
                <p className="leading-relaxed text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link href="/how-it-works" className="btn-sage inline-block rounded-full px-8 py-3.5 text-sm font-semibold">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Testimonial ── */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-warm-gray">
            <div className="flex aspect-[4/5] items-center justify-center text-gray-300">
              <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
          </div>

          <div>
            <Stars className="mb-6" />
            <blockquote className="font-display mb-6 text-2xl font-medium leading-relaxed text-charcoal md:text-3xl">
              &ldquo;{testimonials[2].text}&rdquo;
            </blockquote>
            <div>
              <p className="font-semibold text-charcoal">{testimonials[2].name}</p>
              <p className="text-sm text-gray-400">{testimonials[2].borough}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Events Preview ── */}
      <section className="bg-warm-gray px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">Events & Groups</p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-charcoal md:text-4xl">
              We come to <span className="italic text-accent">your event</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
            {eventCategories.map((cat) => (
              <Link
                key={cat.title}
                href="/events"
                className="card-hover rounded-xl bg-white p-6 text-center"
              >
                <h3 className="mb-1 text-sm font-semibold text-charcoal">{cat.title}</h3>
                <p className="text-xs text-gray-400">{cat.items.length} options</p>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/events" className="btn-primary inline-block rounded-full px-8 py-3.5 text-sm font-semibold">
              Explore Events
            </Link>
          </div>
        </div>
      </section>

      {/* ── More Testimonials ── */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">Testimonials</p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-charcoal md:text-4xl">
              What our clients <span className="italic text-accent">say</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border border-gray-100 p-6 md:p-8">
                <Stars className="mb-4" />
                <p className="mb-6 leading-relaxed text-gray-600">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-light text-sm font-semibold text-sage">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.borough}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/reviews" className="inline-flex items-center gap-1.5 text-sm font-semibold text-sage hover:text-sage-dark">
              Read all reviews
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Classes Preview ── */}
      <section className="section-divider px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">Workshops</p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-charcoal md:text-4xl">
              Learn from <span className="italic text-accent">the pros</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {classCategories.flatMap((cat) =>
              cat.items.map((cls) => (
                <Link key={cls.slug} href={`/classes/${cls.slug}`} className="card-hover rounded-xl border border-gray-100 p-6">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">{cat.title}</p>
                  <h3 className="mb-2 font-semibold text-charcoal">{cls.name}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-gray-400">{cls.description}</p>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>{cls.duration}</span>
                    <span>{cls.groupSize} people</span>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/classes" className="btn-outline inline-block rounded-full px-8 py-3.5 text-sm font-semibold">
              View All Workshops
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-charcoal px-4 py-20 text-white md:py-28">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display mb-4 text-3xl font-medium tracking-tight md:text-4xl">
            Ready to get <span className="italic text-sage-light">pampered?</span>
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
