import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <main className="max-w-md text-center">
        <p className="font-medium text-muted-foreground text-sm">404</p>
        <h1 className="mt-2 font-semibold text-3xl tracking-tight sm:text-4xl">
          Pagina niet gevonden
        </h1>
        <p className="mt-3 text-muted-foreground text-sm">
          De pagina die je zoekt bestaat niet of is verplaatst.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground text-sm shadow-sm transition hover:brightness-110"
            href="/"
          >
            Ga terug naar de startpagina
          </Link>
        </div>
      </main>
    </div>
  );
}
