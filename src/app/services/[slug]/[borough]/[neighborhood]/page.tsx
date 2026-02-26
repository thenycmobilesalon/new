import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug, getNeighborhoodName, getBoroughName, getServiceNeighborhoodParams, serviceSchema, breadcrumbSchema } from "@/lib/seo";

// On-demand ISR — generated on first visit, cached 24h
export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string; borough: string; neighborhood: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, borough, neighborhood } = await params;
  const svc = getServiceBySlug(slug);
  const hood = getNeighborhoodName(borough, neighborhood);
  const boro = getBoroughName(borough);
  if (!svc || !hood || !boro) return {};
  return {
    title: `${svc.name} in ${hood}, ${boro} — Mobile Service`,
    description: `Book mobile ${svc.name.toLowerCase()} in ${hood}, ${boro}. ${svc.description}. Licensed professionals come to your door. The NYC Mobile Salon.`,
    alternates: { canonical: `https://thenycmobilesalon.com/services/${slug}/${borough}/${neighborhood}` },
  };
}

export default async function ServiceNeighborhoodPage({ params }: Props) {
  const { slug, borough, neighborhood } = await params;
  const svc = getServiceBySlug(slug);
  const hood = getNeighborhoodName(borough, neighborhood);
  const boro = getBoroughName(borough);
  if (!svc || !hood || !boro) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        serviceSchema(`${svc.name} in ${hood}, ${boro}`, `Mobile ${svc.name.toLowerCase()} in ${hood}, ${boro}. ${svc.description}.`, `${hood}, ${boro}`),
        breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: svc.name, url: `/services/${slug}` },
          { name: boro, url: `/services/${slug}/${borough}` },
          { name: hood, url: `/services/${slug}/${borough}/${neighborhood}` },
        ]),
      ]) }} />

      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[-5%] top-[-10%] h-[400px] w-[400px] bg-pink-200" />
        <div className="blob right-[10%] bottom-[-10%] h-[350px] w-[350px] bg-purple-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <Link href={`/services/${slug}/${borough}`} className="mb-3 inline-block rounded-full bg-pink-100 px-4 py-1.5 text-sm font-semibold text-pink-600 hover:bg-pink-200 transition-colors">{svc.name} in {boro}</Link>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">
            {svc.name} in <span className="text-gradient">{hood}</span>
          </h1>
          <p className="mx-auto max-w-lg text-lg text-slate-500">
            {svc.description} — delivered to your door in {hood}, {boro}. Licensed, insured, and on your schedule.
          </p>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-xl font-black text-slate-800">What to Expect</h2>
          <p className="mb-8 text-slate-500">Your stylist arrives at your {hood} location with everything needed for {svc.name.toLowerCase()}. No salon commute, no waiting — just professional results in the comfort of your space.</p>

          <h2 className="mb-4 text-xl font-black text-slate-800">Also Available in {hood}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link href={`/locations/${borough}/${neighborhood}`} className="card-hover rounded-2xl bg-gradient-to-br from-sky-50 to-purple-50 p-5 text-center">
              <p className="text-sm font-bold text-slate-800">All Services</p>
              <p className="text-xs text-slate-400">in {hood}</p>
            </Link>
            <Link href={`/events/${borough}/${neighborhood}`} className="card-hover rounded-2xl bg-gradient-to-br from-amber-50 to-pink-50 p-5 text-center">
              <p className="text-sm font-bold text-slate-800">Events</p>
              <p className="text-xs text-slate-400">in {hood}</p>
            </Link>
            <Link href={`/classes/${borough}/${neighborhood}`} className="card-hover rounded-2xl bg-gradient-to-br from-purple-50 to-sky-50 p-5 text-center">
              <p className="text-sm font-bold text-slate-800">Classes</p>
              <p className="text-xs text-slate-400">in {hood}</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-16">
        <div className="blob left-[30%] top-[30%] h-[400px] w-[400px] bg-pink-200" />
        <div className="relative text-center">
          <h2 className="mb-4 text-3xl font-black">Book {svc.name} in <span className="text-gradient">{hood}</span></h2>
          <p className="mb-6 text-slate-500">Your spot. Our pro. Let&apos;s go.</p>
          <Link href="/book" className="btn-gradient inline-block rounded-full px-10 py-3.5 text-sm font-bold text-white">Book Your Appointment</Link>
        </div>
      </section>
    </>
  );
}
