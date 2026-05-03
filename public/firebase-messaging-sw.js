/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/12.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBRquu2HByyYVpn_BzEXdxnWCrb8Nm1x9E",
  authDomain: "realestate-41b1d.firebaseapp.com",
  projectId: "realestate-41b1d",
  storageBucket: "realestate-41b1d.firebasestorage.app",
  messagingSenderId: "204845506621",
  appId: "1:204845506621:web:80635726bced37cdeb4a54",
  measurementId: "G-4TWTJPB07L",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[FCM] Background message:", payload);
  const title = payload?.notification?.title || "New notification";
  const options = {
    body: payload?.notification?.body || "",
    icon: "/favicon.ico",
  };

  self.registration.showNotification(title, options);
});
