import { Canvas } from '@react-three/fiber'
import classes from './Game.module.css';
import Player from './Player/Player';
import Plane from './Plane/Plane';
import { OrbitControls, Stars } from '@react-three/drei'
import RoomForm from './RoomForm/RoomForm';
import { useEffect } from 'react';

function Game(props) {
  const socket = props.socket;

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
    }
  }, []);

  const downHandler = (event) => {
    console.log(event.keyCode);
  }

  return (
    <div className={classes.canvasContainer}>
        <RoomForm socket={socket}/>
        <Canvas flat linear>
            <color attach="background" args={['#000']} />
            <OrbitControls/>
            <Stars/>
            <ambientLight intensity={0.2}/>
            <pointLight position={[10, 10, 10]} />
            <Player position={[0, 0, 0]} />
            <Plane/>
        </Canvas>
    </div>
  );
}

export default Game;
