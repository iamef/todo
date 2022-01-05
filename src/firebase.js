// need to add the compat in import for v9
//https://stackoverflow.com/questions/68946446/how-do-i-fix-a-firebase-9-0-import-error-attempted-import-error-firebase-app

import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";

// import firebase from "firebase/compat/app"; 
// import "firebase/compat/database";
// import "firebase/compat/auth";

// import "firebase/compat/firestore"


// const firebase = require("firebase");
// // Required for side-effects
// require("firebase/firestore");

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app"; // somehow doesn't work
// import { getAnalytics } from "firebase/analytics"; // somehow doesn't work
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVsbM8eWn_6opVMb86eIvyNiKpwyFmJ1w", // can be found on console.cloud.google.com
  authDomain: "todo-medium.firebaseapp.com",
  databaseURL: "https://todo-medium-default-rtdb.firebaseio.com",
  projectId: "todo-medium",
  storageBucket: "todo-medium.appspot.com",
  messagingSenderId: "715936135028",
  appId: "1:715936135028:web:ca4f3f9b7354f36c769e21",
  measurementId: "G-XX97Q3VCNM"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp)

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/calendar.readonly");

const auth = getAuth();

async function firebaseSignInWithGoogle(){
  return new Promise((resolve, reject) => {
    signInWithPopup(auth, provider).then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
      debugger;
      resolve(result);

    })
  });

// signInWithPopup(auth, provider).then((result) => {
//   // This gives you a Google Access Token. You can use it to access the Google API.
//   const credential = GoogleAuthProvider.credentialFromResult(result);
//   const token = credential.accessToken;
//   // The signed-in user info.
//   const user = result.user;
//   // ...
//   debugger;
// }).catch((error) => {
//   // Handle Errors here.
//   const errorCode = error.code;
//   const errorMessage = error.message;
//   // The email of the user's account used.
//   const email = error.email;
//   // The AuthCredential type that was used.
//   const credential = GoogleAuthProvider.credentialFromError(error);
//   // ...
//   console.log(errorCode, errorMessage, email, credential)
//   debugger;
// });
}

async function firebaseSignOut(){
  return new Promise((resolve, reject) => {
    signOut(auth).then(() => {
      resolve(true);
    });

    // .catch((error) => {
    //   // An error happened.
    // });
  });
}




export { auth, db, firebaseSignInWithGoogle , firebaseSignOut };