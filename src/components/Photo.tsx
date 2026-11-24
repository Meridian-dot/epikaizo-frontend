import Image from "next/image";
import { BasketMotif } from "@/components/Patterns";
import type { Photo as PhotoType } from "@/lib/types";

// Shows a photo the owner uploaded in the dashboard, or a patterned
// placeholder until there is one.
export function Photo({
  photo,
  label,
  className = "",
  sizes = "(min-width: 1024px) 33vw, 100vw",
}: {
  photo?: PhotoType | null;
  label: string;
  className?: string;
  sizes?: string;
}) {
  if (photo) {
    return (
      <div className={`relative overflow-hidden bg-sand-deep ${className}`}>
        <Image
          src={photo.url}
          alt={photo.alt}
          fill
          sizes={sizes}
          unoptimized
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={`Photo coming soon: ${label}`}
      className={`relative flex items-end overflow-hidden bg-sand-deep ${className}`}
    >
      <BasketMotif
        className="absolute top-1/2 left-1/2 size-[140%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.16]"
        colour="#8a6c1c"
      />
      <span className="relative m-3 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-brown">
        Photo coming soon · {label}
      </span>
    </div>
  );
}
