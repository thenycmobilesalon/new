import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventBySlug, getNeighborhoodName, getBoroughName, getEventNeighborhoodParams, serviceSchema, breadcrumbSchema } from "@/lib/seo";

export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string; borough: string; neighborhood: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, borough, neighborhood } = await params;
  const evt = getEventBySlug(slug);
  const hood = getNeighborhoodName(borough, neighborhood);
  const boro = getBoroughName(borough);
  if (!evt || !hood || !boro) return {};
  return {
    title: `${evt.name} in ${hood}, ${boro} — Mobile Event Beauty`,
    description: `Book ${evt.name.toLowerCase()} in ${hood}, ${boro}. ${evt.description}. Professional mobile beauty for your event. The NYC Mobile Salon.`,
    alternates: { canonical: `https://thenycmobilesalon.com/events/${slug}/${borough}/${neighborhood}` },
  };
}

export default async function EventNeighborhoodPage({ params }: Props) {
  const { slug, borough, neighborhood } = await params;
  const evt = getEventBySlug(slug);
  const hood = getNeighborhoodName(borough, neighborhood);
  const boro = getBoroughName(borough);
  if (!evt || !hood || !boro) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        serviceSchema(`${evt.name} in ${hood}, ${boro}`, `${evt.description} — mobile event beauty in ${hood}, ${boro}.`, `${hood}, ${boro}`),
        breadcrumbSchema([
          { name: "Home", url: "/" }, { name: "Events", url: "/events" }, { name: evt.name, url: `/events/${slug}` },
          { name: boro, url: `/events/${slug}/${borough}` }, { name: hood, url: `/events/${slug}/${borough}/${neighborhood}` },
        ]),
      ]) }} />

      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[20%] top-[-10%] h-[400px] w-[400px] bg-amber-200" />
        <div className="blob right-[-5%] bottom-[-10%] h-[350px] w-[350px] bg-pink-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <Link href={`/events/${slug}/${borough}`} className="mb-3 inline-block rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-600 hover:bg-amber-200 transition-colors">{evt.name} in {boro}</Link>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">{evt.name} in <span className="text-gradient-warm">{hood}</span></h1>
          <p className="mx-auto max-w-lg text-lg text-slate-500">{evt.description} — professional mobile beauty delivered to your event in {hood}, {boro}.</p>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-xl font-black text-slate-800">What to Expect</h2>
          <p className="mb-8 text-slate-500">Our team arrives at your {hood} location with everything needed. Professional hair, makeup, and beauty services for your entire group — no salon visit required.</p>
          <h2 className="mb-4 text-xl font-black text-slate-800">Also in {hood}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link href={`/locations/${borough}/${neighborhood}`} className="card-hover rounded-2xl bg-gradient-to-br from-sky-50 to-purple-50 p-5 text-center"><p className="text-sm font-bold text-slate-800">All Services</p><p className="text-xs text-slate-400">in {hood}</p></Link>
            <Link href={`/services/blowouts-and-styling/${borough}/${neighborhood}`} className="card-hover rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 p-5 text-center"><p className="text-sm font-bold text-slate-800">Services</p><p className="text-xs text-slate-400">in {hood}</p></Link>
            <Link href={`/classes/${borough}/${neighborhood}`} className="card-hover rounded-2xl bg-gradient-to-br from-purple-50 to-sky-50 p-5 text-center"><p className="text-sm font-bold text-slate-800">Classes</p><p className="text-xs text-slate-400">in {hood}</p></Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-16">
        <div className="blob left-[30%] top-[30%] h-[400px] w-[400px] bg-amber-200" />
        <div className="relative text-center">
          <h2 className="mb-4 text-3xl font-black">Book {evt.name} in <span className="text-gradient-warm">{hood}</span></h2>
          <Link href="/book" className="btn-gradient inline-block rounded-full px-10 py-3.5 text-sm font-bold text-white">Get a Quote</Link>
        </div>
      </section>
    </>
  );
}
