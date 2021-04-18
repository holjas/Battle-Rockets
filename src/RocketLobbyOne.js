// function RocketLobbyOne() {
//   return (
//     <>
//       <h2>⏰ YOU'RE in lobby ONE</h2>
//     </>
//   );
// }
// export default RocketLobbyOne;

import "./Rockets.css";
import axios from "axios";
import { useEffect, useState } from "react";
import rocket1 from "./images/rocket-1.png";

function RocketLobbyOne() {
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

  return (
    <div>
      <h3>Choose Three Rockets as your game pieces </h3>

      <form className="style">
        <input type="checkbox" name="rocket1" />
        <label htmlFor="rocket1">
          <img className="rocket1" src={rocket1} />
        </label>
        {rocket.map((singleRocket) => {
          return (
            <div>
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

export default RocketLobbyOne;
