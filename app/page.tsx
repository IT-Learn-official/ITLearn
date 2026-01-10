import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-bold text-4xl">Ontdek de Wereld van Coderen</h1>
      <div className="flex gap-4">
        <Button>
          <Link href="/login">Inloggen</Link>
        </Button>
        <Button>
          <Link href="/register">Registreren</Link>
        </Button>
      </div>
    </div>
  );
}
