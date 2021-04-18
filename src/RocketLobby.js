import "./Rockets.css";
import axios from "axios";
import { useEffect, useState } from "react";
import firebase from "./firebase";
import rocket1 from "./images/rocket-1.png";

function RocketLobby() {
  const [rocket, setRocket] = useState([]);

  useEffect(() => {
    axios({
      url: "https://api.spacexdata.com/v4/rockets",
      method: "GET",
      dataResponse: "json",
      params: {},
    }).then((res) => {
      setRocket(res.data);
    });
  }, []);

  const handleRocketSelected = () => {
    firebase.database().ref("playerOne").child("rockets").set({
      rocketSelectedOne: "I'm rocket one",
    });
  };

  return (
    <div>
      <h3>Choose Three Rockets as your game pieces </h3>

      <form className="style">
        <input type="checkbox" name="rocket1" onClick={handleRocketSelected} />
        <label htmlFor="rocket1">
          <img className="rocket1" src={rocket1} alt="rocket icon" />
        </label>
        {rocket.map((singleRocket, index) => {
          return (
            <div key={index}>
              <p>Rocket Name: {singleRocket.name}</p>
              <p>Diameter: {singleRocket.diameter.feet}</p>
              <p>Description: {singleRocket.description}</p>
              <p>Country:{singleRocket.description}</p>
            </div>
          );
        })}
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default RocketLobby;
