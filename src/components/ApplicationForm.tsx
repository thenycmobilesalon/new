"use client";

import { useState, useRef } from "react";
import { serviceOptions, boroughs } from "@/lib/constants";

type FormState = {
  success: boolean;
  errors: Record<string, string>;
  serverError: string;
};

const initialState: FormState = {
  success: false,
  errors: {},
  serverError: "",
};

const specialties = [
  "Hairstylist",
  "Barber",
  "Nail Technician",
  "Makeup Artist",
  "Esthetician",
  "Waxing Specialist",
  "Multiple Specialties",
];

export default function ApplicationForm() {
  const [state, setState] = useState<FormState>(initialState);
  const [isPending, setIsPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const [videoName, setVideoName] = useState("");
  const [videoError, setVideoError] = useState("");
  const resumeRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setState(initialState);
    setVideoError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Client-side validation
    const errors: Record<string, string> = {};
    if (!formData.get("name")?.toString().trim()) errors.name = "Name is required";
    if (!formData.get("email")?.toString().trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get("email") as string)) errors.email = "Please enter a valid email";
    if (!formData.get("phone")?.toString().trim()) errors.phone = "Phone is required";
    if (!formData.get("specialty")) errors.specialty = "Please select a specialty";
    if (!formData.get("borough")) errors.borough = "Please select a borough";

    // Video validation - check duration if possible (file size check as proxy)
    const videoFile = formData.get("video") as File;
    if (videoFile && videoFile.size > 0 && videoFile.size < 500000) {
      // Files under 500KB are almost certainly under 30 seconds
      setVideoError("Video must be at least 30 seconds long. Your file seems too short.");
      setIsPending(false);
      return;
    }

    if (Object.keys(errors).length > 0) {
      setState({ success: false, errors, serverError: "" });
      setIsPending(false);
      return;
    }

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.errors) {
          setState({ success: false, errors: json.errors, serverError: "" });
        } else {
          setState({ success: false, errors: {}, serverError: json.error || "Something went wrong" });
        }
      } else {
        setSubmitted(true);
      }
    } catch {
      setState({ success: false, errors: {}, serverError: "Network error. Please try again." });
    }

    setIsPending(false);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-purple-100 bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
          <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-2 font-display text-2xl font-bold text-slate-800">Application Received</h3>
        <p className="text-slate-500">
          We review every application personally. Most candidates hear back within 48 hours.
        </p>
      </div>
    );
  }

  const inputClass = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-charcoal placeholder-gray-400 transition-all focus:border-purple-400 focus:ring-1 focus:ring-purple-400 focus:outline-none";
  const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="rounded-2xl border border-purple-100 bg-white p-6 sm:p-8">
      <h3 className="mb-1 text-center font-display text-xl font-bold text-slate-800">
        Apply to Join the Team
      </h3>
      <p className="mb-6 text-center text-sm text-slate-500">
        $49/hr via Zelle or Apple Cash — paid within 30 minutes of job completion.
      </p>

      {state.serverError && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {state.serverError}
        </p>
      )}

      <div className="space-y-3">
        {/* Name */}
        <div>
          <label htmlFor="app-name" className={labelClass}>Full Name</label>
          <input id="app-name" name="name" type="text" placeholder="Your full name" className={inputClass} />
          {state.errors.name && <p className="mt-1 text-xs text-red-500">{state.errors.name}</p>}
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="app-email" className={labelClass}>Email</label>
            <input id="app-email" name="email" type="email" placeholder="you@email.com" className={inputClass} />
            {state.errors.email && <p className="mt-1 text-xs text-red-500">{state.errors.email}</p>}
          </div>
          <div>
            <label htmlFor="app-phone" className={labelClass}>Phone</label>
            <input id="app-phone" name="phone" type="tel" placeholder="(555) 123-4567" className={inputClass} />
            {state.errors.phone && <p className="mt-1 text-xs text-red-500">{state.errors.phone}</p>}
          </div>
        </div>

        {/* Specialty + Borough */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="app-specialty" className={labelClass}>Specialty</label>
            <select id="app-specialty" name="specialty" defaultValue="" className={inputClass}>
              <option value="" disabled>Choose one</option>
              {specialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {state.errors.specialty && <p className="mt-1 text-xs text-red-500">{state.errors.specialty}</p>}
          </div>
          <div>
            <label htmlFor="app-borough" className={labelClass}>Preferred Borough</label>
            <select id="app-borough" name="borough" defaultValue="" className={inputClass}>
              <option value="" disabled>Your borough</option>
              {boroughs.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            {state.errors.borough && <p className="mt-1 text-xs text-red-500">{state.errors.borough}</p>}
          </div>
        </div>

        {/* Instagram */}
        <div>
          <label htmlFor="app-instagram" className={labelClass}>Instagram Handle</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">@</span>
            <input id="app-instagram" name="instagram" type="text" placeholder="yourusername" className={`${inputClass} pl-7`} />
          </div>
        </div>

        {/* Resume Upload */}
        <div>
          <label className={labelClass}>Resume <span className="text-gray-300">(optional)</span></label>
          <input
            ref={resumeRef}
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => setResumeName(e.target.files?.[0]?.name || "")}
          />
          <button
            type="button"
            onClick={() => resumeRef.current?.click()}
            className="flex w-full items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-500 transition hover:border-purple-300 hover:bg-purple-50"
          >
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {resumeName || "Upload resume (PDF, DOC)"}
          </button>
        </div>

        {/* Video Selfie Upload */}
        <div>
          <label className={labelClass}>Video Selfie <span className="text-purple-500">(min 30 seconds)</span></label>
          <input
            ref={videoRef}
            type="file"
            name="video"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              setVideoName(e.target.files?.[0]?.name || "");
              setVideoError("");
            }}
          />
          <button
            type="button"
            onClick={() => videoRef.current?.click()}
            className="flex w-full items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-500 transition hover:border-purple-300 hover:bg-purple-50"
          >
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {videoName || "Upload a quick intro video"}
          </button>
          {videoError && <p className="mt-1 text-xs text-red-500">{videoError}</p>}
          <p className="mt-1 text-xs text-gray-400">Tell us about yourself, your experience, and why you want to join. Min 30 seconds.</p>
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="app-experience" className={labelClass}>Years of Experience</label>
          <select id="app-experience" name="experience" defaultValue="" className={inputClass}>
            <option value="" disabled>Select</option>
            <option value="0-1">Less than 1 year</option>
            <option value="1-2">1-2 years</option>
            <option value="2-5">2-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </div>

        {/* Availability */}
        <div>
          <label htmlFor="app-availability" className={labelClass}>Availability</label>
          <select id="app-availability" name="availability" defaultValue="" className={inputClass}>
            <option value="" disabled>Select</option>
            <option value="full-time">Full-Time (5-6 days/week)</option>
            <option value="part-time">Part-Time (2-4 days/week)</option>
            <option value="weekends">Weekends Only</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="app-message" className={labelClass}>
            Anything else? <span className="text-gray-300">(optional)</span>
          </label>
          <textarea
            id="app-message"
            name="message"
            rows={2}
            placeholder="Tell us about your specialties, clients you love working with, etc."
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-5 w-full rounded-full bg-purple-600 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-purple-700 disabled:opacity-60"
      >
        {isPending ? "Submitting..." : "Submit Application"}
      </button>

      <p className="mt-4 text-center text-xs text-gray-400">
        By applying, you confirm you hold a valid NYS license for your specialty.
      </p>
    </form>
  );
}
