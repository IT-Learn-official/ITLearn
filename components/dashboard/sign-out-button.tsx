"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/client";

export function SignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await authClient.signOut();
      toast.success("Signed out");
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to sign out");
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
          <span className="ml-1">Signing out…</span>
        </>
      ) : (
        <span>Sign out</span>
      )}
    </Button>
  );
}
