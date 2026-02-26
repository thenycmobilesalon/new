import type { Metadata } from "next";
import Link from "next/link";
import { eventCategories } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Events",
  description: "Mobile beauty services for events — bridal parties, corporate events, birthdays, content shoots, and more. The NYC Mobile Salon comes to your event.",
};

export default function EventsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[20%] top-[-10%] h-[400px] w-[400px] bg-amber-200" />
        <div className="blob right-[-5%] bottom-[-10%] h-[350px] w-[350px] bg-pink-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-3 inline-block rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-600">
            Groups & Events
          </span>
          <h1 className="mb-4 text-5xl font-black tracking-tight md:text-6xl">
            We Bring the <span className="text-gradient-warm">Glam to You.</span>
          </h1>
          <p className="mx-auto max-w-lg text-lg text-slate-500">
            Bridal parties, corporate events, birthdays, photo shoots — our team pulls up with everything you need.
          </p>
        </div>
      </section>

      {/* Event Categories */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl space-y-16">
          {eventCategories.map((cat, i) => (
            <div key={cat.title} className={`rounded-3xl p-8 md:p-12 ${
              i % 2 === 0 ? "bg-gradient-to-br from-amber-50 to-pink-50" : "bg-gradient-to-br from-sky-50 to-purple-50"
            }`}>
              <h2 className="mb-2 text-2xl font-black text-slate-800 md:text-3xl">{cat.title}</h2>
              <p className="mb-8 text-slate-500">{cat.description}</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cat.items.map((item) => (
                  <div key={item.name} className="card-hover rounded-2xl bg-white p-5 shadow-sm">
                    <h3 className="mb-1 text-sm font-bold text-slate-800">{item.name}</h3>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[30%] top-[30%] h-[400px] w-[400px] bg-amber-200" />
        <div className="relative mx-auto max-w-xl text-center">
          <h2 className="mb-4 text-3xl font-black">
            Have an Event? <span className="text-gradient-warm">Let&apos;s Talk.</span>
          </h2>
          <p className="mb-6 text-slate-500">Tell us about your event and we&apos;ll put together a custom package.</p>
          <Link href="/book" className="btn-gradient inline-block rounded-full px-10 py-3.5 text-sm font-bold text-white">
            Get a Quote
          </Link>
        </div>
      </section>
    </>
  );
}
