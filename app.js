const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const cors = require('cors');
app.use(cors());

const MAX_PLAYERS = 4;

const TICK_TIME = 25;

const STAGE_PREPARATION = 'PREPARATION';
const STAGE_HIDING = 'HIDING';
const STAGE_PLAYING = 'PLAYING';
const STAGE_HIDERS_WIN = 'HIDERS_WIN';
const STAGE_SEEKER_WIN = 'SEEKER_WIN';

const TYPE_HIDER = 'HIDER';
const TYPE_SPECTATOR = 'SPECTATOR';
const TYPE_SEEKER = 'SEEKER';


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
        let rm = rooms.find(r => r.name == room);
        if(!rm) {
            rm = {
                name: room,
                messages: [],
                players: [],
                world: generateWorld(),
                gameStage: STAGE_PREPARATION,
                hidingTimer: 40000,
                playingTimer: 120000
            }
            rooms.push(rm);
        }
        if(rm.gameStage === STAGE_PREPARATION) {
            socket.join(room);
            socketRoom = room;
            rm.players.push({
                id: socket.id,
                playerMovement: {},
                position: [0, -2.8, 0],
                rotation: 0,
                model: getRandomModel(),
                type: TYPE_HIDER,
            });
            if(rm.players.length === MAX_PLAYERS) {
                startGame(rm);         
            }
        } else {
            socket.emit('error', 'This room is full');
        }
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

function startGame(room) {
    room.gameStage = STAGE_HIDING;
    const seekerIndex = Math.floor(Math.random() * MAX_PLAYERS);
    room.players[seekerIndex].type = TYPE_SEEKER;
    room.players[seekerIndex].model = 'Cube';
}

setInterval(serverTick, TICK_TIME);

function serverTick() {
    rooms.forEach(r => {
        updatePlayerPositions(r.players);
        updateRoomTime(r);
        io.to(r.name).emit('server_tick', r);
    });
}

function updatePlayerPositions(players) {
    players.forEach(p => {
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
}

function updateRoomTime(room) {
    switch(room.gameStage) {
        case STAGE_HIDING: return updateHidingTimer(room);
        case STAGE_PLAYING: return updatePlayingTimer(room);
        default: return;
    }
}

function updateHidingTimer(room) {
    room.hidingTimer -= TICK_TIME;
    if(room.hidingTimer <= 0) {
        room.gameStage = STAGE_PLAYING;
    }
}

function updatePlayingTimer(room) {
    room.playingTimer -= TICK_TIME;
    if(room.playingTimer <= 0) {
        room.gameStage = STAGE_HIDERS_WIN;
    } 
}