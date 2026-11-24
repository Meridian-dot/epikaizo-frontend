// Silhouettes of the north: the Ombalantu baobab, makalani palms and the
// conical roofs of a homestead on the flat Omusati horizon.
// Drawn in brand brown so they sit quietly with the logo.

const INK = "#2a0e07";

export function Baobab({ className = "" }: { className?: string }) {
  // Thick limbs as round-capped strokes give the baobab its "upside-down
  // roots" look without any image.
  const limbs: [string, number][] = [
    ["M196 150 C186 118 170 100 140 86", 16],
    ["M204 148 C206 112 214 92 236 72", 15],
    ["M190 160 C168 146 140 140 104 134", 13],
    ["M212 156 C236 140 262 136 296 138", 13],
    ["M200 140 C198 110 196 88 194 60", 12],
    ["M140 86 C128 72 116 66 98 62", 8],
    ["M140 86 C142 70 140 58 132 44", 7],
    ["M236 72 C250 58 262 52 280 50", 8],
    ["M236 72 C236 58 240 46 250 34", 7],
    ["M104 134 C90 124 78 120 62 120", 7],
    ["M296 138 C310 128 322 124 340 126", 7],
    ["M194 60 C186 48 178 42 168 38", 6],
    ["M194 60 C202 46 210 40 220 36", 6],
  ];
  const twigs: string[] = [
    "M98 62 l-10 -8 M98 62 l-6 -12 M132 44 l-8 -9 M132 44 l2 -12",
    "M280 50 l10 -6 M280 50 l8 -12 M250 34 l4 -11 M250 34 l10 -6",
    "M62 120 l-12 -4 M62 120 l-8 -10 M340 126 l12 -4 M340 126 l8 -10",
    "M168 38 l-6 -10 M168 38 l-12 -2 M220 36 l6 -10 M220 36 l12 -2",
  ];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 320"
      className={className}
      fill="none"
    >
      <g stroke={INK} strokeLinecap="round">
        {limbs.map(([d, w]) => (
          <path key={d} d={d} strokeWidth={w} />
        ))}
        <path d={twigs.join(" ")} strokeWidth="3" />
      </g>
      <path
        d="M150 320 C156 268 150 222 160 186 C166 166 176 150 186 140 L216 140 C228 152 238 168 242 188 C252 224 246 270 254 320 Z"
        fill={INK}
      />
    </svg>
  );
}

export function Palm({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 240" className={className}>
      <path
        d="M58 240 C60 190 64 140 62 70"
        stroke={INK}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <g
        stroke={INK}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        className="origin-[62px_70px] animate-sway"
      >
        <path d="M62 70 C44 56 26 56 8 66" />
        <path d="M62 70 C48 48 32 40 14 40" />
        <path d="M62 70 C58 44 50 28 36 16" />
        <path d="M62 70 C66 44 74 28 88 18" />
        <path d="M62 70 C78 50 94 42 112 44" />
        <path d="M62 70 C80 60 98 60 116 70" />
        <path d="M62 70 C54 64 40 70 30 84" />
        <path d="M62 70 C72 64 86 70 94 84" />
      </g>
      <circle cx="62" cy="72" r="6" fill={INK} />
    </svg>
  );
}

export function Homestead({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 160 60" className={className}>
      <g fill={INK}>
        <path d="M10 60 L10 40 L4 40 L22 18 L40 40 L34 40 L34 60 Z" />
        <path d="M46 60 L46 36 L38 36 L62 8 L86 36 L78 36 L78 60 Z" />
        <path d="M96 60 L96 42 L90 42 L108 22 L126 42 L120 42 L120 60 Z" />
        {/* Palisade of poles around the homestead. */}
        {Array.from({ length: 30 }, (_, i) => (
          <rect
            key={i}
            x={i * 5.4}
            y={i % 2 ? 46 : 44}
            width="2.4"
            height="16"
          />
        ))}
      </g>
    </svg>
  );
}

/** The flat horizon with a gentle rise, filling the bottom of a scene. */
export function Horizon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={className}
    >
      <path
        d="M0 60 C240 40 420 70 720 52 C1000 36 1200 64 1440 48 L1440 120 L0 120 Z"
        fill={INK}
      />
    </svg>
  );
}
