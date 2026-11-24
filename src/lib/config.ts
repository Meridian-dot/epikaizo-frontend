// All environment settings are read here and nowhere else
// (next.config.ts also reads API_URL for the /api rewrite).
// See .env.example for what each one means.

export const config = {
  // Server-side base URL of the Express API, no trailing slash.
  apiUrl: (process.env.API_URL ?? "").replace(/\/$/, ""),
  // Same switch name as the admin dashboard (Docking Spec section 10).
  useMocks: process.env.NEXT_PUBLIC_USE_MOCKS !== "false",
} as const;
