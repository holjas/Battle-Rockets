import './App.css';
import GameBoard from './GameBoard';
import WinPopUp from './WinPopUp';

function App() {
  return (
    <div className="App">
      <WinPopUp />
      <GameBoard />
    </div>
  );
}

export default App;