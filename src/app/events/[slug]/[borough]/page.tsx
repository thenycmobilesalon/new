import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { neighborhoods } from "@/lib/constants";
import { getEventBySlug, getBoroughName, getEventBoroughParams, serviceSchema, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return getEventBoroughParams();
}

type Props = { params: Promise<{ slug: string; borough: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, borough } = await params;
  const evt = getEventBySlug(slug);
  const boro = getBoroughName(borough);
  if (!evt || !boro) return {};
  return {
    title: `${evt.name} in ${boro}, NYC — Mobile Event Beauty`,
    description: `Book ${evt.name.toLowerCase()} in ${boro}. ${evt.description}. The NYC Mobile Salon brings professional beauty services to your ${boro} event.`,
    alternates: { canonical: `https://thenycmobilesalon.com/events/${slug}/${borough}` },
  };
}

export default async function EventBoroughPage({ params }: Props) {
  const { slug, borough } = await params;
  const evt = getEventBySlug(slug);
  const boro = getBoroughName(borough);
  const hoods = neighborhoods[borough];
  if (!evt || !boro || !hoods) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        serviceSchema(`${evt.name} in ${boro}`, `${evt.description} — mobile event beauty in ${boro}.`, boro),
        breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Events", url: "/events" }, { name: evt.name, url: `/events/${slug}` }, { name: boro, url: `/events/${slug}/${borough}` }]),
      ]) }} />

      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[20%] top-[-10%] h-[400px] w-[400px] bg-amber-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <Link href={`/events/${slug}`} className="mb-3 inline-block rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-600 hover:bg-amber-200 transition-colors">{evt.name}</Link>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">{evt.name} in <span className="text-gradient-warm">{boro}</span></h1>
          <p className="mx-auto max-w-lg text-lg text-slate-500">{evt.description} — we come to any location in {boro}.</p>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-2xl font-black text-slate-800">{evt.name} by Neighborhood</h2>
          <div className="flex flex-wrap gap-2">
            {hoods.map((hood) => (
              <Link key={hood.slug} href={`/events/${slug}/${borough}/${hood.slug}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700">{hood.name}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 text-center">
        <h2 className="mb-4 text-3xl font-black">Plan {evt.name} in <span className="text-gradient-warm">{boro}</span></h2>
        <Link href="/book" className="btn-gradient inline-block rounded-full px-10 py-3.5 text-sm font-bold text-white">Get a Quote</Link>
      </section>
    </>
  );
}
