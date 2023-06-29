const User = require('../db/model_user');
const Path = require('../db/model_path');
const path = require('./pathCtrl');
const { where } = require('sequelize');
var resolutionOs = {
    getAll: async function (req, res, next) {

        try {
            var response = await User.findAll({ where: req.params });
            res.json(response);
        } catch (err) {
            next(err)
        }
    },
    login: async function (req, res, next) {
        try {
            const {email,senha} = req.body;
            console.log(email,senha)
            var responseGet = await User.findAll({ where: { "email": email, "senha": senha} });
            if (responseGet.length > 0) res.send({ 'aceito': 'liberado',
        'user':responseGet })
            else res.status(500).json({ msg: "negado" });
        } catch (err) {
            res.status(404).json({ msg: "não encontrado" });
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
            const {email,senha,nome} = req.body;
            var responseGet = await User.findAll({ where: { "email": email } });
            if (responseGet.length > 0) res.send({ 'erro': 'Email ja cadastrado' })
            else {
                var response = await User.create({
                    email: email,
                    nome: nome,
                    senha: senha,
                })

                var path = await Path.create({
                    id_dad: '-1',
                    nome: nome,
                    id_user: response.id,
                })

                res.send({ response, path })
            }
        } catch (err) {
            res.status(500)
            next(err);
        }
    },
    update: async function (req, res, next) {
        try {
            console.log(req.body)
            var response = await User.update(
                req.body,
                {where:{id:req.body.id}}
            )
            if(req.body.nome){
                var path_response = await Path.findAll({where:{id_user:req.body.id,id_dad:-1}})
                console.log(path_response[0])
                console.log(path_response[0].dataValues.id)
                var path = await Path.update({nome:req.body.nome},{where:{id:path_response[0].dataValues.id}})
                console.log(path)
            }
            res.send( response )
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
