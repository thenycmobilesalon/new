import type { Metadata } from "next";
import Link from "next/link";
import { testimonials } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Reviews",
  description: "See what our clients are saying about The NYC Mobile Salon. 4.9 average rating across 5,000+ appointments.",
};

function Stars() {
  return (
    <span className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  return (
    <>
      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[30%] top-[-10%] h-[400px] w-[400px] bg-amber-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-3 inline-block rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-600">
            4.9 Average Rating
          </span>
          <h1 className="mb-4 text-5xl font-black tracking-tight md:text-6xl">
            Real Clients. <span className="text-gradient-warm">Real Results.</span>
          </h1>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-4xl space-y-6">
          {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="card-hover rounded-2xl bg-white p-8 shadow-lg shadow-slate-200/50">
              <Stars />
              <p className="my-4 text-lg leading-relaxed text-slate-600">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-sky-400 to-purple-400 text-sm font-bold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.borough}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/book" className="btn-gradient inline-block rounded-full px-10 py-3.5 text-sm font-bold text-white">
            Join 5,000+ Happy Clients
          </Link>
        </div>
      </section>
    </>
  );
}
