import "./App.css";
import "./RocketLobby.css";
import firebase from "./firebase";
import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Navbar from "./Navbar";
import placeRockets from "./placerockets";

import falcon1 from "./images/falcon1.png";
import falcon9 from "./images/falcon9.png";
import falconHeavy from "./images/falconHeavy.png";
import starship from "./images/starship.png";

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
      //adding in our own key:value to assign images base on the height value of the individual object items
      .then((res) => {
        const rocketWeight = res.data.map((rWeight) => {
          const singleRocketWeight = rWeight.mass.kg;
          let weight = falconHeavy;
          if (singleRocketWeight < 100000) {
            weight = falcon1;
          } else if (singleRocketWeight < 800000) {
            weight = falcon9;
          } else if (singleRocketWeight < 1400000) {
            weight = starship;
          } else {
          }
          return {
            ...rWeight,
            weight: weight,
          };
        });
        setRocket(rocketWeight);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //determine whichPlayer in order to submit the rocket selection to the appropriate branch in firebase
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
    firebase
      .database()
      .ref(whichPlayer)
      .update({
        rocketSelected: rocketSelected,
        score:
          rocketSelected[0].size +
          rocketSelected[1].size +
          rocketSelected[2].size,
      });
    //running the placeRockets with a timeout to have enought time to complete operation before the next one runs.
    setTimeout(() => placeRockets(rocketSelected[0], whichPlayer), 500);
    setTimeout(() => placeRockets(rocketSelected[1], whichPlayer), 1000);
    setTimeout(() => placeRockets(rocketSelected[2], whichPlayer), 1500);
  };

  //determine whether firebase has received all the information from both players before proceeding to the gameBoard
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
  }, [allPlayersReady, whichPlayer, history]);
  //return number with commas. looks nicer
  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };
  //
  // THE RETURN
  return (
    <>
      <Navbar />
      <section className="rocketLobbySection displayFlexCol">
        <div className="wrapper">
          {/* hide the form when user has selected and submitted their rocket choice */}
          {!hideForm && (
            <>
              <h2>Welcome, {userName}!</h2>

              <h3>Please Choose Three Rockets As Your Game Pieces</h3>
              {/* form with all of the rockets */}
              <form className="rocketLobbyGridContainer">
                {rocket.map((singleRocket, index) => {
                  return (
                    <span key={index}>
                      <div className="rocketCardGridContainer">
                        <div className="rocketLabel">
                          {/*grid container start  */}
                          <input
                            disabled={maxSelectionReach}
                            type="checkbox"
                            id={singleRocket.rocket_id}
                            name={singleRocket.rocket_id}
                            onClick={() => {
                              handleRocketSelected(singleRocket.rocket_name);
                            }}
                          />
                          <label htmlFor={singleRocket.rocket_id}>
                            {singleRocket.rocket_name}
                          </label>
                        </div>

                        <div className="rocketImage">
                          <img
                            src={singleRocket.weight}
                            alt={singleRocket.rocket_name}
                          />
                        </div>
                        <div className="rocketDescriptions">
                          <p>
                            <span>Country:</span> {singleRocket.country}
                          </p>
                          <p>
                            <span>Height:</span> {singleRocket.height.meters}{" "}
                            meters
                          </p>
                          <p>
                            <span>Mass:</span>{" "}
                            {formatNumber(singleRocket.mass.kg)} kg
                          </p>
                          <p>
                            <span>First Flight:</span>
                            {singleRocket.first_flight}
                          </p>
                          <p>
                            <span>Cost Per Launch:</span>$
                            {formatNumber(singleRocket.cost_per_launch)}
                          </p>
                          <p>
                            <span>Status:</span>
                            {singleRocket.active ? "ACTIVE" : "Decommissioned"}
                          </p>
                        </div>
                      </div>

                      {/*grid container end  */}
                    </span>
                  );
                })}

                {/* waiting for players to chose 3 rockets before allowing to continue */}
                {!maxSelectionReach && (
                  <div className="rocketLobbyPrompt displayFlexRow">
                    <h3>Please make your ship selections to continue</h3>
                  </div>
                )}

                {/* playerOne submit selections  */}
                {whichPlayer === "playerOne" && maxSelectionReach && (
                  <div className="rocketLobbyStart displayFlexRow">
                    <button
                      type="button"
                      value="You're ready to join"
                      onClick={rocketSelectionSubmit}
                    >
                      Click Here to Start the Game
                    </button>
                  </div>
                )}

                {/* playerTwo submit selections  */}
                {whichPlayer === "playerTwo" && maxSelectionReach && (
                  <button
                    type="submit"
                    value="You're ready to join"
                    onClick={rocketSelectionSubmit}
                  >
                    Click Here to Start the Game
                  </button>
                )}
              </form>
            </>
          )}
          {/* Will notify players that the other player needs to make their selections before the game came begin. */}
          {!allPlayersReady && hideForm && (
            <div className="rocketLobbyWaiting">
              <h2>
                Still waiting for other player to confirm their selections.
              </h2>
              <h3>
                You will be automatically taken to the game board when both
                sides are ready to play!
              </h3>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Rockets;
