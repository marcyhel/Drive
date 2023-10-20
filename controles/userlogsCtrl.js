const Userlogs = require('../service/userlogs')
const QueryBuilder = require("../helpers/query");

const controller = {

	getAll: async function(req, res, next){
		try{
			const query = await QueryBuilder(req);
			res.json(await Userlogs.getAll(query));
		} catch(error) {
			next(error);
		}
	},

	get: async function(req, res, next){
		try{
			res.json(await Userlogs.get(req.params.id))
		} catch(error) {
			next(error);
		}

	},

	getuser: async function(req, res, next){
		try{
			res.json(await Userlogs.getuser(req.params.id))
		} catch(error) {
			next(error);
		}

	},

	create: async function(req, res, next){
		try{
			res.json(await Userlogs.create(req.body))
		} catch(error) {
			next(error);
		}

	},
}

module.exports = controller;