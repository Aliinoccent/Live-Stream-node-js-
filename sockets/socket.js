
const express=require('express')
const app = express();
const http = require('http');
const server = http.createServer(app)
const io = require('socket.io')(server)
const { createClient } = require('redis');
const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));
client.connect();
io.on('connection', socket => {
    socket.on('createRoom', (roomId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);

    })
    socket.on('joinRoom', (roomId, userId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);

        socket.on('sendToUsers', async (message) => {
            const strmes = JSON.stringify(message);
            console.log(strmes, 'mesg')
            await client.rPush(roomId, strmes);
            const radisMes = await client.lRange(roomId, 0, -1)
            const parsMsg = radisMes.map(item => JSON.parse(item))
            console.log("parse Msg send each time",parsMsg)
            io.to(roomId).emit("otherReciver", parsMsg)
        })

        socket.on('disconnect', () => {
            io.to(roomId).emit('user-disconnected', userId);
        });
    });


});
module.exports={app,server,express};