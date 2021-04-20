import { useState, useEffect } from 'react';
import firebase from './firebase';
import './App.css';
import WinPopUp from './WinPopUp';



const GameBoard = () => {
  
  // since the game board is 7x7, this variable will determine the vertical space occupied by a rocket if it is rotated vertically. 
  const width = 7;
  // setting properties for each rocket as an object inside an array
  const rocketArray = [
    {
        name: "R1",
        size: 2,
        directions: [
        // horizontal, because it's only one square wide
            [0, 1],
        // vertical, because it jumps every seven spots in the array
            [0, width]
        ]
    },
    {
        name: "R2",
        size: 3,
        directions: [
            [0, 1, 2],
            [0, width, width*2]
        ]
    },
    {
        name: "R3",
        size: 3,
        directions: [
            [0, 1, 2],
            [0, width, width*2]
        ]
    },
]
  // initializing gameboard as an object with two arrays to use for game logic, and also to pass to firebase for two player integration
  const gameBoards = {
      playerOneBoard : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      playerTwoBoard : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    }

  // initializing stateful variables that will be necessary for game logic, including the player board, and the mirror of the opponent's board
  let score = rocketArray[0].size + rocketArray[1].size + rocketArray[2].size;

  const [boardPlayerOne, setBoardPlayerOne] = useState(gameBoards.playerOneBoard);
  const [boardPlayerTwo, setBoardPlayerTwo] = useState(gameBoards.playerTwoBoard);
  const [playerOneScore, setPlayerOneScore] = useState(score);
  const [playerTwoScore, setPlayerTwoScore] = useState(score);
  const [playerOneTurn, setPlayerOneTurn] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);



    useEffect( () => {
      
      // this set up an object to pass to the database that will hold either the player one board array or the player two board array.
      const gameLogic = {};
      // this function is used to randomly rotate rockets and place them randomly on the gameboard, and in the gameboard array.
      const placeRockets = (rocket, gameBoard, player) => {
        if (player === "playerOneBoard") {
          gameBoard = gameBoard.playerOneBoard;
          gameLogic.playerOneGrid = gameBoard;
        } if (player === "playerTwoBoard") {
          gameBoard = gameBoard.playerTwoBoard;
          gameLogic.playerTwoGrid = gameBoard;
        }
        // getting random value from ship direction array to see if ship will be pointed horizontally or vertically, why showing how many jumps its position will take in the array. If it's horizontal, it will increment by one, and if vertical, it will increment by 7 (the width of the board).
        let direction;
        let randomDirection = Math.floor(Math.random() * rocket.directions.length);
        let currentDirection = rocket.directions[randomDirection];
        if (randomDirection === 0) {
          direction = 1;
        }
        if (randomDirection === 1) {
          direction = 7;
        }
        // find a random start point for each rocketship
        let randomStart = Math.abs(Math.floor(Math.random() * gameBoard.length - (rocket.directions[0].length * direction)));

        // make sure that squares we're placing rockets into aren't occupied
        const isTaken = currentDirection.some( (index) => (gameBoard[randomStart + index] !== 0))
        // if current rocket is at the 6th spot in the array row (the far right edge), it can still register, but if it's higher that that it can't be placed on the board
        const atRightEdge = currentDirection.some( (index) => (
          (randomStart + index) % width === width - 1))
        // if current rocket is at the 1st spot in the array row (row 0, the far left edge), it can still register, but if it's lower than that it can't be placed on the board
        const atLeftEdge = currentDirection.some( (index) => (
          (randomStart + index) % width === 0))
        // if the rocket position meets all these conditions by not being in a taken space, and not being over the left or right edge of the board, it can be placed on the board
        if (!isTaken && !atRightEdge && !atLeftEdge) {
          currentDirection.forEach( (index) => {
            gameBoard[randomStart + index] = rocket.name;
          })
        // once the rocket has found its position, update the game board in firebase to enable two player play.
          const dbRef = firebase.database().ref();  
          dbRef.update(gameLogic);
        
        // if none of the conditions above are met to properly place a rocket on the gameboard, the process is repeated until successful.  
        } else placeRockets(rocket, gameBoard)
      }
      // this function is called three times per player to place each rocket into their respective gameboard array.
      placeRockets(rocketArray[0], gameBoards, "playerOneBoard");
      placeRockets(rocketArray[1], gameBoards, "playerOneBoard");
      placeRockets(rocketArray[2], gameBoards, "playerOneBoard");
      placeRockets(rocketArray[0], gameBoards, "playerTwoBoard");
      placeRockets(rocketArray[1], gameBoards, "playerTwoBoard");
      placeRockets(rocketArray[2], gameBoards, "playerTwoBoard");

    }, [])


// this useEffect takes the values of the player one and player two arrays that are in firebase, and uses them to set state for both player boards. They need to be in firebase first in order to enable two-player play, because they'll both be working from the same DB.
useEffect( () => {
  const dbRef = firebase.database().ref();
  dbRef.on('value', (data) => {
    setBoardPlayerOne(data.val().playerOneGrid)
    setBoardPlayerTwo(data.val().playerTwoGrid)
  })
}, [] )
  


