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
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDiscordLoading, setIsDiscordLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const handleEmailRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name: email.split("@")[0] ?? email,
      });

      if (error) {
        let message = error.message ?? "Account aanmaken mislukt.";

        if (message.toLowerCase().includes("password is compromised")) {
          message =
            "Dit wachtwoord is bekend uit datalekken. Kies een sterker, uniek wachtwoord.";
        }

        if (message.toLowerCase().includes("already exists")) {
          message =
            "Er bestaat al een account met dit e-mailadres. Als je eerder Google, Discord of GitHub gebruikte, meld je dan aan met die provider.";
        }

        setError(message);
        toast.error(message);
        return;
      }

      toast.success("Account succesvol aangemaakt");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      let message =
        err instanceof Error ? err.message : "Account aanmaken mislukt.";

      if (message.toLowerCase().includes("password is compromised")) {
        message =
          "Dit wachtwoord is bekend uit datalekken. Kies een sterker, uniek wachtwoord.";
      }

      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setIsGoogleLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        errorCallbackURL: "/login",
      });
    } catch (err) {
      console.error(err);
      toast.error("Aanmelden met Google mislukt");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGithub = async () => {
    try {
      setIsGithubLoading(true);
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
        errorCallbackURL: "/login",
      });
    } catch (err) {
      console.error(err);
      toast.error("Aanmelden met GitHub mislukt");
    } finally {
      setIsGithubLoading(false);
    }
  };

  const handleDiscord = async () => {
    try {
      setIsDiscordLoading(true);
      await authClient.signIn.social({
        provider: "discord",
        callbackURL: "/dashboard",
        errorCallbackURL: "/login",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsDiscordLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-xs space-y-6">
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            {/* UPDATED: Height and Width set to 32 to match Login Page */}
            <Image alt="ITLearn-logo" height={32} src="/Logo.png" width={32} />
            <p className="font-medium text-foreground text-lg dark:text-foreground">
              ITLearn
            </p>
          </div>
          <h1 className="font-semibold text-3xl">Maak je account aan</h1>
          <p className="text-muted-foreground">
            Coderen eenvoudig gemaakt door studenten voor studenten.
          </p>
        </div>

        <div className="space-y-3">
          {/* UPDATED: Added wrapper divs to match Login Page structure */}
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
                  <span className="font-medium text-sm">Verbinden…</span>
                </>
              ) : (
                <>
                  <Image
                    alt="Discord-logo"
                    className="shrink-0"
                    height={18}
                    src="/company-logos/discord.svg"
                    width={18}
                  />
                  <span className="font-medium text-sm">
                    Doorgaan met Discord
                  </span>
                </>
              )}
            </Button>
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
                  <span className="font-medium text-sm">Verbinden…</span>
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
                    Doorgaan met GitHub
                  </span>
                </>
              )}
            </Button>
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
                  <span className="font-medium text-sm">Verbinden…</span>
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
                    Doorgaan met Google
                  </span>
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-sm">
              OF REGISTREER MET E-MAIL
            </span>
            <Separator className="flex-1" />
          </div>

          <form className="space-y-6" onSubmit={handleEmailRegister}>
            <div>
              {/* UPDATED: Removed extra classes to match Login Page default styling */}
              <Label htmlFor="email-register">E-mail</Label>
              <div className="relative mt-2.5">
                <Input
                  autoComplete="email"
                  className="peer ps-9"
                  id="email-register"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jij@voorbeeld.com"
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
              {/* UPDATED: Removed extra classes to match Login Page default styling */}
              <Label htmlFor="password-register">Wachtwoord</Label>
              <div className="relative mt-2.5">
                <Input
                  autoComplete="new-password"
                  className="ps-9 pe-9"
                  id="password-register"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Voer je wachtwoord in"
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
                  aria-controls="password-register"
                  aria-label={
                    isVisible ? "Wachtwoord verbergen" : "Wachtwoord tonen"
                  }
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
                  <span className="ml-2">Account aanmaken…</span>
                </>
              ) : (
                <>
                  <span>Account aanmaken</span>
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
              Heb je al een account?{" "}
              <Link
                className="font-medium text-primary hover:underline"
                href="/login"
              >
                Aanmelden
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
