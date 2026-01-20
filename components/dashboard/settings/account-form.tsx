"use client";

import { CheckmarkCircle01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/client";

export function AccountForm() {
  const {
    data: session,
    isPending: isSessionPending,
    refetch,
  } = authClient.useSession();
  const [isUpdating, setIsUpdating] = useState(false);
  const [name, setName] = useState(session?.user?.name || "");

  const user = session?.user;
  const isLoading = isSessionPending || !user;

  // Update name when session loads
  if (user && name === "" && user.name) {
    setName(user.name);
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await authClient.updateUser({
        name,
      });
      await refetch();
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Spinner size={32} />
      </div>
    );
  }

  const fallbackInitial = user?.name?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your public profile information.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdateProfile}>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  alt={user.name || "User"}
                  src={user.image || undefined}
                />
                <AvatarFallback className="text-xl">
                  {fallbackInitial}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-medium text-lg leading-none">
                  {user.name}
                </h3>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                value={name}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  className="pl-9"
                  disabled
                  id="email"
                  value={user.email || ""}
                />
                <HugeiconsIcon
                  className="absolute top-2.5 left-3 size-4 text-muted-foreground"
                  icon={Mail01Icon}
                />
                {user.emailVerified && (
                  <div className="absolute top-2.5 right-3 flex items-center gap-1.5 text-green-600 text-xs">
                    <HugeiconsIcon
                      className="size-3.5"
                      icon={CheckmarkCircle01Icon}
                    />
                    Verified
                  </div>
                )}
              </div>
              <p className="text-[0.8rem] text-muted-foreground">
                Email addresses are managed through your login provider.
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button disabled={isUpdating} type="submit">
              {isUpdating ? (
                <>
                  <Spinner className="mr-2" size={16} />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
