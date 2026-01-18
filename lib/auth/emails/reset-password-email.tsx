import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactElement } from "react";

interface ResetPasswordEmailProps {
  url: string;
  userEmail: string;
}

// Dark mode colors (from globals.css .dark)
const colors = {
  background: "oklch(0.1902 0.0226 276.0826)", // dark blue-gray
  card: "oklch(0.2357 0.0312 275.5838)", // slightly lighter dark
  foreground: "oklch(0.9288 0.0126 255.5078)", // light gray
  mutedForeground: "oklch(0.7107 0.0351 256.7878)", // muted light
  primary: "oklch(0.5736 0.1232 247.7994)", // blue-purple
  primaryForeground: "oklch(0.1902 0.0226 276.0826)", // dark blue-gray
  border: "oklch(0.3073 0.0421 274.2574)", // dark border
};

export const ResetPasswordEmailTemplate = ({
  url,
  userEmail,
}: ResetPasswordEmailProps): ReactElement => (
  <Html lang="en">
    <Head />
    <Preview>Reset your ITLearn password</Preview>
    <Body
      style={{
        backgroundColor: colors.background,
        fontFamily: "Proxima Nova, Helvetica Neue, Arial, sans-serif",
        color: colors.foreground,
        margin: 0,
        padding: 0,
      }}
    >
      <Container
        style={{
          maxWidth: "560px",
          margin: "32px auto",
          backgroundColor: colors.card,
          borderRadius: "12px",
          padding: "28px",
          boxShadow: "0 4px 10px 0px hsl(0 0% 0% / 0.2)",
          border: `1px solid ${colors.border}`,
        }}
      >
        <Heading
          as="h1"
          style={{
            color: colors.foreground,
            fontSize: "24px",
            fontWeight: 600,
            marginBottom: "16px",
          }}
        >
          Reset your password
        </Heading>
        <Text
          style={{
            color: colors.foreground,
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        >
          Hi {userEmail},
        </Text>
        <Text
          style={{
            color: colors.foreground,
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        >
          We received a request to reset your ITLearn password. This link
          expires in 10 minutes and can only be used once.
        </Text>
        <Section style={{ marginTop: "24px", marginBottom: "24px" }}>
          <Button
            href={url}
            style={{
              backgroundColor: colors.primary,
              borderRadius: "12px",
              color: colors.primaryForeground,
              display: "inline-block",
              fontSize: "14px",
              fontWeight: 600,
              padding: "12px 18px",
              textDecoration: "none",
            }}
          >
            Reset password
          </Button>
        </Section>
        <Text
          style={{
            color: colors.mutedForeground,
            fontSize: "13px",
            lineHeight: "1.6",
          }}
        >
          If you did not request a reset, you can ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
);
