var mysql = require("../loaders/mysql");
var Book = {};

Book.getAllBooks = function() {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("allBooks"), [])
            .then(resolve)
            .catch(reject);
    });
}

Book.getBooksBy = function(title) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("getBooksBy"), [title])
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

Book.getOlKeys = function() {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("getOlKeys"), [])
            .then(resolve)
            .catch(reject);
    });
}

Book.createBook = function(info) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("createBook"), [info.bol_key, info.description,
            info.thumbnail_url, info.title, info.bol_key])
            .then(resolve)
            .catch(reject);
    });
}

Book.createAuthor = function(info) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("createAuthor"), [info.aol_key, info.name, info.aol_key])
            .then(resolve)
            .catch(reject);
    });
}

Book.getAuthIdFromOlId = function(info) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("getAuthIdFromOlId"), [info.aol_key])
            .then(resolve)
            .catch(reject);
    });
}

Book.getBookIdFromOlId = function(info) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("getBookIdFromOlId"), [info.bol_key])
            .then(resolve)
            .catch(reject);
    });
}

Book.joinAuthBook = function(info) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("joinAuthBook"), [info.book_id, info.author_id])
            .then(resolve)
            .catch(reject);
    });
}


Book.getAvailableBooks = function(userId) {
    return mysql.query(getQuery("getAvailableBooks"), [userId]);
};

Book.getAvailableBooksByGenre = function(userId, genreId) {
    return mysql.query(getQuery("getAvailableBooksByGenre"), [userId, genreId]);
};

Book.getAvailableBooksByPoints = function(userId, points) {
    return mysql.query(getQuery("getAvailableBooksByPoints"), [userId, points]);
};

Book.getAvailableBooksByPointsAndGenre = function(userId, points, genreId) {
    return mysql.query(getQuery("getAvailableBooksByPointsAndGenre"), [userId, points, genreId]);
};

Book.getGenreList = function() {
    return mysql.query(getQuery("getGenreList"), []);
}

Book.setGenre = function(genre, book_id) {
    return mysql.query(getQuery("setGenre"), [genre, book_id]);
}

Book.getTitleByListId = function(list_id) {
    return mysql.query(getQuery("getTitleByListId"), [list_id]);
}

Book.getBooksByFName = function(name) {
    return mysql.query(getQuery("BooksByFName"), [name]);
}

Book.getBooksByLName = function(name) {
    return mysql.query(getQuery("BooksByLName"), [name]);
}

Book.getBooksByEmail = function(email) {
    return mysql.query(getQuery("BooksByEmail"), [email]);
}

