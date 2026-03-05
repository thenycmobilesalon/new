import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const phone = formData.get("phone")?.toString().trim() || "";
    const specialty = formData.get("specialty")?.toString() || "";
    const borough = formData.get("borough")?.toString() || "";
    const instagram = formData.get("instagram")?.toString().trim() || "";
    const experience = formData.get("experience")?.toString() || "";
    const availability = formData.get("availability")?.toString() || "";
    const message = formData.get("message")?.toString().trim() || "";

    const resume = formData.get("resume") as File | null;
    const video = formData.get("video") as File | null;

    // Validate required fields
    const errors: Record<string, string> = {};
    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email";
    if (!phone) errors.phone = "Phone is required";
    if (!specialty) errors.specialty = "Specialty is required";
    if (!borough) errors.borough = "Borough is required";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const businessEmail = process.env.BUSINESS_EMAIL;
    if (!businessEmail) {
      console.error("BUSINESS_EMAIL not set");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Build attachments from uploaded files
    const attachments: Array<{ filename: string; content: Buffer }> = [];

    if (resume && resume.size > 0) {
      const buffer = Buffer.from(await resume.arrayBuffer());
      attachments.push({ filename: resume.name, content: buffer });
    }

    if (video && video.size > 0) {
      const buffer = Buffer.from(await video.arrayBuffer());
      attachments.push({ filename: video.name, content: buffer });
    }

    // Send notification to business
    await getResend().emails.send({
      from: "NYC Mobile Salon <notifications@thenycmobilesalon.com>",
      replyTo: "hey@thenycmobilesalon.com",
      to: businessEmail,
      subject: `New Application: ${name} — ${specialty}`,
      html: `
        <h2>New Job Application — NYC Mobile Salon</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px">
          <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${name}</td></tr>
          <tr style="background:#f5f3ff"><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${phone}</td></tr>
          <tr style="background:#f5f3ff"><td style="padding:8px;font-weight:bold">Specialty</td><td style="padding:8px">${specialty}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Borough</td><td style="padding:8px">${borough}</td></tr>
          <tr style="background:#f5f3ff"><td style="padding:8px;font-weight:bold">Instagram</td><td style="padding:8px">${instagram ? `@${instagram}` : "Not provided"}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Experience</td><td style="padding:8px">${experience || "Not specified"}</td></tr>
          <tr style="background:#f5f3ff"><td style="padding:8px;font-weight:bold">Availability</td><td style="padding:8px">${availability || "Not specified"}</td></tr>
          ${message ? `<tr><td style="padding:8px;font-weight:bold">Message</td><td style="padding:8px">${message}</td></tr>` : ""}
          <tr style="background:#f5f3ff"><td style="padding:8px;font-weight:bold">Resume</td><td style="padding:8px">${resume && resume.size > 0 ? "Attached" : "Not uploaded"}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Video Selfie</td><td style="padding:8px">${video && video.size > 0 ? "Attached" : "Not uploaded"}</td></tr>
        </table>
      `,
      attachments,
    });

    // Send confirmation to applicant
    await getResend().emails.send({
      from: "NYC Mobile Salon <notifications@thenycmobilesalon.com>",
      replyTo: "hey@thenycmobilesalon.com",
      to: email,
      subject: "Application Received — The NYC Mobile Salon",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto">
          <h2 style="color:#7C3AED">Thanks, ${name}!</h2>
          <p>We received your application for <strong>${specialty}</strong> in <strong>${borough}</strong>.</p>
          <p>Our team reviews every application personally. Most candidates hear back within <strong>48 hours</strong>.</p>
          <p style="margin-top:16px;padding:12px;background:#f5f3ff;border-radius:8px;font-size:14px">
            <strong>Pay:</strong> $49/hr via Zelle or Apple Cash, paid within 30 minutes of job completion.
          </p>
          <p style="margin-top:24px;color:#64748b;font-size:14px">— The NYC Mobile Salon Team</p>
        </div>
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
