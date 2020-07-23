var mysql = require("../loaders/mysql");
var BooksOwned = {};

BooksOwned.getBooks = function(id) {
    return mysql.query(getQuery("books"), [id]);
}

BooksOwned.getAvailableBooksByOLId = function(id, user_id) {
    return mysql.query(getQuery("getAvailableBooksByOLId"), [id, user_id]);
}

BooksOwned.getInventoryByUserId = function(user_id) {
    return new Promise(function(resolve, reject) {
        console.log("Processing in models/books_owned...");
        mysql.query(getQuery("getInventoryByUserId"), [user_id])
            .then(resolve)
            .catch(reject);
    });
}

BooksOwned.deleteInventory = function(list_id) {
    return new Promise(function(resolve, reject) {
        console.log("Deleting Inventory " + list_id.list_id + " in models/books_owned..");
        mysql.query(getQuery("deleteInventory"), [list_id.list_id])
        .then(resolve)
        .catch(reject);
    })
}

BooksOwned.updateCondition = function(info) {
    return new Promise(function(resolve, reject) {
        console.log("Updating list_id: " + info.list_id + " to " + info.condition_description + " with condition_id " + info.condition_id);
        mysql.query(getQuery("updateCondition"), [info.condition_description, info.condition_id, info.list_id])
            .then(resolve)
            .catch(reject);
    });
}

BooksOwned.updateAvailability = function(id, isAvailable) {
    return mysql.query(getQuery("updateAvailability"), [isAvailable ? 1 : 0, id]);
};

BooksOwned.addBook = function(body) {
    return mysql.query(getQuery("newBook"), [body.user_id, body.book_id, body.condition_id, body.condition_description, body.list_date]);
}

// Is this being used?
BooksOwned.deleteBooks = function(body) {
    return mysql.query(getQuery("deleteBook"), [body.user_id, body.book_id]);
}

// Is this being used?
BooksOwned.deleteAllBooks = function(body) {
    return mysql.query(getQuery("deleteBooksOwned"), [body.user_id]);
}

function getQuery(type) {
    var query = "";
    switch(type) {
        case "books":
            query = "SELECT * FROM book LEFT JOIN books_owned ON book.book_id = books_owned.book_id WHERE user_id = ?";
            break;
        case "newBook":
            query = "INSERT INTO books_owned \
                (user_id, book_id, is_available, condition_id, condition_description, list_date) \
                VALUES (?, ?, 1, ?, ?, ?)";
            break;
        case "updateAvailability":
            query = "UPDATE books_owned SET is_available = ? WHERE list_id = ?;";
            break;
        case "deleteBook":
	        query = "DELETE from books_owned WHERE user_id = ? AND book_id = ?";
            break;
        case "deleteAllBooks":
	        query = "DELETE from books_owned WHERE user_id = ?";
            break;
        case "getInventoryByUserId":
            query = "SELECT books_owned.list_id, book.title, author.name, books_owned.condition_description, books_owned.list_date \
                    FROM book \
                    JOIN book_author ON book.book_id = book_author.book_id \
                    JOIN author ON book_author.author_id = author.author_id \
                    LEFT JOIN books_owned ON book.book_id = books_owned.book_id \
                    WHERE user_id = ? AND books_owned.is_available = 1;"
            break;
        case "deleteInventory":
            query = "DELETE from books_owned WHERE list_id = ?;"
            break;
        case "updateCondition":
            query = "UPDATE books_owned SET condition_description = ?, condition_id = ? WHERE list_id = ?;"
            break;
        case "deleteBook":
    	    query = "DELETE from books_owned WHERE user_id = ? AND book_id = ?";
            break;
        case "deleteAllBooks":
    	    query = "DELETE from books_owned WHERE user_id = ?";
            break;
        case "getAvailableBooksByOLId":
            query = "SELECT \
            b.book_id, b.ol_key, bo.condition_description, bo.list_date \
            FROM books_owned bo INNER JOIN book b ON b.book_id = bo.book_id \
            WHERE bo.is_available = 1 AND b.ol_key = ? AND bo.user_id != ? \
            GROUP BY bo.condition_id;"
            break;
    }

    return query;
};

module.exports = BooksOwned;
