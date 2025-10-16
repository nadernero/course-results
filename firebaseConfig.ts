import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration from the Firebase console.
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyBc934ZufzHPXbCAtafc3gagswF-_bacYg",
  authDomain: "course-results-5f0c1.firebaseapp.com",
  projectId: "course-results-5f0c1",
  storageBucket: "course-results-5f0c1.firebasestorage.app",
  messagingSenderId: "267687091931",
  appId: "1:267687091931:web:11f2c5c3b5e4ce9a5bb6fe"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);