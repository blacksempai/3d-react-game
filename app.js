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
        let rm = rooms.find(r => r.name == room);
        if(!rm) {
            rm = {
                name: room,
                messages: [],
                players: [],
                world: generateWorld()
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
            }
        }
    });

});

const models = ['Mushroom_1', 'Mushroom_2', 'Mushroom_3', 'Mushroom_4']

function generateWorld() {
    const world = [];
    for(let i = 0; i < 100; i++) {
        const index = Math.floor(Math.random() * models.length);
        const x = Math.floor(Math.random() * 1000) - 500;
        const z = Math.floor(Math.random() * 1000) - 500;
        const object = {
            id: i,
            position: [x, 0, z],
            model: models[index]
        }
        world.push(object);
    }
    return world;
}

setInterval(serverTick, 25);

function serverTick() {
    rooms.forEach(r => {
        r.players.forEach(p => {
            if(p.playerMovement.left) {
                p.position[0] -= 1;
            }
            if(p.playerMovement.right) {
                p.position[0] += 1;
            }
            if(p.playerMovement.up) {
                p.position[2] -= 1;
            }
            if(p.playerMovement.down) {
                p.position[2] += 1;
            }
        });
        //TODO: send only players
        io.to(r.name).emit('server_tick', r);
    });
}