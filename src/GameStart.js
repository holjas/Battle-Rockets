import { useState, useEffect } from "react";
import firebase from "./firebase";

function GameStart() {
  //   const [playerOne, setPlayerOne] = useState(false);
  //   const [playerTwo, setPlayerTwo] = useState(false);
  const [isPlayerOneReady, setIsPlayerOneReady] = useState(false);
  const [isPlayerTwoReady, setIsPlayerTwoReady] = useState(false);
  const [playerOneName, setPlayerOneName] = useState("");
  const [playerTwoName, setPlayerTwoName] = useState("");

  //handleClick, to confirm when players are ready. Also captures their names.
  const handleIsPlayerReady = (player) => {
    if (player === "one") {
      setIsPlayerOneReady(true);
      const dbRef = firebase.database().ref().child("playerOne");
      dbRef.push({
        playerName: playerOneName,
        rocketSelection: {
          rocketOne: "one",
          rocketTwo: "two",
        },
      });
    }
    if (player === "two") {
      setIsPlayerTwoReady(true);
      const dbRef = firebase.database().ref().child("playerTwo");
      dbRef.push({
        playerName: playerTwoName,
        rocketSelection: {
          rocketOne: "one",
          rocketTwo: "two",
        },
      });
    }
  };
  //confirm that both players are ready and game can start
  useEffect(() => {
    if (isPlayerOneReady && isPlayerTwoReady) {
      console.log("we're both ready, now start the game");
    }
  }, [isPlayerOneReady, isPlayerTwoReady]);
  //captures text input
  const handleChange = (event, playerNumber) => {
    if (playerNumber === "one") {
      setPlayerOneName(event.target.value);
    }
    if (playerNumber === "two") {
      setPlayerTwoName(event.target.value);
    }
  };

  return (
    <section>
      <h2>game start</h2>
      <input
        type="text"
        onChange={(event) => handleChange(event, "one")}
        value={playerOneName}
      ></input>
      <button
        onClick={() => {
          handleIsPlayerReady("one");
        }}
      >
        player one
      </button>
      <input
        type="text"
        onChange={(event) => handleChange(event, "two")}
        value={playerTwoName}
      ></input>
      <button
        onClick={() => {
          handleIsPlayerReady("two");
        }}
      >
        player two
      </button>
    </section>
  );
}

export default GameStart;
