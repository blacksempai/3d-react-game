import { useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

function Plane() {
    const obj = useLoader(FBXLoader, process.env.PUBLIC_URL + 'models/Mushroom_4.fbx')
    const obj2 = useLoader(FBXLoader, process.env.PUBLIC_URL + 'models/Cactus_3.fbx')
    const obj3 = useLoader(FBXLoader, process.env.PUBLIC_URL + 'models/Flower_1.fbx')
    return (
        <>
            <primitive object={obj} position={[100,-1,0]} scale={[0.1,0.1,0.1]}/>
            <primitive object={obj2} position={[40,-1,80]} scale={[0.1,0.1,0.1]}/>
            <primitive object={obj3} position={[-14,-1,18]} />
            <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[1000, 1000]}/>
                <meshStandardMaterial color="green" />
            </mesh>
        </>
    )
}

export default Plane;