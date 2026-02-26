import type { Metadata } from "next";
import Link from "next/link";
import { womensCategories, mensCategories } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services",
  description: "Full menu of mobile beauty services for women and men — hair, nails, makeup, skincare, waxing, grooming, and more. We come to you anywhere in NYC.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[-10%] top-[-10%] h-[400px] w-[400px] bg-pink-200" />
        <div className="blob right-[-5%] bottom-[-10%] h-[350px] w-[350px] bg-sky-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-3 inline-block rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-600">
            Full Service Menu
          </span>
          <h1 className="mb-4 text-5xl font-black tracking-tight md:text-6xl">
            Every Service. <span className="text-gradient">Your Space.</span>
          </h1>
          <p className="mx-auto max-w-lg text-lg text-slate-500">
            From blowouts to brazilians, fades to facials — we bring the full salon experience to your door.
          </p>
        </div>
      </section>

      {/* Women's Services */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-2">
              <span className="text-lg font-bold text-white">Women&apos;s Services ✨</span>
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {womensCategories.map((cat) => (
              <div key={cat.slug}>
                <h3 className="mb-4 text-lg font-black text-slate-800">{cat.title}</h3>
                <ul className="space-y-3">
                  {cat.services.map((s) => (
                    <li key={s.name} className="group flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-pink-50">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-purple-400">
                        <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Men's Services */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2">
              <span className="text-lg font-bold text-white">Men&apos;s Services 🔥</span>
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {mensCategories.map((cat) => (
              <div key={cat.slug}>
                <h3 className="mb-4 text-lg font-black text-slate-800">{cat.title}</h3>
                <ul className="space-y-3">
                  {cat.services.map((s) => (
                    <li key={s.name} className="group flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-sky-50">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-sky-400 to-indigo-400">
                        <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center">
        <h2 className="mb-4 text-3xl font-black">
          Ready to <span className="text-gradient">Book?</span>
        </h2>
        <p className="mb-6 text-slate-500">Pick your service. Pick your spot. We handle the rest.</p>
        <Link href="/book" className="btn-gradient inline-block rounded-full px-10 py-3.5 text-sm font-bold text-white">
          Book Your Appointment
        </Link>
      </section>
    </>
  );
}
