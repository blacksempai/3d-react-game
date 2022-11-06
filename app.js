const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const cors = require('cors');
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

server.listen(5000, () => {
    console.log('listening on *:5000');
});

const rooms = [];

io.on('connection', (socket) => {
    console.log('Connection establised with a user ' + socket.id);
    let socketRoom;

    socket.on('join_room', (room) => {
        socket.join(room);
        socketRoom = room;
        const rm = rooms.find(r => r.name == room);
        if(rm) {
            io.to(rm.name).emit('receive_message', rm.messages);
        }
        else {
            rooms.push({
                name: room,
                messages: []
            });
        }
    });
    
    socket.on('send_message', (message) => {
        let room = rooms.find(r => r.name == socketRoom);
        if(room) {
            room.messages.push(message);
            io.to(room.name).emit('receive_message', room.messages);
        }
    })

});