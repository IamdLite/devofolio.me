// Import the Firebase SDK
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your Firebase configuration (from Firebase console)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Optional in test mode
  authDomain: "devfolio-f8eee.firebaseapp.com",
  databaseURL: "https://devfolio-f8eee-default-rtdb.firebaseio.com", // Add your Realtime Database URL
  projectId: "devfolio-f8eee",
  storageBucket: "devfolio-f8eee.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const db = getDatabase(app);
