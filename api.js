const express = require('express');
const http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
const cors = require("cors");
const config = require('./config');
const fs = require('fs');
const md5 = require('md5');

const { permit, isLoggedIn, metricsPermission } = require('./security/permissions.js');

const app = express()
var bodyParser = require('body-parser')
const server = http.createServer(app)
const files = require('./controles/filesCtrl')
const User = require('./controles/userCtrl')
const Path = require('./controles/pathCtrl')
const AudioStream = require('./controles/audioStreamCtrl')
const Sistem = require('./controles/sistem')
const userlogs = require('./controles/userlogsCtrl')
const database = require('./db/db');

const upload = require('./config/multer')
const { verifyToken, verifyRefreshToken } = require('./helpers/middleware')
database.authenticate().then(() => {
    console.log("bd conectado..")
}).catch((err) => {
    console.log("erro bd ", err)
})


const uploadedChunks = {};

app.use(express.static(path.join(__dirname, './uploads'), () => { console.log("dds") }));
app.use(cookieParser());
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '100mb' }));
app.use(express.json());
app.use(bodyParser.json());

app.get('/web2', (req, res, next) => {
    res.render("./web/index.html")
})

app.post('/upload', (req, res) => {
    const { name, currentChunkIndex, totalChunks } = req.query;
    const firstChunk = parseInt(currentChunkIndex) === 0;
    const lastChunk = parseInt(currentChunkIndex) === parseInt(totalChunks) - 1;
    const ext = name.split('.').pop();
    const data = req.body.toString().split(',')[1];
    const buffer = new Buffer(data, 'base64');
    const tmpFilename = 'tmp_' + md5(name + req.ip) + '.' + ext;
    if (firstChunk && fs.existsSync('./uploads/' + tmpFilename)) {
        fs.unlinkSync('./uploads/' + tmpFilename);
    }
    fs.appendFileSync('./uploads/' + tmpFilename, buffer);
    if (lastChunk) {
        const finalFilename = md5(Date.now()).substr(0, 6) + '.' + ext;
        fs.renameSync('./uploads/' + tmpFilename, './uploads/' + finalFilename);
        res.json({ finalFilename });
    } else {
        res.json('ok');
    }
});

// app.post('/upload', upload.single('file'), (req, res) => {
//     const file = req.file;
//     const partNumber = parseInt(req.body.partNumber); // Obtém o número da parte do corpo da solicitação

//     // Verifica se a parte já foi recebida
//     if (!uploadedChunks[file.name]) {
//         uploadedChunks[file.name] = {
//             parts: [],
//             partCount: parseInt(req.body.partCount) // Obtém o número total de partes
//         };
//     }

//     // Armazena a parte no objeto uploadedChunks
//     uploadedChunks[file.name].parts[partNumber] = file.buffer;

//     // Verifica se todas as partes foram recebidas
//     if (uploadedChunks[file.name].parts.length === uploadedChunks[file.name].partCount) {
//         // Todas as partes foram recebidas; agora você pode reuni-las para criar o arquivo completo
//         const completeFile = Buffer.concat(uploadedChunks[file.name].parts);
//         // Salve o arquivo completo na pasta de destino

//         const fileName = (Math.floor(Math.random() * 10000) + 10000) + '_' + Date.now() + path.extname(file.originalname);
//         const filePath = path.join(__dirname, uploadDir, fileName);

//         fs.writeFileSync(filePath, completeFile);

//         // Limpe a memória das partes temporárias
//         delete uploadedChunks[file.name];
//     }

//     res.status(200).send('Parte do arquivo recebida e processada.');
// });



app.post('/file', verifyToken, upload.single('file'), files.create)
app.post('/filem', verifyToken, upload.array('file', 10), files.create)

app.post('/file-path', verifyToken, files.getAll)

app.post('/user', verifyToken, User.create)
app.put('/user', verifyToken, User.update)

app.post('/login', User.login)

app.post('/path', verifyToken, Path.create)
app.post('/get-path', verifyToken, verifyToken, Path.getAll)
app.put('/path', verifyToken, Path.update)
app.delete('/path', verifyToken, Path.delete)

app.get('/play/:id', verifyToken, AudioStream.playing)

app.get('/sis', verifyToken, Sistem.getSistem)

app.post('/api/v1/userlogs', verifyToken, userlogs.create)

server.listen(config.port, () => {
    console.log("> Server listening on port: ", config.port)

})
module.exports = app