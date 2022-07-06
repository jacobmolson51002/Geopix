import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const firebaseConfig = {
    apiKey: "AIzaSyBDlW6U80c2hw-dR5Qz1v0fHejHE-V32zY",
    authDomain: "geopix-295e8.firebaseapp.com",
    projectId: "geopix-295e8",
    storageBucket: "geopix-295e8.appspot.com",
    messagingSenderId: "321768973307",
    appId: "1:321768973307:web:221f750a1b5418160c215e",
    measurementId: "G-5RNV8GVDJQ"
  };
export const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);