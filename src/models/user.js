var mysql = require("../loaders/mysql");
var User = {};


User.getAllUsers = function() {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("allUsers"), [])
            .then(resolve)
            .catch(reject);
    });
}

User.getUserById = function(id) {
    return new Promise(function(resolve, reject) {
        mysql.query(queryParam("userById", id), [])
            .then(resolve)
            .catch(reject);
    })
}

function getQuery(type) {
    var query = "";
    switch(type) {
        case "allUsers":
            query = "SELECT * from user;"
            break;
    }
    
    return query;
};

function queryParam(type, param) {
    var query = "";
    switch(type) {
        case "userById":
            query = "SELECT * from user WHERE user_id = " + param;
            break;
    }

    return query;
}

module.exports = User;