var mysql = require("../loaders/mysql");
var WishList = {};

WishList.addWish = function(id, body) {
    return mysql.query(getQuery("newWish"), [body.user_id, body.book_id]);
}

WishList.getWishList = function(id) {
    return mysql.query(getQuery("wish"), [id]);
}

WishList.deleteWish = function(body) {
    return mysql.query(getQuery("deleteWish"), [body.user_id, body.book_id]);
}

function getQuery(type) {
    var query = "";
    switch(type) {
        case "wish":
            query = "SELECT * from wishlist WHERE user_id = ?";
            break;
    case "newWish":
            query = "INSERT INTO wishlist \
            (user_id, book_id) \
            VALUES (?, ?)";
            break;
        case "deleteWish":
            query = "DELETE from wishlist WHERE user_id = ? AND book_id = ?";
            break;
        }

    return query;
};

module.exports = WishList;
