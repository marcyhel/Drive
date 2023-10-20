const UserLogs = require('../db/userlogs')

const service = {
    getAll: async function(query){
        return await UserLogs.findAll(query);
    },
    get: async function(id, query = {}){
        return await UserLogs.findByPk(id);
    },
    getuser: async function(id, query = {}){
        return await UserLogs.findAll({
            where: {user_id: id}
        });
    },
    create: async function(model){
        return await UserLogs.create(model);
    },
}

module.exports = service;
