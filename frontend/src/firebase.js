import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// These should be replaced with actual config from the Firebase Console
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGT-qnWELIM3Svywj1c7LS5-gq7gBpOoY",
  authDomain: "unavagam-ea4eb.firebaseapp.com",
  projectId: "unavagam-ea4eb",
  storageBucket: "unavagam-ea4eb.firebasestorage.app",
  messagingSenderId: "852443808318",
  appId: "1:852443808318:web:a756a447d79ff1ed1cc76f",
  measurementId: "G-K7HCFFVDBK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
