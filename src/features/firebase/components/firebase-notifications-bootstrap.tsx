"use client";

import { useFirebaseNotifications } from "../hooks/use-firebase-notifications";

export function FirebaseNotificationsBootstrap() {
  useFirebaseNotifications();
  return null;
}
