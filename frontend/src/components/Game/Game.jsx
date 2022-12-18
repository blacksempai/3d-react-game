import { Canvas } from '@react-three/fiber'
import classes from './Game.module.css';
import Player from './Player/Player';
import Plane from './Plane/Plane';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import RoomForm from './RoomForm/RoomForm';
import { useEffect, useState, useRef } from 'react';
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const playerMovement = {
  up: false,
  down: false,
  left: false,
  right: false
};


function Game(props) {
  const socket = props.socket;
  const [room, setRoom] = useState({players:[], world: []});
  const [cameraPosition, setCameraPosition] = useState([0,0,0]);

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
      const curentPlayer = room.players.find(p => p.id === socket.id);
      setCameraPosition(curentPlayer.position);
    });
  }, [socket]);

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
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

  return (
    <div className={classes.canvasContainer}>
        <RoomForm socket={socket}/>
        <Canvas flat linear>
            <color attach="background" args={['lightblue']} />
            <PerspectiveCamera makeDefault />
            <OrbitControls 
              target={cameraPosition}
              position={cameraPosition}
              ref={orbitControlsRef}
              maxPolarAngle={1.5}
              minPolarAngle={0.5}
            />
            <ambientLight intensity={0.8}/>
            <pointLight position={[5, 10, 0]} />
            { room.players.map(p => <Player position={p.position} key={p.id} model={p.model} type={p.type} player={p} getObj={getObj}/>) }
            <Plane world={room.world} getObj={getObj}/>
        </Canvas>
    </div>
  );
}

export default Game;
