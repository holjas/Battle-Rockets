import firebase from 'firebase/app';
import 'firebase/database';

  // HOLLY's
  const firebaseConfig = {
    apiKey: "AIzaSyAf8Lax6c8QkmYvzHsgmjMxxDzRhdreb9k",
    authDomain: "battlerockets-5c6fc.firebaseapp.com",
    databaseURL: "https://battlerockets-5c6fc-default-rtdb.firebaseio.com",
    projectId: "battlerockets-5c6fc",
    storageBucket: "battlerockets-5c6fc.appspot.com",
    messagingSenderId: "827425225449",
    appId: "1:827425225449:web:82c0909517ed32e07dce78",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


  export default firebase;