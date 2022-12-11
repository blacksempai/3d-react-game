function Player(props) {
    const {position, type, model, getObj} = props;

    if(model === 'Cube') {
        return (
            <mesh position={position}>
                <boxGeometry args={[5, 5, 5]} />
                <meshStandardMaterial color='hotpink'/>
            </mesh>
        )
    }
    else {
        return <primitive object={getObj(model)} position={position} scale={[0.1,0.1,0.1]}/> 
    }   
}

export default Player;