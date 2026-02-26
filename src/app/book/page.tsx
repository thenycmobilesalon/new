import type { Metadata } from "next";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Book Your Appointment",
  description: "Book a mobile beauty appointment with The NYC Mobile Salon. Hair, nails, makeup, grooming — we come to you anywhere in NYC.",
};

export default function BookPage() {
  return (
    <section className="relative overflow-hidden px-4 py-20">
      <div className="blob left-[10%] top-[20%] h-[400px] w-[400px] bg-pink-200" />
      <div className="blob right-[10%] bottom-[10%] h-[350px] w-[350px] bg-sky-200" />

      <div className="relative mx-auto max-w-lg">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">
            Let&apos;s <span className="text-gradient">Do This.</span>
          </h1>
          <p className="text-slate-500">
            Fill it out, we&apos;ll hit you back within 24 hours. Easy.
          </p>
        </div>
        <LeadForm />
      </div>
    </section>
  );
}
