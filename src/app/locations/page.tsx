import type { Metadata } from "next";
import Link from "next/link";
import { neighborhoods, boroughNames } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Locations",
  description: "The NYC Mobile Salon serves all 5 boroughs — Manhattan, Brooklyn, Queens, Bronx, and Staten Island. Find mobile beauty services in your neighborhood.",
};

export default function LocationsPage() {
  return (
    <>
      <section className="relative overflow-hidden px-4 py-20">
        <div className="blob left-[20%] top-[-10%] h-[400px] w-[400px] bg-sky-200" />
        <div className="blob right-[-5%] bottom-[-10%] h-[350px] w-[350px] bg-purple-200" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-3 inline-block rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-600">
            All 5 Boroughs
          </span>
          <h1 className="mb-4 text-5xl font-black tracking-tight md:text-6xl">
            Your Neighborhood. <span className="text-gradient">Our Stylists.</span>
          </h1>
          <p className="mx-auto max-w-lg text-lg text-slate-500">
            We come to you — no matter where in NYC you are.
          </p>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl space-y-12">
          {Object.entries(neighborhoods).map(([boroughSlug, hoods]) => (
            <div key={boroughSlug}>
              <h2 className="mb-6 text-2xl font-black text-slate-800">
                {boroughNames[boroughSlug]}
              </h2>
              <div className="flex flex-wrap gap-2">
                {hoods.map((hood) => (
                  <Link
                    key={hood.slug}
                    href={`/locations/${boroughSlug}/${hood.slug}`}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                  >
                    {hood.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
