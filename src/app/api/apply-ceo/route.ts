import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import { supabaseAdmin } from "@/lib/supabase";

function escape(input: string | null | undefined): string {
  if (!input) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name = "",
      email = "",
      phone = "",
      linkedinUrl = "",
      location = "",
      currentRole = "",
      currentCompany = "",
      yearsExperience = "",
      marketplaceBackground = "",
      otherPlatforms = "",
      plExperience = "",
      teamSize = "",
      biggestScale = "",
      whySweatEquity = "",
      plan306090 = "",
      anythingElse = "",
      videoUrl = null,
      resumeUrl = null,
      website = "",
    } = body;

    if (typeof website === "string" && website.trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!email.trim()) errors.email = "Email is required";
    if (!phone.trim()) errors.phone = "Phone is required";
    if (!linkedinUrl.trim()) errors.linkedinUrl = "LinkedIn is required";
    if (!location) errors.location = "Location is required";
    if (!yearsExperience) errors.yearsExperience = "Years of experience required";
    if (!marketplaceBackground) errors.marketplaceBackground = "Marketplace background required";
    if (!plExperience) errors.plExperience = "P&L experience required";
    if (!teamSize) errors.teamSize = "Team size required";
    if (!biggestScale.trim()) errors.biggestScale = "Biggest scale required";
    if (!whySweatEquity.trim()) errors.whySweatEquity = "Sweat equity rationale required";
    if (!plan306090.trim()) errors.plan306090 = "30/60/90 plan required";
    if (!videoUrl) errors.videoUrl = "Video intro required";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recent } = await supabaseAdmin
      .from("ceo_applications")
      .select("id")
      .eq("email", trimmedEmail)
      .gte("created_at", oneHourAgo)
      .limit(1);

    if (recent && recent.length > 0) {
      return NextResponse.json({ success: true });
    }

    const { error: dbError } = await supabaseAdmin
      .from("ceo_applications")
      .insert({
        name: name.trim(),
        email: trimmedEmail,
        phone: phone.trim(),
        linkedin_url: linkedinUrl.trim(),
        location,
        current_title: currentRole || null,
        current_company: currentCompany || null,
        years_experience: yearsExperience,
        marketplace_background: marketplaceBackground,
        other_platforms: otherPlatforms || null,
        pl_experience: plExperience,
        team_size: teamSize,
        biggest_scale: biggestScale.trim(),
        why_sweat_equity: whySweatEquity.trim(),
        plan_30_60_90: plan306090.trim(),
        anything_else: anythingElse || null,
        video_url: videoUrl,
        resume_url: resumeUrl || null,
      });

    if (dbError) {
      console.error("CEO application insert error:", dbError);
      return NextResponse.json(
        { error: "We couldn't save your application. Please try again." },
        { status: 500 }
      );
    }

    const businessEmail = process.env.BUSINESS_EMAIL;
    if (!businessEmail) {
      console.error("BUSINESS_EMAIL not set — CEO application saved without notification");
      return NextResponse.json({ success: true });
    }

    try {
      await getResend().emails.send({
        from: "NYC Mobile Salon <notifications@thenycmobilesalon.com>",
        replyTo: trimmedEmail,
        to: businessEmail,
        subject: `Founding CEO Application: ${name.trim()}`,
        html: `
          <h2>Founding CEO / Head of Operations — New Application</h2>
          <table style="border-collapse:collapse;width:100%;max-width:600px;font-family:Arial,sans-serif">
            <tr><td style="padding:8px;font-weight:bold;width:180px">Name</td><td style="padding:8px">${escape(name.trim())}</td></tr>
            <tr style="background:#f5f3ff"><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${escape(trimmedEmail)}">${escape(trimmedEmail)}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px"><a href="tel:${escape(phone.trim())}">${escape(phone.trim())}</a></td></tr>
            <tr style="background:#f5f3ff"><td style="padding:8px;font-weight:bold">LinkedIn</td><td style="padding:8px"><a href="${escape(linkedinUrl.trim())}" target="_blank" rel="noreferrer">${escape(linkedinUrl.trim())}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold">Location</td><td style="padding:8px">${escape(location)}</td></tr>
            <tr style="background:#f5f3ff"><td style="padding:8px;font-weight:bold">Current Role</td><td style="padding:8px">${escape(currentRole) || "—"}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Current Company</td><td style="padding:8px">${escape(currentCompany) || "—"}</td></tr>
            <tr style="background:#f5f3ff"><td style="padding:8px;font-weight:bold">Years in Marketplace</td><td style="padding:8px">${escape(yearsExperience)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Primary Platform</td><td style="padding:8px">${escape(marketplaceBackground)}</td></tr>
            <tr style="background:#f5f3ff"><td style="padding:8px;font-weight:bold">Other Platforms</td><td style="padding:8px">${escape(otherPlatforms) || "—"}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">P&amp;L Experience</td><td style="padding:8px">${escape(plExperience)}</td></tr>
            <tr style="background:#f5f3ff"><td style="padding:8px;font-weight:bold">Largest Team Managed</td><td style="padding:8px">${escape(teamSize)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Video Intro</td><td style="padding:8px">${videoUrl ? `<a href="${escape(videoUrl)}" target="_blank" rel="noreferrer">Watch Video</a>` : "Not uploaded"}</td></tr>
            <tr style="background:#f5f3ff"><td style="padding:8px;font-weight:bold">Resume</td><td style="padding:8px">${resumeUrl ? `<a href="${escape(resumeUrl)}" target="_blank" rel="noreferrer">Download Resume</a>` : "Not uploaded"}</td></tr>
          </table>

          <h3 style="margin-top:24px;font-family:Arial,sans-serif">Biggest Platform Scaled</h3>
          <div style="padding:12px;background:#faf7ff;border-left:3px solid #7c3aed;white-space:pre-wrap;font-family:Arial,sans-serif;font-size:14px">${escape(biggestScale.trim())}</div>

          <h3 style="margin-top:24px;font-family:Arial,sans-serif">Why Sweat Equity Works For Them</h3>
          <div style="padding:12px;background:#faf7ff;border-left:3px solid #7c3aed;white-space:pre-wrap;font-family:Arial,sans-serif;font-size:14px">${escape(whySweatEquity.trim())}</div>

          <h3 style="margin-top:24px;font-family:Arial,sans-serif">30 / 60 / 90 Day Plan</h3>
          <div style="padding:12px;background:#faf7ff;border-left:3px solid #7c3aed;white-space:pre-wrap;font-family:Arial,sans-serif;font-size:14px">${escape(plan306090.trim())}</div>

          ${
            anythingElse
              ? `<h3 style="margin-top:24px;font-family:Arial,sans-serif">Anything Else</h3><div style="padding:12px;background:#faf7ff;border-left:3px solid #7c3aed;white-space:pre-wrap;font-family:Arial,sans-serif;font-size:14px">${escape(anythingElse)}</div>`
              : ""
          }
        `,
      });
    } catch (emailError) {
      console.error(
        "CEO application email send failed (row already saved):",
        emailError
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CEO application submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
