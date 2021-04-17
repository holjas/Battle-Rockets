import "./App.css";
import { useState, useEffect } from "react";
// import { HashRouter, Route } from "react-router-dom";
import GameStart from "./GameStart";
import firebase from "./firebase";
import Lobby from "./Lobby";

function App() {
  const [data, setData] = useState({});

  //pull from firebase what's there (runs when token is assigned)
  useEffect(() => {
    const dbRef = firebase.database().ref();
    dbRef.on("value", (response) => {
      setData(response.val());
      // console.log(response.val());
    });
  }, []);

  const playerOne = data.playerOne;

  // const playerTwo = data.playerTwo;

  //destructure the data returned from firebase,
  // const { players = {} } = data;
  //checking that two players have 'entered' the game
  // const enoughPlayers = Object.keys(players).length === 2;
  //when two player are confirmed, push P1/P2 info to firebase
  // useEffect(() => {
  //   if (enoughPlayers) {
  //     const [playerOne, playerTwo] = Object.values(players);
  //     const pOne = firebase.database().ref().child("playerOne");
  //     const pTwo = firebase.database().ref().child("playerTwo");

  //     pOne.push(playerOne);
  //     pTwo.push(playerTwo);
  //   }

  //   // for (const key in data.playerOne) {
  //   //   console.log(data.playerOne[key].token);
  //   //   if (data.playerOne[key].token === token) console.log("Iam player one");
  //   // }

  //   // for (const key in data) {
  //   //   console.log(data.playerOne[key].token, "FIREBASE TOKEN");
  //   //   console.log(token, "REGULAR TOKEN");
  //   //   const firebaseToken = data.playerOne[key].token;
  //   //   if (firebaseToken === token) {
  //   //     console.log("IAM PLAYER ONE");
  //   //   }
  //   // }
  // }, [enoughPlayers]);

  // for (const key in data.playerOne) {
  //   console.log(data.playerOne[key].token);
  //   if (data.playerOne[key].token === token) console.log("Iam player one");
  // }

  //Game Start component to capture user name
  // const addPlayer = (name) => {
  //   const dbRef = firebase.database().ref().child("players");
  //   dbRef.push({
  //     playerName: name,
  //     token: token,
  //   });
  // };

  // button for clearing firebase. testing only!!!!!
  const removeEverything = () => {
    firebase.database().ref("playerOne").set(false);
    firebase.database().ref("playerTwo").set(false);
  };
  return (
    <div className="App">
      <h1>🚀👩‍🚀🚀👨‍🚀🚀BATLLE ROCKETS GOOOOOO 🚀👩‍🚀🚀👨‍🚀🚀</h1>

      <GameStart playerOne={playerOne} />

      <Lobby />
      {/* Button for testing only */}
      <button onClick={removeEverything}>CLEAR ALL</button>
    </div>
  );
}

export default App;
