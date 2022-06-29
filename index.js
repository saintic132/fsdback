const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')

const {addUser, getUser, removeUser} = require('./chat')

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
    }
})

const PORT = process.env.PORT || 5000

app.use(cors())

io.on('connection', (socket) => {

    console.log('User connection')


    socket.on('join', (name, cb) => {
        const id = addUser(name)
        console.log(id)

        socket.emit('message', {id, text: `${name}, welcome to chat !`})
        // socket.emit('message', {user: name, text: `${name}, has joined!`})

        cb()
    })

    socket.on('sendMessage', ({id, message}, cb) => {
        const user = getUser(id)
        if (user) {
            io.emit('message', {user: user.name, text: message})
            cb()
        } else {
            return cb('User not found')
        }

    })

    socket.on('disconnect', ({name}) => {
        console.log('User left')
    })
})


app.get('/', (req, res) => {
    res.status(200).send('Server is up and running')
})

server.listen(PORT, () => {
    console.log('Server start at port ' + PORT)
})