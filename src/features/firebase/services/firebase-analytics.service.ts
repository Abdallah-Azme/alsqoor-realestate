import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { getFirebaseApp, isFirebaseConfigured } from "../config/firebase-client";

let analyticsPromise: Promise<Analytics | null> | null = null;

export function initializeFirebaseAnalytics(): Promise<Analytics | null> {
  if (analyticsPromise) return analyticsPromise;

  analyticsPromise = (async () => {
    if (typeof window === "undefined") return null;
    if (!isFirebaseConfigured) return null;

    const app = getFirebaseApp();
    if (!app) return null;

    const supported = await isSupported().catch(() => false);
    if (!supported) return null;

    return getAnalytics(app);
  })();

  return analyticsPromise;
}
