const Sequelize = require('sequelize');

const sequelze = new Sequelize('serv-file', 'root', '0800', {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306
})
sequelze.sync({}).then((e) => {
    console.log('Sincronizado')
});

module.exports = sequelze;