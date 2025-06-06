importScripts(
  "https://www.gstatic.com/firebasejs/9.19.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.19.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyA67Sc3_tM9uo5vB8ZjEMsCwfp6g-7jv7Q",
  authDomain: "fly-far-int-v2.firebaseapp.com",
  projectId: "fly-far-int-v2",
  storageBucket: "fly-far-int-v2.firebasestorage.app",
  messagingSenderId: "968381687861",
  appId: "1:968381687861:web:bb4e4a8f366f610e6b697c",
  measurementId: "G-XJ3TVTRERL",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload?.notification?.title;
  const notificationOptions = {
    body: payload?.notification?.body,
    icon: payload?.notification?.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
