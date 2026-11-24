import Image from "next/image";
import Link from "next/link";
import { GreetingBar } from "@/components/GreetingBar";
import { MainNav } from "@/components/MainNav";
import { WovenBand } from "@/components/Patterns";
import { site } from "@/content/site";

export function SiteHeader({ phone }: { phone: string }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <GreetingBar phone={phone} />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="shrink-0" aria-label={`${site.name}, home`}>
          <Image
            src="/logo.png"
            alt={site.name}
            width={855}
            height={292}
            loading="eager"
            className="h-12 w-auto sm:h-14"
          />
        </Link>
        <MainNav />
      </div>
      <WovenBand className="opacity-70" />
    </header>
  );
}
