"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { authService } from "@/features/auth";
import {
  requestFirebaseMessagingToken,
  subscribeToForegroundMessages,
} from "../services/firebase-messaging.service";

const SAVED_FCM_TOKEN_KEY = "fcm_token";

export function useFirebaseNotifications() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    if (!("serviceWorker" in navigator)) return;

    let unsubscribe: (() => void) | null = null;
    let isUnmounted = false;
    let isSubscribedToForeground = false;
    let isFcmTokenSynced = false;

    const setupNotifications = async () => {
      if (isUnmounted || isFcmTokenSynced) return;
      const accessToken = localStorage.getItem("token");
      if (!accessToken) return;

      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }

      if (Notification.permission !== "granted") {
         return;
      }

      const token = await requestFirebaseMessagingToken();
      if (!token) {
        console.warn("[FCM] setupNotifications: no token");
        return;
      }

      const savedToken = localStorage.getItem(SAVED_FCM_TOKEN_KEY);
      if (savedToken !== token) {
         await authService.updateFcmToken({ fcm_token: token }).catch((err) => {
          console.error("[FCM] updateFcmToken failed", err);
        });
        localStorage.setItem(SAVED_FCM_TOKEN_KEY, token);
      }  

      if (!isSubscribedToForeground) {
        unsubscribe = await subscribeToForegroundMessages((payload) => {
          const title = payload?.notification?.title || "New notification";
          const body = payload?.notification?.body || "";
          toast.info(title, { description: body });
        });
        isSubscribedToForeground = true;
      }

      isFcmTokenSynced = true;
    };

    void setupNotifications();
    const intervalId = window.setInterval(() => {
      void setupNotifications();
    }, 15000);

    const onWindowFocus = () => {
      void setupNotifications();
    };
    window.addEventListener("focus", onWindowFocus);

    return () => {
      isUnmounted = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onWindowFocus);
      if (unsubscribe) unsubscribe();
    };
  }, []);
}
