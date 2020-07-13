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

Book.getBookByOLId = function(id) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("getBookByOLId"), [id])
            .then(resolve)
            .catch(reject);
    });
}

// Update
Book.createBook = function(info) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("createBook"), [])
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
                b.book_id, b.title, a.name, count(b.book_id) AS count \
                from book b \
                INNER JOIN books_owned bo ON b.book_id = bo.book_id \
                INNER JOIN book_author ba ON bo.book_id = ba.book_id \
                INNER JOIN author a ON ba.author_id = a.author_id \
                WHERE bo.is_available = 1 \
                GROUP BY b.book_id;"
            break;
        case "getBookByOLId":
            query = "select \
            b.book_id, b.ol_key, b.description, b.thumbnail_url, b.title, a.name \
            from book b \
            INNER JOIN book_author ba ON b.book_id = ba.author_id\
            INNER JOIN author a on ba.author_id = a.author_id \
            WHERE b.ol_key = ?;"
            break;
        case "createBook":
            query = "INSERT INTO book \
            (list_id, traded_to, traded_by, is_accepted, request_date, \
            approve_date, reject_date, ship_date, lost_date, received_date, \
            refund_date, has_claim, claim_open_date, claim_settle_date, is_complete) \
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
            break;
    }

    return query;
};

module.exports = Book;

