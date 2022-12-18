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
            rotation: 0,
            position: [0, -2.8, 0],
            model: getRandomModel(),
            type: 'HIDDER'
        });
    });

    socket.on('player_move', ({playerMovement, rotation}) => {
        const room = rooms.find(r => r.name === socketRoom);
        if(room) {
            const player = room.players.find(p => p.id === socket.id);
            if(player) {
                player.playerMovement = playerMovement;
                player.rotation = rotation;
            }
        }
    });

});

const models = ['Mushroom_1', 'Mushroom_2', 'Mushroom_3', 'Mushroom_4']

function getRandomModel() {
    const index = Math.floor(Math.random() * models.length);
    return models[index];
}

function generateWorld() {
    const world = [];
    for(let i = 0; i < 100; i++) {
        const x = Math.floor(Math.random() * 1000) - 500;
        const z = Math.floor(Math.random() * 1000) - 500;
        const object = {
            id: i,
            position: [x, -2.8, z],
            model: getRandomModel()
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
                p.position[0] += Math.sin(p.rotation-Math.PI/2);
                p.position[2] += Math.cos(p.rotation-Math.PI/2);
            }
            if(p.playerMovement.right) {
                p.position[0] += Math.sin(p.rotation+Math.PI/2);
                p.position[2] += Math.cos(p.rotation+Math.PI/2);
            }
            if(p.playerMovement.up) {
                p.position[0] -= Math.sin(p.rotation);
                p.position[2] -= Math.cos(p.rotation);
            }
            if(p.playerMovement.down) {
                p.position[0] += Math.sin(p.rotation);
                p.position[2] += Math.cos(p.rotation);
            }
        });
        //TODO: send only players
        io.to(r.name).emit('server_tick', r);
    });
}