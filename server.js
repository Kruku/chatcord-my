const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

//run when clients connects
io.on('connection', socket => {
    //Welcome new user
    socket.emit('message', 'Welcome to ChatCord!');

    //Broadcast when user connect
    socket.broadcast.emit('message', 'User has joined the chat');

    //Run when user discconect
    socket.on('disconnect', () => {
        io.emit('message', 'User has left the chat');
    });

    //Listen for message
    socket.on('chatMessage', (msg) => {
        io.emit('message', msg);
    });
});


const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));