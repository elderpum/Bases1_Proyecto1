const { verifyJWT } = require("../helpers");
const { ChatMessages } = require("../models");

const chat = new ChatMessages();

const socketController = async (socket, io) => {
    const user = await verifyJWT(socket.handshake.headers['x-token']);
    if (!user) return socket.disconnect();

    chat.connectUser(user);
    io.emit('active-users', chat.usersArr);
    socket.emit('receive-msg', chat.last10);

    socket.join(user.id);

    socket.on('disconnect', () => {
        chat.disconnectUser(user.id);
        io.emit('active-users', chat.usersArr);
    });

    socket.on('send-msg', ({ msg, uid }) => {
        if (uid) {
            socket.to(uid).emit('private-msg', {from:user.name, msg});
        } else {
            chat.sendMsg(user.id, user.name, msg);
            io.emit('receive-msg', chat.last10);
        }
    })
}

module.exports = {
    socketController
}