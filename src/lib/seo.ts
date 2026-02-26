import { neighborhoods, boroughNames, allServices, allEvents, allClasses } from "./constants";
import type { Service, EventItem, ClassItem } from "./constants";

const SITE_URL = "https://thenycmobilesalon.com";
const BUSINESS_NAME = "The NYC Mobile Salon";

// ─── Param generators ───────────────────────────────────────────────

export function getAllNeighborhoodParams() {
  const params: { borough: string; neighborhood: string }[] = [];
  for (const [borough, hoods] of Object.entries(neighborhoods)) {
    for (const hood of hoods) {
      params.push({ borough, neighborhood: hood.slug });
    }
  }
  return params;
}

export function getAllBoroughParams() {
  return Object.keys(neighborhoods).map((borough) => ({ borough }));
}

/** Every combination: service × borough × neighborhood */
export function getServiceNeighborhoodParams() {
  const params: { slug: string; borough: string; neighborhood: string }[] = [];
  for (const svc of allServices) {
    for (const [borough, hoods] of Object.entries(neighborhoods)) {
      for (const hood of hoods) {
        params.push({ slug: svc.slug, borough, neighborhood: hood.slug });
      }
    }
  }
  return params;
}

/** Every combination: service × borough */
export function getServiceBoroughParams() {
  const params: { slug: string; borough: string }[] = [];
  for (const svc of allServices) {
    for (const borough of Object.keys(neighborhoods)) {
      params.push({ slug: svc.slug, borough });
    }
  }
  return params;
}

/** Every combination: event × borough × neighborhood */
export function getEventNeighborhoodParams() {
  const params: { slug: string; borough: string; neighborhood: string }[] = [];
  for (const evt of allEvents) {
    for (const [borough, hoods] of Object.entries(neighborhoods)) {
      for (const hood of hoods) {
        params.push({ slug: evt.slug, borough, neighborhood: hood.slug });
      }
    }
  }
  return params;
}

export function getEventBoroughParams() {
  const params: { slug: string; borough: string }[] = [];
  for (const evt of allEvents) {
    for (const borough of Object.keys(neighborhoods)) {
      params.push({ slug: evt.slug, borough });
    }
  }
  return params;
}

/** Every combination: class × borough × neighborhood */
export function getClassNeighborhoodParams() {
  const params: { slug: string; borough: string; neighborhood: string }[] = [];
  for (const cls of allClasses) {
    for (const [borough, hoods] of Object.entries(neighborhoods)) {
      for (const hood of hoods) {
        params.push({ slug: cls.slug, borough, neighborhood: hood.slug });
      }
    }
  }
  return params;
}

export function getClassBoroughParams() {
  const params: { slug: string; borough: string }[] = [];
  for (const cls of allClasses) {
    for (const borough of Object.keys(neighborhoods)) {
      params.push({ slug: cls.slug, borough });
    }
  }
  return params;
}

// ─── Lookups ────────────────────────────────────────────────────────

export function getNeighborhoodName(borough: string, neighborhoodSlug: string): string | null {
  const hoods = neighborhoods[borough];
  if (!hoods) return null;
  return hoods.find((h) => h.slug === neighborhoodSlug)?.name ?? null;
}

export function getBoroughName(boroughSlug: string): string | null {
  return boroughNames[boroughSlug] ?? null;
}

export function getServiceBySlug(slug: string): Service | null {
  return allServices.find((s) => s.slug === slug) ?? null;
}

export function getEventBySlug(slug: string): EventItem | null {
  return allEvents.find((e) => e.slug === slug) ?? null;
}

export function getClassBySlug(slug: string): ClassItem | null {
  return allClasses.find((c) => c.slug === slug) ?? null;
}

// ─── JSON-LD Schemas ────────────────────────────────────────────────

export function localBusinessSchema(overrides?: { name?: string; url?: string; description?: string; areaServed?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: overrides?.name ?? BUSINESS_NAME,
    url: overrides?.url ?? SITE_URL,
    description: overrides?.description ?? "Licensed mobile beauty professionals serving all 5 NYC boroughs. Hair, nails, makeup, grooming, and more — delivered to your door.",
    email: "hey@thenycmobilesalon.com",
    areaServed: overrides?.areaServed ?? "New York City",
    address: {
      "@type": "PostalAddress",
      addressLocality: "New York",
      addressRegion: "NY",
      addressCountry: "US",
    },
    priceRange: "$49 - $500+",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "5000",
      bestRating: "5",
    },
  };
}

export function serviceSchema(serviceName: string, description: string, areaServed?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description,
    provider: {
      "@type": "LocalBusiness",
      name: BUSINESS_NAME,
      url: SITE_URL,
    },
    areaServed: areaServed ?? "New York City",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE_URL}/book`,
      serviceType: "Mobile Service",
    },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export { SITE_URL, BUSINESS_NAME };
