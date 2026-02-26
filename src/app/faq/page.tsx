import type { Metadata } from "next";
import Link from "next/link";
import { faqSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about The NYC Mobile Salon — booking, pricing, cancellations, what to expect, and more.",
};

const faqs = [
  {
    q: "How does it work?",
    a: "You fill out our booking form, we match you with a licensed stylist, and they come to your location with everything they need. That's it.",
  },
  {
    q: "Where do you service?",
    a: "All 5 NYC boroughs — Manhattan, Brooklyn, Queens, Bronx, and Staten Island. We go anywhere in the city.",
  },
  {
    q: "How far in advance should I book?",
    a: "We can often do same-day, but 24–48 hours notice is ideal to get your preferred stylist and time slot.",
  },
  {
    q: "Is there a travel fee?",
    a: "Nope. Travel is included for all locations within NYC. No hidden fees, ever.",
  },
  {
    q: "What do I need to provide?",
    a: "Just a chair, an outlet, and access to a sink if you're getting color or a rinse-out service. We bring everything else.",
  },
  {
    q: "Can I request a specific stylist?",
    a: "Absolutely. If you've worked with someone you love, just let us know and we'll book them for you.",
  },
  {
    q: "What's your cancellation policy?",
    a: "Free cancellation or reschedule up to 12 hours before your appointment. Under 12 hours, a fee may apply.",
  },
  {
    q: "Are your stylists licensed?",
    a: "100%. Every stylist on our team is licensed, insured, and vetted. We don't play with that.",
  },
  {
    q: "Do you do events and groups?",
    a: "Yes — bridal parties, corporate events, birthdays, photo shoots, you name it. We bring the whole team.",
  },
  {
    q: "How is pricing determined?",
    a: "Pricing depends on the service, hair type/length, and complexity. We'll give you a clear quote before booking — no surprises.",
  },
  {
    q: "Do you offer classes?",
    a: "Yes! We offer hands-on workshops — blowout technique, makeup basics, skincare routines, braiding, nail art, and more.",
  },
  {
    q: "What forms of payment do you accept?",
    a: "Venmo, Zelle, Cash App, Apple Pay, and cash. We make it easy.",
  },
];

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }}
      />

      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob right-[20%] top-[-10%] h-[400px] w-[400px] bg-sky-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-5xl font-black tracking-tight md:text-6xl">
            Got <span className="text-gradient">Questions?</span>
          </h1>
          <p className="mx-auto max-w-md text-lg text-slate-500">We got answers.</p>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="mb-2 font-bold text-slate-800">{faq.q}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-slate-500">Still have questions?</p>
          <Link href="mailto:hey@thenycmobilesalon.com" className="btn-gradient inline-block rounded-full px-8 py-3 text-sm font-bold text-white">
            Email Us
          </Link>
        </div>
      </section>
    </>
  );
}
