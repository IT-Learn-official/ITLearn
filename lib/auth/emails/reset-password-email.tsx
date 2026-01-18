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

const palette = {
  background: "#ffffff",
  card: "#f8fafc",
  foreground: "#0f172a",
  mutedForeground: "#64748b",
  primary: "#2dd4bf",
  primaryForeground: "#0f172a",
  border: "#e2e8f0",
};

const bodyStyle = {
  backgroundColor: palette.background,
  fontFamily: "Proxima Nova, Helvetica Neue, Arial, sans-serif",
  color: palette.foreground,
  margin: 0,
  padding: 0,
};

const containerStyle = {
  maxWidth: "560px",
  margin: "32px auto",
  backgroundColor: palette.card,
  borderRadius: "12px",
  padding: "28px",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
  border: `1px solid ${palette.border}`,
};

const buttonStyle = {
  backgroundColor: palette.primary,
  borderRadius: "12px",
  color: palette.primaryForeground,
  display: "inline-block",
  fontSize: "14px",
  fontWeight: 600,
  padding: "12px 18px",
  textDecoration: "none",
};

const textStyle = {
  color: palette.foreground,
  fontSize: "14px",
  lineHeight: "1.6",
};

const mutedTextStyle = {
  color: palette.mutedForeground,
  fontSize: "13px",
  lineHeight: "1.6",
};

export const ResetPasswordEmailTemplate = ({
  url,
  userEmail,
}: ResetPasswordEmailProps): ReactElement => (
  <Html lang="en">
    <Head />
    <Preview>Reset your ITLearn password</Preview>
    <Body style={bodyStyle}>
      <Container style={containerStyle}>
        <Heading as="h1">Reset your password</Heading>
        <Text style={textStyle}>Hi {userEmail},</Text>
        <Text style={textStyle}>
          We received a request to reset your ITLearn password. This link
          expires in 10 minutes and can only be used once.
        </Text>
        <Section>
          <Button href={url} style={buttonStyle}>
            Reset password
          </Button>
        </Section>
        <Text style={mutedTextStyle}>
          If you did not request a reset, you can ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
);
