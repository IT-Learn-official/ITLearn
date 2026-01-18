"use client";

import { LockPasswordIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/client";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import { useLocale } from "@/lib/i18n/use-locale";

export default function ResetPasswordPage() {
  const dict = useDictionary();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isTokenInvalid, setIsTokenInvalid] = useState(!token);
  const shouldShowResetForm = !(isComplete || isTokenInvalid);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setIsTokenInvalid(true);
      toast.error(dict.auth.reset.invalidToken);
      return;
    }

    if (password !== confirmPassword) {
      toast.error(dict.validation.passwordMatch);
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        setIsTokenInvalid(true);
        toast.error(dict.auth.reset.invalidToken);
        return;
      }

      setIsComplete(true);
      setIsTokenInvalid(false);
      toast.success(dict.auth.success.passwordChanged);
    } catch (err) {
      console.error(err);
      setIsTokenInvalid(true);
      toast.error(dict.auth.reset.invalidToken);
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
              icon={LockPasswordIcon}
              size={24}
              strokeWidth={1.5}
            />
          </div>
          <h1 className="text-balance font-semibold text-2xl">
            {dict.auth.reset.title}
          </h1>
          <p className="text-muted-foreground">{dict.auth.reset.subtitle}</p>
        </div>

        {isComplete ? (
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-muted-foreground text-sm">
            {dict.auth.success.passwordChanged}
          </div>
        ) : null}

        {isTokenInvalid ? (
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-muted-foreground text-sm">
            {dict.auth.reset.invalidToken}
          </div>
        ) : null}

        {shouldShowResetForm ? (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="reset-password">
                {dict.auth.reset.passwordLabel}
              </Label>
              <div className="relative mt-2.5">
                <Input
                  autoComplete="new-password"
                  className="peer ps-9"
                  id="reset-password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={dict.auth.reset.passwordPlaceholder}
                  required
                  type="password"
                  value={password}
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                  <HugeiconsIcon
                    aria-hidden={true}
                    color="currentColor"
                    icon={LockPasswordIcon}
                    size={16}
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="reset-confirm">
                {dict.auth.reset.confirmPasswordLabel}
              </Label>
              <div className="relative mt-2.5">
                <Input
                  autoComplete="new-password"
                  className="peer ps-9"
                  id="reset-confirm"
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder={dict.auth.reset.confirmPasswordPlaceholder}
                  required
                  type="password"
                  value={confirmPassword}
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                  <HugeiconsIcon
                    aria-hidden={true}
                    color="currentColor"
                    icon={LockPasswordIcon}
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
                  {dict.auth.reset.submitting}
                </span>
              ) : (
                dict.auth.reset.submit
              )}
            </Button>
          </form>
        ) : null}

        <div className="flex items-center justify-between text-muted-foreground text-sm">
          <span>{dict.auth.reset.requestNewLink}</span>
          <Link
            className="font-medium text-primary hover:underline"
            href={`/${locale}/forgot-password`}
          >
            {dict.auth.forgot.submit}
          </Link>
        </div>
      </div>
    </div>
  );
}
