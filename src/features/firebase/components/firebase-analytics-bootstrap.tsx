"use client";

import { useFirebaseAnalytics } from "../hooks/use-firebase-analytics";

export function FirebaseAnalyticsBootstrap() {
  useFirebaseAnalytics();
  return null;
}
