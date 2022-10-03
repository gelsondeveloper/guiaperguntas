const sequelize = require("sequelize");
const connection = new sequelize('guiaperguntas', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});


module.exports = connection;