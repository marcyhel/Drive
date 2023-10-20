const Sequelize = require('sequelize');
const config = require('../config');
const sequelze = new Sequelize(config.database.name, config.database.username, config.database.password, {
    dialect: 'mysql',
    host: config.database.host,
    port: config.database.port
})
sequelze.sync().then((e) => {
    console.log('Sincronizado')
});

module.exports = sequelze;