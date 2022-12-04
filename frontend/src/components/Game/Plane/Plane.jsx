import { useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

function Plane() {
    const obj = useLoader(FBXLoader, process.env.PUBLIC_URL + 'models/Mushroom_4.fbx')
    return (
        <>
            <primitive object={obj} position={[100,-1,0]} scale={[0.1,0.1,0.1]}/>
            <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[1000, 1000]}/>
                <meshStandardMaterial color="green" />
            </mesh>
        </>
    )
}

export default Plane;