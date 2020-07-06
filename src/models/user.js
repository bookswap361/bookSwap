var mysql = require("../loaders/mysql");
var bcrypt = require('bcrypt');
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

User.createUser = function(body) {
    return new Promise(function(resolve, reject) {
        bcrypt.hash(body.pWord, 10, function(err, hash) {
            mysql.query(getQuery("createUser"), 
                [body.fName, body.lName, body.email, body.address, hash])
                .then(resolve)
                .catch(reject);
        })
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

        case "createUser":
            query = "INSERT INTO user \
            (first_name, last_name, email, address, points, password) \
            VALUES (?, ?, ?, ?, 100, ?)";
            break;
    }

    return query;
};

module.exports = User;
