var mysql = require("../loaders/mysql");
var ForumModel = {};

ForumModel.getAllThreads = function() {
    return mysql.query(getQuery("allThreads"), []);
};

function getQuery(type) {
    var query = "";
    switch(type) {
        case "allThreads":
            query = "SELECT t.thread_id, t.title, u.first_name, u.last_name, DATE_FORMAT(t.create_date,'%M-%D-%Y') as create_date, t.is_resolved FROM thread t INNER JOIN user u ON t.user_id = u.user_id GROUP BY t.thread_id ORDER BY t.thread_id;";
            break;
    }
    return query;
};

module.exports = ForumModel;
