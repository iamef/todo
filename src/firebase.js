// need to add the compat in import for v9
//https://stackoverflow.com/questions/68946446/how-do-i-fix-a-firebase-9-0-import-error-attempted-import-error-firebase-app

import firebase from "firebase/compat/app"; 
import "firebase/compat/database";

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app"; // somehow doesn't work
// import { getAnalytics } from "firebase/analytics"; // somehow doesn't work
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVsbM8eWn_6opVMb86eIvyNiKpwyFmJ1w",
  authDomain: "todo-medium.firebaseapp.com",
  databaseURL: "https://todo-medium-default-rtdb.firebaseio.com",
  projectId: "todo-medium",
  storageBucket: "todo-medium.appspot.com",
  messagingSenderId: "715936135028",
  appId: "1:715936135028:web:ca4f3f9b7354f36c769e21",
  measurementId: "G-XX97Q3VCNM"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// const db = app.database()
// export default db;
// const analytics = getAnalytics(app);


// commented out because this is probably all wrong
// import firebase from 'firebase';
// //from 1st may
// var firebaseConfig = {
//     apiKey: "AIzaSyBgw6z_lKum5OgSjT_QTf5zHBUARrwZr9Y",
//     authDomain: "todo-36448.firebaseapp.com",
//     databaseURL: "https://todo-36448-default-rtdb.firebaseio.com",
//     projectId: "todo-36448",
//     storageBucket: "todo-36448.appspot.com",
//     messagingSenderId: "717272925628",
//     appId: "1:717272925628:web:abd8a5dfdc15b374bc57b9",
//     measurementId: "G-06LGZRD0Z0"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
export default firebase; // needs to contain a default export