const express = require('express');
const http = require('http');
const { v4: uuidv4 } = require("uuid")
const app = express();
const server = http.createServer(app)
const io = require('socket.io')(server)
const { createClient } = require('redis');
const { Console } = require('console');
const path=require('path')
require('dotenv').config();
app.set("view engine", 'ejs')
app.use(express.static('views'))
app.use(express.static(path.join(__dirname, 'views/public')));
const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));
client.connect();
app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`)
})
app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})
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
const port =process.env.Port||3002
console.log(port,'this is port')
server.listen(port);
