"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav, moreNav, womensCategories, mensCategories, eventCategories, classCategories } from "@/lib/constants";

type DropdownKey = "services" | "events" | "classes" | "more" | null;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setMenuOpen(false);
  }, [pathname]);

  function toggle(key: DropdownKey) {
    setActiveDropdown(activeDropdown === key ? null : key);
  }

  const chevron = (key: DropdownKey) => (
    <svg className={`h-3 w-3 transition-transform ${activeDropdown === key ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const simpleLinks = mainNav.filter((l) => !["Services", "Events", "Classes"].includes(l.label));

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors hover:text-charcoal ${pathname === href ? "text-charcoal" : "text-gray-400"}`;

  const dropdownBtnClass = (check: boolean) =>
    `flex items-center gap-1 text-sm font-medium transition-colors hover:text-charcoal ${check ? "text-charcoal" : "text-gray-400"}`;

  return (
    <header ref={navRef} className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-charcoal">
          The NYC Mobile Salon
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/" className={linkClass("/")}>Home</Link>
          <Link href="/how-it-works" className={linkClass("/how-it-works")}>How It Works</Link>

          {/* Services dropdown */}
          <div className="relative">
            <button onClick={() => toggle("services")} className={dropdownBtnClass(pathname.startsWith("/services"))}>
              Services {chevron("services")}
            </button>
            {activeDropdown === "services" && (
              <div className="absolute left-1/2 top-full mt-3 w-[480px] -translate-x-1/2 rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <div className="mb-4">
                  <Link href="/services" className="text-xs font-semibold uppercase tracking-widest text-sage hover:text-sage-dark">View All Services &rarr;</Link>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">Women&apos;s</p>
                    {womensCategories.map((cat) => (
                      <p key={cat.slug} className="py-1">
                        <span className="text-sm font-medium text-charcoal">{cat.title}</span>
                        <span className="ml-1 text-xs text-gray-400">({cat.services.length})</span>
                      </p>
                    ))}
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">Men&apos;s</p>
                    {mensCategories.map((cat) => (
                      <p key={cat.slug} className="py-1">
                        <span className="text-sm font-medium text-charcoal">{cat.title}</span>
                        <span className="ml-1 text-xs text-gray-400">({cat.services.length})</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Events dropdown */}
          <div className="relative">
            <button onClick={() => toggle("events")} className={dropdownBtnClass(pathname.startsWith("/events"))}>
              Events {chevron("events")}
            </button>
            {activeDropdown === "events" && (
              <div className="absolute left-1/2 top-full mt-3 w-[300px] -translate-x-1/2 rounded-xl border border-gray-100 bg-white p-5 shadow-lg">
                <Link href="/events" className="mb-3 block text-xs font-semibold uppercase tracking-widest text-sage hover:text-sage-dark">View All Events &rarr;</Link>
                {eventCategories.map((cat) => (
                  <p key={cat.slug} className="py-1.5">
                    <span className="text-sm font-medium text-charcoal">{cat.title}</span>
                    <span className="ml-1 text-xs text-gray-400">({cat.items.length})</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Classes dropdown */}
          <div className="relative">
            <button onClick={() => toggle("classes")} className={dropdownBtnClass(pathname.startsWith("/classes"))}>
              Classes {chevron("classes")}
            </button>
            {activeDropdown === "classes" && (
              <div className="absolute left-1/2 top-full mt-3 w-[260px] -translate-x-1/2 rounded-xl border border-gray-100 bg-white p-5 shadow-lg">
                <Link href="/classes" className="mb-3 block text-xs font-semibold uppercase tracking-widest text-sage hover:text-sage-dark">View All Classes &rarr;</Link>
                {classCategories.flatMap((cat) => cat.items).map((cls) => (
                  <Link key={cls.slug} href={`/classes/${cls.slug}`} className="block py-1.5 text-sm font-medium text-charcoal transition-colors hover:text-sage">{cls.name}</Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/pricing" className={linkClass("/pricing")}>Pricing</Link>

          {/* More dropdown */}
          <div className="relative">
            <button onClick={() => toggle("more")} className={dropdownBtnClass(moreNav.some((l) => pathname === l.href))}>
              More {chevron("more")}
            </button>
            {activeDropdown === "more" && (
              <div className="absolute right-0 top-full mt-3 w-44 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                {moreNav.map((link) => (
                  <Link key={link.href} href={link.href} className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sage-light/30 ${pathname === link.href ? "text-sage" : "text-charcoal"}`}>{link.label}</Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/book" className="btn-primary rounded-full px-6 py-2.5 text-sm font-semibold">Book Now</Link>
        </nav>

        {/* Mobile menu button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden" aria-label="Toggle menu">
          <svg className="h-6 w-6 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="max-h-[80vh] overflow-y-auto border-t border-gray-100 bg-white px-4 pb-6 lg:hidden">
          {simpleLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`block py-3 text-sm font-medium ${pathname === link.href ? "text-sage" : "text-charcoal"}`}>{link.label}</Link>
          ))}

          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between py-3 text-sm font-medium text-charcoal">Services <svg className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <div className="pl-4 pb-2">
              <Link href="/services" className="block py-1.5 text-xs font-semibold uppercase tracking-widest text-sage">All Services</Link>
              <p className="mt-2 text-xs font-semibold text-gray-400">Women&apos;s</p>
              {womensCategories.map((c) => <p key={c.slug} className="py-1 text-sm text-gray-500">{c.title}</p>)}
              <p className="mt-2 text-xs font-semibold text-gray-400">Men&apos;s</p>
              {mensCategories.map((c) => <p key={c.slug} className="py-1 text-sm text-gray-500">{c.title}</p>)}
            </div>
          </details>

          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between py-3 text-sm font-medium text-charcoal">Events <svg className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <div className="pl-4 pb-2">
              <Link href="/events" className="block py-1.5 text-xs font-semibold uppercase tracking-widest text-sage">All Events</Link>
              {eventCategories.map((c) => <p key={c.slug} className="py-1 text-sm text-gray-500">{c.title}</p>)}
            </div>
          </details>

          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between py-3 text-sm font-medium text-charcoal">Classes <svg className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <div className="pl-4 pb-2">
              <Link href="/classes" className="block py-1.5 text-xs font-semibold uppercase tracking-widest text-sage">All Classes</Link>
              {classCategories.flatMap((c) => c.items).map((cls) => (
                <Link key={cls.slug} href={`/classes/${cls.slug}`} className="block py-1 text-sm text-gray-500">{cls.name}</Link>
              ))}
            </div>
          </details>

          <div className="border-t border-gray-100 pt-2">
            <p className="py-2 text-xs font-semibold uppercase tracking-widest text-gray-400">More</p>
            {moreNav.map((link) => (
              <Link key={link.href} href={link.href} className={`block py-2.5 text-sm font-medium ${pathname === link.href ? "text-sage" : "text-gray-500"}`}>{link.label}</Link>
            ))}
          </div>

          <Link href="/book" className="btn-primary mt-3 block rounded-full px-5 py-2.5 text-center text-sm font-semibold text-white">Book Now</Link>
        </nav>
      )}
    </header>
  );
}
