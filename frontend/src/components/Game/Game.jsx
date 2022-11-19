import { Canvas } from '@react-three/fiber'
import classes from './Game.module.css';
import Player from './Player/Player';
import Plane from './Plane/Plane';
import { OrbitControls } from '@react-three/drei'
import RoomForm from './RoomForm/RoomForm';

function Game() {
  return (
    <div className={classes.canvasContainer}>
        <RoomForm/>
        <Canvas flat linear>
            <OrbitControls/>
            <ambientLight/>
            <pointLight position={[10, 10, 10]} />
            <Player position={[2, 0, 0]} />
            <Plane/>
        </Canvas>
    </div>
  );
}

export default Game;
