import firebase from './firebase';


const setUpPlayer = (props) => {
    const dbRef = firebase.database().ref();
    const properties = {
        player : "one or two",
        isReady : "true or false",
    }

    dbRef.push(properties);
    
  }


  export default Scratch;



