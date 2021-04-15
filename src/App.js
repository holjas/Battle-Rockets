import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import RocketStats from "./RocketStats.js";

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
      <h1>🚀👩‍🚀🚀👨‍🚀🚀BATLLE ROCKETS GOOOOOO 🚀👩‍🚀🚀👨‍🚀🚀</h1>
      {rocket.map((singleRocket) => {
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
      })}
    </div>
  );
}

export default App;
