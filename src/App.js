import "./App.css";
import { useState, useEffect } from "react";
import firebase from "./firebase";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";

// import Navbar from "./Navbar";
import PlayerStart from "./PlayerStart";
import RocketLobby from "./RocketLobby";
import GameBoard from "./GameBoard";

// import star from "./images/star.png";

function App() {
  const [data, setData] = useState({});
  const [localAssignedToken, setLocalAssignedToken] = useState("");
  const history = useHistory();

  //pull from firebase what's there (runs when token is assigned)
  useEffect(() => {
    const dbRef = firebase.database().ref();
    dbRef.on("value", (response) => {
      setData(response.val());
    });
  }, []);
  const { playerOne, playerTwo } = data;

  // button for clearing firebase and reset game.
  const removeEverything = () => {
    firebase.database().ref("playerOne").set(false);
    firebase.database().ref("playerTwo").set(false);
    firebase.database().ref("isGameOver").set(false);
    firebase.database().ref("turn").set("playerOne");
  };
  //capture the local token number
  function captureTheToken(localToken) {
    setLocalAssignedToken(localToken);
  }

  //THE RETURN
  return (
    <Router>
      <>
        <button
          className="starAbortButton"
          onClick={() => {
            removeEverything();
            history.push("/");
            window.location.reload(false);
          }}
        >
          reset game
        </button>
        {/* once both players have both entered the game, playerStart will hide */}
        {!playerTwo && (
          <>
            <PlayerStart
              playerOne={playerOne}
              playerTwo={playerTwo}
              captureTheToken={captureTheToken}
            />
          </>
        )}

        {/* Routing for Rocket lobbies */}
        <Route exact path="/" render={() => {}} />
        <Route
          exact
          path="/RocketLobbyOne"
          render={() => (
            <RocketLobby data={data} localToken={localAssignedToken} />
          )}
        />
        <Route
          exact
          path="/RocketLobbyTwo"
          render={() => (
            <RocketLobby data={data} localToken={localAssignedToken} />
          )}
        />

        {/* Routing for Game boards */}
        <Route
          exact
          path="/GameBoardOne"
          render={() => (
            <GameBoard data={data} localToken={localAssignedToken} />
          )}
        />
        <Route
          exact
          path="/GameBoardTwo"
          render={() => (
            <GameBoard data={data} localToken={localAssignedToken} />
          )}
        />
      </>
    </Router>
  );
}

export default App;
