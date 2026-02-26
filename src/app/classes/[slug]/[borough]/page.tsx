import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { neighborhoods } from "@/lib/constants";
import { getClassBySlug, getBoroughName, getClassBoroughParams, serviceSchema, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return getClassBoroughParams();
}

type Props = { params: Promise<{ slug: string; borough: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, borough } = await params;
  const cls = getClassBySlug(slug);
  const boro = getBoroughName(borough);
  if (!cls || !boro) return {};
  return {
    title: `${cls.name} in ${boro}, NYC — Mobile Workshop`,
    description: `Book a ${cls.name.toLowerCase()} in ${boro}. ${cls.description}. ${cls.duration}, groups of ${cls.groupSize}. At your ${boro} location.`,
    alternates: { canonical: `https://thenycmobilesalon.com/classes/${slug}/${borough}` },
  };
}

export default async function ClassBoroughPage({ params }: Props) {
  const { slug, borough } = await params;
  const cls = getClassBySlug(slug);
  const boro = getBoroughName(borough);
  const hoods = neighborhoods[borough];
  if (!cls || !boro || !hoods) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        serviceSchema(`${cls.name} in ${boro}`, `${cls.description} — mobile workshop in ${boro}.`, boro),
        breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Classes", url: "/classes" }, { name: cls.name, url: `/classes/${slug}` }, { name: boro, url: `/classes/${slug}/${borough}` }]),
      ]) }} />

      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[-5%] top-[-10%] h-[400px] w-[400px] bg-purple-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <Link href={`/classes/${slug}`} className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-600 hover:bg-purple-200 transition-colors">{cls.name}</Link>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">{cls.name} in <span className="text-gradient">{boro}</span></h1>
          <p className="mx-auto max-w-lg text-lg text-slate-500">{cls.description} — at your {boro} location. {cls.duration}, groups of {cls.groupSize}.</p>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-2xl font-black text-slate-800">{cls.name} by Neighborhood</h2>
          <div className="flex flex-wrap gap-2">
            {hoods.map((hood) => (
              <Link key={hood.slug} href={`/classes/${slug}/${borough}/${hood.slug}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700">{hood.name}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 text-center">
        <h2 className="mb-4 text-3xl font-black">Book {cls.name} in <span className="text-gradient">{boro}</span></h2>
        <Link href="/book" className="btn-gradient inline-block rounded-full px-10 py-3.5 text-sm font-bold text-white">Book a Workshop</Link>
      </section>
    </>
  );
}
