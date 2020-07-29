var mysql = require("../loaders/mysql");
var Alert = {};

Alert.addAlert = function(id, content) {
    return mysql.query(getQuery("addAlert"), [content, id]);
}

Alert.deleteByAlertId = function(id) {
    return mysql.query(getQuery("deleteByAlertId"), [id]);
};

Alert.deleteByUserId = function(id) {
    return mysql.query(getQuery("deleteByUserId"), [id]);
};

Alert.getByUserId = function(id) {
    return mysql.query(getQuery("getByUserId"), [id]);
};

function getQuery(type) {
    var query = "";
    switch(type) {
        case "addAlert":
            query = "INSERT INTO alert (alert, user_id) VALUES (?, ?);";
            break;
        case "deleteByAlertId":
            query = "DELETE FROM alert WHERE alert_id = ?;";
            break;
        case "deleteByUserId":
            query = "DELETE FROM alert WHERE user_id = ?;";
            break;
        case "getByUserId":
            query = "SELECT * FROM alert WHERE user_id = ?;";
            break;
        }

    return query;
};

module.exports = Alert;
