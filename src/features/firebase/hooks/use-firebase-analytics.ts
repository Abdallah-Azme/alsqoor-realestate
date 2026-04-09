"use client";

import { useEffect } from "react";
import { initializeFirebaseAnalytics } from "../services/firebase-analytics.service";

export function useFirebaseAnalytics() {
  useEffect(() => {
    void initializeFirebaseAnalytics();
  }, []);
}
