import "./Rockets.css";
import axios from "axios";
import { useEffect, useState } from "react";
import rocket1 from "./images/rocket-1.png";
import rocket2 from "./images/rocket-2.png";
import rocket3 from "./images/rocket-3.png";

function Rockets() {
  const [rocket, setRocket] = useState([]);

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
          console.log(singleRocketHeight);
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

  return (
    <div>
      <h3>Choose Three Rockets as your game pieces </h3>
      <form className="style">
        {rocket.map((singleRocket, index) => {
          return (
            <div key={index}>
              <label
                className="visually-hidden"
                htmlFor={singleRocket.rocket_id}
              >
                {singleRocket.rocket_name}
              </label>
              <input
                type="checkbox"
                id={singleRocket.rocket_id}
                name={singleRocket.rocket_id}
              />
              <img
                className="rocket1"
                src={singleRocket.orientation}
                alt={singleRocket.rocket_name}
              />
              <p>Rocket Name: {singleRocket.rocket_name}</p>
              <p>Diameter: {singleRocket.diameter.feet}</p>
              <p>Country: {singleRocket.country}</p>
              <p>Description:{singleRocket.description}</p>
            </div>
          );
        })}
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Rockets;
