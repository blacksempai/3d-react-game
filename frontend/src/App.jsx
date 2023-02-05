import './App.css';
import Game from './components/Game/Game'
import io from 'socket.io-client';

let origin = undefined;

if(process.env.NODE_ENV === 'development') {
  origin = 'http://localhost:5000';
}

const socket = io.connect(origin);

function App() {
  return <Game socket={socket}/>;
}

export default App;
