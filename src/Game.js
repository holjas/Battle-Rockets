import { useState, useEffect } from 'react';
import firebase from './firebase';
import './App.css';
import WinPopUp from './WinPopUp'



function Game() {

  const width = 7;

  const rocketArray = [
    {
        name: "R1",
        size: 1,
        score: 400,
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
        score: 300,
        directions: [
            [0, 1, 2],
            [0, width, width*2]
        ]
    },
    {
        name: "R3",
        size: 2,
        score: 300,
        directions: [
            [0, 1, 2],
            [0, width, width*2]
        ]
    },
]

const gameBoards = {
    playerOne : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    playerTwo : ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""]
  }

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

  const isTaken = currentDirection.some( (index) => (gameBoard[randomStart + index] !== 0))
// if current rocket is at the 6th spot in the array row (the far right edge), it can still register, but if it's higher that that it can't be placed on the board
  const atRightEdge = currentDirection.some( (index) => (
    (randomStart + index) % width === width - 1))
// if current rocket is at the 1st spot in the array row (row 0, the far left edge), it can still register, but if it's lower that that it can't be placed on the board
  const atLeftEdge = currentDirection.some( (index) => (
    (randomStart + index) % width === 0))

  if (!isTaken && !atRightEdge && !atLeftEdge) {
    currentDirection.forEach( (index) => {
      gameBoards.playerOne[randomStart + index] = rocket.name;
    })
} else placeRockets(rocket, gameBoard)


}
placeRockets(rocketArray[0], gameBoards.playerOne)
placeRockets(rocketArray[1], gameBoards.playerOne)
placeRockets(rocketArray[2], gameBoards.playerOne)


  const [click, setClick] = useState(gameBoards.playerOne);
  const [mirror, setMirror] = useState(gameBoards.playerTwo);
  const [rocketOneSize, setRocketOneSize] = useState(rocketArray[0].size);
  const [rocketTwoSize, setRocketTwoSize] = useState(rocketArray[1].size);
  const [rocketThreeSize, setRocketThreeSize] = useState(rocketArray[2].size);
  const [shotsTaken, setShotsTaken] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);


  // useEffect( () => {
  //   const dbRef = firebase.database().ref();
  //   const gameBoard = {
  //     playerOne : click,
  //     mirrorOne : mirror
  //   }
  //   dbRef.push(gameBoard);
  // }, [])

  const winPopUp = document.querySelector('.win');
  const winButton = document.querySelector('.winButt');
  
  const handleClick = (event, index) => {
    const cell = event.target.value;
    const arrayCopy = [...click];
    const mirrorCopy = [...mirror];

    if (cell === "hit" || cell === "miss") {
    } else {
      setShotsTaken(shotsTaken + 1);
      if (cell === "0") {
        arrayCopy[index] = 'miss';
        mirrorCopy[index] = 'miss';
      } else if (cell === "R1" || "R2" || "R3") {
        arrayCopy[index] = 'hit';
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
      if (rocketOneSize <= 0 && rocketTwoSize <= 0 && rocketThreeSize <= 0) {
        setPlayerScore(playerScore * (49 - shotsTaken))
      }
      setClick(arrayCopy);
      setMirror(mirrorCopy);
      // check for a winner
      if (playerScore >= 1000){
        WinPopUp();
        winPopUp.classList.remove('hidden')
        winButton.classList.remove('hidden')
      }
      // update mirror grid
      // switch from player to player
    }
  }

  return (
    <div className="GameScreen">
      <WinPopUp />
            <p>What the player interacts with and score: {playerScore}</p>
      <div className="container">
          <div className="grid gridPlayerOne">
            {
              mirror.map( (value, index) => {
                return(
                  <button key={index} onClick ={ event => handleClick(event, index) } value={ click[index] } >{ value }</button>

                )
              })
            }
          </div>
           <p>Opponent tracks other player's progress here</p>
         <div className="grid gridPlayerTwo">
         {
              click.map( (value, index) => {
                const cellValue = value === 0 ? null : value
                return(
                  <button key={index} value={ click[index] } >{ cellValue }</button>

                )
              })
            }
         </div>
      </div>


    </div>
  );  
}


export default Game;

