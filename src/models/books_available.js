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

BooksAvailable.addSwap = function(info, user_id) {
    return new Promise(function(resolve, reject) {
        console.log("Add swap list_id: " + info.list_id + " traded_to: " + user_id + " date: " + info.date + " in models/books_owned..");
        mysql.query(getQuery("addSwap"), [info.list_id, user_id, info.list_id, info.date])
        .then(resolve)
        .catch(reject);
    })
}

BooksAvailable.getBooksByOLId = function(id) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("getBooksByOLId"), [id])
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
        case "addSwap":
            console.log("before 1st query");
            query = "INSERT INTO swap (list_id, traded_to, traded_by, is_accepted, request_date) \
                VALUES (?, ?, (SELECT user_id FROM books_owned WHERE list_id = ?), 0, ?);"
            break;
        case "getBooksByOLId":
            query = "SELECT \
            b.book_id, b.ol_key, bo.condition_description, bo.list_date \
            FROM books_owned bo INNER JOIN book b ON b.book_id = bo.book_id \
            WHERE bo.is_available = 1 AND b.ol_key = ?;"
            break;
        }

    return query;
};

module.exports = BooksAvailable;
