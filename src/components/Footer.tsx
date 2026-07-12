import Link from "next/link";
import { ExternalProfiles } from "./ExternalProfiles";
export function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto grid max-w-page gap-10 px-5 py-14 md:grid-cols-2 lg:px-10">
        <div>
          <p className="display max-w-xl text-5xl">
            Let’s work on something useful.
          </p>
          <Link className="button mt-7 bg-chartreuse text-ink" href="/engage">
            Start a conversation
          </Link>
        </div>
        <div className="flex flex-col items-start justify-between gap-8 text-sm md:flex-row md:items-end">
          <div>
            <p className="mb-5 font-serif text-2xl">Cheesewiththat</p>
            <ExternalProfiles compact />
          </div>
          <div className="text-right">
            <p>© {new Date().getFullYear()} Mihir</p>
            <div className="mt-3 flex gap-4">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
