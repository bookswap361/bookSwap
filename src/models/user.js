var mysql = require("../loaders/mysql");
var bcrypt = require('bcryptjs');
var User = {};


User.getAllUsers = function() {
    return mysql.query(getQuery("allUsers"), [])
}

User.getUserById = function(id) {
    return mysql.query(getQuery("userById"), [id])
}

User.getUserByEmail = function(body) {
    return mysql.query(getQuery("userByEmail"), [body.email])
}

User.createUser = function(body, hash) {
    return mysql.query(getQuery("createUser"), 
        [body.first_name, body.last_name,
            body.email, body.address, hash])
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

        case "createUser":
            query = "INSERT INTO user \
            (first_name, last_name, email, address, points, password) \
            VALUES (?, ?, ?, ?, 0, ?)";
            break;

        case "userByEmail":
            query = "SELECT * from user WHERE email = ?";
            break;
    }

    return query;
};

module.exports = User;
