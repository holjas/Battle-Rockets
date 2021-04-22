import { useState, useEffect } from "react";

import firebase from "./firebase";
import "./App.css";
import WinPopUp from "./WinPopUp";

function GameBoard({ data, localToken }) {
  // hollys stuff start
  const [whichPlayer, setWhichPlayer] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (localToken) {
      const playerOne = data.playerOne.token === localToken;
      const playerTwo = data.playerTwo.token === localToken;
      if (playerOne) {
        setWhichPlayer("playerOne");
        setUserName(data.playerOne.name);
      }
      if (playerTwo) {
        setWhichPlayer("playerTwo");
        setUserName(data.playerTwo.name);
      }
    }
  }, [data, localToken]);
  //hollys stuff ends

  const [boardPlayerOne, setBoardPlayerOne] = useState(data.playerOne.grid);
  const [boardPlayerTwo, setBoardPlayerTwo] = useState(data.playerTwo.grid);
  const [turn, setTurn] = useState(true);
  let readyToGo = false;
  if (boardPlayerOne && boardPlayerTwo) {
    readyToGo = true;
  }

  // game logic is handled inside this function that is triggered when the user clicks on any square
  const handleClick = (event, index, player) => {
    if (!data.isGameOver) {
      const dbRef = firebase.database().ref(`/${player}`);
      // this variable gathers the value mapped into the button, which corresponds to a point in the array
      const cell = event.target.value;
      // creating copies of both arrays that will be used to set the updated states of the game board and mirror
      let score = data[player].score;
      const boardCopy = data[player].grid;
      console.log(boardCopy);
      if (cell === "🚀" || cell === "⭕️") {
      } else {
        if (cell === "0") {
          boardCopy[index] = "⭕️";
        } else {
          boardCopy[index] = "🚀";
          score = score - 1;
        }
        // this sets the state of the board for player two
        // switch from player to player
        const turnResult = {
          grid: boardCopy,
          score: score,
        };
        dbRef.update(turnResult);
      }
    }
    const dbRef = firebase.database().ref();
    if (player === "playerOne") {
      const update = {};
      update.turn = true;
      dbRef.update(update);
      console.log(`player two turn`);
    }
    if (player === "playerTwo") {
      const update = {};
      update.turn = false;
      dbRef.update(update);
      console.log(`player one turn`);
    }
  };

  // THIS IS WHEN A WINNER IS FOUND

  // const winPopUp = document.querySelector(".win");
  // const winButton = document.querySelector(".winButt");

  // if (playerOneScore === 0 || playerTwoScore === 0) {
  //   setIsGameOver(true);
  //   // game is over: direct to pop up component to display winner
  //   WinPopUp();
  //   winPopUp.classList.remove("hidden");
  //   winButton.classList.remove("hidden");
  // }

  useEffect(() => {
    const dbRef = firebase.database().ref();
    dbRef.on("value", (response) => {
      setBoardPlayerOne(response.val().playerOne.grid);
      setBoardPlayerTwo(response.val().playerTwo.grid);
      setTurn(response.val().turn);
    });
  }, []);

  return (
    <div>
      {readyToGo ? (
        <div className="GameScreen">
          {/* TOP LEFT CORNER - PLAYER ONE ATTACKS PLAYER TWO HERE*/}
          {whichPlayer === "playerOne" && (
            <div className="container">
              <div className="grid boardPlayerOne">
                {boardPlayerOne.map((value, index) => {
                  const playerTurn = data.turn ? true : false;
                  const cellValue = value === 0 ? null : value;
                  return (
                    <button
                      key={index}
                      onClick={(event) =>
                        handleClick(event, index, "playerOne")
                      }
                      value={boardPlayerTwo[index]}
                      disabled={playerTurn}
                    >
                      {cellValue}
                    </button>
                  );
                })}
              </div>

              {/* TOP RIGHT CORNER - PLAYER TWO ATTACKS PLAYER ONE HERE*/}
              <div className="grid boardPlayerTwo">
                {boardPlayerTwo.map((value, index) => {
                  const playerTurn = data.turn ? false : true;
                  const cellValue = value === 0 ? null : value;
                  return (
                    <button
                      key={index}
                      onClick={(event) =>
                        handleClick(event, index, "playerTwo")
                      }
                      value={boardPlayerOne[index]}
                      disabled={playerTurn}
                    >
                      {cellValue}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* BOTTOM LEFT CORNER - PLAYER ONE TRACKS THEIR STATUS HERE*/}
          {whichPlayer === "playerTwo" && (
            <div className="container">
              <div className="grid mirrorPlayerOne">
                {boardPlayerTwo.map((value, index) => {
                  const cellValue = value === 0 ? null : value;
                  return (
                    <button key={index} value={boardPlayerOne[index]}>
                      {cellValue}
                    </button>
                  );
                })}
              </div>

              {/* BOTTOM RIGHT CORNER - PLAYER TWO TRACKS THEIR STATUS */}
              <div className="grid mirrorPlayerTwo">
                {boardPlayerOne.map((value, index) => {
                  const cellValue = value === 0 ? null : value;
                  return (
                    <button key={index} value={boardPlayerTwo[index]}>
                      {cellValue}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default GameBoard;
