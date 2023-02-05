import { Canvas } from '@react-three/fiber'
import classes from './Game.module.css';
import Player from './Player/Player';
import Plane from './Plane/Plane';
import { Cylinder, OrbitControls } from '@react-three/drei'
import RoomForm from './RoomForm/RoomForm';
import { useEffect, useState, useRef } from 'react';
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import Timer from './Timer/Timer';
import Info from './Info/Info';

const playerMovement = {
  up: false,
  down: false,
  left: false,
  right: false
};

const STAGE_PREPARATION = 'PREPARATION';
const STAGE_HIDING = 'HIDING';
const STAGE_PLAYING = 'PLAYING';
const STAGE_HIDERS_WIN = 'HIDERS_WIN';
const STAGE_SEEKER_WIN = 'SEEKER_WIN';

const TYPE_HIDER = 'HIDER';
const TYPE_SPECTATOR = 'SPECTATOR';
const TYPE_SEEKER = 'SEEKER';


function Game(props) {
  const socket = props.socket;
  const [room, setRoom] = useState({players:[], world: []});
  const [cameraPosition, setCameraPosition] = useState([0,0,0]);
  const [currentPlayer, setCurrentPlayer] = useState({});
    const [activeSkills, setActiveSkills] = useState([]);
  const orbitControlsRef = useRef();

  const models = new Map();
  models.set('Mushroom_1', useLoader(FBXLoader, process.env.PUBLIC_URL + 'models/Mushroom_1.fbx')); 
  models.set('Mushroom_2', useLoader(FBXLoader, process.env.PUBLIC_URL + 'models/Mushroom_2.fbx'));
  models.set('Mushroom_3', useLoader(FBXLoader, process.env.PUBLIC_URL + 'models/Mushroom_3.fbx'));
  models.set('Mushroom_4', useLoader(FBXLoader, process.env.PUBLIC_URL + 'models/Mushroom_4.fbx'));

  const getObj = (name) => {
      const object = models.get(name);
      return object.clone();
  }

  useEffect(() => {
    socket.on('server_tick', room => {
      setRoom(room);
      const curP = room.players.find(p => p.id === socket.id);
      setCurrentPlayer(curP);
      setCameraPosition(curP.position);
    });
    socket.on('error', error => alert(error));
  }, [socket]);

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    window.addEventListener('keypress', pressHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
      window.removeEventListener('keypress', pressHandler);
    }
  }, []);

  const downHandler = (event) => {
    switch(event.keyCode) {
      case 87: playerMovement.up = true; break;
      case 68: playerMovement.right = true; break;
      case 65: playerMovement.left = true; break;
      case 83: playerMovement.down = true; break;
      default: return;
    }
    const rotation = orbitControlsRef.current.getAzimuthalAngle();
    socket.emit('player_move', {playerMovement, rotation});
  }

  const upHandler = (event) => {
    switch(event.keyCode) {
      case 87: playerMovement.up = false; break;
      case 68: playerMovement.right = false; break;
      case 65: playerMovement.left = false; break;
      case 83: playerMovement.down = false; break;
      default: return;
    }
    const rotation = orbitControlsRef.current.getAzimuthalAngle();
    socket.emit('player_move', {playerMovement, rotation});
  }

  const pressHandler = (event) => {
      if(event.keyCode === 101) {
        socket.emit('catch_spell');
        activeSkills.push({position: currentPlayer.position});
        setTimeout(() => activeSkills.pop(), 500);
      }
  }

  if(room.gameStage === STAGE_HIDING && currentPlayer.type === TYPE_SEEKER) {
    return (
      <div className={classes.blackScreen}>
        <Timer gameStage={room.gameStage} timer={room.hidingTimer} color='white'/>
        <h1 className={classes.redTitle}>YOU ARE SEEKER!</h1>
      </div>
    );
  }

  if(room.gameStage === STAGE_HIDERS_WIN) {
    return (
      <div className={classes.blackScreen}>
        <h1 className={classes.greenTitle}>HIDDERS WIN!</h1>
      </div>
    );
  }

  if(room.gameStage === STAGE_SEEKER_WIN) {
    return (
      <div className={classes.blackScreen}>
        <h1 className={classes.redTitle}>SEEAKER WIN!</h1>
      </div>
    );
  }


  return (
    <div className={classes.canvasContainer}>
        {!room.name ? <RoomForm socket={socket}/> : null}
        {
        room.gameStage === STAGE_PREPARATION ? 
        <Info message="Preparing Stage"/> : null
        }
        {
        room.gameStage === STAGE_HIDING ? 
        <Timer gameStage={room.gameStage} timer={room.hidingTimer} color='black'/> : null
        }
        {
        room.gameStage === STAGE_PLAYING ? 
        <Timer gameStage={room.gameStage} timer={room.playingTimer} color='black'/> : null
        }
        <Canvas flat linear>
            <color attach="background" args={['lightblue']} />
            <OrbitControls 
              target={cameraPosition}
              position={cameraPosition}
              ref={orbitControlsRef}
              maxPolarAngle={1.3}
              minPolarAngle={0.5}
              minDistance={5} 
              maxDistance={15}
            />
            <ambientLight intensity={0.8}/>
            {activeSkills.map(skill => 
              <Cylinder args={[15, 15, 1.5, 30]} position={skill.position} material-color="hotpink"/>
            )}
            <pointLight position={[5, 10, 0]} />
            { room.players.map(p => <Player position={p.position} key={p.id} model={p.model} type={p.type} getObj={getObj}/>) }
            <Plane world={room.world} getObj={getObj}/>
        </Canvas>
    </div>
  );
}

export default Game;
