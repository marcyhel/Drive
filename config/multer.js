const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        cb(null, (Math.floor(Math.random() * 10000) + 10000) + '_' + Date.now() + path.extname(file.originalname));
    },
    // destination: function (req, file, cb) {
    //     cb(null, "uploads/");
    // },
    // filename: function (req, file, cb) {

    //     cb(null,(Math.floor(Math.random() * 10000) + 10000) + '_' + Date.now() + path.extname(file.originalname));
    // },
});

const upload = multer({ storage, limits: { files: 10 }, });

module.exports = upload;