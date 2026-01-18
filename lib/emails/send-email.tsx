import { render } from "@react-email/render";
import { ResetPasswordEmailTemplate } from "@/lib/auth/emails/reset-password-email";
import { VerificationEmailTemplate } from "@/lib/auth/emails/verification-email";
import { defaultFromAddress, resend } from "@/lib/emails/resend";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

interface EmailLinkOptions {
  to: string;
  url: string;
}

export const sendTransactionalEmail = async ({
  to,
  subject,
  html,
  text,
}: SendEmailOptions) => {
  try {
    console.log("[Email] Attempting to send email:", {
      to,
      subject,
      from: defaultFromAddress,
    });

    const result = await resend.emails.send({
      from: defaultFromAddress,
      to,
      subject,
      html,
      text,
    });

    if (result.error) {
      console.error("[Email] Resend API error:", result.error);
      throw new Error(`Failed to send email: ${result.error.message}`);
    }

    console.log("[Email] Email sent successfully:", result.data?.id);
    return result;
  } catch (error) {
    console.error("[Email] Failed to send email:", error);
    console.error("[Email] Error details:", {
      to,
      subject,
      from: defaultFromAddress,
      apiKey: process.env.RESEND_API_KEY ? "SET" : "MISSING",
    });
    throw error;
  }
};

export const sendVerificationEmail = async ({ to, url }: EmailLinkOptions) => {
  try {
    console.log("[Email] Rendering verification email for:", to);

    const html = await render(
      <VerificationEmailTemplate url={url} userEmail={to} />
    );
    const text = await render(
      <VerificationEmailTemplate url={url} userEmail={to} />,
      {
        plainText: true,
      }
    );

    await sendTransactionalEmail({
      to,
      subject: "Verify your ITLearn email",
      html,
      text,
    });

    console.log("[Email] Verification email sent successfully to:", to);
  } catch (error) {
    console.error("[Email] Failed to send verification email:", error);
    throw error;
  }
};

export const sendResetPasswordEmail = async ({ to, url }: EmailLinkOptions) => {
  try {
    console.log("[Email] Rendering reset password email for:", to);

    const html = await render(
      <ResetPasswordEmailTemplate url={url} userEmail={to} />
    );
    const text = await render(
      <ResetPasswordEmailTemplate url={url} userEmail={to} />,
      {
        plainText: true,
      }
    );

    await sendTransactionalEmail({
      to,
      subject: "Reset your ITLearn password",
      html,
      text,
    });

    console.log("[Email] Reset password email sent successfully to:", to);
  } catch (error) {
    console.error("[Email] Failed to send reset password email:", error);
    throw error;
  }
};
