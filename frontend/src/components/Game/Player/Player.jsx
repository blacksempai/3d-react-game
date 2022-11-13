function Player(props) {
    return (
        <mesh position={props.position}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color='hotpink'/>
        </mesh>
    )
} 

export default Player;