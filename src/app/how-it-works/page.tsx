import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Book a mobile beauty appointment in 3 easy steps. Tell us what you need, get matched with a stylist, and enjoy salon-quality service at your door.",
};

const steps = [
  {
    num: "01",
    emoji: "📝",
    title: "Tell Us What You Need",
    description: "Fill out our quick form — pick your service, your borough, and your preferred date. Takes 30 seconds.",
  },
  {
    num: "02",
    emoji: "💬",
    title: "We Match You With a Pro",
    description: "We pair you with a licensed stylist who specializes in exactly what you need. We'll confirm all the details with you.",
  },
  {
    num: "03",
    emoji: "💅",
    title: "They Show Up. You Glow Up.",
    description: "Your stylist arrives at your door with everything needed — tools, products, the works. You just sit back.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[50%] top-[50%] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 bg-purple-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-600">
            Dead Simple
          </span>
          <h1 className="mb-4 text-5xl font-black tracking-tight md:text-6xl">
            Three Steps to <span className="text-gradient-warm">Looking Amazing</span>
          </h1>
          <p className="mx-auto max-w-lg text-lg text-slate-500">
            No apps to download. No accounts to create. Just tell us what you need.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-3xl space-y-12">
          {steps.map((step) => (
            <div key={step.num} className="flex gap-6 rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50 p-8 md:p-12">
              <div className="flex flex-col items-center">
                <span className="text-4xl">{step.emoji}</span>
                <span className="mt-2 text-2xl font-black text-gradient">{step.num}</span>
              </div>
              <div>
                <h2 className="mb-2 text-xl font-black text-slate-800 md:text-2xl">{step.title}</h2>
                <p className="text-slate-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ quick hits */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-black">
            Quick <span className="text-gradient">Q&amp;A</span>
          </h2>
          <div className="space-y-4">
            {[
              { q: "How far in advance should I book?", a: "We can often accommodate same-day requests, but 24–48 hours notice is ideal." },
              { q: "What if I need to reschedule?", a: "No worries — reschedule for free up to 12 hours before your appointment." },
              { q: "Do I need to provide anything?", a: "Nope. Our stylists bring everything. Just a chair and an outlet is all we need." },
              { q: "Is there a travel fee?", a: "Travel is included for all 5 boroughs. No hidden charges." },
            ].map((item) => (
              <div key={item.q} className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-2 font-bold text-slate-800">{item.q}</h3>
                <p className="text-sm text-slate-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center">
        <h2 className="mb-4 text-3xl font-black">
          Convinced? <span className="text-gradient">Let&apos;s Go.</span>
        </h2>
        <Link href="/book" className="btn-gradient inline-block rounded-full px-10 py-3.5 text-sm font-bold text-white">
          Book Your Appointment
        </Link>
      </section>
    </>
  );
}
