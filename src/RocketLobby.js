import "./RocketLobby.css";
import firebase from "./firebase";

import axios from "axios";
import { useEffect, useState } from "react";
import rocket1 from "./images/rocket-1.png";
import rocket2 from "./images/rocket-2.png";
import rocket3 from "./images/rocket-3.png";

function Rockets({ data, localToken }) {
  const [rocket, setRocket] = useState([]);
  const [rocketSelected, setRocketSelected] = useState([]);
  const [whichPlayer, setWhichPlayer] = useState("playerOne");

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
  useEffect(() => {
    const playerOne = data.playerOne.token === localToken;
    const playerTwo = data.playerTwo.token === localToken;
    if (playerOne) {
      setWhichPlayer("playerOne");
    }
    if (playerTwo) {
      setWhichPlayer("playerTwo");
    }
  }, [data]);

  const maxSelectionReach = rocketSelected.length === 3;

  const handleRocketSelected = (value) => {
    if (maxSelectionReach) {
      alert("you have selected 3 rockets");
    }
    setRocketSelected([...rocketSelected, value]);
  };

  const rocketSelectionSubmit = () => {
    firebase.database().ref(whichPlayer).update({
      rocketSelected: rocketSelected,
    });
  };

  return (
    <div className="wrapper">
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
        <input
          type="submit"
          value="You're ready to join"
          onClick={rocketSelectionSubmit}
        />
      </form>
    </div>
  );
}

export default Rockets;
