import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name = "",
      email = "",
      phone = "",
      message = "",
    } = body;

    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email";
    if (!message.trim()) errors.message = "Message is required";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const { error: dbError } = await supabaseAdmin.from("leads").insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || "—",
      service: "Contact Form",
      borough: "General",
      preferred_date: null,
      message: message.trim(),
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
    }

    const businessEmail = process.env.BUSINESS_EMAIL;
    if (!businessEmail) {
      console.error("BUSINESS_EMAIL not set");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    await getResend().emails.send({
      from: "NYC Mobile Salon <notifications@thenycmobilesalon.com>",
      replyTo: email.trim(),
      to: businessEmail,
      subject: `Contact Form: ${name.trim()}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px">
          <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${name.trim()}</td></tr>
          <tr style="background:#f0f9ff"><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${email.trim()}">${email.trim()}</a></td></tr>
          ${phone.trim() ? `<tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px"><a href="tel:${phone.trim()}">${phone.trim()}</a></td></tr>` : ""}
          <tr style="background:#f0f9ff"><td style="padding:8px;font-weight:bold;vertical-align:top">Message</td><td style="padding:8px;white-space:pre-wrap">${message.trim()}</td></tr>
        </table>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
