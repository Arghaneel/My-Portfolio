import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate
    const validationResult = contactFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ errors: validationResult.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, subject, message } = validationResult.data;
    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || "arghaneeldas29@gmail.com";
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

    // 2. Email delivery isn't configured → say so honestly, so the visitor can email directly.
    //    (Previously this pretended to succeed and the message was lost.)
    if (!resendApiKey) {
      console.warn("[contact] RESEND_API_KEY is not set – message not delivered.");
      return NextResponse.json(
        {
          error: "The contact form isn't set up to send email yet.",
          fallback: "mailto",
        },
        { status: 503 }
      );
    }

    // 3. Send via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail,
        reply_to: email,
        subject: `[Portfolio] ${subject}`,
        text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
        html: `
          <h3>New message from your portfolio</h3>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      console.error("[contact] Resend API failed:", await emailResponse.text());
      return NextResponse.json(
        { error: "Your message couldn't be sent right now.", fallback: "mailto" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: "Thanks! Your message has been sent. I'll reply soon." });
  } catch (error) {
    console.error("[contact] route error:", error);
    return NextResponse.json(
      { error: "Something went wrong while sending your message.", fallback: "mailto" },
      { status: 500 }
    );
  }
}
