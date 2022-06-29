const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')

const {addUser, getUser, removeUser} = require('./chat')
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

    console.log('User connection')

    socketChannel.on('client-new-message-sent', ({id, message}, cb) => {
        let time = new Date().toLocaleTimeString('ru-RU', {hour: 'numeric', minute: 'numeric'});
        let randomId = v1()
        let newMessage = {id, messageId: randomId, name: 'Patrick', message, time}
        io.emit('new-message-sent', newMessage)

        cb()
    })

    // socketChannel.on('join', (name, cb) => {
    //     const id = addUser(name)
    //     console.log(id)
    //
    //     socketChannel.emit('message', {id, text: `${name}, welcome to chat !`})
    //     socketChannel.emit('message', {user: name, text: `${name}, has joined!`})
    //
    //     cb()
    // })



    socketChannel.on('disconnect', ({name}) => {
        console.log('User left')
    })
})


app.get('/', (req, res) => {
    res.status(200).send('Server is up and running')
})

server.listen(PORT, () => {
    console.log('Server start at port ' + PORT)
})