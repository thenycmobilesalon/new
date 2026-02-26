import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { womensCategories, mensCategories } from "@/lib/constants";
import { getAllNeighborhoodParams, getNeighborhoodName, getBoroughName, localBusinessSchema, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return getAllNeighborhoodParams();
}

type Props = { params: Promise<{ borough: string; neighborhood: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { borough, neighborhood } = await params;
  const hood = getNeighborhoodName(borough, neighborhood);
  const boro = getBoroughName(borough);
  if (!hood || !boro) return {};
  return {
    title: `Mobile Salon in ${hood}, ${boro} — Hair, Nails, Makeup & More`,
    description: `Book mobile beauty services in ${hood}, ${boro}. Licensed stylists for hair, nails, makeup, grooming, waxing & more — delivered to your door in ${hood}. Starting at $49.`,
    alternates: { canonical: `https://thenycmobilesalon.com/locations/${borough}/${neighborhood}` },
  };
}

export default async function NeighborhoodLocationPage({ params }: Props) {
  const { borough, neighborhood } = await params;
  const hood = getNeighborhoodName(borough, neighborhood);
  const boro = getBoroughName(borough);
  if (!hood || !boro) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            localBusinessSchema({
              name: `The NYC Mobile Salon — ${hood}`,
              url: `https://thenycmobilesalon.com/locations/${borough}/${neighborhood}`,
              areaServed: `${hood}, ${boro}, New York City`,
              description: `Mobile beauty services in ${hood}, ${boro}. Hair, nails, makeup, grooming, and more — delivered to your door.`,
            }),
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Locations", url: "/locations" },
              { name: boro, url: `/locations/${borough}` },
              { name: hood, url: `/locations/${borough}/${neighborhood}` },
            ]),
          ]),
        }}
      />

      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[-5%] top-[-10%] h-[400px] w-[400px] bg-sky-200" />
        <div className="blob right-[10%] bottom-[-10%] h-[350px] w-[350px] bg-purple-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <Link href={`/locations/${borough}`} className="mb-3 inline-block rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-600 hover:bg-sky-200 transition-colors">
            {boro}
          </Link>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
            Mobile Salon in <span className="text-gradient">{hood}</span>
          </h1>
          <p className="mx-auto max-w-lg text-lg text-slate-500">
            Licensed beauty pros delivered to your door in {hood}, {boro}. Hair, nails, makeup, grooming, events, and more.
          </p>
        </div>
      </section>

      {/* Services available */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-2xl font-black text-slate-800">
            Services Available in {hood}
          </h2>

          <div className="mb-12">
            <h3 className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-1.5 text-sm font-bold text-white">
              Women&apos;s Services ✨
            </h3>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {womensCategories.flatMap((cat) =>
                cat.services.map((s) => (
                  <div key={s.name} className="rounded-xl border border-slate-100 p-3">
                    <p className="text-sm font-bold text-slate-700">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-1.5 text-sm font-bold text-white">
              Men&apos;s Services 🔥
            </h3>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {mensCategories.flatMap((cat) =>
                cat.services.map((s) => (
                  <div key={s.name} className="rounded-xl border border-slate-100 p-3">
                    <p className="text-sm font-bold text-slate-700">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-xl font-black text-slate-800">More in {hood}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link href={`/services/${borough}/${neighborhood}`} className="card-hover rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 p-6 text-center">
              <p className="font-bold text-slate-800">All Services</p>
              <p className="text-xs text-slate-400">in {hood}</p>
            </Link>
            <Link href={`/events/${borough}/${neighborhood}`} className="card-hover rounded-2xl bg-gradient-to-br from-amber-50 to-pink-50 p-6 text-center">
              <p className="font-bold text-slate-800">Events</p>
              <p className="text-xs text-slate-400">in {hood}</p>
            </Link>
            <Link href={`/classes/${borough}/${neighborhood}`} className="card-hover rounded-2xl bg-gradient-to-br from-sky-50 to-purple-50 p-6 text-center">
              <p className="font-bold text-slate-800">Classes</p>
              <p className="text-xs text-slate-400">in {hood}</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden px-4 py-16">
        <div className="blob left-[30%] top-[30%] h-[400px] w-[400px] bg-pink-200" />
        <div className="relative text-center">
          <h2 className="mb-4 text-3xl font-black">
            Book in {hood}, <span className="text-gradient">{boro}</span>
          </h2>
          <p className="mb-6 text-slate-500">Your spot. Our stylists. Let&apos;s go.</p>
          <Link href="/book" className="btn-gradient inline-block rounded-full px-10 py-3.5 text-sm font-bold text-white">
            Book Your Appointment
          </Link>
        </div>
      </section>
    </>
  );
}
