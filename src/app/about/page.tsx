import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "The NYC Mobile Salon brings licensed beauty professionals to your door across all 5 boroughs. Our story, our mission, our team.",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[-5%] top-[-10%] h-[400px] w-[400px] bg-sky-200" />
        <div className="blob right-[-5%] bottom-[-10%] h-[350px] w-[350px] bg-purple-200" />
        <div className="relative mx-auto max-w-3xl">
          <span className="mb-3 inline-block rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-600">
            Our Story
          </span>
          <h1 className="mb-6 text-5xl font-black tracking-tight md:text-6xl">
            Beauty Should <span className="text-gradient">Come to You.</span>
          </h1>
          <div className="space-y-6 text-lg leading-relaxed text-slate-500">
            <p>
              We started The NYC Mobile Salon because we were tired of the same thing everyone in New York is tired of — fighting for salon appointments, commuting across the city, and waiting in lobbies when you could be doing literally anything else.
            </p>
            <p>
              So we flipped it. We built a network of top-tier, licensed beauty professionals who come to <em>you</em>. Your apartment, your office, your event space, your hotel room. Anywhere in all 5 boroughs.
            </p>
            <p>
              Every stylist on our team is vetted, licensed, and insured. They show up on time with everything they need — tools, products, the works. All you need is a chair and a mirror.
            </p>
            <p>
              We&apos;re not just another salon. We&apos;re the future of beauty in New York City — and we&apos;re just getting started.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { label: "Licensed Pros", value: "100%" },
              { label: "Boroughs Covered", value: "5" },
              { label: "Client Satisfaction", value: "4.9/5" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-black text-gradient">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/book" className="btn-gradient inline-block rounded-full px-10 py-3.5 text-sm font-bold text-white">
              Book With Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
