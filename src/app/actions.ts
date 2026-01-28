"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const projectType = formData.get("projectType") as string;
  const message = formData.get("message") as string;

  // Validation
  if (!firstName || !lastName || !email || !message) {
    return { success: false, error: "Please fill in all required fields." };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Built by Kiefer <onboarding@resend.dev>",
      to: ["info@kbuiltco.com"],
      replyTo: email,
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #8B6F47; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>

          <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p style="margin: 10px 0;"><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ""}
            <p style="margin: 10px 0;"><strong>Project Type:</strong> ${projectType}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
            <p style="line-height: 1.6; color: #555; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
            <p>This email was sent from the Built by Kiefer contact form.</p>
            <p>Reply to this email will go directly to: ${email}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: "Failed to send message. Please try again." };
    }

    return { success: true };
  } catch (error) {
    console.error("Send email error:", error);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
