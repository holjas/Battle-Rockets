import firebase from 'firebase/app';
import 'firebase/database';

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAbDyBJmjNka05R1EPjNFC7oUxKivX7gzM",
    authDomain: "mmm-bookshelf.firebaseapp.com",
    projectId: "mmm-bookshelf",
    storageBucket: "mmm-bookshelf.appspot.com",
    messagingSenderId: "131890630949",
    appId: "1:131890630949:web:ea83479e6fd332a6d00acc"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


  export default firebase;