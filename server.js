
const { v4: uuidv4 } = require("uuid")
const path=require('path')
require('dotenv').config();
const {app,server,express}=require('./sockets/socket')

app.set("view engine", 'ejs')
app.use(express.static('views'))
app.use(express.static(path.join(__dirname, 'views/public')));

app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`)
})
app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})
const port =process.env.Port||3002;
console.log(port,'this is port')
server.listen(port);
