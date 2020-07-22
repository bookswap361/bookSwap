var mysql = require("../loaders/mysql");
var BooksOwned = {};

BooksOwned.getBooks = function(id) {
    return mysql.query(getQuery("books"), [id]);
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

// Is this being used?
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
        case "deleteBook":
	    query = "DELETE from books_owned WHERE user_id = ? AND book_id = ?";
            break;
        case "deleteAllBooks":
	    query = "DELETE from books_owned WHERE user_id = ?";
        case "getInventoryByUserId":
            query = "SELECT books_owned.list_id, book.title, author.name, books_owned.condition_description, books_owned.list_date \
                    FROM book \
                    JOIN book_author ON book.book_id = book_author.book_id \
                    JOIN author ON book_author.author_id = author.author_id \
                    LEFT JOIN books_owned ON book.book_id = books_owned.book_id \
                    WHERE user_id = ?;"
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
            }

    return query;
};

module.exports = BooksOwned;
