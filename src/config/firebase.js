import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA9KmZtNYG47hKLvtTXrxWWgS-5WTDlviY",
    authDomain: "practica-firebase-20220329.firebaseapp.com",
    projectId: "practica-firebase-20220329",
    storageBucket: "practica-firebase-20220329.appspot.com",
    messagingSenderId: "947993307099",
    appId: "1:947993307099:web:86ac136523aac9cacea9fe"
};

console.log("Valor de la configuracion", firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Obtén referencias a los servicios que necesitas
const auth = getAuth(app);

const database = getFirestore(app);
const storage = getStorage(app);

export { auth, database, storage };