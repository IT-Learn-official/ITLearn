"use client";

import {
  Mail01Icon,
  Refresh01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/client";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import { useLocale } from "@/lib/i18n/use-locale";

export default function VerifyEmailPage() {
  const dict = useDictionary();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const hasInvalidToken = searchParams.get("error") === "invalid_token";
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const email = useMemo(() => emailParam ?? "", [emailParam]);

  const handleResend = async () => {
    if (!email) {
      toast.error(dict.auth.errors.invalidEmail);
      return;
    }

    try {
      setIsSending(true);
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: `/${locale}/verify`,
      });

      if (error) {
        toast.error(dict.auth.errors.emailSendFailed);
        return;
      }

      setIsSent(true);
      toast.success(dict.auth.success.emailSent);
    } catch (err) {
      console.error(err);
      toast.error(dict.auth.errors.emailSendFailed);
    } finally {
      setIsSending(false);
    }
  };

  let subtitleText = dict.auth.verify.subtitle;

  if (hasInvalidToken) {
    subtitleText = dict.auth.verify.invalidToken;
  } else if (email) {
    subtitleText = dict.auth.verify.subtitleWithEmail.replace("{email}", email);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HugeiconsIcon
              aria-hidden={true}
              color="currentColor"
              icon={Tick02Icon}
              size={24}
              strokeWidth={1.5}
            />
          </div>
          <h1 className="text-balance font-semibold text-2xl">
            {dict.auth.verify.title}
          </h1>
          <p className="text-muted-foreground">{subtitleText}</p>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4 text-muted-foreground text-sm">
          <div className="flex items-start gap-3">
            <HugeiconsIcon
              aria-hidden={true}
              color="currentColor"
              icon={Mail01Icon}
              size={18}
              strokeWidth={1.5}
            />
            <div>
              <p className="font-medium text-foreground">
                {dict.auth.verify.tipTitle}
              </p>
              <p>{dict.auth.verify.tipBody}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full"
            disabled={isSending}
            onClick={handleResend}
            type="button"
          >
            {isSending ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                {dict.auth.verify.resending}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <HugeiconsIcon
                  aria-hidden={true}
                  color="currentColor"
                  icon={Refresh01Icon}
                  size={16}
                  strokeWidth={1.5}
                />
                {isSent ? dict.auth.verify.resent : dict.auth.verify.resend}
              </span>
            )}
          </Button>

          <div className="flex items-center justify-between text-muted-foreground text-sm">
            <span>{dict.auth.verify.backToLogin}</span>
            <Link
              className="font-medium text-primary hover:underline"
              href={`/${locale}/login`}
            >
              {dict.auth.verify.loginLink}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
