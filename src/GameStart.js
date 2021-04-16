import { useState } from "react";

function GameStart(props) {
  // const [isPlayerOneReady, setIsPlayerOneReady] = useState(false);
  // const [isPlayerTwoReady, setIsPlayerTwoReady] = useState(false);
  const [playerOneName, setPlayerOneName] = useState("");
  const [playerTwoName, setPlayerTwoName] = useState("");
  const { addPlayer } = props;

  //handleClick, to confirm when players are ready. Also captures their names.
  const handleIsPlayerReady = (player) => {
    addPlayer(player);
  };
  //captures text input
  const handleChange = (event, playerNumber) => {
    if (playerNumber === "one") {
      setPlayerOneName(event.target.value);
    }
    if (playerNumber === "two") {
      setPlayerTwoName(event.target.value);
    }
  };

  return (
    <section>
      <h2>game start</h2>
      <input
        type="text"
        onChange={(event) => handleChange(event, "one")}
        value={playerOneName}
      ></input>
      <button
        onClick={() => {
          handleIsPlayerReady(playerOneName);
          setPlayerOneName("");
        }}
      >
        player one
      </button>

      <input
        type="text"
        onChange={(event) => handleChange(event, "two")}
        value={playerTwoName}
      ></input>
      <button
        onClick={() => {
          handleIsPlayerReady(playerTwoName);
          setPlayerTwoName("");
        }}
      >
        player two
      </button>
    </section>
  );
}

export default GameStart;
