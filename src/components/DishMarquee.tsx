import { signatureDishes } from "@/content/site";

// Dish names drifting past like a market chalkboard. Pauses on hover and
// stands still with reduced motion. The list is read once by screen readers.
export function DishMarquee({ dark = false }: { dark?: boolean }) {
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-8 pr-8"
    >
      {signatureDishes.map((dish) => (
        <li key={dish} className="flex items-center gap-8 whitespace-nowrap">
          <span className="font-display text-3xl sm:text-4xl">{dish}</span>
          <span aria-hidden="true" className="text-gold">
            ◆
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div
      className={`group overflow-hidden py-6 ${dark ? "bg-brown-deep text-gold-light" : "bg-sand text-brown"}`}
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
