var mysql = require("../loaders/mysql");
var Account = {};


Account.getAccount = function(id) {
    return mysql.query(getQuery("account"), [id]);
}


function getQuery(type) {
    var query = "";
    switch(type) {
        case "account":
            query = "SELECT * from user WHERE user_id = ?";
            break;
    }

    return query;
};

module.exports = Account;
