import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

import GameBoard from './GameBoard';


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
      console.log(rocket);
    });
  },);

  return (
    <div className="App">
      <GameBoard />
    </div>
  );
}

export default App;