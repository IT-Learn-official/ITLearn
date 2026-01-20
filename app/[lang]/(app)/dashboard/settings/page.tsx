"use client";

import { AccountForm } from "@/components/dashboard/settings/account-form";
import { useDictionary } from "@/lib/i18n/use-dictionary";

export default function SettingsPage() {
  const dict = useDictionary();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="font-semibold text-3xl">{dict.app.profile.settings}</h1>
      </div>
      <div className="mx-auto w-full max-w-6xl items-start gap-6">
        <AccountForm />
      </div>
    </div>
  );
}
