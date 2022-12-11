function Player(props) {
    return (
        <mesh position={props.position}>
            <boxGeometry args={[5, 5, 5]} />
            <meshStandardMaterial color='hotpink'/>
        </mesh>
    )
} 

export default Player;