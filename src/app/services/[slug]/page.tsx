import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allServices, neighborhoods, boroughNames } from "@/lib/constants";
import { getServiceBySlug, serviceSchema, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return allServices.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const svc = getServiceBySlug(slug);
  if (!svc) return {};
  return {
    title: `Mobile ${svc.name} in NYC — At Your Door`,
    description: `Book mobile ${svc.name.toLowerCase()} anywhere in New York City. Licensed professionals come to your home, office, or event. ${svc.description}. Starting at $49.`,
    alternates: { canonical: `https://thenycmobilesalon.com/services/${slug}` },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const svc = getServiceBySlug(slug);
  if (!svc) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        serviceSchema(`Mobile ${svc.name} in NYC`, `${svc.description}. Licensed mobile beauty professionals serving all 5 NYC boroughs.`),
        breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Services", url: "/services" }, { name: svc.name, url: `/services/${slug}` }]),
      ]) }} />

      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[-5%] top-[-10%] h-[400px] w-[400px] bg-pink-200" />
        <div className="blob right-[10%] bottom-[-10%] h-[350px] w-[350px] bg-purple-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <Link href="/services" className="mb-3 inline-block rounded-full bg-pink-100 px-4 py-1.5 text-sm font-semibold text-pink-600 hover:bg-pink-200 transition-colors">Services</Link>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
            Mobile <span className="text-gradient">{svc.name}</span> in NYC
          </h1>
          <p className="mx-auto max-w-lg text-lg text-slate-500">{svc.description}. Licensed pros come to your door — anywhere in the city.</p>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-2xl font-black text-slate-800">Book {svc.name} by Borough</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {Object.entries(boroughNames).map(([boroSlug, boroName]) => (
              <Link key={boroSlug} href={`/services/${slug}/${boroSlug}`} className="card-hover rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 p-6 text-center">
                <p className="font-bold text-slate-800">{boroName}</p>
                <p className="text-xs text-slate-400">{neighborhoods[boroSlug].length} neighborhoods</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 text-center">
        <h2 className="mb-4 text-3xl font-black">Ready for <span className="text-gradient">{svc.name}?</span></h2>
        <Link href="/book" className="btn-gradient inline-block rounded-full px-10 py-3.5 text-sm font-bold text-white">Book Now</Link>
      </section>
    </>
  );
}
