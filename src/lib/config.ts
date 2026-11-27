// All environment settings are read here and nowhere else
// (next.config.ts also reads API_URL for the /api rewrite).
// See .env.example for what each one means.

export const config = {
  // Server-side base URL of the Express API, no trailing slash.
  apiUrl: (process.env.API_URL ?? "").replace(/\/$/, ""),
  // Same switch name and default as the admin dashboard: the real API unless
  // this is exactly "true". (It used to default to mocks, so a missing
  // variable silently hid every dashboard edit.)
  useMocks: process.env.NEXT_PUBLIC_USE_MOCKS === "true",
} as const;
