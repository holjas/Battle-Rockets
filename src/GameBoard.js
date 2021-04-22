import { useState, useEffect } from "react";
import firebase from "./firebase";
import "./App.css";
import WinPopUp from "./WinPopUp";

function GameBoard({ data, localToken }) {
  const [whichPlayer, setWhichPlayer] = useState("");
  const [rocketSelections, setRocketSelections] = useState([]);
  // HOLLy STUFF START
  const [userName, setUserName] = useState("");
  //HOLLY STUFF END
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
        setRocketSelections(data.playerTwo.rocketSelected);
        setUserName(data.playerTwo.name);
      }
    }
  }, [data, localToken]);

  // initializing gameboard as an object with two arrays to use for game logic, and also to pass to firebase for two player integration
  const gameBoards = {
    playerOneBoard: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ],
    playerTwoBoard: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ],
  };

  let score = 10;
  // initializing stateful variables that will be necessary for game logic, including the player board, and the mirror of the opponent's board
  const [boardPlayerOne, setBoardPlayerOne] = useState(
    gameBoards.playerOneBoard
  );
  const [boardPlayerTwo, setBoardPlayerTwo] = useState(
    gameBoards.playerTwoBoard
  );
  const [playerOneScore, setPlayerOneScore] = useState(score);
  const [playerTwoScore, setPlayerTwoScore] = useState(score);
  const [playerOneTurn, setPlayerOneTurn] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    // this set up an object to pass to the database that will hold either the player one board array or the player two board array.
    const gameLogic = {};
    // this function is used to randomly rotate rockets and place them randomly on the gameboard, and in the gameboard array.
    const placeRockets = (rocket, gameBoard, player) => {
      if (player === "playerOneBoard") {
        gameBoard = gameBoard.playerOneBoard;
        gameLogic.playerOneGrid = gameBoard;
        gameLogic.playerOneScore = score;
      }
      if (player === "playerTwoBoard") {
        gameBoard = gameBoard.playerTwoBoard;
        gameLogic.playerTwoGrid = gameBoard;
        gameLogic.playerTwoScore = score;
      }
      // getting random value from ship direction array to see if ship will be pointed horizontally or vertically, why showing how many jumps its position will take in the array. If it's horizontal, it will increment by one, and if vertical, it will increment by 7 (the width of the board).
      let direction;
      let randomDirection = Math.floor(
        Math.random() * rocket.directions.length
      );
      let currentDirection = rocket.directions[randomDirection];
      if (randomDirection === 0) {
        direction = 1;
      }
      if (randomDirection === 1) {
        direction = 7;
      }
      // find a random start point for each rocketship
      let randomStart = Math.abs(
        Math.floor(
          Math.random() * gameBoard.length -
            rocket.directions[0].length * direction
        )
      );

      // make sure that squares we're placing rockets into aren't occupied
      const isTaken = currentDirection.some(
        (index) => gameBoard[randomStart + index] !== 0
      );
      // if current rocket is at the 6th spot in the array row (the far right edge), it can still register, but if it's higher that that it can't be placed on the board
      const atRightEdge = currentDirection.some(
        (index) => (randomStart + index) % 7 === 6
      );
      // if current rocket is at the 1st spot in the array row (row 0, the far left edge), it can still register, but if it's lower than that it can't be placed on the board
      const atLeftEdge = currentDirection.some(
        (index) => (randomStart + index) % 7 === 0
      );
      // if the rocket position meets all these conditions by not being in a taken space, and not being over the left or right edge of the board, it can be placed on the board
      if (!isTaken && !atRightEdge && !atLeftEdge) {
        currentDirection.forEach((index) => {
          gameBoard[randomStart + index] = rocket.name;
        });
        // once the rocket has found its position, update the game board in firebase to enable two player play.
        const dbRef = firebase.database().ref();
        dbRef.update(gameLogic);

        // if none of the conditions above are met to properly place a rocket on the gameboard, the process is repeated until successful.
      } else placeRockets(rocket, gameBoard);
    };
  }, []);
  // game logic is handled inside this function that is triggered when the user clicks on any square
  const handleClick = (event, index, player) => {
    // setting up connection to firebase, because its values will be updated once the game logic has run
    const dbRef = firebase.database().ref();
    // gathering a value from the database to see if the game is over
    dbRef.on("value", (data) => {
      if (!data.val().isGameOver) {
        // this variable gathers the value mapped into the button, which corresponds to a point in the array
        const cell = event.target.value;
        // creating copies of both arrays that will be used to set the updated states of the game board and mirror
        if (player === "playerOne") {
          const boardCopy = [...boardPlayerTwo];
          if (cell === "🚀" || cell === "⭕️") {
          } else {
            if (cell === "0") {
              boardCopy[index] = "⭕️";
            } else if (cell === "R1" || "R2" || "R3") {
              boardCopy[index] = "🚀";
              setPlayerOneScore(playerOneScore - 1);
            }
            // this sets the state of the board for player two.
            setBoardPlayerTwo(boardCopy);
            // switch from player to player
            setPlayerOneTurn(false);
          }
        } else {
          const boardCopy = [...boardPlayerOne];
          if (cell === "🚀" || cell === "⭕️") {
          } else {
            if (cell === "0") {
              boardCopy[index] = "⭕️";
            } else if (cell === "R1" || "R2" || "R3") {
              boardCopy[index] = "🚀";
              setPlayerTwoScore(playerTwoScore - 1);
            }
            // this sets the state of the board for player two.
            setBoardPlayerOne(boardCopy);
            // switch from player to player
            setPlayerOneTurn(true);
          }
        }
      }
    });

    const winPopUp = document.querySelector(".win");
    const winButton = document.querySelector(".winButt");

    if (playerOneScore === 0 || playerTwoScore === 0) {
      setIsGameOver(true);
      // game is over: direct to pop up component to display winner
      WinPopUp();
      winPopUp.classList.remove("hidden");
      winButton.classList.remove("hidden");
    }

    const gameLogic = {
      playerOneGrid: boardPlayerOne,
      playerTwoGrid: boardPlayerTwo,
      playerOneScore: playerOneScore,
      playerTwoScore: playerTwoScore,
      isPlayerOneTurn: playerOneTurn,
      isGameOver: isGameOver,
    };
    dbRef.update(gameLogic);
  };
  // HOLLYS STUFF STARTS HERE
  console.log(`${whichPlayer} is ${userName}`);
  //HOLLY STUFF ENDS HERE
  return (
    <div className="GameScreen wrapper">
      {/* playerone screen start */}

      {/* TOP LEFT CORNER - PLAYER ONE ATTACKS PLAYER TWO HERE*/}
      <div className="container">
        <p>{userName}</p>
        <div className="grid boardPlayerOne">
          {boardPlayerTwo.map((value, index) => {
            const playerTurn = playerOneTurn ? false : true;
            return (
              <button
                key={index}
                onClick={(event) => handleClick(event, index, whichPlayer)}
                value={boardPlayerTwo[index]}
                disabled={playerTurn}
              >
                {value}
              </button>
            );
          })}
        </div>

        {/* TOP RIGHT CORNER - PLAYER TWO ATTACKS PLAYER ONE HERE*/}
        <div className="grid boardPlayerTwo">
          {boardPlayerOne.map((value, index) => {
            const playerTurn = playerOneTurn ? true : false;
            return (
              <button
                key={index}
                onClick={(event) => handleClick(event, index, whichPlayer)}
                value={boardPlayerOne[index]}
                disabled={playerTurn}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>

      {/* playerone screen end */}

      {/* playerTwo screen start */}

      <div className="container">
        <p>{userName}</p>

        {/* BOTTOM LEFT CORNER - PLAYER ONE TRACKS THEIR STATUS HERE*/}
        <div className="grid mirrorPlayerOne">
          {boardPlayerOne.map((value, index) => {
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
          {boardPlayerTwo.map((value, index) => {
            const cellValue = value === 0 ? null : value;
            return (
              <button key={index} value={boardPlayerTwo[index]}>
                {cellValue}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GameBoard;