// game logic is handled inside this function that is triggered when the user clicks on any square
const handleClickPlayerOne = (event, index) => {
  // setting up connection to firebase, because its values will be updated once the game logic has run
  const dbRef = firebase.database().ref();
  // gathering a value from the database to see if the game is over
  dbRef.on('value', (data) => {
    if (!data.val().isGameOver) {
        // this variable gathers the value mapped into the button, which corresponds to a point in the array
        const cell = event.target.value;
        // creating copies of both arrays that will be used to set the updated states of the game board and mirror
        const boardCopy = [...boardPlayerTwo];
        if (cell === "🚀" || cell === "⭕️") {
        } else {
          if (cell === "0") {
            boardCopy[index] = '⭕️';
          } else if (cell === "R1" || "R2" || "R3") {
            boardCopy[index] = '🚀';
            setPlayerOneScore(playerOneScore - 1);
          }
          // this sets the state of the board for player two.
          setBoardPlayerTwo(boardCopy);
          // switch from player to player
          setPlayerOneTurn(false);
        }
      }
    })
  }
// game logic is handled inside this function that is triggered when the user clicks on any square
const handleClickPlayerTwo = (event, index) => {
  // setting up connection to firebase, because its values will be updated once the game logic has run
  const dbRef = firebase.database().ref();
  // gathering a value from the database to see if the game is over
  dbRef.on('value', (data) => {
    if (!data.val().isGameOver) {
        // this variable gathers the value mapped into the button, which corresponds to a point in the array
        const cell = event.target.value;
        // creating copies of both arrays that will be used to set the updated states of the game board and mirror
        const boardCopy = [...boardPlayerOne];
        if (cell === "🚀" || cell === "⭕️") {
        } else {
          if (cell === "0") {
            boardCopy[index] = '⭕️';
          } else if (cell === "R1" || "R2" || "R3") {
            boardCopy[index] = '🚀';
            setPlayerTwoScore(playerTwoScore - 1);
          }
          // this sets the state of the board for player one.
          setBoardPlayerOne(boardCopy);
          // switch from player to player
          setPlayerOneTurn(true);
        }
      }
    })
  }

// this useEffect checks if there is a game winner and updates firebase with the game results after every player click.
useEffect( () => {

  const winPopUp = document.querySelector('.win');
  const winButton = document.querySelector('.winButt');

  if (playerOneScore === 0 || playerTwoScore === 0) {
    setIsGameOver(true);
    // game is over: direct to pop up component to display winner
    WinPopUp();
      winPopUp.classList.remove('hidden');
      winButton.classList.remove('hidden');

  }

  const dbRef = firebase.database().ref();
  const gameLogic = {
    playerOneGrid : boardPlayerOne,
    playerTwoGrid : boardPlayerTwo,
    playerOneScore : playerOneScore,
    playerTwoScore : playerTwoScore,
    isPlayerOneTurn : playerOneTurn,
    isGameOver : isGameOver
  }
  dbRef.set(gameLogic);

}, [handleClickPlayerOne, handleClickPlayerTwo])







  return (
    <div className="GameScreen">
      
            {/* TOP LEFT CORNER - PLAYER ONE ATTACKS PLAYER TWO HERE*/}
      <div className="container">
          <div className="grid boardPlayerOne">
            {
              boardPlayerTwo.map( (value, index) => {
                const playerTurn = playerOneTurn ? false : true;
                return(
                  <button 
                    key={index} 
                    onClick ={ event => handleClickPlayerOne(event, index) } 
                    value={ boardPlayerTwo[index] } 
                    disabled={playerTurn}>
                    { value }
                  </button>
                )
              })
            }
          </div>

          <WinPopUp />
           {/* TOP RIGHT CORNER - PLAYER TWO ATTACKS PLAYER ONE HERE*/}
         <div className="grid boardPlayerTwo">
         {
              boardPlayerOne.map( (value, index) => {
                const playerTurn = playerOneTurn ? true : false;
                return(
                  <button 
                    key={index} 
                    onClick ={ event => handleClickPlayerTwo(event, index) } 
                    value={ boardPlayerOne[index] }
                    disabled={playerTurn}>
                    { value }
                  </button>

                )
              })
            }
         </div>
      </div>

      <div className="container">
        {/* BOTTOM LEFT CORNER - PLAYER ONE TRACKS THEIR STATUS HERE*/}
          <div className="grid mirrorPlayerOne">
            {
              boardPlayerOne.map( (value, index) => {
                const cellValue = value === 0 ? null : value;
                return(
                  <button 
                    key={index} 
                    value={ boardPlayerOne[index] }>
                    { cellValue }
                  </button>

                )
              })
            }
          </div>

          
           {/* BOTTOM RIGHT CORNER - PLAYER TWO TRACKS THEIR STATUS */}
         <div className="grid mirrorPlayerTwo">
         {
              boardPlayerTwo.map( (value, index) => {
                const cellValue = value === 0 ? null : value;
                return(
                  <button 
                    key={index} 
                    value={ boardPlayerTwo[index] } >
                    { cellValue }
                  </button>

                )
              })
            }
         </div>
      </div>

      


    </div>
  );
}

export default GameBoard;
