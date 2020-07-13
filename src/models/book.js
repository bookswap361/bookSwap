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
        mysql.query(getQuery("createBook"), [info.ol_key, info.description,
            info.thumbnail_url, info.title])
            .then(resolve)
            .catch(reject);
    });
}
Book.createAuthor = function(info) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("createAuthor"), [info.ol_key, info.name])
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
            query = "SELECT \
            b.book_id, b.ol_key, b.description, b.thumbnail_url, b.title, a.name \
            FROM book b \
            INNER JOIN book_author ba ON b.book_id = ba.author_id\
            INNER JOIN author a on ba.author_id = a.author_id \
            WHERE b.ol_key = ?;"
            break;
        case "createBook":
            query = "INSERT INTO book \
            (ol_key, description, thumbnail_url, title) \
            VALUES (?, ?, ?, ?);"
            break;
        case "createAuthor":
            query = "INSERT INTO author \
            (ol_key, name) VALUES (?, ?);"
            break;
    }

    return query;
};

module.exports = Book;

