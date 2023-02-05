import classes from './Chat.module.css';

function Chat({socket, messages}) {
 
  const sendMessage = (event) => {
    event.preventDefault();
    const message = event.target.message.value;
    if(message) {
      socket.emit('message', message);
    }
  }

  return (
    <div className={classes.chat}>
      <ul className={classes.chat__list}>
        {messages.map(m => <li className={classes.chat__item}>{m}</li>)}
      </ul>
      <form className={classes.chat__form} onSubmit={sendMessage}>
        <input type="text" name='message' className={classes.chat__input}/>
        <button type="submit" className={classes.chat__submit}>Send</button>
      </form>
    </div>
  );
}

export default Chat;
