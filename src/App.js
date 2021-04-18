import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import RocketStats from "./RocketStats.js";
import UserInput from "./UserInput";
import moon from "./images/moon-phase.png" 

import Game from './Game';

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
    <div className="App">
      <Game />
    </div>
  );
}

export default App;