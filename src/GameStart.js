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
    // if (player === "one") {
    //   setIsPlayerOneReady(true);
    //   const dbRef = firebase.database().ref().child("playerOne");
    //   dbRef.push({
    //     playerName: playerOneName,
    //     rocketSelection: {
    //       rocketOne: "one",
    //       rocketTwo: "two",
    //     },
    //   });
    //   setPlayerOneName("");
    // }
    // if (player === "two") {
    //   setIsPlayerTwoReady(true);
    //   const dbRef = firebase.database().ref().child("playerTwo");
    //   dbRef.push({
    //     playerName: playerTwoName,
    //     rocketSelection: {
    //       rocketOne: "one",
    //       rocketTwo: "two",
    //     },
    //   });
    //   setPlayerTwoName("");
    // }
  };
  //confirm that both players are ready and game can start. gameStart Section will be hidden, and next section will appear
  // useEffect(() => {
  //   if (isPlayerOneReady && isPlayerTwoReady) {
  //     props.handleShowGameStart();
  //   }
  // }, [isPlayerOneReady, isPlayerTwoReady]);
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
        }}
      >
        player two
      </button>
    </section>
  );
}

export default GameStart;
