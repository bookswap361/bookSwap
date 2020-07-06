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
        mysql.query(getQuery("userById"), [id])
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
        case "userById":
            query = "SELECT * from user WHERE user_id = ?";
            break;
    }

    return query;
};

module.exports = User;