function getQuery(type) {
    var query = "";
    switch(type) {
        case "allBooks":
            query = "SELECT * FROM book;"
            break;
        case "getBooksBy":
            query = "SELECT b.title, b.thumbnail_url, b.ol_key AS book_id, b.description, \
                a.name AS author, a.ol_key AS author_id \
                FROM book b \
                INNER JOIN book_author ba ON b.book_id = ba.book_id \
                INNER JOIN author a ON ba.author_id = a.author_id \
                WHERE title LIKE ? \
                GROUP BY b.book_id;"
            break;
        case "getBookByOLId":
            query = "SELECT \
            b.book_id, b.ol_key, b.description, b.thumbnail_url, b.title, a.name, IFNULL(g.name, NULL) AS genre_name \
            FROM book b \
            INNER JOIN book_author ba ON b.book_id = ba.book_id\
            INNER JOIN author a ON ba.author_id = a.author_id \
            LEFT JOIN book_genre bg ON b.book_id = bg.book_id \
            LEFT JOIN genre g ON bg.genre_id = g.genre_id \
            WHERE b.ol_key = ? \
            GROUP BY b.book_id;"
            break;
        case "createBook":
            query = "INSERT INTO book (ol_key, description, thumbnail_url, title) SELECT ?,?,?,? FROM book WHERE NOT EXISTS (SELECT ol_key FROM book WHERE ol_key = ?) LIMIT 1;";
            break;
        case "createAuthor":
            query = "INSERT INTO author (ol_key, name) SELECT ?, ? FROM author WHERE NOT EXISTS (SELECT ol_key FROM author WHERE ol_key = ?) LIMIT 1;";           
            break;
        case "getAuthIdFromOlId":
            query = "SELECT author_id FROM author WHERE ol_key = ?;"
            break;
        case "getBookIdFromOlId":
            query = "SELECT book_id FROM book WHERE ol_key = ?;"
            break;        
        case "joinAuthBook":
            query = "INSERT INTO book_author\
            (book_id, author_id) VALUES (?, ?);"
            break;
        case "getOlKeys":
            query = "SELECT ol_key FROM book \
            UNION \
            SELECT ol_key FROM author;"
            break;
        case "getAvailableBooks":
            query = "SELECT b.book_id, b.title, a.name, count(b.book_id) AS count \
                from book b \
                INNER JOIN books_owned bo ON b.book_id = bo.book_id \
                INNER JOIN book_author ba ON bo.book_id = ba.book_id \
                INNER JOIN author a ON ba.author_id = a.author_id \
                WHERE bo.is_available = 1 AND bo.user_id != ? \
                GROUP BY b.book_id;";
            break;
        case "getAvailableBooksByGenre":
            query = "SELECT b.book_id, b.title, a.name, count(b.book_id) AS count \
                from book b \
                INNER JOIN books_owned bo ON b.book_id = bo.book_id \
                INNER JOIN book_author ba ON bo.book_id = ba.book_id \
                INNER JOIN author a ON ba.author_id = a.author_id \
                INNER JOIN book_genre bg ON bo.book_id = bg.book_id \
                WHERE bo.is_available = 1 AND bo.user_id != ? AND bg.genre_id = ?\
                GROUP BY b.book_id;";
            break;
        case "getAvailableBooksByPoints":
            query = "SELECT b.book_id, b.title, a.name, bc.cost, count(b.book_id) AS count \
                from book b \
                INNER JOIN books_owned bo ON b.book_id = bo.book_id \
                INNER JOIN book_condition bc ON bo.condition_id = bc.condition_id \
                INNER JOIN book_author ba ON bo.book_id = ba.book_id \
                INNER JOIN author a ON ba.author_id = a.author_id \
                WHERE bo.is_available = 1 AND bo.user_id != ? AND bc.cost <= ?\
                GROUP BY b.book_id;";
            break;
        case "getAvailableBooksByPointsAndGenre":
            query = "SELECT b.book_id, b.title, a.name, bc.cost, count(b.book_id) AS count \
                from book b \
                INNER JOIN books_owned bo ON b.book_id = bo.book_id \
                INNER JOIN book_condition bc ON bo.condition_id = bc.condition_id \
                INNER JOIN book_author ba ON bo.book_id = ba.book_id \
                INNER JOIN author a ON ba.author_id = a.author_id \
                INNER JOIN book_genre bg ON bo.book_id = bg.book_id \
                WHERE bo.is_available = 1 AND bo.user_id != ? AND bc.cost <= ? AND bg.genre_id = ?\
                GROUP BY b.book_id;";
            break;
        case "getGenreList":
            query = "SELECT genre_id, name FROM genre;";
            break;
        case "setGenre":
            query = "INSERT INTO book_genre (genre_id, book_id) VALUES (?, ?);";
            break;
        case "getTitleByListId":
            query = "SELECT b.title, a.name FROM book b \
                    INNER JOIN books_owned bo ON b.book_id = bo.book_id \
                    INNER JOIN book_author ba ON bo.book_id = ba.book_id \
                    INNER JOIN author a ON ba.author_id = a.author_id \
                    WHERE bo.list_id = ?;";
            break;
            
        case "BooksByFName":
            query = "SELECT book.title, book.ol_key, books_owned.condition_description, book_condition.cost, user.user_id FROM book INNER JOIN books_owned ON book.book_id = books_owned.book_id INNER JOIN book_condition ON book_condition.condition_id = books_owned.condition_id INNER JOIN user ON user.user_id = books_owned.user_id WHERE user.first_name = ?";
            break;  

        case "BooksByLName":
            query = "SELECT book.title, book.ol_key, books_owned.condition_description, book_condition.cost, user.user_id FROM book INNER JOIN books_owned ON book.book_id = books_owned.book_id INNER JOIN book_condition ON book_condition.condition_id = books_owned.condition_id INNER JOIN user ON user.user_id = books_owned.user_id WHERE user.last_name = ?";
            break; 

        case "BooksByEmail":
            query = "SELECT book.title, book.ol_key, books_owned.condition_description, book_condition.cost, user.user_id FROM book INNER JOIN books_owned ON book.book_id = books_owned.book_id INNER JOIN book_condition ON book_condition.condition_id = books_owned.condition_id INNER JOIN user ON user.user_id = books_owned.user_id WHERE user.email = ?";
            break;      
        }

    return query;
};

module.exports = Book;

