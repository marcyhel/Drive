const { path } = require('../api');
const Path = require('../db/model_path');

var resolutionOs = {
    getAll: async function (req, res, next) {

        try {
            var response = await Path.findAll({ where: req.body });
            res.json(response);
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

            const {user,nome,dad} = req.body;
            
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
                {where:{id:req.body.id}}
            );
            res.send( response );
        } catch (err) {
            res.status(500)
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
