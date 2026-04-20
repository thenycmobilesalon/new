import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact The NYC Mobile Salon",
  description:
    "Get in touch with The NYC Mobile Salon. Questions about services, bookings, events, or partnerships — we'll get back to you within 24 hours.",
  alternates: { canonical: "https://thenycmobilesalon.com/contact" },
  openGraph: {
    title: "Contact The NYC Mobile Salon",
    description:
      "Get in touch with The NYC Mobile Salon. Questions about services, bookings, events, or partnerships — we'll get back to you within 24 hours.",
    url: "https://thenycmobilesalon.com/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-purple-50/30 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-800">Contact Us</h1>
          <p className="mt-4 text-lg text-slate-500">
            Questions, custom requests, events, or partnerships — send us a note.
            We usually reply within 24 hours.
          </p>
        </div>
        <ContactForm />
        <div className="mt-10 text-center text-sm text-slate-500">
          <p>
            Prefer email? <a href="mailto:hey@thenycmobilesalon.com" className="text-purple-600 hover:underline font-medium">hey@thenycmobilesalon.com</a>
          </p>
        </div>
      </div>
    </main>
  );
}
