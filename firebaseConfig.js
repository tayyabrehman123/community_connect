import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Replace the below config object with your own Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyCD_2J_1asNXLpK7HVZYZu6jJpzAlkYcFM",
  authDomain: "community-connect-3a7ed.firebaseapp.com",
  projectId: "community-connect-3a7ed",
  storageBucket: "community-connect-3a7ed.firebasestorage.app",
  messagingSenderId: "879594298915",
  appId: "1:879594298915:web:bca5ef95f76cb8c9149b96",
  measurementId: "G-TF2RMRSC3J"
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (e) {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { auth, db }; 