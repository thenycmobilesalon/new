import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import { validateLeadForm, type LeadFormData } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const data: LeadFormData = await request.json();
    const errors = validateLeadForm(data);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const businessEmail = process.env.BUSINESS_EMAIL;
    if (!businessEmail) {
      console.error("BUSINESS_EMAIL not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Send notification to business
    await getResend().emails.send({
      from: "NYC Mobile Salon <notifications@thenycmobilesalon.com>",
      replyTo: "hey@thenycmobilesalon.com",
      to: businessEmail,
      subject: `New Lead: ${data.name} — ${data.service}`,
      html: `
        <h2>New Lead from NYC Mobile Salon</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px">
          <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${data.name}</td></tr>
          <tr style="background:#f0f9ff"><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${data.email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${data.phone}</td></tr>
          <tr style="background:#f0f9ff"><td style="padding:8px;font-weight:bold">Service</td><td style="padding:8px">${data.service}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Borough</td><td style="padding:8px">${data.borough}</td></tr>
          <tr style="background:#f0f9ff"><td style="padding:8px;font-weight:bold">Preferred Date</td><td style="padding:8px">${data.date}</td></tr>
          ${data.message ? `<tr><td style="padding:8px;font-weight:bold">Message</td><td style="padding:8px">${data.message}</td></tr>` : ""}
        </table>
      `,
    });

    // Send confirmation to lead
    await getResend().emails.send({
      from: "NYC Mobile Salon <notifications@thenycmobilesalon.com>",
      replyTo: "hey@thenycmobilesalon.com",
      to: data.email,
      subject: "We got your request! — NYC Mobile Salon",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto">
          <h2 style="color:#0369a1">Thanks, ${data.name}!</h2>
          <p>We received your request for <strong>${data.service}</strong> in <strong>${data.borough}</strong>.</p>
          <p>Our team will reach out within 24 hours to confirm your appointment for <strong>${data.date}</strong>.</p>
          <p style="margin-top:24px;color:#64748b;font-size:14px">— The NYC Mobile Salon Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
