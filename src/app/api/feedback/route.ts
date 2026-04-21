import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message = "", source = "unknown" } = body;

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const cleanMessage = message.trim().slice(0, 2000);
    const cleanSource = String(source).slice(0, 200);

    const { error } = await supabaseAdmin.from("notifications").insert({
      type: "feedback",
      title: `Anonymous feedback from ${cleanSource}`,
      message: cleanMessage,
      read: false,
    });

    if (error) {
      console.error("Feedback insert error:", error);
      return NextResponse.json(
        { error: "We couldn't save your feedback. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Feedback submission error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
