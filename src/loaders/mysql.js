var mysql = require("mysql");
var config = require("../config/config.js");

var connectionConfig = {
    "connectionLimit": 10,
    "multipleStatements": true,
    "host": config.dbHost,
    "user": config.dbUser,
    "password": config.dbPassword,
    "database": config.dbName
};

var pool = mysql.createConnection(connectionConfig);

var connection = function() {
    return new Promise(function(resolve, reject) {
        pool.connect(function(err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
};

var query = function(query, data) {
    return new Promise(function(resolve, reject) {
        pool.query(query, data, function(err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

module.exports = {
    "connection": connection,
    "query": query, 
    "pool": pool
};
