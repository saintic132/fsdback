const chat = {
    users: [],
}

const addUser = (userName, userId) => {
    chat.users.push({userId, userName})
    return userId
}

const returnChat = () => {
    return chat.users
}

const getUser = (id) => {
    return chat.users.find(user => user.userId === id)
}

const removeUser = (id) => {
    const index = chat.users.findIndex(user => user.userId === id)
    if (index !== -1) {
        chat.users.splice(index, 1)
    }
}

module.exports = {addUser, returnChat, removeUser, getUser}