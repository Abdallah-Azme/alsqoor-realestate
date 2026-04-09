import { getToken, isSupported, Messaging, getMessaging, onMessage } from "firebase/messaging";
import { getFirebaseApp, isFirebaseConfigured } from "../config/firebase-client";

const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export async function getFirebaseMessagingInstance(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;
  if (!isFirebaseConfigured) return null;

  const supported = await isSupported().catch(() => false);
  if (!supported) return null;

  const app = getFirebaseApp();
  if (!app) return null;

  return getMessaging(app);
}

export async function requestFirebaseMessagingToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  if (!vapidKey) return null;

  const messaging = await getFirebaseMessagingInstance();
  if (!messaging) return null;

  const serviceWorkerRegistration = await navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .catch(() => null);

  if (!serviceWorkerRegistration) return null;

  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration,
  }).catch(() => null);

  return token || null;
}

export async function subscribeToForegroundMessages(
  callback: (payload: any) => void,
): Promise<(() => void) | null> {
  const messaging = await getFirebaseMessagingInstance();
  if (!messaging) return null;

  return onMessage(messaging, callback);
}
