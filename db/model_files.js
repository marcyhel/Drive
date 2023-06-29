const Sequelize = require('sequelize');
const database = require('./db');

const Files = database.define('files', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    path: {
        type: Sequelize.STRING,
        allowNull: false
    },
    id_path: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    size: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    type: {
        type: Sequelize.STRING,
        allowNull: true,
    }

})
module.exports = Files;