var mysql = require("../loaders/mysql");
var BooksOwned = {};

BooksOwned.getBooks = function(id) {
    return mysql.query(getQuery("books"), [id]);
}

BooksOwned.addBooks = function(body) {
    return mysql.query(getQuery("newBook"), [body.user_id, body.book_id, body.condition_id, body.condition_description, body.list_date]);
}

BooksOwned.deleteBooks = function(body) {
    return mysql.query(getQuery("deleteBook"), [body.book_id]);
}


function getQuery(type) {
    var query = "";
    switch(type) {
        case "books":
            query = "SELECT * from books_owned WHERE user_id = ?";
            break;
    case "newBook":
    query = "INSERT INTO books_owned \
            (user_id, book_id, is_available, condition_id, condition_description, list_date) \
            VALUES (?, ?, 1, ?, ?, ?)";
            break;
    case "deleteBook":
	query = "DELETE from books_owned WHERE user_id = ? AND book_id = ?";
            break;
        }

    return query;
};

module.exports = BooksOwned;
