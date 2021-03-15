const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUSer
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'chatBot';

//run when clients connects
io.on('connection', socket => {
    socket.on('joinRom', ({
        username,
        room
    }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

        //Broadcast when user connect
        socket.broadcast.emit('message', formatMessage(botName, 'User has joined the chat'));

    });

    //Listen for message
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER', msg));
    });

    //Run when user discconect
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'User has left the chat'));
    });

});


const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));