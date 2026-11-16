import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { site } from "@/content/home";

/**
 * POST /api/note — the hero card's backend.
 * With RESEND_API_KEY set, the note is emailed to NOTE_TO (default: the site email) via Resend,
 * with the sender's address as reply-to. Without it, notes are appended to NOTES_FILE
 * (default: data/notes.jsonl next to the server), one JSON object per line.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PER_HOUR = 10;
const recent = new Map<string, number[]>();

function tooMany(ip: string): boolean {
  const now = Date.now();
  const stamps = (recent.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  stamps.push(now);
  recent.set(ip, stamps);
  return stamps.length > MAX_PER_HOUR;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (tooMany(ip)) return NextResponse.json({ error: "Too many notes from here. Try again in an hour." }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const page = typeof body.page === "string" ? body.page.slice(0, 200) : "/";
  if (!message || message.length > 4000) return NextResponse.json({ error: "Write a few words first." }, { status: 400 });
  if (!EMAIL.test(email) || email.length > 200) return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });

  const note = { at: new Date().toISOString(), message, email, page };
  const key = process.env.RESEND_API_KEY;
  if (key) {
    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTE_FROM ?? "Sheng Yan site <onboarding@resend.dev>",
        to: [process.env.NOTE_TO ?? site.email],
        reply_to: email,
        subject: `Note from ${email}`,
        text: `${message}\n\nFrom: ${email}\nPage: ${page}\nAt: ${note.at}`,
      }),
    });
    if (!sent.ok) {
      console.error("note: email delivery failed", sent.status, await sent.text());
      return NextResponse.json({ error: "Couldn't send right now." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, via: "email" });
  }

  const file = process.env.NOTES_FILE ?? path.join(process.cwd(), "data", "notes.jsonl");
  await mkdir(path.dirname(file), { recursive: true });
  await appendFile(file, `${JSON.stringify(note)}\n`);
  return NextResponse.json({ ok: true, via: "file" });
}
