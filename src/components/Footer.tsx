import Link from "next/link";
import { mainNav, moreNav, neighborhoods, boroughNames } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-charcoal px-4 py-16 text-gray-400">
      <div className="mx-auto max-w-6xl">
        {/* Top section */}
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="font-display text-xl font-semibold text-white">
              The NYC Mobile Salon
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              Licensed beauty pros, delivered to your door across all 5 NYC boroughs. The future of beauty is mobile.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Pages</h4>
            <ul className="space-y-2.5 text-sm">
              {mainNav.map((link) => (
                <li key={link.href}><Link href={link.href} className="transition-colors hover:text-white">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">More</h4>
            <ul className="space-y-2.5 text-sm">
              {moreNav.map((link) => (
                <li key={link.href}><Link href={link.href} className="transition-colors hover:text-white">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="mailto:hey@thenycmobilesalon.com" className="transition-colors hover:text-white">hey@thenycmobilesalon.com</a></li>
              <li>All 5 Boroughs, NYC</li>
            </ul>
          </div>
        </div>

        {/* Locations section */}
        <div className="mt-16 border-t border-white/10 pt-12">
          <h4 className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-gray-500">Neighborhoods We Serve</h4>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {Object.entries(neighborhoods).map(([boroughSlug, hoods]) => (
              <div key={boroughSlug}>
                <Link href={`/locations/${boroughSlug}`} className="mb-3 block text-sm font-semibold text-white transition-colors hover:text-sage-light">
                  {boroughNames[boroughSlug]}
                </Link>
                <ul className="space-y-1">
                  {hoods.map((hood) => (
                    <li key={hood.slug}>
                      <Link href={`/locations/${boroughSlug}/${hood.slug}`} className="text-xs text-gray-600 transition-colors hover:text-gray-400">
                        {hood.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} The NYC Mobile Salon. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
