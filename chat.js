const {v1} = require("uuid");

const chat = {
    users: [
        {id: 1, name: 'Patrick'}
    ],
    messages: {
        // '1': [
        //     {id: 1, name: 'Patrick', message: 'Hello world asd asd a'},
        // ]
    }
}

const addUser = (name) => {
    let id = v1()
    chat.users.push({id, name})
    chat.messages[id] = []
    return {id}
}

const removeUser = (id) => {
    const index = chat.users.findIndex(user => user.id === id)
    if (index !== -1) {
        return {...chat, users: chat.users.splice(index, 1)[0]}
    }
}

const getUser = (id) => {
    return chat.users.find(user => user.id === id)
}

module.exports = {addUser, removeUser, getUser}