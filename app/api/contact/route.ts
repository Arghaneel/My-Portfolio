import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Zod Validation
    const validationResult = contactFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;
    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || "arghaneel@gmail.com";

    // 2. Send email via Resend API (using native fetch to avoid dependencies bloat)
    if (resendApiKey) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: toEmail,
          subject: `[Portfolio Contact] ${subject}`,
          html: `
            <h3>New Message from Portfolio Contact Form</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error("Resend API failed:", errorText);
        throw new Error("Resend email delivery failed");
      }

      return NextResponse.json({ success: true, message: "Email sent successfully via Resend!" });
    } else {
      // Local development simulation fallback
      console.log("--- Contact Form Submission (Simulated) ---");
      console.log(`From: ${name} <${email}>`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      console.log("-------------------------------------------");
      
      return NextResponse.json({
        success: true,
        simulated: true,
        message: "Message received! (Simulation mode: RESEND_API_KEY is not set)",
      });
    }
  } catch (error) {
    console.error("Contact API Route error:", error);
    return NextResponse.json(
      { error: "Internal server error. Failed to process message." },
      { status: 500 }
    );
  }
}
