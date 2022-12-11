import { useLoader } from "@react-three/fiber";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { RepeatWrapping } from 'three';


function Plane(props) {
    const { world, getObj } = props;

    const texture = useLoader(TextureLoader, process.env.PUBLIC_URL + 'textures/grass.jpg');
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(100, 100);
    texture.anisotropy = 16;

    const submarine = useLoader(FBXLoader, process.env.PUBLIC_URL + 'models/submarine.fbx');
    const house = useLoader(FBXLoader, process.env.PUBLIC_URL + 'models/house.fbx');
    return (
        <>   
        <primitive object={submarine} position={[50,15,50]} scale={[0.1,0.1,0.1]}/> 
        <primitive object={house} position={[200,-4,-20]} scale={[0.05,0.05,0.05]}/> 

        { world.map(o => 
            <primitive key={o.id} object={getObj(o.model)} position={o.position} scale={[0.1,0.1,0.1]}/>
        ) }
            
        <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1000, 1000]}/>
            <meshPhongMaterial attach="material" map={texture}/>
        </mesh>
        </>
    )
}

export default Plane;