import firebase from "./firebase";
import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Navbar from "./Navbar";
import placeRockets from "./placerockets";

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
      //adding in our own key:value to assign images base on the height value of the individual object items
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
  //
  // THE RETURN
  return (
    <>
      <Navbar />
      <section className="rocketLobbySection">
        <div className="wrapper">
          {/* hide the form when user has selected and submitted their rocket choice */}
          {!hideForm && (
            <>
              <h2>Welcome, {userName}!</h2>

              <h3>Please Choose Three Rockets As Your Game Pieces</h3>
              {/* form with all of the rockets */}
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
                      <div className="rocketImageSize">
                        <img
                          className="rocketImages"
                          src={singleRocket.orientation}
                          alt={singleRocket.rocket_name}
                        />
                      </div>

                      <div className="textDiv">
                        <label
                          className="visually-hidden"
                          htmlFor={singleRocket.rocket_id}
                        >
                          {singleRocket.rocket_name}
                        </label>
                        <h4 className="rocketTitle">
                          {singleRocket.rocket_name}
                        </h4>
                        <p>
                          <span>Height:</span> {singleRocket.height.meters}
                          meters
                        </p>
                        <p>
                          <span>Country</span>: {singleRocket.country}
                        </p>
                        <p>
                          <span>Description:</span> {singleRocket.description}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* waiting for players to chose 3 rockets before allowing to continue */}
                {!maxSelectionReach && (
                  <>
                    <h5>Please make your ship selections</h5>
                  </>
                )}

                {/* playerOne submit selections  */}
                {whichPlayer === "playerOne" && maxSelectionReach && (
                  <>
                    <button
                      className="submitButton"
                      type="button"
                      value="You're ready to join"
                      onClick={rocketSelectionSubmit}
                    >
                      Click Here to Start the Game
                    </button>
                  </>
                )}

                {/* playerTwo submit selections  */}
                {whichPlayer === "playerTwo" && maxSelectionReach && (
                  <button
                    className="submitButton"
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