// Shared Tailwind class names, so buttons and fields look the same everywhere.

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-bold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

export const btn = {
  gold: `${base} bg-gold text-brown-deep hover:bg-gold-light`,
  brown: `${base} bg-brown text-white hover:bg-brown-soft`,
  outlineBrown: `${base} border-2 border-brown text-brown hover:bg-brown hover:text-white`,
  outlineLight: `${base} border-2 border-white/80 text-white hover:bg-white hover:text-brown`,
  link: "font-bold text-brown underline decoration-gold decoration-2 underline-offset-4 hover:decoration-brown",
} as const;

export const field = {
  label: "block font-bold text-brown",
  hint: "mt-1 text-sm text-muted",
  input:
    "mt-2 block w-full rounded-xl border-2 border-line bg-white px-4 py-3 text-base text-ink placeholder:text-muted/70 focus:border-gold focus:outline-none",
  error: "mt-2 text-sm font-bold text-[#a3341b]",
} as const;

export const eyebrow =
  "text-sm font-bold tracking-[0.2em] text-gold-deep uppercase";
