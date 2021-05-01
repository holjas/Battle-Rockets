import firebase from "firebase/app";
import "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbHoquwXecTql1ekQNaYaRcWEWSlsi-_A",
  authDomain: "chatapplearning-cbea4.firebaseapp.com",
  databaseURL: "https://chatapplearning-cbea4-default-rtdb.firebaseio.com",
  projectId: "chatapplearning-cbea4",
  storageBucket: "chatapplearning-cbea4.appspot.com",
  messagingSenderId: "724521741978",
  appId: "1:724521741978:web:510000e5e8c6fc30e17923",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
