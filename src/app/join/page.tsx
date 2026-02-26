import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join the Team",
  description: "Join The NYC Mobile Salon team. Licensed stylists, barbers, nail techs, and makeup artists — set your own schedule, keep more of what you earn.",
};

const perks = [
  { title: "Set Your Schedule", description: "Work when you want. Full-time, part-time, weekends only — you decide." },
  { title: "Keep More of What You Earn", description: "Competitive pay with no booth rental fees. We handle the clients, you handle the craft." },
  { title: "We Supply the Clients", description: "No hustling for bookings. We match you with clients in your area." },
  { title: "All 5 Boroughs", description: "Work in the neighborhoods you know. We've got clients everywhere." },
  { title: "Insurance & Support", description: "You're covered. We provide liability insurance and ongoing support." },
  { title: "Grow With Us", description: "As we grow, you grow. Top performers get priority bookings and bonuses." },
];

export default function JoinPage() {
  return (
    <>
      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[-5%] top-[-10%] h-[400px] w-[400px] bg-purple-200" />
        <div className="blob right-[10%] bottom-[-10%] h-[350px] w-[350px] bg-pink-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-600">
            Now Hiring
          </span>
          <h1 className="mb-4 text-5xl font-black tracking-tight md:text-6xl">
            Join the <span className="text-gradient">Squad.</span>
          </h1>
          <p className="mx-auto max-w-lg text-lg text-slate-500">
            We&apos;re looking for licensed stylists, barbers, nail techs, makeup artists, and estheticians who want to work on their own terms.
          </p>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-black">
            Why Work <span className="text-gradient-warm">With Us</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {perks.map((perk) => (
              <div key={perk.title} className="card-hover rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50 p-6">
                <h3 className="mb-2 font-bold text-slate-800">{perk.title}</h3>
                <p className="text-sm text-slate-500">{perk.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="mb-4 text-3xl font-black">
            Ready to <span className="text-gradient">Apply?</span>
          </h2>
          <p className="mb-6 text-slate-500">
            Send us your name, what you specialize in, and your availability. We&apos;ll be in touch within 48 hours.
          </p>
          <a href="mailto:hey@thenycmobilesalon.com?subject=I%20Want%20to%20Join%20the%20Team" className="btn-gradient inline-block rounded-full px-10 py-3.5 text-sm font-bold text-white">
            Apply Now
          </a>
        </div>
      </section>
    </>
  );
}
