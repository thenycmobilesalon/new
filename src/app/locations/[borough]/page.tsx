import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { neighborhoods } from "@/lib/constants";
import { getAllBoroughParams, getBoroughName, localBusinessSchema, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return getAllBoroughParams();
}

type Props = { params: Promise<{ borough: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { borough } = await params;
  const name = getBoroughName(borough);
  if (!name) return {};
  return {
    title: `Mobile Salon Services in ${name}, NYC`,
    description: `The NYC Mobile Salon serves every neighborhood in ${name}. Licensed stylists for hair, nails, makeup, grooming & more — delivered to your door in ${name}.`,
    alternates: { canonical: `https://thenycmobilesalon.com/locations/${borough}` },
  };
}

export default async function BoroughPage({ params }: Props) {
  const { borough } = await params;
  const name = getBoroughName(borough);
  const hoods = neighborhoods[borough];
  if (!name || !hoods) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            localBusinessSchema({ areaServed: `${name}, New York City` }),
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Locations", url: "/locations" },
              { name, url: `/locations/${borough}` },
            ]),
          ]),
        }}
      />

      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[20%] top-[-10%] h-[400px] w-[400px] bg-sky-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-3 inline-block rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-600">
            {name}
          </span>
          <h1 className="mb-4 text-5xl font-black tracking-tight md:text-6xl">
            Mobile Salon in <span className="text-gradient">{name}</span>
          </h1>
          <p className="mx-auto max-w-lg text-lg text-slate-500">
            Licensed beauty professionals serving every neighborhood in {name}. Hair, nails, makeup, grooming — we come to you.
          </p>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-2xl font-black text-slate-800">
            Neighborhoods We Serve in {name}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {hoods.map((hood) => (
              <Link
                key={hood.slug}
                href={`/locations/${borough}/${hood.slug}`}
                className="card-hover rounded-2xl border border-slate-200 p-4 text-center text-sm font-medium text-slate-700 transition-all hover:border-sky-300 hover:bg-sky-50"
              >
                {hood.name}
              </Link>
            ))}
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <Link href={`/services/${borough}`} className="rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 p-6 text-center card-hover">
              <p className="font-bold text-slate-800">Services</p>
              <p className="text-xs text-slate-400">in {name}</p>
            </Link>
            <Link href={`/events/${borough}`} className="rounded-2xl bg-gradient-to-br from-amber-50 to-pink-50 p-6 text-center card-hover">
              <p className="font-bold text-slate-800">Events</p>
              <p className="text-xs text-slate-400">in {name}</p>
            </Link>
            <Link href={`/classes/${borough}`} className="rounded-2xl bg-gradient-to-br from-sky-50 to-purple-50 p-6 text-center card-hover">
              <p className="font-bold text-slate-800">Classes</p>
              <p className="text-xs text-slate-400">in {name}</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 text-center">
        <h2 className="mb-4 text-3xl font-black">
          Ready to Book in <span className="text-gradient">{name}?</span>
        </h2>
        <Link href="/book" className="btn-gradient inline-block rounded-full px-10 py-3.5 text-sm font-bold text-white">
          Book Your Appointment
        </Link>
      </section>
    </>
  );
}
