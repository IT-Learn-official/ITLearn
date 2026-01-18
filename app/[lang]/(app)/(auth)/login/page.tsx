"use client";

import {
  ArrowRight01Icon,
  LockPasswordIcon,
  Mail01Icon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/client";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import { useLocale } from "@/lib/i18n/use-locale";

export default function LoginPage() {
  const router = useRouter();
  const dict = useDictionary();
  const locale = useLocale();
  const emailInputId = useId();
  const passwordInputId = useId();
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(
    null
  );
  const [isVerificationSending, setIsVerificationSending] = useState(false);
  const [isDiscordLoading, setIsDiscordLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [lastMethod, setLastMethod] = useState<string | null>(null);

  useEffect(() => {
    setLastMethod(authClient.getLastUsedLoginMethod() ?? null);
  }, []);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const handleDiscord = async () => {
    try {
      setIsDiscordLoading(true);
      await authClient.signIn.social({
        provider: "discord",
        callbackURL: `/${locale}/dashboard`,
        errorCallbackURL: `/${locale}/login`,
      });
    } catch (err) {
      console.error(err);
      toast.error(dict.auth.errors.discordError);
    } finally {
      setIsDiscordLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setIsGoogleLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `/${locale}/dashboard`,
        errorCallbackURL: `/${locale}/login`,
      });
    } catch (err) {
      console.error(err);
      toast.error(dict.auth.errors.googleError);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGithub = async () => {
    try {
      setIsGithubLoading(true);
      await authClient.signIn.social({
        provider: "github",
        callbackURL: `/${locale}/dashboard`,
        errorCallbackURL: `/${locale}/login`,
      });
    } catch (err) {
      console.error(err);
      toast.error(dict.auth.errors.githubError);
    } finally {
      setIsGithubLoading(false);
    }
  };

  const resolveSignInError = (error: { message?: string; status?: number }) => {
    let message = error.message ?? dict.auth.errors.genericError;
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("credential account not found")) {
      message = dict.auth.errors.credentialAccountNotFound;
    }

    if (lowerMessage.includes("already exists")) {
      message = dict.auth.errors.socialAccountExists;
    }

    if (error.status === 403) {
      message = dict.auth.errors.emailNotVerified;
      setVerificationEmail(email);
    }

    return message;
  };

  const handlePasswordLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setVerificationEmail(null);
    setIsSubmitting(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        const message = resolveSignInError(error);
        setError(message);
        toast.error(message);
        return;
      }

      toast.success(dict.auth.success.signedIn);
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch (err) {
      const message = resolveSignInError(
        err instanceof Error ? { message: err.message } : {}
      );
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (!verificationEmail) {
      return;
    }

    try {
      setIsVerificationSending(true);
      const { error } = await authClient.sendVerificationEmail({
        email: verificationEmail,
        callbackURL: `/${locale}/verify`,
      });

      if (error) {
        toast.error(dict.auth.errors.emailSendFailed);
        return;
      }

      toast.success(dict.auth.success.emailSent);
    } catch (err) {
      console.error(err);
      toast.error(dict.auth.errors.emailSendFailed);
    } finally {
      setIsVerificationSending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-xs space-y-6">
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <Image alt="ITLearn-logo" height={32} src="/Logo.png" width={32} />
            <p className="font-medium text-foreground text-lg dark:text-foreground">
              ITLearn
            </p>
          </div>
          <h1 className="font-semibold text-3xl">{dict.auth.login.title}</h1>
          <p className="text-muted-foreground">{dict.auth.login.subtitle}</p>
        </div>

        {verificationEmail ? (
          <Alert>
            <AlertTitle>{dict.auth.login.verifyTitle}</AlertTitle>
            <AlertDescription>
              <p>{dict.auth.login.verifyDescription}</p>
              <Button
                className="mt-3 w-full"
                disabled={isVerificationSending}
                onClick={handleResendVerification}
                type="button"
                variant="secondary"
              >
                {isVerificationSending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner />
                    {dict.auth.login.resendingEmail}
                  </span>
                ) : (
                  dict.auth.login.resendEmail
                )}
              </Button>
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-3">
          <div className="relative">
            <Button
              className="w-full justify-center gap-1.5"
              disabled={
                isDiscordLoading ||
                isGoogleLoading ||
                isGithubLoading ||
                isSubmitting
              }
              onClick={handleDiscord}
              type="button"
              variant="outline"
            >
              {isDiscordLoading ? (
                <>
                  <Spinner />
                  <span className="font-medium text-sm">
                    {dict.auth.login.connecting}
                  </span>
                </>
              ) : (
                <>
                  <Image
                    alt="Discord-logo"
                    height={18}
                    src="/company-logos/discord.svg"
                    width={18}
                  />
                  <span>{dict.auth.login.continueWithDiscord}</span>
                </>
              )}
            </Button>

            {lastMethod === "discord" ? (
              <Badge
                className="pointer-events-none absolute -top-2 right-2 border-transparent bg-background/80 px-2 py-0 font-semibold text-[10px] text-muted-foreground uppercase tracking-wide shadow-sm"
                variant="outline"
              >
                {dict.auth.login.lastUsed}
              </Badge>
            ) : null}
          </div>

          <div className="relative">
            <Button
              className="w-full justify-center gap-1.5"
              disabled={
                isGithubLoading ||
                isGoogleLoading ||
                isDiscordLoading ||
                isSubmitting
              }
              onClick={handleGithub}
              type="button"
              variant="outline"
            >
              {isGithubLoading ? (
                <>
                  <Spinner />
                  <span className="font-medium text-sm">
                    {dict.auth.login.connecting}
                  </span>
                </>
              ) : (
                <>
                  <Image
                    alt="GitHub-logo"
                    className="shrink-0"
                    height={18}
                    src="/company-logos/github.svg"
                    width={18}
                  />
                  <span className="font-medium text-sm">
                    {dict.auth.login.continueWithGithub}
                  </span>
                </>
              )}
            </Button>

            {lastMethod === "github" ? (
              <Badge
                className="pointer-events-none absolute -top-2 right-2 border-transparent bg-background/80 px-2 py-0 font-semibold text-[10px] text-muted-foreground uppercase tracking-wide shadow-sm"
                variant="outline"
              >
                {dict.auth.login.lastUsed}
              </Badge>
            ) : null}
          </div>

          <div className="relative">
            <Button
              className="w-full justify-center gap-1.5"
              disabled={
                isGoogleLoading ||
                isDiscordLoading ||
                isGithubLoading ||
                isSubmitting
              }
              onClick={handleGoogle}
              type="button"
              variant="outline"
            >
              {isGoogleLoading ? (
                <>
                  <Spinner />
                  <span className="font-medium text-sm">
                    {dict.auth.login.connecting}
                  </span>
                </>
              ) : (
                <>
                  <Image
                    alt="Google-logo"
                    className="shrink-0"
                    height={18}
                    src="/company-logos/google.png"
                    width={18}
                  />
                  <span className="font-medium text-sm">
                    {dict.auth.login.continueWithGoogle}
                  </span>
                </>
              )}
            </Button>

            {lastMethod === "google" ? (
              <Badge
                className="pointer-events-none absolute -top-2 right-2 border-transparent bg-background/80 px-2 py-0 font-semibold text-[10px] text-muted-foreground uppercase tracking-wide shadow-sm"
                variant="outline"
              >
                {dict.auth.login.lastUsed}
              </Badge>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-sm">
              {dict.auth.login.continueWith}
            </span>
            <Separator className="flex-1" />
          </div>

          <form className="space-y-6" onSubmit={handlePasswordLogin}>
            <div>
              <Label htmlFor={emailInputId}>{dict.auth.login.email}</Label>
              <div className="relative mt-2.5">
                <Input
                  className="peer ps-9"
                  id={emailInputId}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={dict.auth.login.emailPlaceholder}
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

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor={passwordInputId}>
                  {dict.auth.login.password}
                </Label>
                <Link
                  className="text-primary text-sm hover:underline"
                  href={`/${locale}/forgot-password`}
                >
                  {dict.auth.login.forgotPassword}
                </Link>
              </div>
              <div className="relative mt-2.5">
                <Input
                  autoComplete="current-password"
                  className="ps-9 pe-9"
                  id={passwordInputId}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={dict.auth.login.passwordPlaceholder}
                  required
                  type={isVisible ? "text" : "password"}
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
                <Button
                  aria-controls={passwordInputId}
                  aria-label={isVisible ? "Hide password" : "Show password"}
                  aria-pressed={isVisible}
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  onClick={toggleVisibility}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <HugeiconsIcon
                    aria-hidden={true}
                    color="currentColor"
                    icon={isVisible ? ViewOffIcon : ViewIcon}
                    size={16}
                    strokeWidth={1.5}
                  />
                </Button>
              </div>
            </div>

            <Button
              className="w-full gap-1"
              disabled={isSubmitting || isDiscordLoading}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  <span className="ml-2">{dict.auth.login.signingIn}</span>
                </>
              ) : (
                <>
                  <span>{dict.auth.login.submit}</span>
                  <HugeiconsIcon
                    aria-hidden={true}
                    color="currentColor"
                    icon={ArrowRight01Icon}
                    size={16}
                    strokeWidth={1.5}
                  />
                </>
              )}
            </Button>

            <div className="text-center text-sm">
              {dict.auth.login.noAccount}{" "}
              <Link
                className="font-medium text-primary hover:underline"
                href={`/${locale}/register`}
              >
                {dict.auth.login.createAccount}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
