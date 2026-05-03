import { getToken, isSupported, Messaging, getMessaging, onMessage } from "firebase/messaging";
import { getFirebaseApp, isFirebaseConfigured } from "../config/firebase-client";

const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export async function getFirebaseMessagingInstance(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;
  if (!isFirebaseConfigured) {
    console.warn("[FCM] Firebase not configured");
    return null;
  }

  const supported = await isSupported().catch(() => false);
  if (!supported) {
    console.warn("[FCM] Messaging not supported in this browser");
    return null;
  }

  const app = getFirebaseApp();
  if (!app) {
    console.warn("[FCM] No Firebase app");
    return null;
  }

  return getMessaging(app);
}

export async function requestFirebaseMessagingToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  if (!vapidKey) {
    console.warn("[FCM] NEXT_PUBLIC_FIREBASE_VAPID_KEY is missing");
    return null;
  }

  const messaging = await getFirebaseMessagingInstance();
  if (!messaging) return null;

  const serviceWorkerRegistration = await navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .catch((err) => {
      console.error("[FCM] Service worker registration failed", err);
      return null;
    });

  if (!serviceWorkerRegistration) return null;

  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration,
  }).catch((err) => {
    console.error("[FCM] getToken failed", err);
    return null;
  });

 

  return token || null;
}

export async function subscribeToForegroundMessages(
  callback: (payload: any) => void,
): Promise<(() => void) | null> {
  const messaging = await getFirebaseMessagingInstance();
  if (!messaging) return null;

  return onMessage(messaging, (payload) => {
    console.log("[FCM] Foreground message:", payload);
    callback(payload);
  });
}
