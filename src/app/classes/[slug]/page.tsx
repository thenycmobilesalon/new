import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allClasses, neighborhoods, boroughNames } from "@/lib/constants";
import { getClassBySlug, serviceSchema, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return allClasses.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cls = getClassBySlug(slug);
  if (!cls) return {};
  return {
    title: `${cls.name} in NYC — Mobile Beauty Workshop`,
    description: `Book a ${cls.name.toLowerCase()} anywhere in NYC. ${cls.description}. ${cls.duration}, groups of ${cls.groupSize}. The NYC Mobile Salon.`,
    alternates: { canonical: `https://thenycmobilesalon.com/classes/${slug}` },
  };
}

export default async function ClassPage({ params }: Props) {
  const { slug } = await params;
  const cls = getClassBySlug(slug);
  if (!cls) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        serviceSchema(`${cls.name} in NYC`, `${cls.description}. Hands-on workshop, ${cls.duration}, groups of ${cls.groupSize}.`),
        breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Classes", url: "/classes" }, { name: cls.name, url: `/classes/${slug}` }]),
      ]) }} />

      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[-5%] top-[-10%] h-[400px] w-[400px] bg-purple-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <Link href="/classes" className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-600 hover:bg-purple-200 transition-colors">Classes</Link>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl lg:text-6xl"><span className="text-gradient">{cls.name}</span> in NYC</h1>
          <p className="mx-auto max-w-lg text-lg text-slate-500">{cls.description}. {cls.duration}, groups of {cls.groupSize} — at your location.</p>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-2xl font-black text-slate-800">Book This Class by Borough</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {Object.entries(boroughNames).map(([boroSlug, boroName]) => (
              <Link key={boroSlug} href={`/classes/${slug}/${boroSlug}`} className="card-hover rounded-2xl bg-gradient-to-br from-purple-50 to-sky-50 p-6 text-center">
                <p className="font-bold text-slate-800">{boroName}</p>
                <p className="text-xs text-slate-400">{neighborhoods[boroSlug].length} neighborhoods</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 text-center">
        <h2 className="mb-4 text-3xl font-black">Book <span className="text-gradient">{cls.name}</span></h2>
        <Link href="/book" className="btn-gradient inline-block rounded-full px-10 py-3.5 text-sm font-bold text-white">Book a Workshop</Link>
      </section>
    </>
  );
}
