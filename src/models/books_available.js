var mysql = require("../loaders/mysql");
var BooksAvailable = {};

BooksAvailable.getAvailableBooks = function(user_id) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("getAvailableBooks"), [user_id])
            .then(resolve)
            .catch(reject);
    });
}

BooksAvailable.getCondition = function(book_id, user_id) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("getCondition"), [book_id.book_id, user_id])
            .then(resolve)
            .catch(reject);
    });
}

BooksAvailable.getPoints = function(user_id) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("getPoints"), [user_id])
            .then(resolve)
            .catch(reject);
    });
}

BooksAvailable.addSwap = function(info, user_id) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("addSwap"), [info.list_id, user_id, info.list_id, info.date])
        .then(resolve)
        .catch(reject);
    })
}

function getQuery(type) {
    var query = "";
    switch(type) {
        case "getAvailableBooks":
            query = "select \
                b.book_id, b.title, a.name, count(b.book_id) AS count \
                from book b \
                INNER JOIN books_owned bo ON b.book_id = bo.book_id \
                INNER JOIN book_author ba ON bo.book_id = ba.book_id \
                INNER JOIN author a ON ba.author_id = a.author_id \
                WHERE bo.is_available = 1 AND bo.user_id != ? \
                GROUP BY b.book_id;"
            break;
        case "getCondition":
            query = "SELECT bo.list_id, b.title, a.name, bo.condition_description, bc.cost\
                from book b \
                INNER JOIN books_owned bo ON b.book_id = bo.book_id \
                INNER JOIN book_author ba ON bo.book_id = ba.book_id \
                INNER JOIN author a ON ba.author_id = a.author_id \
                INNER JOIN book_condition bc ON bo.condition_id = bc.condition_id \
                WHERE bo.is_available = 1 AND bo.book_id = ? AND bo.user_id != ?;"
            break;
        case "getPoints":
            query = "SELECT points FROM user WHERE user_id = ?;"
            break;
        case "addSwap":
            query = "INSERT INTO swap (list_id, traded_to, traded_by, is_accepted, request_date) \
                VALUES (?, ?, (SELECT user_id FROM books_owned WHERE list_id = ?), 0, ?);"
            break;
        }

    return query;
};

module.exports = BooksAvailable;
