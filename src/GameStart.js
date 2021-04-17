import { useState, useEffect } from "react";
import firebase from "./firebase";

function GameStart(props) {
  const { playerOne, playerTwo, captureTheToken } = props;

  const [playerOneName, setPlayerOneName] = useState("");
  const [playerTwoName, setPlayerTwoName] = useState("");
  const [token, setToken] = useState(null);

  //create a token when component first mounts (borrowed from somewhere off the internet)
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
  //handleClick, to confirm when players are ready by capturing their name and assigned token
  const handleIsPlayerReady = (player, playerNumber) => {
    firebase.database().ref().child(playerNumber).push({
      name: player,
      token: token,
    });
  };
  //captures text input for user name
  const handleChange = (event, playerNumber) => {
    if (playerNumber === "one") {
      setPlayerOneName(event.target.value);
    }
    if (playerNumber === "two") {
      setPlayerTwoName(event.target.value);
    }
  };

  //these if statements are a proof of concept. that the different assigned tokens will tell the browswers, you are player one and another player two
  if (playerOne) {
    const { token: playerTokenFirebase } = Object.values(playerOne)[0];
    if (token === playerTokenFirebase) {
      console.log("You are player one");
    }
  }

  if (playerTwo) {
    const { token: playerTokenFirebase } = Object.values(playerTwo)[0];
    if (token === playerTokenFirebase) {
      console.log("You are player two");
    }
  }

  return (
    <section>
      {!playerOne && (
        <>
          <p>welcome player one! please enter your name</p>
          <input
            type="text"
            onChange={(event) => handleChange(event, "one")}
            value={playerOneName}
          ></input>
          <button
            onClick={() => {
              handleIsPlayerReady(playerOneName, "playerOne");
              setPlayerOneName("");
              captureTheToken(token);
            }}
          >
            player one
          </button>
        </>
      )}
      {playerOne && (
        <div>
          <p>Player One has already entered the game.</p>
          <p>Waiting for player two to enter the game...</p>

          <input
            type="text"
            onChange={(event) => handleChange(event, "two")}
            value={playerTwoName}
          ></input>
          <button
            onClick={() => {
              handleIsPlayerReady(playerTwoName, "playerTwo");
              setPlayerTwoName("");
              captureTheToken(token);
            }}
          >
            player two
          </button>
        </div>
      )}
    </section>
  );
}

export default GameStart;
