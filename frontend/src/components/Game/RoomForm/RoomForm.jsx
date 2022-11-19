import classes from './RoomForm.module.css'


const RoomForm = () => {
    return (
    <form className={classes.form}>
        <input type="text" placeholder="Room"/>
        <button>Join</button>
    </form>
    )
}

export default RoomForm;