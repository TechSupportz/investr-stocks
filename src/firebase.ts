// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDTExQB82SYC8xWwSDcEFtmp72ir0_Lbwc",
    authDomain: "investr-stocks.firebaseapp.com",
    projectId: "investr-stocks",
    storageBucket: "investr-stocks.appspot.com",
    messagingSenderId: "691033923944",
    appId: "1:691033923944:web:a3289403841113c101f6dd",
}

// Initialize Firebase
export const firebaseInstance = initializeApp(firebaseConfig)

export const db = getFirestore(firebaseInstance)
