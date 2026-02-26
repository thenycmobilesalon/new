import type { MetadataRoute } from "next";
import { neighborhoods, allServices, allEvents, allClasses } from "@/lib/constants";

const SITE_URL = "https://thenycmobilesalon.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages = [
    { path: "", priority: 1.0 },
    { path: "/services", priority: 0.9 },
    { path: "/events", priority: 0.9 },
    { path: "/classes", priority: 0.9 },
    { path: "/pricing", priority: 0.8 },
    { path: "/how-it-works", priority: 0.8 },
    { path: "/book", priority: 0.9 },
    { path: "/about", priority: 0.6 },
    { path: "/locations", priority: 0.8 },
    { path: "/reviews", priority: 0.7 },
    { path: "/faq", priority: 0.6 },
    { path: "/join", priority: 0.5 },
  ];

  for (const p of staticPages) {
    entries.push({ url: `${SITE_URL}${p.path}`, lastModified: now, changeFrequency: "weekly", priority: p.priority });
  }

  const boroughs = Object.keys(neighborhoods);

  // Location pages: /locations/[borough] and /locations/[borough]/[neighborhood]
  for (const borough of boroughs) {
    entries.push({ url: `${SITE_URL}/locations/${borough}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
    for (const hood of neighborhoods[borough]) {
      entries.push({ url: `${SITE_URL}/locations/${borough}/${hood.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.6 });
    }
  }

  // Service pages: /services/[slug], /services/[slug]/[borough], /services/[slug]/[borough]/[neighborhood]
  for (const svc of allServices) {
    entries.push({ url: `${SITE_URL}/services/${svc.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.8 });
    for (const borough of boroughs) {
      entries.push({ url: `${SITE_URL}/services/${svc.slug}/${borough}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
      for (const hood of neighborhoods[borough]) {
        entries.push({ url: `${SITE_URL}/services/${svc.slug}/${borough}/${hood.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.6 });
      }
    }
  }

  // Event pages: /events/[slug], /events/[slug]/[borough], /events/[slug]/[borough]/[neighborhood]
  for (const evt of allEvents) {
    entries.push({ url: `${SITE_URL}/events/${evt.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.8 });
    for (const borough of boroughs) {
      entries.push({ url: `${SITE_URL}/events/${evt.slug}/${borough}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
      for (const hood of neighborhoods[borough]) {
        entries.push({ url: `${SITE_URL}/events/${evt.slug}/${borough}/${hood.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.6 });
      }
    }
  }

  // Class pages: /classes/[slug], /classes/[slug]/[borough], /classes/[slug]/[borough]/[neighborhood]
  for (const cls of allClasses) {
    entries.push({ url: `${SITE_URL}/classes/${cls.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.8 });
    for (const borough of boroughs) {
      entries.push({ url: `${SITE_URL}/classes/${cls.slug}/${borough}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
      for (const hood of neighborhoods[borough]) {
        entries.push({ url: `${SITE_URL}/classes/${cls.slug}/${borough}/${hood.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.6 });
      }
    }
  }

  return entries;
}
