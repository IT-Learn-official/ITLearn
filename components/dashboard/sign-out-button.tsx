"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import { useLocale } from "@/lib/i18n/use-locale";

export function SignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const dict = useDictionary();
  const locale = useLocale();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await authClient.signOut();
      toast.success(dict.auth.success.signedIn);
      router.push(`/${locale}/login`);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(dict.auth.errors.genericError);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Button
      className="inline-flex items-center justify-center gap-1 text-muted-foreground text-sm hover:text-foreground"
      disabled={isSigningOut}
      onClick={handleSignOut}
      size="sm"
      variant="ghost"
    >
      {isSigningOut ? (
        <>
          <Spinner />
          <span className="ml-1">{dict.common.loading}</span>
        </>
      ) : (
        <span>{dict.app.navigation.signOut}</span>
      )}
    </Button>
  );
}
