import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { neighborhoods } from "@/lib/constants";
import { getServiceBySlug, getBoroughName, getServiceBoroughParams, serviceSchema, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return getServiceBoroughParams();
}

type Props = { params: Promise<{ slug: string; borough: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, borough } = await params;
  const svc = getServiceBySlug(slug);
  const boro = getBoroughName(borough);
  if (!svc || !boro) return {};
  return {
    title: `Mobile ${svc.name} in ${boro}, NYC`,
    description: `Book mobile ${svc.name.toLowerCase()} in ${boro}, New York. Licensed professionals deliver ${svc.description.toLowerCase()} to your door in any ${boro} neighborhood.`,
    alternates: { canonical: `https://thenycmobilesalon.com/services/${slug}/${borough}` },
  };
}

export default async function ServiceBoroughPage({ params }: Props) {
  const { slug, borough } = await params;
  const svc = getServiceBySlug(slug);
  const boro = getBoroughName(borough);
  const hoods = neighborhoods[borough];
  if (!svc || !boro || !hoods) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        serviceSchema(`Mobile ${svc.name} in ${boro}`, `${svc.description} — delivered to your door in ${boro}.`, boro),
        breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Services", url: "/services" }, { name: svc.name, url: `/services/${slug}` }, { name: boro, url: `/services/${slug}/${borough}` }]),
      ]) }} />

      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[-5%] top-[-10%] h-[400px] w-[400px] bg-pink-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <Link href={`/services/${slug}`} className="mb-3 inline-block rounded-full bg-pink-100 px-4 py-1.5 text-sm font-semibold text-pink-600 hover:bg-pink-200 transition-colors">{svc.name}</Link>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">
            {svc.name} in <span className="text-gradient">{boro}</span>
          </h1>
          <p className="mx-auto max-w-lg text-lg text-slate-500">{svc.description} — we come to any neighborhood in {boro}.</p>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-2xl font-black text-slate-800">{svc.name} by Neighborhood in {boro}</h2>
          <div className="flex flex-wrap gap-2">
            {hoods.map((hood) => (
              <Link key={hood.slug} href={`/services/${slug}/${borough}/${hood.slug}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700">{hood.name}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 text-center">
        <h2 className="mb-4 text-3xl font-black">Book {svc.name} in <span className="text-gradient">{boro}</span></h2>
        <Link href="/book" className="btn-gradient inline-block rounded-full px-10 py-3.5 text-sm font-bold text-white">Book Now</Link>
      </section>
    </>
  );
}
