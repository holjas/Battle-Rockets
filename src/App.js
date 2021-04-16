import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import RocketStats from "./RocketStats.js";
import UserInput from "./UserInput";
import moon from "./images/moon-phase.png" 

function App() {
  const [rocket, setRocket] = useState([]);

  useEffect(() => {
    axios({
      url: "https://api.spacexdata.com/v4/rockets",
      method: "GET",
      dataResponse: "json",
      params: {},
    }).then((res) => {
      setRocket(res.data);
      console.log(res.data);
    });
  }, []);

  return (
    <div className='App'>
      <header>
      <h1>Battle Rockets</h1>
      <h2></h2>
      <p></p>
      <UserInput />
      <div className="flexMoon">
      <img className="moon"src={moon}/>
      <p>Ready</p>
      </div>

      {/* {rocket.map((singleRocket) => {
        return (
          <RocketStats
            name={singleRocket.name}
            mass={singleRocket.mass.lb}
            height={singleRocket.height.feet}
            diameter={singleRocket.diameter.feet}
            country={singleRocket.country}
            description={singleRocket.description}
          />
        );
      })} */}
      </header>
    </div>
  );
}

export default App;
