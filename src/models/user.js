var mysql = require("../loaders/mysql");
var User = {};



User.getUserById = function(user_id) {
    return mysql.query(getQuery("userById"), [user_id]);
}

User.searchUsers = function(id, query, search_by) {
    switch(search_by)
    {
        case 1:
            return mysql.query(getQuery("searchUserByFname"), [id, query]);
            break;
        case 2:
            return mysql.query(getQuery("searchUserByLname"), [id, query]);
            break;
        case 3:
            return mysql.query(getQuery("searchUserByEmail"), [id, query]);
    }
}

User.getUserByEmail = function(email) {
    return mysql.query(getQuery("userByEmail"), [email]);
}

User.createUser = function(user, hash) {
    return mysql.query(getQuery("createUser"), 
        [user.first_name, user.last_name,
            user.email, user.street, user.city,
            user.state, user.zip, hash]);
}

User.deleteUser = function(user_id) {
    return mysql.query(getQuery("deleteUserById"), [user_id]);
}

//should update to be named addPoints (updatePoints is misleading)
User.updatePoints = function(amount, user_id) {
    return mysql.query(getQuery("updatePoints"), [amount, user_id]);
}

//needs to be updated with city, state, zip
User.updateUser = function(user) {
    return mysql.query(getQuery("updateUser"), [user.first_name, user.last_name, user.email, user.street, user.user_id]);
}

//should update to be named subPoints (deletePoints is misleading)
User.deletePoints = function(amount, user_id) {
    return mysql.query(getQuery("deletePoints"), [amount, user_id]);
}

User.updateLostLimit = function(user_id) {
    return mysql.query(getQuery("updateLostLimit"), [user_id]);
};

User.getPoints = function(user_id) {
    return mysql.query(getQuery("getPoints"), [user_id]);
};

function getQuery(type) {
    var query = "";
    switch(type) {
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

        case "deleteUserById":
            query = "DELETE from user WHERE user_id = ?";
            break;

        case "updateUser":
            query = "UPDATE user SET first_name = ?, last_name = ?, email = ?, street = ? WHERE user_id = ?";
            break;
            
         case "searchUserByFname":
            query = "SELECT * FROM user INNER JOIN books_owned ON books_owned.user_id = ? WHERE user.first_name = ? AND books_owned.is_available = 1";

        case "searchUserByLname":
            query = "SELECT * FROM user INNER JOIN books_owned ON books_owned.user_id = ? WHERE user.last_name = ? AND books_owned.is_available = 1";
            break;

        case "searchUserByEmail":
            query = "SELECT * FROM user INNER JOIN books_owned ON books_owned.user_id = ? WHERE user.email = ? AND books_owned.is_available = 1";
            break;
            
        case "updatePoints":
            query = "UPDATE user SET points = points + ? WHERE user_id = ?";
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
