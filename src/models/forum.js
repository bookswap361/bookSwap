var mysql = require("../loaders/mysql");
var ForumModel = {};

ForumModel.getAllThreads = function() {
    return mysql.query(getQuery("allThreads"), []);
};

ForumModel.getThreadById = function(id) {
    return mysql.query(getQuery("threadById"), [id]);
};

function getQuery(type) {
    var query = "";
    switch(type) {
        case "allThreads":
            query = "SELECT t.thread_id, t.title, u.first_name, u.last_name, DATE_FORMAT(t.create_date,'%M-%D-%Y') as create_date, t.is_resolved FROM thread t INNER JOIN user u ON t.user_id = u.user_id GROUP BY t.thread_id ORDER BY t.thread_id;";
            break;
        case "threadById":
            query = "SELECT m.message_id, m.thread_id, u.first_name, u.last_name, m.post, m.date FROM messages m INNER JOIN user u ON m.user_id = u.user_id WHERE m.thread_id = ? ORDER BY m.date ASC;"
    }
    return query;
};

module.exports = ForumModel;
