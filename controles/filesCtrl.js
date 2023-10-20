const Files = require('../db/model_files');

const path = require('path');
var resolutionOs = {
    getAll: async function (req, res, next) {

        try {
            var response = await Files.findAll({ where: req.body });
            res.json(response);
        } catch (err) {
            next(err)
        }
    },
    get: async function (req, res, next) {
        try {

        } catch (err) {
            next(err)
        }
    },
    create: async function (req, res, next) {
        try {

            // const { nome } = req.body;
            console.log(req.body)
            const file = req.files;
            var arquivo
            for (let files of file) {
                console.log(files)
                arquivo = new Files({
                    nome: files.originalname.split('.')[0],
                    path: files.path,
                    id_path: req.body.id,
                    type: files.mimetype
                });

                await arquivo.save()
            }

            res.json({ arquivo, msg: 'Imagem salva' })

        } catch (err) {
            res.status(500)
            next(err);
        }
    },
    update: async function (req, res, next) {
        try {
        } catch (err) {
            next(err);
        }
    },
    delete: async function (req, res, next) {
        try {
            res.json({ message: "Success - ResolutionOS Deleted" })
        } catch (err) {
            next(err);
        }
    }
}

module.exports = resolutionOs;
