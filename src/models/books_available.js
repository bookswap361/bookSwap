var mysql = require("../loaders/mysql");
var BooksAvailable = {};

BooksAvailable.getAvailableBooks = function(user_id) {
    return new Promise(function(resolve, reject) {
        console.log("Retrieving Books from Database...");
        mysql.query(getQuery("getAvailableBooks"), [user_id])
            .then(resolve)
            .catch(reject);
    });
}

BooksAvailable.getCondition = function(book_id, user_id) {
    return new Promise(function(resolve, reject) {
        console.log("Retrieving book conditions from models/book...");
        mysql.query(getQuery("getCondition"), [book_id.book_id, user_id])
            .then(resolve)
            .catch(reject);
    });
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
            query = "SELECT bo.list_id, b.title, a.name, u.user_id, bo.condition_description, bc.cost\
                from book b \
                INNER JOIN books_owned bo ON b.book_id = bo.book_id \
                INNER JOIN book_author ba ON bo.book_id = ba.book_id \
                INNER JOIN author a ON ba.author_id = a.author_id \
                INNER JOIN book_condition bc ON bo.condition_id = bc.condition_id \
                INNER JOIN user u ON bo.user_id = u.user_id \
                WHERE bo.is_available = 1 AND bo.book_id = ? AND bo.user_id != ?;"
            break;
        }

    return query;
};

module.exports = BooksAvailable;
