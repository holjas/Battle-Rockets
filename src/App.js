import "./App.css";
import { useState, useEffect } from "react";
import firebase from "./firebase";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";

import GameStart from "./GameStart";
import RocketLobbyOne from "./RocketLobbyOne";
import RocketLobbyTwo from "./RocketLobbyTwo";
import DeleteLater from "./DeleteLater";

function App(props) {
  const [data, setData] = useState({});
  const [localAssignedToken, setLocalAssignedToken] = useState("");
  const history = useHistory();
  const [playerOnePath, setPlayerOnePath] = useState(false);
  const [playerTwoPath, setPlayerTwoPath] = useState(false);

  //pull from firebase what's there (runs when token is assigned)
  useEffect(() => {
    const dbRef = firebase.database().ref();
    dbRef.on("value", (response) => {
      setData(response.val());
      // console.log(response.val());
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
  useEffect(() => {
    for (const key in playerOne) {
      const firebaseToken = playerOne[key].token;
      if (firebaseToken === localAssignedToken) {
        // console.log("i'm player one. set");
        setPlayerOnePath(true);
      }
    }
    for (const key in playerTwo) {
      const firebaseToken = playerTwo[key].token;
      if (firebaseToken === localAssignedToken) {
        // console.log("you're player two. wait your turn");
        setPlayerTwoPath(true);
      }
    }
  }, [localAssignedToken]);
  console.log("history", history);
  //THE RETURN
  return (
    <Router>
      <div className="App">
        {/* Button for testing only */}
        <button
          onClick={() => {
            removeEverything();
            history.push("/home");
          }}
        >
          CLEAR ALL
        </button>
        {/* Button for testing only */}
        <h1>🚀👩‍🚀🚀👨‍🚀🚀BATLLE ROCKETS GO 🚀👩‍🚀🚀👨‍🚀🚀</h1>

        {/* once both players have both entered the game, GameStart will hide */}
        {!playerTwo && (
          <GameStart
            playerOne={playerOne}
            playerTwo={playerTwo}
            captureTheToken={captureTheToken}
          />
        )}

        {/* Rocket selection lobby. player diverge here to make rocket selections */}

        {/* {playerOnePath && !playerTwo && <RocketLobbyOne player={playerOne} />} */}
        {/* {console.log("playerone object", playerOne)} */}

        {/* {playerTwo && <RocketLobbyTwo player={playerTwo} />} */}
        {/* {console.log("playertwo object", playerTwo)}s */}
        <Route exact path="/RocketLobbyOne" component={RocketLobbyOne} />
        <Route exact path="/RocketLobbyTwo" component={RocketLobbyTwo} />
      </div>
    </Router>
  );
}

export default App;
