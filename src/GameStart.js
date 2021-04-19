import { useState, useEffect } from "react";
import firebase from "./firebase";

import { Link, withRouter } from "react-router-dom";

function GameStart(props) {
  const { playerOne, captureTheToken } = props;

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
  //handleClick, to confirm when players are ready by capturing their name and assigned token & creating the structure of the database for gameplay
  const handleIsPlayerReady = (player, playerNumber) => {
    firebase
      .database()
      .ref()
      .child(playerNumber)
      .set({
        name: player,
        token: token,
        rockets: {
          rocketSelectionOne: "one",
          rocketSelectionTwo: "two",
          rocketSelectionThree: "three",
        },
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
  //variable to determine if playerOne exists in firebase AND that the tokens match from firebase and local state
  const isPlayerOne = playerOne && playerOne.token === token;

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
              props.history.push("/RocketLobbyOne");
            }}
          >
            <Link to="/RocketLobbyOne">player one</Link>
          </button>
        </>
      )}
      {/* Once player one has entered, page will ask for player two to enter */}
      {playerOne && !isPlayerOne && (
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
              props.history.push("/RocketLobbyTwo");
            }}
          >
            <Link to="/RocketLobbyTwo">player Two</Link>
          </button>
        </div>
      )}
    </section>
  );
}

export default withRouter(GameStart);