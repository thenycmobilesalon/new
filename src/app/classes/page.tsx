import type { Metadata } from "next";
import Link from "next/link";
import { classCategories } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Classes & Workshops",
  description: "Learn from professional stylists — DIY blowouts, makeup masterclasses, skincare workshops, braiding basics, nail art, and men's grooming. Book a group class in NYC.",
};

export default function ClassesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[-5%] top-[-10%] h-[400px] w-[400px] bg-purple-200" />
        <div className="blob right-[10%] bottom-[-10%] h-[350px] w-[350px] bg-sky-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-600">
            Learn From the Pros
          </span>
          <h1 className="mb-4 text-5xl font-black tracking-tight md:text-6xl">
            Workshops & <span className="text-gradient">Masterclasses</span>
          </h1>
          <p className="mx-auto max-w-lg text-lg text-slate-500">
            Our stylists teach you the techniques. Small groups, hands-on learning, at your spot.
          </p>
        </div>
      </section>

      {/* Classes */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-5xl space-y-16">
          {classCategories.map((cat) => (
            <div key={cat.title}>
              <h2 className="mb-6 text-2xl font-black text-slate-800">{cat.title}</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {cat.items.map((cls) => (
                  <div key={cls.name} className="card-hover rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50 p-8">
                    <h3 className="mb-2 text-lg font-bold text-slate-800">{cls.name}</h3>
                    <p className="mb-4 text-sm text-slate-500">{cls.description}</p>
                    <div className="flex gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {cls.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {cls.groupSize} people
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[40%] top-[30%] h-[400px] w-[400px] bg-purple-200" />
        <div className="relative mx-auto max-w-xl text-center">
          <h2 className="mb-4 text-3xl font-black">
            Want to Book a <span className="text-gradient">Class?</span>
          </h2>
          <p className="mb-6 text-slate-500">Perfect for girls&apos; nights, team events, or just leveling up your skills.</p>
          <Link href="/book" className="btn-gradient inline-block rounded-full px-10 py-3.5 text-sm font-bold text-white">
            Book a Workshop
          </Link>
        </div>
      </section>
    </>
  );
}
