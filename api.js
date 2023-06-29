const express = require('express');
const http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
const cors = require("cors");

const app = express()
var bodyParser = require('body-parser')
const server = http.createServer(app)
const files = require('./controles/filesCtrl')
const User = require('./controles/userCtrl')
const Path = require('./controles/pathCtrl')
const AudioStream = require('./controles/audioStreamCtrl')
const Sistem = require('./controles/sistem')
const database = require('./db/db');

const upload = require('./config/multer')

database.authenticate().then(() => {
    console.log("bd conectado..")
}).catch((err) => {
    console.log("erro bd ", err)
})




app.use(express.static(path.join(__dirname, './uploads'),()=>{console.log("dds")}));
app.use(cookieParser());
app.use(cors({ origin: '*',methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());

app.get('/web2', (req, res, next)=>{
    res.render("./web/index.html")
})

app.post('/file', upload.single('file'), files.create)
app.post('/filem', upload.array('file',10), files.create)

app.get('/file', files.getAll)

app.post('/user', User.create)
app.put('/user', User.update)

app.post('/login', User.login)

app.post('/path', Path.create)
app.post('/get-path', Path.getAll)
app.put('/path', Path.update)

app.get('/play/:id', AudioStream.playing)

app.get('/sis', Sistem.getSistem)

server.listen(1235, () => {
    console.log(`> Server listening on port: 1235`)

})
module.exports = app