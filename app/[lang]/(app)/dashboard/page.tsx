"use client";

import { useDictionary } from "@/lib/i18n/use-dictionary";

export default function DashboardPage() {
  const dict = useDictionary();

  return (
    <div className="flex h-full flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">
            {dict.app.dashboard.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            {dict.app.dashboard.welcome}
          </p>
        </div>
      </div>

      <div className="flex h-full flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed">
        <p className="text-center text-muted-foreground text-sm">
          {dict.app.dashboard.overview}
        </p>
      </div>
    </div>
  );
}
