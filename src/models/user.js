var mysql = require("../loaders/mysql");
var User = {};


User.getAllUsers = function() {
    return mysql.query(getQuery("allUsers"), []);
}

User.getUserById = function(id) {
    return mysql.query(getQuery("userById"), [id]);
}

User.getUserByEmail = function(body) {
    return mysql.query(getQuery("userByEmail"), [body.email]);
}

User.createUser = function(body, hash) {
    return mysql.query(getQuery("createUser"), 
        [body.first_name, body.last_name,
            body.email, body.street, body.city,
            body.state, body.zip, hash]);
}

User.deleteUser = function(body) {
    return mysql.query(getQuery("deleteUser"), [body.email]);
}
//not sure if this will work, but when it's called by account services or swap services, maybe a number can be specificed for the points?
//example in Account Services
User.updatePoints = function(number, user_id) {
    return mysql.query(getQuery("updatePoints"), [number, user_id]);
}

User.deletePoints = function(body) {
    return mysql.query(getQuery("deletePoints"), [body.number, body.user_id]);
}

User.updateUser = function(body) {
    return mysql.query(getQuery("updateUser"), [body.first_name, body.last_name, body.email, body.street, body.user_id]);
}

User.deletePoints = function(number, user_id) {
    console.log("deleting " + number + " from user_id " + user_id + ".");
    return mysql.query(getQuery("deletePoints"), [number, user_id]);
}

User.updateLostLimit = function(id) {
    return mysql.query(getQuery("updateLostLimit"), [id]);
};

User.getPoints = function(id) {
    return mysql.query(getQuery("getPoints"), [id]);
};

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
            (first_name, last_name, email, street, city, state, zip, password) \
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            break;

        case "userByEmail":
            query = "SELECT * from user WHERE email = ?";
            break;

        case "deleteUser":
            query = "DELETE from user WHERE email = ?";
            break;

        case "updateUser":
            query = "UPDATE user SET first_name = ?, last_name = ?, email = ?, street = ? WHERE user_id = ?";
            break;

        case "updatePoints":
            query = "UPDATE user SET points = points + ? WHERE user_id = ?";
            break;
            
        case "deletePoints":
            query = "UPDATE user SET points = points - ? WHERE user_id = ?";
            break;

        case "deletePoints":
             query = "UPDATE user SET points = points - ? WHERE user_id = ?";
             break;

        case "updateLostLimit":
            query = "UPDATE user SET lost_limit_reached = 1 WHERE user_id = ?";
            break;
        case "getPoints":
            query = "SELECT points FROM user WHERE user_id = ?";
            break;
    }

    return query;
};

module.exports = User;
