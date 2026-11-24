import Link from "next/link";
import { Baobab } from "@/components/Landscape";
import { btn } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center">
      <Baobab className="w-64 opacity-90" />
      <h1 className="mt-6 text-5xl">This path leads nowhere</h1>
      <p className="mt-4 text-lg text-muted">
        Sorry, we couldn&apos;t find that page. Even under a baobab, people
        sometimes take a wrong turn.
      </p>
      <Link href="/" className={`${btn.brown} mt-8`}>
        Back to the home page
      </Link>
    </section>
  );
}
