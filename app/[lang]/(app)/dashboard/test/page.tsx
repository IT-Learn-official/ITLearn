"use client";

import { useDictionary } from "@/lib/i18n/use-dictionary";

const TestPage = () => {
  const dict = useDictionary();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-semibold text-3xl">Test Page</h1>
      <p className="mt-4 text-muted-foreground">
        {dict.app.dashboard.overview}
      </p>
    </main>
  );
};

export default TestPage;
