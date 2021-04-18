import { useState, useEffect } from 'react';
import firebase from './firebase';
import './App.css';



function Game() {
  // since the game board is 7x7, this variable will determine the vertical space occupied by a rocket if it is rotated vertically. 
  const width = 7;
  // setting properties for each rocket as an object inside an array
  const rocketArray = [
    {
        name: "R1",
        size: 1,
        score: 475,
        directions: [
        // horizontal, because it's only one square wide
            [0, 1],
        // vertical, because it jumps every seven spots in the array
            [0, width]
        ]
    },
    {
        name: "R2",
        size: 2,
        score: 375,
        directions: [
            [0, 1, 2],
            [0, width, width*2]
        ]
    },
    {
        name: "R3",
        size: 2,
        score: 375,
        directions: [
            [0, 1, 2],
            [0, width, width*2]
        ]
    },
]
// initializing gameboard as an object with two arrays to use for game logic, and also to pass to firebase for two player integration
const gameBoards = {
    playerOneBoard : [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    playerOneMirror : ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
    playerTwoBoard : [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    playerTwoMirror : ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
  }

// this function is used to randomly rotate rockets and place them randomly on the gameboard, and in the gameboard array.

const placeRockets = (rocket, gameBoard) => {
  // getting random value from ship direction array to see if ship will be pointed horizontally or vertically
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

  // make sure that squares we're popping ships into aren't occupied, or aren't off the edge of the board

  const isTaken = currentDirection.some( (index) => (gameBoard[randomStart + index] !== 1))
// if current rocket is at the 6th spot in the array row (the far right edge), it can still register, but if it's higher that that it can't be placed on the board
  const atRightEdge = currentDirection.some( (index) => (
    (randomStart + index) % width === width - 1))
// if current rocket is at the 1st spot in the array row (row 0, the far left edge), it can still register, but if it's lower that that it can't be placed on the board
  const atLeftEdge = currentDirection.some( (index) => (
    (randomStart + index) % width === 0))

  if (!isTaken && !atRightEdge && !atLeftEdge) {
    currentDirection.forEach( (index) => {
      gameBoard[randomStart + index] = rocket.name;
    })
// if none of the conditions above are met to properly place a rocket on the gameboard, the process is repeated until successful.  
  } else placeRockets(rocket, gameBoard)

}
// this function is called three times to place each rocket into the gameboard array
placeRockets(rocketArray[0], gameBoards.playerOneBoard)
placeRockets(rocketArray[1], gameBoards.playerOneBoard)
placeRockets(rocketArray[2], gameBoards.playerOneBoard)
placeRockets(rocketArray[0], gameBoards.playerTwoBoard)
placeRockets(rocketArray[1], gameBoards.playerTwoBoard)
placeRockets(rocketArray[2], gameBoards.playerTwoBoard)

// initializing stateful variables that will be necessary for game logic, including the player board, and the mirror of the opponent's board
const [boardPlayerOne, setBoardPlayerOne] = useState(gameBoards.playerOneBoard);
const [mirrorPlayerOne, setMirrorPlayerOne] = useState(gameBoards.playerOneMirror);
const [boardPlayerTwo, setBoardPlayerTwo] = useState(gameBoards.playerTwoBoard);
const [mirrorPlayerTwo, setMirrorPlayerTwo] = useState(gameBoards.playerTwoMirror);
const [rocketOneSize, setRocketOneSize] = useState(rocketArray[0].size);
const [rocketTwoSize, setRocketTwoSize] = useState(rocketArray[1].size);
const [rocketThreeSize, setRocketThreeSize] = useState(rocketArray[2].size);
const [shotsTaken, setShotsTaken] = useState(0);
const [playerScore, setPlayerScore] = useState(0);
const [playerOneTurn, setPlayerOneTurn] = useState(true);
const [isGameOver, setIsGameOver] = useState(false);

// set up object for player logic in firebase - includes array of rocket placement on gameboard, as well as scoring, and the current player turn
  useEffect( () => {

    if (playerScore > 1000) {
      setIsGameOver(true);
      // game is over: direct to another screen
    }

    const dbRef = firebase.database().ref();
    const gameBoard = {
      playerOneGrid : boardPlayerOne,
      mirrorOneGrid : mirrorPlayerOne,
      playerTwoGrid : boardPlayerTwo,
      mirrorTwoGrid : mirrorPlayerTwo,
      playerOneScore : playerScore,
      isPlayerOneTurn : playerOneTurn,
      isGameOver : isGameOver
    }
    dbRef.set(gameBoard);
  }, [boardPlayerOne, mirrorPlayerOne, boardPlayerTwo, mirrorPlayerTwo, playerScore,playerOneTurn, isGameOver])
  


// game logic is handled inside this function that is triggered when the user clicks on any square
  const handleClick = (event, index) => {
    // setting up connection to firebase, because its values will be updated once the game logic has run
    const dbRef = firebase.database().ref();
    // gathering a value from the database to see if the game is over
    dbRef.on('value', (data) => {
      if (!data.val().isGameOver) {
        // this variable gathers the value mapped into the button, which corresponds to a point in the array
        const cell = event.target.value;
        // creating copies of both arrays that will be used to set the updated states of the game board and mirror
        const boardCopy = [...boardPlayerOne];
        const mirrorCopy = [...mirrorPlayerOne];
        
        if (cell === "hit" || cell === "miss") {
        } else {
          
          setShotsTaken(shotsTaken + 1);
          if (cell === "0") {
            boardCopy[index] = 'miss';
            mirrorCopy[index] = 'miss';
          } else if (cell === "R1" || "R2" || "R3") {
            boardCopy[index] = 'hit';
            mirrorCopy[index] = 'hit';
            if (cell === "R1") {
              setRocketOneSize(rocketOneSize - 1);
              if (rocketOneSize === 0) {
                setPlayerScore(playerScore + rocketArray[0].score);
              }
            }
            if (cell === "R2") {
              setRocketTwoSize(rocketTwoSize - 1);
              if (rocketTwoSize === 0) {
                setPlayerScore(playerScore + rocketArray[1].score);
              }
            }
            if (cell === "R3") {
              setRocketThreeSize(rocketThreeSize - 1);
              if (rocketThreeSize === 0) {
                setPlayerScore(playerScore + rocketArray[2].score);
              }
            }
          }
          // 

          setBoardPlayerOne(boardCopy);
          setMirrorPlayerOne(mirrorCopy);

          // switch from player to player
        }
      }
    })
      
  }

  // useEffect( () => {

  //   if (playerScore > 1000) {
  //     setIsGameOver(true);
  //     // game is over: direct to another screen
  //   }

  //   const dbRef = firebase.database().ref();
  //   const gameBoard = {
  //     playerOneGrid : boardPlayerOne,
  //     mirrorOneGrid : mirrorPlayerOne,
  //     playerTwoGrid : boardPlayerTwo,
  //     mirrorTwoGrid : mirrorPlayerTwo,
  //     playerOneScore : playerScore,
  //     isPlayerOneTurn : playerOneTurn,
  //     isGameOver : isGameOver
  //   }
  //   dbRef.update(gameBoard);
  // }, [boardPlayerOne, mirrorPlayerOne, boardPlayerTwo, mirrorPlayerTwo, playerScore,playerOneTurn, isGameOver, handleClick])


  return (
    <div className="GameScreen">
      
            {/* <p>What the player interacts with and score: {playerScore}</p> */}
      <div className="container">
          <div className="grid boardPlayerOne">
            {
              boardPlayerOne.map( (value, index) => {
                return(
                  <button key={index} onClick ={ event => handleClick(event, index) } value={ boardPlayerOne[index] } >{ value }</button>

                )
              })
            }
          </div>

          
           {/* <p>Opponent tracks other player's progress here</p> */}
         <div className="grid boardPlayerTwo">
         {
              boardPlayerTwo.map( (value, index) => {
                return(
                  <button key={index} onClick ={ event => handleClick(event, index) } value={ boardPlayerTwo[index] } >{ value }</button>

                )
              })
            }
         </div>
      </div>

      <div className="container">
          <div className="grid mirrorPlayerTwo">
            {
              boardPlayerTwo.map( (value, index) => {
                return(
                  <button key={index} onClick ={ event => handleClick(event, index) } value={ boardPlayerTwo[index] } >{ value }</button>

                )
              })
            }
          </div>

          
           {/* <p>Opponent tracks other player's progress here</p> */}
         <div className="grid mirrorPlayerOne">
         {
              boardPlayerOne.map( (value, index) => {
                // const cellValue = value === 0 ? null : value
                return(
                  <button key={index} onClick ={ event => handleClick(event, index) } value={ boardPlayerOne[index] } >{ value }</button>

                )
              })
            }
         </div>
      </div>

      


    </div>
  );
}

export default Game;
