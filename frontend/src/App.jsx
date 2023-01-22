import './App.css';
import Game from './components/Game/Game'
import io from 'socket.io-client';

const socket = io.connect(window.location);

function App() {
  return <Game socket={socket}/>;
}

export default App;
