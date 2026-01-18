"use client";

import { Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/client";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import { useLocale } from "@/lib/i18n/use-locale";

export default function ForgotPasswordPage() {
  const dict = useDictionary();
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      toast.error(dict.auth.errors.invalidEmail);
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `/${locale}/reset-password`,
      });

      if (error) {
        toast.error(dict.auth.errors.emailSendFailed);
        return;
      }

      setIsSent(true);
      toast.success(dict.auth.success.passwordReset);
    } catch (err) {
      console.error(err);
      toast.error(dict.auth.errors.emailSendFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HugeiconsIcon
              aria-hidden={true}
              color="currentColor"
              icon={Mail01Icon}
              size={24}
              strokeWidth={1.5}
            />
          </div>
          <h1 className="text-balance font-semibold text-2xl">
            {isSent ? dict.auth.forgot.sentTitle : dict.auth.forgot.title}
          </h1>
          <p className="text-muted-foreground">
            {isSent ? dict.auth.forgot.sentBody : dict.auth.forgot.subtitle}
          </p>
        </div>

        {isSent ? null : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="forgot-email">
                {dict.auth.forgot.emailLabel}
              </Label>
              <div className="relative mt-2.5">
                <Input
                  className="peer ps-9"
                  id="forgot-email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={dict.auth.forgot.emailPlaceholder}
                  required
                  type="email"
                  value={email}
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                  <HugeiconsIcon
                    aria-hidden={true}
                    color="currentColor"
                    icon={Mail01Icon}
                    size={16}
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>

            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner />
                  {dict.auth.forgot.submitting}
                </span>
              ) : (
                dict.auth.forgot.submit
              )}
            </Button>
          </form>
        )}

        <div className="flex items-center justify-between text-muted-foreground text-sm">
          <span>{dict.auth.forgot.backToLogin}</span>
          <Link
            className="font-medium text-primary hover:underline"
            href={`/${locale}/login`}
          >
            {dict.auth.forgot.loginLink}
          </Link>
        </div>
      </div>
    </div>
  );
}
