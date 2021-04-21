import "./RocketLobby.css";
import firebase from "./firebase";
import Navbar from "./Navbar";

import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import rocket1 from "./images/rocket-1.png";
import rocket2 from "./images/rocket-2.png";
import rocket3 from "./images/rocket-3.png";

function Rockets({ data, localToken }) {
  const [rocket, setRocket] = useState([]);
  const [rocketSelected, setRocketSelected] = useState([]);
  const [whichPlayer, setWhichPlayer] = useState("playerOne");
  const [userName, setUserName] = useState("");
  const [hideForm, setHideForm] = useState(false);
  const history = useHistory();
  //api call to SpaceX to get the different rocket types
  useEffect(() => {
    axios({
      url: "https://api.spacexdata.com/v3/rockets/",
      method: "GET",
      dataResponse: "json",
      params: {},
    })
      .then((res) => {
        const rocketHeight = res.data.map((rHeight) => {
          const singleRocketHeight = rHeight.height.meters;
          let orientation = rocket3;
          if (singleRocketHeight > 100) {
            orientation = rocket1;
          } else if (singleRocketHeight > 50) {
            orientation = rocket2;
          } else {
            orientation = rocket3;
          }
          return {
            ...rHeight,
            orientation: orientation,
          };
        });
        setRocket(rocketHeight);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //determine which player in order to submit the rocket selection to the appropriate branch in firebase
  //also capture user name to display on screen
  useEffect(() => {
    if (localToken) {
      const playerOne = data.playerOne.token === localToken;
      const playerTwo = data.playerTwo.token === localToken;
      if (playerOne) {
        setWhichPlayer("playerOne");
        setUserName(data.playerOne.name);
      }
      if (playerTwo) {
        setWhichPlayer("playerTwo");
        setUserName(data.playerTwo.name);
      }
    }
  }, [data, localToken]);

  //captures the selected rockets, put them in an array for push to firebase once all selections are made
  const maxSelectionReach = rocketSelected.length === 3;
  const handleRocketSelected = (value) => {
    if (maxSelectionReach) {
      alert("you have selected 3 rockets");
    }
    const rocketDetails = {};
    if (value === "Falcon 1") {
      rocketDetails.name = value;
      rocketDetails.size = 2;
      rocketDetails.directions = [
        [0, 1],
        [0, 7],
      ];
    }
    if (value === "Falcon 9") {
      rocketDetails.name = value;
      rocketDetails.size = 3;
      rocketDetails.directions = [
        [0, 1, 2],
        [0, 7, 14],
      ];
    }
    if (value === "Falcon Heavy") {
      rocketDetails.name = value;
      rocketDetails.size = 4;
      rocketDetails.directions = [
        [0, 1, 2, 3],
        [0, 7, 14, 21],
      ];
    }
    if (value === "Starship") {
      rocketDetails.name = value;
      rocketDetails.size = 4;
      rocketDetails.directions = [
        [0, 1, 2, 3],
        [0, 7, 14, 21],
      ];
    }
    setRocketSelected([...rocketSelected, rocketDetails]);
  };

  //onClick will push the rockets selected to firebase (depending on user of course)
  const rocketSelectionSubmit = (e) => {
    e.preventDefault();
    setHideForm(true);
    firebase.database().ref(whichPlayer).update({
      rocketSelected: rocketSelected,
    });
  };

  const allPlayersReady =
    data.playerOne.rocketSelected && data.playerTwo.rocketSelected;
  useEffect(() => {
    if (allPlayersReady) {
      if (whichPlayer === "playerOne") {
        history.push("/GameBoardOne");
      }
      if (whichPlayer === "playerTwo") {
        history.push("/GameBoardTwo");
      }
    }
  }, [allPlayersReady]);

  return (
    <>
      <Navbar />
      <section className="rocketLobbySection">
        <div className="wrapper">
          {!hideForm && (
            <>
              <h2>Welcome, {userName}!</h2>

              <h3>Choose Three Rockets as your game pieces </h3>

              <form className="style grid-container">
                {rocket.map((singleRocket, index) => {
                  return (
                    <div key={index} className="flex">
                      <div>
                        <input
                          disabled={maxSelectionReach}
                          type="checkbox"
                          id={singleRocket.rocket_id}
                          name={singleRocket.rocket_id}
                          onClick={() => {
                            handleRocketSelected(singleRocket.rocket_name);
                          }}
                        />
                      </div>
                      <div>
                        <img
                          className="rocket1"
                          src={singleRocket.orientation}
                          alt={singleRocket.rocket_name}
                        />
                      </div>

                      <div>
                        <label
                          className="visually-hidden"
                          htmlFor={singleRocket.rocket_id}
                        >
                          {singleRocket.rocket_name}
                        </label>
                        <p className="Tittle">{singleRocket.rocket_name}</p>
                        <p>Diameter: {singleRocket.diameter.feet}</p>
                        <p>Country: {singleRocket.country}</p>
                        <p>Description:{singleRocket.description}</p>
                      </div>
                    </div>
                  );
                })}
                {/* waiting for players notice start */}
                {!maxSelectionReach && (
                  <>
                    <h5>Please make your ship selections</h5>
                  </>
                )}
                {/* waiting for players notice end */}
                {/* playerOne submit selections start */}
                {whichPlayer === "playerOne" && maxSelectionReach && (
                  <>
                    <button
                      type="button"
                      value="You're ready to join"
                      onClick={rocketSelectionSubmit}
                    >
                      Enter the Game {userName}
                    </button>
                  </>
                )}
                {/* playerOne submit selections start */}
                {/* playerTwo submit selections start */}
                {whichPlayer === "playerTwo" && maxSelectionReach && (
                  <button
                    type="submit"
                    value="You're ready to join"
                    onClick={rocketSelectionSubmit}
                  >
                    Enter the Game {userName}
                  </button>
                )}
                {/* playerTwo submit selections end */}
              </form>
            </>
          )}
          {!allPlayersReady && maxSelectionReach && (
            <div className="rocketLobbyWaiting">
              <h2>
                Still waiting for other player to confirm their selections.
              </h2>
              <h3>
                You will be automatically taken to the game board when both
                sides are ready
              </h3>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Rockets;
