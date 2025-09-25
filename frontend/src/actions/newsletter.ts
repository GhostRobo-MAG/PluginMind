"use server"

import { env } from "@/env.mjs"
import { resend } from "@/config/email"
import {
  newsletterSignUpSchema,
  type NewsletterSignUpFormInput,
} from "@/validations/newsletter"

import { NewsletterWelcomeEmail } from "@/components/emails/newsletter-welcome-email"

export async function subscribeToNewsletter(
  rawInput: NewsletterSignUpFormInput
): Promise<"error" | "success"> {
  try {
    const validatedInput = newsletterSignUpSchema.safeParse(rawInput)
    if (!validatedInput.success) return "error"

    const emailSent = await resend.emails.send({
      from: env.RESEND_EMAIL_FROM,
      to: validatedInput.data.email,
      subject: "Welcome to our newsletter!",
      react: NewsletterWelcomeEmail(),
    })

    return emailSent ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error subscribing to the newsletter")
  }
}
