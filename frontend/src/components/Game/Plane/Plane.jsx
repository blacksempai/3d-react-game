import { useLoader } from "@react-three/fiber";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';


function Plane(props) {
    const { world } = props;

    const models = new Map();
    models.set('Mushroom_1', useLoader(FBXLoader, process.env.PUBLIC_URL + 'models/Mushroom_1.fbx')); 
    models.set('Mushroom_2', useLoader(FBXLoader, process.env.PUBLIC_URL + 'models/Mushroom_2.fbx'));
    models.set('Mushroom_3', useLoader(FBXLoader, process.env.PUBLIC_URL + 'models/Mushroom_3.fbx'));
    models.set('Mushroom_4', useLoader(FBXLoader, process.env.PUBLIC_URL + 'models/Mushroom_4.fbx'));  

    const submarine = useLoader(FBXLoader, process.env.PUBLIC_URL + 'models/submarine.fbx');
    const house = useLoader(FBXLoader, process.env.PUBLIC_URL + 'models/house.fbx');
    return (
        <>   
        <primitive object={submarine} position={[50,15,50]} scale={[0.1,0.1,0.1]}/> 
        <primitive object={house} position={[200,-4,-20]} scale={[0.05,0.05,0.05]}/> 

        { world.map(o => 
            <primitive key={o.id} object={models.get(o.model)} position={o.position} scale={[0.1,0.1,0.1]}/>
        ) }
            
        <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1000, 1000]}/>
            <meshStandardMaterial color="lightblue" />
        </mesh>
        </>
    )
}

export default Plane;