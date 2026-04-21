const FALLBACK_SITE_ORIGIN = "https://api.alsqoor-realestate.sa";

function normalizeOrigin(value?: string): string | null {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function getSiteOrigin(): string {
  return normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL) ?? FALLBACK_SITE_ORIGIN;
}

export function isSecureCookiesEnabled(): boolean {
  return process.env.NODE_ENV === "production";
}
