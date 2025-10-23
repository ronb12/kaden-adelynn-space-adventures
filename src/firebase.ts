// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1b-JWvBRGti5LFKk7LqSS8p1QFbP_D88",
  authDomain: "kaden---adelynn-adventures.firebaseapp.com",
  projectId: "kaden---adelynn-adventures",
  storageBucket: "kaden---adelynn-adventures.firebasestorage.app",
  messagingSenderId: "265116401918",
  appId: "1:265116401918:web:e1511695b92aeb05e0e5af",
  measurementId: "G-W4Q02R318L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
