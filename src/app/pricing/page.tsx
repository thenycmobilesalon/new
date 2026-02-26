import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Transparent pricing for mobile beauty services in NYC. Starting at $49. No hidden fees.",
};

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[20%] top-[-10%] h-[400px] w-[400px] bg-sky-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-3 inline-block rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-600">
            Transparent Pricing
          </span>
          <h1 className="mb-4 text-5xl font-black tracking-tight md:text-6xl">
            No Surprises. <span className="text-gradient">Just Great Hair.</span>
          </h1>
          <p className="mx-auto max-w-lg text-lg text-slate-500">
            Prices vary by service, stylist, and location. Here&apos;s a general guide — reach out for an exact quote.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {/* Quick Services */}
          <div className="card-hover rounded-2xl border border-slate-200 p-8">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">Quick Services</p>
            <h3 className="mb-2 text-3xl font-black text-gradient">$49–$99</h3>
            <p className="mb-6 text-sm text-slate-500">In and out, looking fresh.</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Blowouts & Styling</li>
              <li>Men&apos;s Haircuts & Fades</li>
              <li>Beard Trims</li>
              <li>Classic Manicure</li>
              <li>Brow Wax & Shape</li>
              <li>Express Facial</li>
            </ul>
          </div>

          {/* Full Services */}
          <div className="card-hover rounded-2xl bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 p-[2px]">
            <div className="rounded-2xl bg-white p-8">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-purple-500">Most Popular</p>
              <h3 className="mb-2 text-3xl font-black text-gradient">$100–$250</h3>
              <p className="mb-6 text-sm text-slate-500">The full experience.</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Women&apos;s Haircuts & Color</li>
                <li>Highlights / Balayage</li>
                <li>Gel Mani + Pedi Combo</li>
                <li>Full Glam Makeup</li>
                <li>Deep Cleansing Facial</li>
                <li>Silk Press</li>
                <li>Hot Towel Shave</li>
              </ul>
            </div>
          </div>

          {/* Premium */}
          <div className="card-hover rounded-2xl border border-slate-200 p-8">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">Premium</p>
            <h3 className="mb-2 text-3xl font-black text-gradient">$250+</h3>
            <p className="mb-6 text-sm text-slate-500">Go all out.</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Extensions (Install)</li>
              <li>Braids & Protective Styles</li>
              <li>Bridal Hair & Makeup</li>
              <li>Group / Event Packages</li>
              <li>Workshops & Classes</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-sky-50 p-8 text-center">
          <h3 className="mb-2 text-lg font-black text-slate-800">Every quote is custom</h3>
          <p className="mb-6 text-sm text-slate-500">
            Final pricing depends on the service, your hair type/length, location, and stylist. No hidden fees — ever. Travel is included within NYC.
          </p>
          <Link href="/book" className="btn-gradient inline-block rounded-full px-8 py-3 text-sm font-bold text-white">
            Get Your Custom Quote
          </Link>
        </div>
      </section>
    </>
  );
}
