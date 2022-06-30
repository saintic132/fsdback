const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')

setInterval(function () {
    http.get('http://fsdback.herokuapp.com/');
}, 600000);

const {addUser, returnChat, getUser, removeUser} = require('./chat')
const {v1} = require("uuid");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
    }
})

const PORT = process.env.PORT || 5000

app.use(cors())

io.on('connection', (socketChannel) => {
    socketChannel.on('join', (name, cb) => {
        if (name) {
            const userId = addUser(name, socketChannel.id)
            const chat = returnChat()
            socketChannel.emit('self-user-data', {userId, userName: name})
            socketChannel.emit('other-user-in-chat', chat)
            socketChannel.broadcast.emit('new-user-join', {userId, userName: name})
            cb()
        }
    })

    socketChannel.on('client-new-message-sent', ({userId, message}, cb) => {
        if (userId) {
            let userData = getUser(userId)
            let time = new Date().toLocaleTimeString('ru-RU', {hour: 'numeric', minute: 'numeric'})
            let randomId = v1()
            if (userData) {
                let newMessage = {userId, messageId: randomId, userName: userData.userName, message, time}
                io.emit('new-message-sent', newMessage)
                cb()
            }
        }
    })

    socketChannel.on('disconnect', () => {
        if (socketChannel.id) {
            let userData = getUser(socketChannel.id)
            removeUser(socketChannel.id)
            if (userData) {
                io.emit('user-left-from-chat', userData)
            }
        }
    })
})


app.get('/', (req, res) => {
    res.status(200).send('Server is up and running')
})

server.listen(PORT, () => {
    console.log('Server start at port ' + PORT)
})