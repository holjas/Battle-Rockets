import { useState, useEffect } from "react";
import firebase from "./firebase";

import { Link, withRouter } from "react-router-dom";
import Footer from "./Footer";

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
    firebase.database().ref().child(playerNumber).set({
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
  //variable to determine if playerOne exists in firebase AND that the tokens match from firebase and local state
  const isPlayerOne = playerOne && playerOne.token === token;

  //
  //
  return (
    <>
      {!playerOne && (
        <>
          <section className="gameStartSection">
            <h1>Battle Rockets</h1>
            <div className="gameStartContainer wrapper">
              <h2>Let's play a game!</h2>
              <h2>Enter your name to start</h2>
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
                <Link to="/RocketLobbyOne">Player One START</Link>
              </button>
            </div>
          </section>
          <Footer />
        </>
      )}
      {/* Once player one has entered, page will ask for player two to enter */}
      {playerOne && !isPlayerOne && (
        <>
          <section className="gameStartSection">
            <h1>Battle Rockets</h1>
            <div className="gameStartContainer wrapper">
              <h2>Player One has already entered the game.</h2>
              <h2>Waiting for player two...</h2>

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
                <Link to="/RocketLobbyTwo">Player Two START</Link>
              </button>
            </div>
          </section>
          <Footer />
        </>
      )}
    </>
  );
}

export default withRouter(GameStart);
