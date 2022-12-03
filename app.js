const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const cors = require('cors');
app.use(cors());

app.use(express.static('frontend/build'));

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
        let rm = rooms.find(r => r.name == room);
        if(!rm) {
            rm = {
                name: room,
                messages: [],
                players: []
            }
            rooms.push(rm);
        }
        rm.players.push({
            id: socket.id,
            playerMovement: {},
            position: [0, 0, 0]
        });
    });

    socket.on('player_move', (playerMovement) => {
        const room = rooms.find(r => r.name === socketRoom);
        if(room) {
            const player = room.players.find(p => p.id === socket.id);
            if(player) {
                player.playerMovement = playerMovement;
                console.log(player)
            }
        }
    });

});

setInterval(serverTick, 1000/30);

function serverTick() {
    rooms.forEach(room => {
        room.players.forEach(player => {
            if (player.playerMovement.left) {
                player.position[0] -= 0.25
            }
            if (player.playerMovement.right) {
                player.position[0] += 0.25
            }
            if (player.playerMovement.up) {
                player.position[2] -= 0.25
            }
            if (player.playerMovement.down) {
                player.position[2] += 0.25
            }
        });
        io.to(room.name).emit('server_tick', room);
    })
}