import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("pw");
  const tab = searchParams.get("tab") || "leads";
  const status = searchParams.get("status");

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const table = tab === "applications" ? "applications" : "leads";
  let query = supabaseAdmin
    .from(table)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("pw");

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, table, status } = body;

  if (!id || !table || !status) {
    return NextResponse.json({ error: "Missing id, table, or status" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from(table)
    .update({ status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
