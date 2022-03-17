// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBkvlGen7TCj1ZehyccPYgRtTTUB-IyTyk",
    authDomain: "dev-x-deepg.firebaseapp.com",
    projectId: "dev-x-deepg",
    storageBucket: "dev-x-deepg.appspot.com",
    messagingSenderId: "340997743316",
    appId: "1:340997743316:web:05e9acc61fc29a5160d141",
    measurementId: "G-ZWMSWNWQS7"
};

// Initialize Firebase
export const firebaseInstance = firebase.initializeApp(firebaseConfig);

// export const firebase = {
//     analytics: getAnalytics(app)
// };
