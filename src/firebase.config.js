import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA67Sc3_tM9uo5vB8ZjEMsCwfp6g-7jv7Q",
  authDomain: "fly-far-int-v2.firebaseapp.com",
  projectId: "fly-far-int-v2",
  storageBucket: "fly-far-int-v2.appspot.com",
  messagingSenderId: "968381687861",
  appId: "1:968381687861:web:bb4e4a8f366f610e6b697c",
  measurementId: "G-XJ3TVTRERL",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Check if Messaging is supported
// let messaging;
// isSupported()
//   .then((supported) => {
//     if (supported) {
//       messaging = getMessaging(firebaseApp);
//     } else {
//       console.error("Firebase Messaging is not supported in this browser.");
//     }
//   })
//   .catch((error) => {
//     console.error("Error checking Firebase Messaging support:", error);
//   });

let messagingInstance = null;

const getMessagingInstance = async () => {
  const supported = await isSupported();
  if (!supported) {
    console.error("Firebase Messaging is not supported in this browser.");
    return null;
  }

  if (!messagingInstance) {
    messagingInstance = getMessaging(firebaseApp);
  }

  return messagingInstance;
};

// VAPID Key
const vapidKey =
  "BFXKCOkPQqi20OcqhlAHvjnEUSFshdFzowdlYLkMsLsHB7Ceo5nkDNHYNlMhL6iASB8a9Vio7Cqjobsr-nR2utM";

// Function to get device token
const getDeviceToken = async () => {
  try {
    if (!messagingInstance) {
      throw new Error("Firebase Messaging is not supported in this browser.");
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messagingInstance, { vapidKey });
      if (token) {
        return token;
      } else {
        console.warn("No registration token available.");
        return null;
      }
    } else {
      console.warn("Notification permission denied.");
      return null;
    }
  } catch (error) {
    console.error("Error getting device token:", error);
    return null;
  }
};

// Export relevant objects and functions
export { firebaseApp, getMessagingInstance, getDeviceToken, onMessage };
