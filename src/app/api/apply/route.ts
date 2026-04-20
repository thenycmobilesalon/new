import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name = "",
      phone = "",
      specialty = "",
      instagram = "",
      experience = "",
      availability = "",
      message = "",
      videoUrl = null,
    } = body;

    // Validate required fields
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!phone.trim()) errors.phone = "Phone is required";
    if (!specialty) errors.specialty = "Specialty is required";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Save to Supabase
    const { error: dbError } = await supabaseAdmin.from("applications").insert({
      name: name.trim(),
      phone: phone.trim(),
      specialty,
      instagram: instagram || null,
      experience: experience || null,
      availability: availability || null,
      message: message || null,
      video_url: videoUrl || null,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
    }

    const businessEmail = process.env.BUSINESS_EMAIL;
    if (!businessEmail) {
      console.error("BUSINESS_EMAIL not set");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Send notification to business
    await getResend().emails.send({
      from: "NYC Mobile Salon <notifications@thenycmobilesalon.com>",
      replyTo: "hey@thenycmobilesalon.com",
      to: businessEmail,
      subject: `New Application: ${name.trim()} — ${specialty}`,
      html: `
        <h2>New Job Application — NYC Mobile Salon</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px">
          <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${name.trim()}</td></tr>
          <tr style="background:#f5f3ff"><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px"><a href="tel:${phone.trim()}">${phone.trim()}</a></td></tr>
          <tr><td style="padding:8px;font-weight:bold">Specialty</td><td style="padding:8px">${specialty}</td></tr>
          <tr style="background:#f5f3ff"><td style="padding:8px;font-weight:bold">Instagram</td><td style="padding:8px">${instagram ? `@${instagram}` : "Not provided"}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Experience</td><td style="padding:8px">${experience || "Not specified"}</td></tr>
          <tr style="background:#f5f3ff"><td style="padding:8px;font-weight:bold">Availability</td><td style="padding:8px">${availability || "Not specified"}</td></tr>
          ${message ? `<tr><td style="padding:8px;font-weight:bold">Message</td><td style="padding:8px">${message}</td></tr>` : ""}
          <tr style="background:#f5f3ff"><td style="padding:8px;font-weight:bold">Video Selfie</td><td style="padding:8px">${videoUrl ? `<a href="${videoUrl}">Watch Video</a>` : "Not uploaded"}</td></tr>
        </table>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
