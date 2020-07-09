var mysql = require("../loaders/mysql");
var Account = {};


Account.getAccount = function(id) {
    return mysql.query(getQuery("account"), [id]);
}

Account.addBooks = function(body) {
    return mysql.query(getQuery("newBook"), [body.user_id, body.book_id, body.condition_id, body.condition_description, body.list_date]);
}

Account.addWish = function(id, body) {
    return mysql.query(getQuery("newWish"), [body.user_id, body.book_id]);
}

Account.deleteAccount = function(body) {
    return mysql.query(getQuery("deleteAccount"), [body.user_id]);
}

Account.deleteBooks = function(body) {
    return mysql.query(getQuery("deleteBooks"), [body.book_id]);
}

Account.deleteWish = function(body) {
    return mysql.query(getQuery("deleteWish"), [body.book_id]);
}

Account.updateAccount = function(body) {
    return mysql.query(getQuery("updateUser"), [body.first_name, body.last_name, body.email, body.address, body.user_id]);
}

Account.updatePoints = function(body) {
    return mysql.query(getQuery("updatePoints"), [ body.pointValue, body.user_id]);
}

Account.updateLostLimit = function(body) {
    return mysql.query(getQuery("updateLost"), [body.lost_limit, body.user_id]);
}




function getQuery(type) {
    var query = "";
    switch(type) {
        case "account":
            query = "SELECT * from user WHERE user_id = ?";
            query+= "SELECT * from books_owned WHERE user_id =?";
            query+= "SELECT * from wishlist WHERE user_id = ?";
            break;

        case "newBook":
            query = "INSERT INTO books_owned \
            (user_id, book_id, is_available, condition_id, condition_description, list_date) \
            VALUES (?, ?, 1, ?, ?, ?)";
            break;

        case "newWish:
            query = "INSERT INTO wishlist \
            (user_id, book_id) \
            VALUES (?, ?)";
            break;

        case "deleteAccount:
            query = "DELETE from books_owned WHERE user_id = ?";
            query+= "DELETE from wishlist WHERE user_id = ?";
            query+= "DELETE from user WHERE user_id = ?";
            break;

        case "deleteBook":
            query = "DELETE from books_owned WHERE user_id = ? AND book_id = ?";
            break;

        case "deleteWish":
            query = "DELETE from wishlist WHERE user_id = ? AND book_id = ?";
            break;

        case "updateUser":
            query = "UPDATE user SET first_name = ?, last_name = ?, email = ?, address = ? WHERE user_id = ?";
            break;

        case "updatePoints":
            query = "UPDATE user SET points = ? WHERE user_id = ?";
            break;

        case "updateLost":
            query = "UPDATE user SET lost_limit_reached = ? WHERE user_id = ?";
            break;

    }

    return query;
};

module.exports = Account;
