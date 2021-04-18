import "./App.css";
import { useState, useEffect } from "react";
import firebase from "./firebase";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";

import GameStart from "./GameStart";
import RocketLobbyOne from "./RocketLobbyOne";
import RocketLobbyTwo from "./RocketLobbyTwo";

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

  // button for clearing firebase. testing only!!!!!
  const removeEverything = () => {
    firebase.database().ref("playerOne").set(false);
    firebase.database().ref("playerTwo").set(false);
  };
  //capture the local token number
  function captureTheToken(localToken) {
    setLocalAssignedToken(localToken);
  }

  //THE RETURN
  return (
    <Router>
      <div className="App">
        {/* Button for testing only */}
        <button
          onClick={() => {
            removeEverything();
            history.push("/");
          }}
        >
          CLEAR ALL
        </button>
        {/* Button for testing only */}
        <header>
          <h1>Battle Rockets</h1>
          {/* <div className="flexMoon">
            <img className="moon" src={moon} />
          </div> */}
        </header>

        {/* once both players have both entered the game, GameStart will hide */}
        {!playerTwo && (
          <GameStart
            playerOne={playerOne}
            // playerTwo={playerTwo}
            captureTheToken={captureTheToken}
          />
        )}

        <Route exact path="/RocketLobbyOne" component={RocketLobbyOne} />
        <Route exact path="/RocketLobbyTwo" component={RocketLobbyTwo} />
      </div>
    </Router>
  );
}

export default App;
