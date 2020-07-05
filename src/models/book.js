var mysql = require("../loaders/mysql");
var Book = {};

Book.getAllBooks = function() {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("allBooks"), [])
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
    }

    return query;
};

module.exports = Book;

