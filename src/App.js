import "./App.css";
import { useState, useEffect } from "react";
// import { HashRouter, Route } from "react-router-dom";
import GameStart from "./GameStart";
import firebase from "./firebase";
import Lobby from "./Lobby";

function App() {
  const [data, setData] = useState({});
  const [token, setToken] = useState(null);

  //create a token when component first mounts
  useEffect(() => {
    //generate a token, borrowed from somewhere off the internet
    function create_UUID() {
      var dt = new Date().getTime();
      var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (dt + Math.random() * 16) % 16 | 0;
          dt = Math.floor(dt / 16);
          return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    }
    setToken(create_UUID());
  }, []);

  useEffect(() => {
    //pull from firebase what's there (runs when token is assigned)
    const dbRef = firebase.database().ref();
    dbRef.on("value", (response) => {
      setData(response.val());
    });
  }, [token]);

  //destructure the data returned from firebase,
  const { players = {} } = data;
  //checking that two players have 'entered' the game
  const enoughPlayers = Object.keys(players).length === 2;
  //when two player are confirmed, push P1/P2 info to firebase
  useEffect(() => {
    if (enoughPlayers) {
      const [playerOne, playerTwo] = Object.values(players);
      const pOne = firebase.database().ref().child("playerOne");
      const pTwo = firebase.database().ref().child("playerTwo");

      pOne.push(playerOne);
      pTwo.push(playerTwo);
    }

    // for (const key in data.playerOne) {
    //   console.log(data.playerOne[key].token);
    // }

    // for (const key in data.playerTwo) {
    //   console.log(data.playerTwo[key].token);
    //   const firebaseToken = data.playerTwo[key].token;
    //   if (firebaseToken === token) {
    //     console.log("IAM PLAYER TWO");
    //   }
    // }
  }, [enoughPlayers]);

  for (const key in data.playerOne) {
    console.log(data.playerOne[key].token, "FIREBASE TOKEN");
    console.log(token, "REGULAR TOKEN");
    const firebaseToken = data.playerOne[key].token;
    if (firebaseToken === token) {
      console.log("IAM PLAYER ONE");
    }
  }
  for (const key in data.playerTwo) {
    console.log(data.playerTwo[key].token, "FIREBASE TOKEN");
    console.log(token, "REGULAR TOKEN");
    const firebaseToken = data.playerTwo[key].token;
    if (firebaseToken === token) {
      console.log("IAM PLAYER TWO");
    }
  }

  //Game Start component to capture user name
  const addPlayer = (name) => {
    const dbRef = firebase.database().ref().child("players");
    dbRef.push({
      playerName: name,
      token: token,
    });
  };

  // button for clearing firebase. testing only!!!!!
  const removeEverything = () => {
    firebase.database().ref("playerOne").remove();
    firebase.database().ref("playerTwo").remove();
    firebase.database().ref("players").remove();
  };
  return (
    <div className="App">
      <h1>🚀👩‍🚀🚀👨‍🚀🚀BATLLE ROCKETS GOOOOOO 🚀👩‍🚀🚀👨‍🚀🚀</h1>

      <GameStart addPlayer={addPlayer} player1={{}} player2={{}} />

      <Lobby />
      {/* Button for testing only */}
      <button onClick={removeEverything}>CLEAR ALL</button>
    </div>
  );
}

export default App;
