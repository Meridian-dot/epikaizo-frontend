// Decorative patterns inspired by northern Namibian basketry: woven zigzag
// bands and the concentric rings of a basket seen from above. Purely
// decorative, so every SVG is hidden from screen readers.

type BandProps = {
  className?: string;
  tone?: "gold" | "brown" | "light";
};

const toneColour = {
  gold: "#b9942c",
  brown: "#3e160c",
  light: "#e8d8a6",
} as const;

/** A thin woven band, used under the header and between sections. */
export function WovenBand({ className = "", tone = "gold" }: BandProps) {
  const c = toneColour[tone];
  const id = `woven-${tone}`;
  return (
    <svg
      aria-hidden="true"
      className={`block h-3.5 w-full ${className}`}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={id} width="28" height="14" patternUnits="userSpaceOnUse">
          <path
            d="M0 11 L7 3 L14 11 L21 3 L28 11"
            fill="none"
            stroke={c}
            strokeWidth="2"
          />
          <path d="M7 9.5 L9.5 12 L7 14 L4.5 12 Z" fill={c} opacity="0.8" />
          <path d="M21 0 L23 2 L21 4 L19 2 Z" fill={c} opacity="0.55" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** A row of beads, for small dividers. */
export function BeadRow({ className = "" }: { className?: string }) {
  const colours = ["#b9942c", "#3e160c", "#b9942c", "#e8d8a6", "#3e160c"];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 90 10"
      className={`h-2.5 w-24 ${className}`}
    >
      {Array.from({ length: 9 }, (_, i) => (
        <circle
          key={i}
          cx={5 + i * 10}
          cy="5"
          r={i % 2 === 0 ? 3.6 : 2.6}
          fill={colours[i % colours.length]}
        />
      ))}
    </svg>
  );
}

/** A basket seen from above: concentric rings with woven triangle bands. */
export function BasketMotif({
  className = "",
  colour = "#b9942c",
  style,
}: {
  className?: string;
  colour?: string;
  style?: React.CSSProperties;
}) {
  const teeth = (radius: number, count: number, size: number, flip = false) =>
    Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2;
      const b = ((i + 0.5) / count) * Math.PI * 2;
      const c = ((i + 1) / count) * Math.PI * 2;
      const r2 = flip ? radius - size : radius + size;
      const p = (ang: number, r: number) =>
        `${(100 + Math.cos(ang) * r).toFixed(2)} ${(100 + Math.sin(ang) * r).toFixed(2)}`;
      return `M${p(a, radius)} L${p(b, r2)} L${p(c, radius)} Z`;
    }).join(" ");

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      className={className}
      style={style}
    >
      <g fill="none" stroke={colour} strokeWidth="1.2">
        {[96, 88, 70, 62, 44, 36, 20].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} />
        ))}
      </g>
      <path d={teeth(70, 32, 8)} fill={colour} opacity="0.9" />
      <path d={teeth(44, 20, 8)} fill={colour} opacity="0.7" />
      <path d={teeth(96, 48, 8, true)} fill={colour} opacity="0.55" />
      <circle cx="100" cy="100" r="8" fill={colour} />
    </svg>
  );
}
