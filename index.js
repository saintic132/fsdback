const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')

setInterval(function() {
    http.get('https://seobilityback.herokuapp.com/');
}, 300000);

const {addUser, returnChat, getUser, removeUser} = require('./chat')

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
        const userId = addUser(name, socketChannel.id)
        const chat = returnChat()
        socketChannel.emit('self-user-data', {userId, userName: name})
        socketChannel.emit('other-user-in-chat', chat)
        socketChannel.broadcast.emit('new-user-join', {userId, userName: name})
        cb()
    })

    socketChannel.on('client-new-message-sent', ({id, message}, cb) => {
        let userData = getUser(id)
        let time = new Date().toLocaleTimeString('ru-RU', {hour: 'numeric', minute: 'numeric'})
        let randomId = v1()
        let newMessage = {userId: id, messageId: randomId, userName: userData.userName, message, time}
        io.emit('new-message-sent', newMessage)
        cb()
    })

    socketChannel.on('disconnect', () => {
        removeUser(socketChannel.id)
        io.emit('user-left-from-chat', socketChannel.id)
    })
})


app.get('/', (req, res) => {
    res.status(200).send('Server is up and running')
})

server.listen(PORT, () => {
    console.log('Server start at port ' + PORT)
})