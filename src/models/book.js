var mysql = require("../loaders/mysql");
var Book = {};

Book.getAllBooks = function() {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("allBooks"), [])
            .then(resolve)
            .catch(reject);
    });
}

Book.getAvailableBooks = function() {
    return new Promise(function(resolve, reject) {
        console.log("Retrieving Books from Database...");
        mysql.query(getQuery("getAvailableBooks"), [])
            .then(resolve)
            .catch(reject);
    });
}

function getQuery(type) {
    var query = "";
    switch(type) {
        case "allBooks":
            query = "SELECT * FROM book;"
            break;
        case "getAvailableBooks":
            query = "select \
                b.book_id, b.title, a.last_name, a.first_name, count(b.book_id) AS count \
                from book b \
                INNER JOIN books_owned bo ON b.book_id = bo.book_id \
                INNER JOIN book_author ba ON bo.book_id = ba.book_id \
                INNER JOIN author a ON ba.author_id = a.author_id \
                WHERE bo.is_available = 1 \
                GROUP BY b.book_id;"
            break;
    }

    return query;
};

module.exports = Book;

