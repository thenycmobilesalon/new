import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getClassBySlug, getNeighborhoodName, getBoroughName, getClassNeighborhoodParams, serviceSchema, breadcrumbSchema } from "@/lib/seo";

export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string; borough: string; neighborhood: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, borough, neighborhood } = await params;
  const cls = getClassBySlug(slug);
  const hood = getNeighborhoodName(borough, neighborhood);
  const boro = getBoroughName(borough);
  if (!cls || !hood || !boro) return {};
  return {
    title: `${cls.name} in ${hood}, ${boro} — Mobile Workshop`,
    description: `Book a ${cls.name.toLowerCase()} in ${hood}, ${boro}. ${cls.description}. ${cls.duration}, groups of ${cls.groupSize}. At your location. The NYC Mobile Salon.`,
    alternates: { canonical: `https://thenycmobilesalon.com/classes/${slug}/${borough}/${neighborhood}` },
  };
}

export default async function ClassNeighborhoodPage({ params }: Props) {
  const { slug, borough, neighborhood } = await params;
  const cls = getClassBySlug(slug);
  const hood = getNeighborhoodName(borough, neighborhood);
  const boro = getBoroughName(borough);
  if (!cls || !hood || !boro) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        serviceSchema(`${cls.name} in ${hood}, ${boro}`, `${cls.description} — mobile workshop in ${hood}, ${boro}. ${cls.duration}, groups of ${cls.groupSize}.`, `${hood}, ${boro}`),
        breadcrumbSchema([
          { name: "Home", url: "/" }, { name: "Classes", url: "/classes" }, { name: cls.name, url: `/classes/${slug}` },
          { name: boro, url: `/classes/${slug}/${borough}` }, { name: hood, url: `/classes/${slug}/${borough}/${neighborhood}` },
        ]),
      ]) }} />

      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[-5%] top-[-10%] h-[400px] w-[400px] bg-purple-200" />
        <div className="blob right-[10%] bottom-[-10%] h-[350px] w-[350px] bg-sky-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <Link href={`/classes/${slug}/${borough}`} className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-600 hover:bg-purple-200 transition-colors">{cls.name} in {boro}</Link>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">{cls.name} in <span className="text-gradient">{hood}</span></h1>
          <p className="mx-auto max-w-lg text-lg text-slate-500">{cls.description} — at your spot in {hood}, {boro}. {cls.duration}, groups of {cls.groupSize}.</p>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-xl font-black text-slate-800">What to Expect</h2>
          <p className="mb-8 text-slate-500">Our instructor comes to your {hood} location with all materials and supplies. Hands-on learning in a small group setting — no experience needed.</p>
          <h2 className="mb-4 text-xl font-black text-slate-800">Also in {hood}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link href={`/locations/${borough}/${neighborhood}`} className="card-hover rounded-2xl bg-gradient-to-br from-sky-50 to-purple-50 p-5 text-center"><p className="text-sm font-bold text-slate-800">All Services</p><p className="text-xs text-slate-400">in {hood}</p></Link>
            <Link href={`/services/blowouts-and-styling/${borough}/${neighborhood}`} className="card-hover rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 p-5 text-center"><p className="text-sm font-bold text-slate-800">Services</p><p className="text-xs text-slate-400">in {hood}</p></Link>
            <Link href={`/events/bridal-hair-and-makeup/${borough}/${neighborhood}`} className="card-hover rounded-2xl bg-gradient-to-br from-amber-50 to-pink-50 p-5 text-center"><p className="text-sm font-bold text-slate-800">Events</p><p className="text-xs text-slate-400">in {hood}</p></Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-16">
        <div className="blob left-[30%] top-[30%] h-[400px] w-[400px] bg-purple-200" />
        <div className="relative text-center">
          <h2 className="mb-4 text-3xl font-black">Book {cls.name} in <span className="text-gradient">{hood}</span></h2>
          <Link href="/book" className="btn-gradient inline-block rounded-full px-10 py-3.5 text-sm font-bold text-white">Book a Workshop</Link>
        </div>
      </section>
    </>
  );
}
