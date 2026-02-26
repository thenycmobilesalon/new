import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allEvents, neighborhoods, boroughNames } from "@/lib/constants";
import { getEventBySlug, serviceSchema, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return allEvents.map((e) => ({ slug: e.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const evt = getEventBySlug(slug);
  if (!evt) return {};
  return {
    title: `Mobile ${evt.name} in NYC — We Come to Your Event`,
    description: `Book mobile ${evt.name.toLowerCase()} anywhere in New York City. ${evt.description}. The NYC Mobile Salon brings the glam to your event.`,
    alternates: { canonical: `https://thenycmobilesalon.com/events/${slug}` },
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const evt = getEventBySlug(slug);
  if (!evt) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        serviceSchema(`Mobile ${evt.name} in NYC`, `${evt.description}. Professional event beauty services across all 5 NYC boroughs.`),
        breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Events", url: "/events" }, { name: evt.name, url: `/events/${slug}` }]),
      ]) }} />

      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[20%] top-[-10%] h-[400px] w-[400px] bg-amber-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <Link href="/events" className="mb-3 inline-block rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-600 hover:bg-amber-200 transition-colors">Events</Link>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
            <span className="text-gradient-warm">{evt.name}</span> in NYC
          </h1>
          <p className="mx-auto max-w-lg text-lg text-slate-500">{evt.description}. We bring everything to your location — anywhere in the city.</p>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-2xl font-black text-slate-800">Book {evt.name} by Borough</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {Object.entries(boroughNames).map(([boroSlug, boroName]) => (
              <Link key={boroSlug} href={`/events/${slug}/${boroSlug}`} className="card-hover rounded-2xl bg-gradient-to-br from-amber-50 to-pink-50 p-6 text-center">
                <p className="font-bold text-slate-800">{boroName}</p>
                <p className="text-xs text-slate-400">{neighborhoods[boroSlug].length} neighborhoods</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 text-center">
        <h2 className="mb-4 text-3xl font-black">Plan Your <span className="text-gradient-warm">{evt.name}</span></h2>
        <Link href="/book" className="btn-gradient inline-block rounded-full px-10 py-3.5 text-sm font-bold text-white">Get a Quote</Link>
      </section>
    </>
  );
}
