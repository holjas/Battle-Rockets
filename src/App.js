import "./App.css";
import { useState, useEffect } from "react";
import firebase from "./firebase";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";

import GameStart from "./GameStart";
import RocketLobby from "./RocketLobby";

import star from "./images/star.png";

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
  console.log(localAssignedToken);
  //THE RETURN
  return (
    <Router>
      <div>
        {/* Button for testing only */}
        <div className="starAbortContainer">
          <img
            src={star}
            alt="cartoon star"
            className="starAbort"
            onClick={() => {
              removeEverything();
              history.push("/");
              window.location.reload(false);
            }}
          />
        </div>
        {/* Button for testing only */}
        {/* once both players have both entered the game, GameStart will hide */}
        {!playerTwo && (
          <GameStart
            playerOne={playerOne}
            // playerTwo={playerTwo}
            captureTheToken={captureTheToken}
          />
        )}

        <Route exact path="/RocketLobbyOne" component={RocketLobby} />
        <Route exact path="/RocketLobbyTwo" component={RocketLobby} />
      </div>
    </Router>
  );
}

export default App;