var mysql = require("../loaders/mysql");
var WishList = {};

WishList.addWish = function(user_id, book_id) {
    return mysql.query(getQuery("newWish"), [user_id, book_id]);
}

WishList.getWishList = function(id) {
    return mysql.query(getQuery("wish"), [id]);
}

WishList.deleteWish = function(user_id, book_id) {
    return mysql.query(getQuery("deleteWish"), [user_id, book_id]);
}

WishList.deleteAllWish = function(id) {
    return mysql.query(getQuery("deleteAllWish"), [id]);
}

WishList.searchWish = function(body) {
    return mysql.query(getQuery("searchWish"), [body.user_id, body.book_id]);
}

function getQuery(type) {
    var query = "";
    switch(type) {
        case "wish":
            query = "SELECT * FROM book LEFT JOIN wishlist ON book.book_id = wishlist.book_id WHERE user_id = ?";
            break;
    case "newWish":
            query = "INSERT INTO wishlist \
            (user_id, book_id) \
            VALUES (?, ?)";
            break;
        case "deleteWish":
            query = "DELETE from wishlist WHERE user_id = ? AND book_id = ?";
            break;
        case "deleteAllWish":
            query = "DELETE from wishlist WHERE user_id = ?";
        }

    return query;
};

module.exports = WishList;
