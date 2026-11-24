// Small line drawings for rooms: amenity icons and bed layouts.

const icons: Record<string, React.ReactNode> = {
  aircon: (
    <>
      <rect x="3" y="5" width="18" height="7" rx="2" />
      <path d="M7 15 c0 2 -1 3 -1 4 M12 15 v4 M17 15 c0 2 1 3 1 4" />
    </>
  ),
  tv: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 21 h8" />
    </>
  ),
  fridge: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M6 10 h12 M9 6 v2 M9 13 v3" />
    </>
  ),
  bath: (
    <>
      <path d="M4 12 h16 v3 a4 4 0 0 1 -4 4 H8 a4 4 0 0 1 -4 -4 z" />
      <path d="M6 12 V6 a2 2 0 0 1 4 0" />
    </>
  ),
  closet: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M12 3 v18 M10 11 v2 M14 11 v2" />
    </>
  ),
  kettle: (
    <>
      <path d="M6 19 h11 l-1.5 -9 h-8 z" />
      <path d="M17 12 c2.5 0 2.5 4 0 4 M9 10 V7 h5 v3" />
    </>
  ),
  balcony: (
    <>
      <path d="M3 12 h18 M5 12 v8 M9 12 v8 M15 12 v8 M19 12 v8 M3 20 h18" />
      <path d="M7 12 V5 h10 v7" />
    </>
  ),
  lounge: (
    <>
      <path d="M4 18 v-6 a2 2 0 0 1 4 0 v2 h8 v-2 a2 2 0 0 1 4 0 v6 z" />
      <path d="M7 10 V8 a2 2 0 0 1 2 -2 h6 a2 2 0 0 1 2 2 v2 M6 18 v2 M18 18 v2" />
    </>
  ),
  parking: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M10 16 V8 h3 a2.5 2.5 0 0 1 0 5 h-3" />
    </>
  ),
};

export function AmenityIcon({ icon }: { icon: string | null }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-6 shrink-0 text-gold-deep"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[icon ?? ""] ?? <circle cx="12" cy="12" r="4" />}
    </svg>
  );
}

/** Bed layout for a setup, worked out from its name. */
export function BedDiagram({ setupName }: { setupName: string }) {
  const name = setupName.toLowerCase();
  const family = name.includes("family");
  const together = name.includes("double") || name.includes("couple");
  const single = name.startsWith("single");
  const twoPillows = name.includes("couple");

  const bed = (x: number, w: number, pillows: number, key: string) => (
    <g key={key}>
      <rect
        x={x}
        y="10"
        width={w}
        height="44"
        rx="4"
        fill="#faf5ec"
        stroke="#3e160c"
        strokeWidth="2"
      />
      {Array.from({ length: pillows }, (_, i) => (
        <rect
          key={i}
          x={x + 4 + (i * (w - 8)) / pillows}
          y="14"
          width={(w - 8) / pillows - (pillows > 1 ? 3 : 0)}
          height="9"
          rx="3"
          fill="#e8d8a6"
        />
      ))}
      <rect
        x={x}
        y="30"
        width={w}
        height="24"
        rx="4"
        fill="#b9942c"
        opacity="0.35"
      />
    </g>
  );

  let beds: React.ReactNode[];
  if (twoPillows) beds = [bed(34, 32, 2, "a")];
  else if (single) beds = [bed(40, 24, 1, "a")];
  else if (together) beds = [bed(16, 48, 2, "a")];
  else beds = [bed(12, 24, 1, "a"), bed(54, 24, 1, "b")];
  if (family) beds.push(bed(84, 16, 1, "c"));

  return (
    <svg aria-hidden="true" viewBox="0 0 104 64" className="h-14 w-24">
      {beds}
    </svg>
  );
}
