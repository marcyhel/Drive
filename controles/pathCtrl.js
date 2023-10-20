const { path } = require('../api');
const Path = require('../db/model_path');
const Files = require('../db/model_files');
var resolutionOs = {
    getAll: async function (req, res, next) {

        try {
            var path_atual = await Path.findAll({ where: { id: req.body.id_dad, id_user: req.body.id_user } });
            var paths = await Path.findAll({ where: req.body });
            res.json({ path_atual, paths });
        } catch (err) {
            next(err)
        }
    },

    get: async function (req, res, next) {
        try {

        } catch (err) {
            next(err);
        }
    },
    create: async function (req, res, next) {
        try {

            const { user, nome, dad } = req.body;

            var response = await Path.create({
                id_user: user,
                nome: nome,
                id_dad: dad,
            });
            res.send(response);

        } catch (err) {
            res.status(500)
            next(err);
        }
    },
    update: async function (req, res, next) {
        try {
            var response = await Path.update(
                req.body,
                { where: { id: req.body.id } }
            );
            res.send(response);
        } catch (err) {
            res.status(500)
            next(err);
        }
    },
    delete: async function (req, res, next) {
        try {


            console.log(req.body)
            var paths = await Path.findAll({ where: { id_dad: req.body.id } });
            var files = await Files.findAll({ where: { id_path: req.body.id } });
            if (paths.length > 0 || files.length > 0) {

                if (!req.body.force) {
                    res.json({ response: "dependentes" })
                } else {
                    var response = await Path.destroy({ where: { id_dad: req.body.id } });
                    await Path.destroy({ where: { id: req.body.id } });
                    res.json({ response: "ok" })
                }
            } else {
                var response = await Path.destroy({ where: { id_dad: req.body.id } });
                await Path.destroy({ where: { id: req.body.id } });
                res.json({ response: "ok" })
            }


        } catch (err) {
            next(err);
        }
    }
}

module.exports = resolutionOs;
