var dotenv = require("dotenv");
dotenv.config();

var configurations = {
    "port": process.env.PORT,
    "dbHost": process.env.DB_HOST,
    "dbUser": process.env.DB_USER,
    "dbPassword": process.env.DB_PASSWORD,
    "dbName": process.env.DB_NAME
};

module.exports = configurations;
