import "./App.css";
import { useState, useEffect } from "react";
// import { HashRouter, Route } from "react-router-dom";
import GameStart from "./GameStart";
import firebase from "./firebase";
import Lobby from "./Lobby";

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

function App() {
  // const [data, setData] = useState({});
  const [token, setToken] = useState(null);
  // const [playerAssignedToken, setPlayerAssignedToken] = useState("");

  useEffect(() => {
    //create a token
    setToken(create_UUID());
    //pull from firebase what's there
    // const dbRef = firebase.database().ref();
    // dbRef.on("value", (response) => {
    //   setData(response.val());
    // });

    // setPlayerAssignedToken(token);
  }, []);
  console.log("iam token", token);
  // console.log("iam Player assigned token", playerAssignedToken);
  // const handleShowGameStart = () => {
  //   setgameStartSection(false);
  // };

  // const { plaerys: players } = data;

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
  // }, [enoughPlayers]);

  // const { playerOne = {}, playerTwo = {} } = data;

  // if (Object.values(playerOne).token === token) {
  //   console.log("I'm player one");
  // }

  // if (Object.values(playerTwo).token === token) {
  //   console.log("I'm player two");
  // }

  const addPlayer = (name) => {
    const dbRef = firebase.database().ref().child("players");
    dbRef.push({
      playerName: name,
      token: token,
      rocketSelection: {
        rocketOne: "one",
        rocketTwo: "two",
      },
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
